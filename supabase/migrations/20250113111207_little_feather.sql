/*
  # Fix exchange rates functionality

  1. Changes
    - Add default exchange rates
    - Add function to get latest exchange rate
    - Update trigger function
*/

-- Create function to get latest exchange rate with default values
CREATE OR REPLACE FUNCTION get_exchange_rate(from_curr currency_code, to_curr currency_code)
RETURNS decimal AS $$
DECLARE
  rate decimal;
BEGIN
  -- If same currency, return 1
  IF from_curr = to_curr THEN
    RETURN 1.0;
  END IF;

  -- Get latest rate
  SELECT er.rate INTO rate
  FROM exchange_rates er
  WHERE er.from_currency = from_curr
  AND er.to_currency = to_curr
  ORDER BY updated_at DESC
  LIMIT 1;

  -- If no rate found, use default rates
  IF rate IS NULL THEN
    CASE
      WHEN from_curr = 'USD' AND to_curr = 'EUR' THEN
        rate := 0.9130;
      WHEN from_curr = 'GBP' AND to_curr = 'EUR' THEN
        rate := 1.1635;
      WHEN from_curr = 'EUR' AND to_curr = 'USD' THEN
        rate := 1.0953;
      WHEN from_curr = 'EUR' AND to_curr = 'GBP' THEN
        rate := 0.8595;
      ELSE
        rate := 1.0; -- Fallback
    END CASE;
  END IF;

  RETURN rate;
END;
$$ LANGUAGE plpgsql;

-- Update the trigger function
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

-- Insert default exchange rates in batches
DO $$
BEGIN
  -- USD/EUR and GBP/EUR
  INSERT INTO exchange_rates (from_currency, to_currency, rate)
  VALUES ('USD', 'EUR', 0.9130),
         ('GBP', 'EUR', 1.1635)
  ON CONFLICT (from_currency, to_currency) 
  DO UPDATE SET rate = EXCLUDED.rate,
                updated_at = now();

  -- EUR/USD and EUR/GBP
  INSERT INTO exchange_rates (from_currency, to_currency, rate)
  VALUES ('EUR', 'USD', 1.0953),
         ('EUR', 'GBP', 0.8595)
  ON CONFLICT (from_currency, to_currency) 
  DO UPDATE SET rate = EXCLUDED.rate,
                updated_at = now();
END $$;