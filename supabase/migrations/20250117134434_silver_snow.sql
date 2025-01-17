-- Drop the payment_method_type enum and convert column to text
ALTER TABLE transactions
  ALTER COLUMN payment_method TYPE text;

-- Create trigger function to validate payment methods
CREATE OR REPLACE FUNCTION validate_transaction_payment_method()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if payment method exists for user
  IF NOT EXISTS (
    SELECT 1 
    FROM payment_methods 
    WHERE user_id = NEW.user_id 
    AND name = NEW.payment_method
  ) THEN
    -- If payment method doesn't exist, set to default
    NEW.payment_method := 'Dinheiro';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment method validation
CREATE TRIGGER ensure_valid_payment_method
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction_payment_method();

-- Update any existing transactions with invalid payment methods
UPDATE transactions t
SET payment_method = 'Dinheiro'
WHERE NOT EXISTS (
  SELECT 1 
  FROM payment_methods pm
  WHERE pm.user_id = t.user_id 
  AND pm.name = t.payment_method
);