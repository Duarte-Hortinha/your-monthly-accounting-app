/*
  # Add currency support and exchange rates

  1. New Features
    - Currency enum type (EUR, USD, GBP)
    - App configuration table
    - Exchange rates table
    - Currency columns for transactions
  
  2. Security
    - RLS enabled for new tables
    - Read-only access for authenticated users
*/

-- Create currency enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE currency_code AS ENUM ('EUR', 'USD', 'GBP');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create app_config table
CREATE TABLE IF NOT EXISTS app_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- Create exchange_rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency currency_code NOT NULL,
  to_currency currency_code NOT NULL,
  rate decimal NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

-- Add currency columns to transactions if they don't exist
DO $$ BEGIN
  ALTER TABLE transactions
    ADD COLUMN currency currency_code DEFAULT 'EUR'::currency_code,
    ADD COLUMN exchange_rate decimal DEFAULT 1.0,
    ADD COLUMN eur_amount decimal GENERATED ALWAYS AS (amount * exchange_rate) STORED;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access to app config" ON app_config;
DROP POLICY IF EXISTS "Allow read access to exchange rates" ON exchange_rates;

-- Create RLS policies
CREATE POLICY "Allow read access to app config"
  ON app_config FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow read access to exchange rates"
  ON exchange_rates FOR SELECT TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_currency 
  ON transactions(currency);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_currencies 
  ON exchange_rates(from_currency, to_currency);

-- Create helper function for getting exchange rates
CREATE OR REPLACE FUNCTION get_exchange_rate(from_curr currency_code, to_curr currency_code)
RETURNS decimal AS $$
DECLARE
  rate decimal;
BEGIN
  IF from_curr = to_curr THEN
    RETURN 1.0;
  END IF;

  SELECT er.rate INTO rate
  FROM exchange_rates er
  WHERE er.from_currency = from_curr
  AND er.to_currency = to_curr
  ORDER BY updated_at DESC
  LIMIT 1;

  IF rate IS NULL THEN
    CASE
      WHEN from_curr = 'USD' AND to_curr = 'EUR' THEN rate := 0.9130;
      WHEN from_curr = 'GBP' AND to_curr = 'EUR' THEN rate := 1.1635;
      WHEN from_curr = 'EUR' AND to_curr = 'USD' THEN rate := 1.0953;
      WHEN from_curr = 'EUR' AND to_curr = 'GBP' THEN rate := 0.8595;
      ELSE rate := 1.0;
    END CASE;
  END IF;

  RETURN rate;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for updating exchange rates
CREATE OR REPLACE FUNCTION update_transaction_exchange_rate()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.currency = 'EUR'::currency_code THEN
    NEW.exchange_rate := 1.0;
  ELSE
    NEW.exchange_rate := get_exchange_rate(NEW.currency, 'EUR'::currency_code);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_exchange_rate_before_insert ON transactions;

-- Create trigger
CREATE TRIGGER update_exchange_rate_before_insert
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transaction_exchange_rate();

-- Insert default exchange rates
INSERT INTO exchange_rates (from_currency, to_currency, rate)
VALUES 
  ('USD', 'EUR', 0.9130),
  ('GBP', 'EUR', 1.1635),
  ('EUR', 'USD', 1.0953),
  ('EUR', 'GBP', 0.8595)
ON CONFLICT (from_currency, to_currency) 
DO UPDATE SET 
  rate = EXCLUDED.rate,
  updated_at = now();

-- Store API key in app_config
INSERT INTO app_config (key, value, description)
VALUES (
  'exchange_rate_api_key',
  '0d3b851b7316057c05f8ad2f',
  'API key for ExchangeRate-API service'
)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    updated_at = now();