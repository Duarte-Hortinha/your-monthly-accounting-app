-- Function to update exchange rates from API using pg_net
CREATE OR REPLACE FUNCTION update_exchange_rates_from_api()
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

  -- Update rates in database
  INSERT INTO exchange_rates (from_currency, to_currency, rate)
  VALUES 
    ('EUR', 'USD', usd_rate),
    ('EUR', 'GBP', gbp_rate),
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
  -- Log error but continue using existing rates
  RAISE WARNING 'Failed to update exchange rates: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Create function to manually trigger update
CREATE OR REPLACE FUNCTION trigger_exchange_rate_update()
RETURNS void AS $$
BEGIN
  PERFORM update_exchange_rates_from_api();
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION trigger_exchange_rate_update() TO authenticated;