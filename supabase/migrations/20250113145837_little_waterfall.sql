-- Drop existing payment methods table and related objects
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TRIGGER IF EXISTS ensure_valid_payment_method ON transactions;
DROP FUNCTION IF EXISTS validate_payment_method();
DROP FUNCTION IF EXISTS add_payment_method(UUID, TEXT);
DROP FUNCTION IF EXISTS remove_payment_method(UUID, TEXT);
DROP TRIGGER IF EXISTS ensure_default_payment_methods ON auth.users;
DROP FUNCTION IF EXISTS create_default_payment_methods();

-- Create payment method type enum
DO $$ BEGIN
  CREATE TYPE payment_method_type AS ENUM (
    'Santander/MB Way',
    'Monese',
    'Revolut',
    'Dinheiro'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Update transactions table to use enum
ALTER TABLE transactions
  ALTER COLUMN payment_method TYPE payment_method_type
  USING payment_method::payment_method_type;

-- Create trigger function to validate payment method
CREATE OR REPLACE FUNCTION validate_payment_method()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure payment method is one of the valid enum values
  IF NEW.payment_method::text NOT IN (
    'Santander/MB Way', 'Monese', 'Revolut', 'Dinheiro'
  ) THEN
    NEW.payment_method := 'Dinheiro'::payment_method_type;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment method validation
CREATE TRIGGER ensure_valid_payment_method
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_payment_method();

-- Update any invalid payment methods to 'Dinheiro'
UPDATE transactions
SET payment_method = 'Dinheiro'::payment_method_type
WHERE payment_method::text NOT IN (
  'Santander/MB Way', 'Monese', 'Revolut', 'Dinheiro'
);