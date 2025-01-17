-- Add configuration for exchange rate API
CREATE TABLE IF NOT EXISTS app_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to app config"
  ON app_config FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow update to app config for admin"
  ON app_config FOR ALL TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE email IN (SELECT unnest(current_setting('app.admin_emails', true)::text[]))
  ))
  WITH CHECK (auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE email IN (SELECT unnest(current_setting('app.admin_emails', true)::text[]))
  ));

-- Function to set API key
CREATE OR REPLACE FUNCTION set_exchange_rate_api_key(api_key text)
RETURNS void AS $$
BEGIN
  INSERT INTO app_config (key, value, description)
  VALUES (
    'exchange_rate_api_key',
    api_key,
    'API key for ExchangeRate-API service'
  )
  ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      updated_at = now();
END;
$$ LANGUAGE plpgsql;