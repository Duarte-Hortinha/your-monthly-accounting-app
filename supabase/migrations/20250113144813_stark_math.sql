-- Drop existing trigger and function
DROP TRIGGER IF EXISTS ensure_valid_payment_method ON transactions;
DROP FUNCTION IF EXISTS validate_payment_method();

-- Create improved payment method validation function
CREATE OR REPLACE FUNCTION validate_payment_method()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if payment method exists for user
  IF NOT EXISTS (
    SELECT 1 FROM payment_methods
    WHERE user_id = NEW.user_id
    AND name = NEW.payment_method
  ) THEN
    -- If the payment method doesn't exist, set it to 'Dinheiro'
    NEW.payment_method := 'Dinheiro';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment method validation
CREATE TRIGGER ensure_valid_payment_method
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_payment_method();

-- Update any existing transactions with invalid payment methods
UPDATE transactions t
SET payment_method = 'Dinheiro'
WHERE NOT EXISTS (
  SELECT 1 FROM payment_methods pm
  WHERE pm.user_id = t.user_id
  AND pm.name = t.payment_method
);