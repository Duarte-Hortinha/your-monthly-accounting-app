/*
  # Add Default Payment Methods

  1. Changes
    - Add default payment methods for all users
    - Ensure existing transactions maintain their payment methods

  2. Default Methods
    - Dinheiro (already exists)
    - Santander/MB Way
    - Monese
    - Revolut
*/

-- Insert default payment methods for all users
INSERT INTO payment_methods (user_id, name)
SELECT 
  u.id as user_id,
  m.name as name
FROM auth.users u
CROSS JOIN (
  VALUES 
    ('Santander/MB Way'),
    ('Monese'),
    ('Revolut')
) as m(name)
ON CONFLICT (user_id, name) DO NOTHING;

-- Create function to ensure new users get default payment methods
CREATE OR REPLACE FUNCTION create_default_payment_methods()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert default payment methods for the new user
  INSERT INTO payment_methods (user_id, name)
  VALUES 
    (NEW.id, 'Dinheiro'),
    (NEW.id, 'Santander/MB Way'),
    (NEW.id, 'Monese'),
    (NEW.id, 'Revolut')
  ON CONFLICT (user_id, name) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically add default payment methods for new users
DROP TRIGGER IF EXISTS ensure_default_payment_methods ON auth.users;
CREATE TRIGGER ensure_default_payment_methods
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_payment_methods();