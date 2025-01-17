/*
  # Payment Methods Management

  1. New Tables
    - `payment_methods`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `payment_methods` table
    - Add policies for authenticated users to manage their payment methods

  3. Functions
    - `add_payment_method`: Add a new payment method for a user
    - `remove_payment_method`: Remove a payment method for a user
*/

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own payment methods"
  ON payment_methods FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods"
  ON payment_methods FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods"
  ON payment_methods FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to add a payment method
CREATE OR REPLACE FUNCTION add_payment_method(
  p_user_id UUID,
  p_name TEXT
) RETURNS void AS $$
BEGIN
  -- Validate inputs
  IF p_name IS NULL OR p_user_id IS NULL THEN
    RAISE EXCEPTION 'Payment method name and user ID cannot be null';
  END IF;

  -- Don't allow duplicates
  IF EXISTS (
    SELECT 1 FROM payment_methods 
    WHERE user_id = p_user_id AND name = p_name
  ) THEN
    RAISE EXCEPTION 'Payment method already exists';
  END IF;

  -- Insert new payment method
  INSERT INTO payment_methods (user_id, name)
  VALUES (p_user_id, p_name);
END;
$$ LANGUAGE plpgsql;

-- Function to remove a payment method
CREATE OR REPLACE FUNCTION remove_payment_method(
  p_user_id UUID,
  p_name TEXT
) RETURNS void AS $$
BEGIN
  -- Validate inputs
  IF p_name IS NULL OR p_user_id IS NULL THEN
    RAISE EXCEPTION 'Payment method name and user ID cannot be null';
  END IF;

  -- Don't allow removing default methods
  IF p_name IN ('Dinheiro', 'Santander/MB Way', 'Monese', 'Revolut') THEN
    RAISE EXCEPTION 'Cannot remove default payment methods';
  END IF;

  -- Delete the payment method
  DELETE FROM payment_methods
  WHERE user_id = p_user_id AND name = p_name;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment method not found';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION add_payment_method(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_payment_method(UUID, TEXT) TO authenticated;

-- Insert default payment methods for all users
INSERT INTO payment_methods (user_id, name)
SELECT 
  u.id as user_id,
  m.name as name
FROM auth.users u
CROSS JOIN (
  VALUES 
    ('Dinheiro'),
    ('Santander/MB Way'),
    ('Monese'),
    ('Revolut')
) as m(name)
ON CONFLICT (user_id, name) DO NOTHING;

-- Create trigger function to add default payment methods for new users
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
CREATE TRIGGER ensure_default_payment_methods
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_payment_methods();