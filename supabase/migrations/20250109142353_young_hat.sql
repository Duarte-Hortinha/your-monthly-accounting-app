/*
  # Fix payment method enum and trigger

  1. Changes
    - Drop and recreate trigger with correct payment method value
    - Update trigger function to use 'Dinheiro' instead of 'Cash'
    - Ensure all data uses correct payment method values

  2. Security
    - Maintains existing RLS policies
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS ensure_receipt_for_non_cash ON transactions;
DROP FUNCTION IF EXISTS set_receipt_for_non_cash();

-- Create new trigger function with correct payment method
CREATE OR REPLACE FUNCTION set_receipt_for_non_cash()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_method != 'Dinheiro'::payment_method_type THEN
    NEW.has_receipt = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger with new function
CREATE TRIGGER ensure_receipt_for_non_cash
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION set_receipt_for_non_cash();

-- Update any remaining incorrect values (safe cast using enum type)
UPDATE transactions 
SET payment_method = 'Dinheiro'::payment_method_type 
WHERE payment_method::text = 'Cash';