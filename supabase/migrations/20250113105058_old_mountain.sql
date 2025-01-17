/*
  # Add Currency Support
  
  1. New Tables
    - `exchange_rates`
      - `id` (uuid, primary key)
      - `from_currency` (text)
      - `to_currency` (text)
      - `rate` (decimal)
      - `updated_at` (timestamptz)
  
  2. Changes to Transactions
    - Add columns for currency support
    - Add indexes for performance
  
  3. Security
    - Enable RLS on new table
    - Add policies for authenticated users
*/

-- Create currency enum
CREATE TYPE currency_code AS ENUM ('EUR', 'USD', 'GBP');

-- Add currency columns to transactions
ALTER TABLE transactions
ADD COLUMN currency currency_code DEFAULT 'EUR'::currency_code,
ADD COLUMN exchange_rate decimal DEFAULT 1.0,
ADD COLUMN eur_amount decimal GENERATED ALWAYS AS (amount * exchange_rate) STORED;

-- Create exchange rates table
CREATE TABLE exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency currency_code NOT NULL,
  to_currency currency_code NOT NULL,
  rate decimal NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

-- Enable RLS
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to exchange rates"
  ON exchange_rates
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_transactions_currency ON transactions(currency);
CREATE INDEX idx_exchange_rates_currencies ON exchange_rates(from_currency, to_currency);

-- Create function to update exchange rates
CREATE OR REPLACE FUNCTION update_transaction_exchange_rate()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.currency = 'EUR'::currency_code THEN
    NEW.exchange_rate := 1.0;
  ELSE
    SELECT rate INTO NEW.exchange_rate
    FROM exchange_rates
    WHERE from_currency = NEW.currency
    AND to_currency = 'EUR'::currency_code
    ORDER BY updated_at DESC
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_exchange_rate_before_insert
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transaction_exchange_rate();