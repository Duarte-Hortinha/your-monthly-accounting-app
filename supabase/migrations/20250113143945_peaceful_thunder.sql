/*
  # Payment Methods Management

  1. New Tables
    - `payment_methods`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes
    - Modify transactions table to use new payment methods system
    - Add RLS policies for payment_methods table
    - Add functions for managing payment methods

  3. Security
    - Enable RLS on payment_methods table
    - Add policies for authenticated users
*/

-- Create payment_methods table
CREATE TABLE payment_methods (
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

CREATE POLICY "Users can update their own payment methods"
  ON payment_methods FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
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

  -- Don't allow removing "Dinheiro"
  IF p_name = 'Dinheiro' THEN
    RAISE EXCEPTION 'Cannot remove the default cash payment method';
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

-- Insert default payment method (Dinheiro) for existing users
INSERT INTO payment_methods (user_id, name)
SELECT id, 'Dinheiro'
FROM auth.users
ON CONFLICT DO NOTHING;