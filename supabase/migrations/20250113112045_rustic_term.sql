/*
  # Exchange Rate API Integration
  
  1. Create app_config table for storing API configuration
  2. Create function to update exchange rates using pg_net
  3. Set up error handling and logging
*/

-- Create table to store API configuration if it doesn't exist
CREATE TABLE IF NOT EXISTS app_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- Store the API key
INSERT INTO app_config (key, value, description)
VALUES (
  'exchange_rate_api_key',
  '0d3b851b7316057c05f8ad2f',
  'API key for ExchangeRate-API service'
)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    updated_at = now();

-- Function to update exchange rates from API
CREATE OR REPLACE FUNCTION update_exchange_rates()
RETURNS void AS $$
DECLARE
  api_key text;
  api_url text;
  request_id bigint;
  response_status int;
  response_body text;
  api_response json;
  usd_rate decimal;
  gbp_rate decimal;
BEGIN
  -- Get API key from config
  SELECT value INTO api_key
  FROM app_config
  WHERE key = 'exchange_rate_api_key';

  -- Skip if no API key is set
  IF api_key IS NULL THEN
    RAISE NOTICE 'No API key set. Using default rates.';
    RETURN;
  END IF;

  -- Get EUR base rates
  api_url := 'https://v6.exchangerate-api.com/v6/' || api_key || '/latest/EUR';
  
  -- Make HTTP request using pg_net
  SELECT net.http_get(api_url) INTO request_id;
  
  -- Wait for and get the response
  SELECT status, content::text 
  INTO response_status, response_body
  FROM net.http_get_result(request_id);

  -- Check response status
  IF response_status != 200 THEN
    RAISE NOTICE 'API request failed with status %', response_status;
    RETURN;
  END IF;

  -- Parse JSON response
  api_response := response_body::json;

  -- Extract rates
  usd_rate := (api_response->'conversion_rates'->>'USD')::decimal;
  gbp_rate := (api_response->'conversion_rates'->>'GBP')::decimal;

  -- Update EUR -> USD/GBP rates
  INSERT INTO exchange_rates (from_currency, to_currency, rate)
  VALUES 
    ('EUR', 'USD', usd_rate),
    ('EUR', 'GBP', gbp_rate)
  ON CONFLICT (from_currency, to_currency) 
  DO UPDATE SET 
    rate = EXCLUDED.rate,
    updated_at = now();

  -- Update USD/GBP -> EUR rates
  INSERT INTO exchange_rates (from_currency, to_currency, rate)
  VALUES 
    ('USD', 'EUR', 1/usd_rate),
    ('GBP', 'EUR', 1/gbp_rate)
  ON CONFLICT (from_currency, to_currency) 
  DO UPDATE SET 
    rate = EXCLUDED.rate,
    updated_at = now();

  -- Log successful update
  INSERT INTO app_config (key, value, description)
  VALUES (
    'last_exchange_rate_update',
    now()::text,
    'Timestamp of last successful exchange rate update'
  )
  ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      updated_at = now();

EXCEPTION WHEN OTHERS THEN
  -- Log error and continue using default rates
  RAISE NOTICE 'Error updating exchange rates: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION update_exchange_rates TO authenticated;