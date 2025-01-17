-- Drop existing trigger and function
DROP TRIGGER IF EXISTS ensure_valid_payment_method ON transactions;
DROP FUNCTION IF EXISTS validate_payment_method();

-- Create improved payment method validation function
CREATE OR REPLACE FUNCTION validate_payment_method()
RETURNS TRIGGER AS $$
DECLARE
  valid_method BOOLEAN;
BEGIN
  -- Check if payment method exists for user
  SELECT EXISTS (
    SELECT 1 
    FROM payment_methods 
    WHERE user_id = NEW.user_id 
    AND name = NEW.payment_method
  ) INTO valid_method;

  -- If payment method is not valid, set to default
  IF NOT valid_method THEN
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
WITH valid_methods AS (
  SELECT DISTINCT user_id, name 
  FROM payment_methods
)
UPDATE transactions t
SET payment_method = 'Dinheiro'
WHERE NOT EXISTS (
  SELECT 1 
  FROM valid_methods vm
  WHERE vm.user_id = t.user_id 
  AND vm.name = t.payment_method
);