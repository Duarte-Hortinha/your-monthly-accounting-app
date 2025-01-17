/*
  # Add receipt logic trigger

  1. Changes
    - Add trigger function to automatically set has_receipt for non-cash payments
    - Add trigger to transactions table
  
  2. Security
    - Maintains existing RLS policies
*/

-- Create trigger function
CREATE OR REPLACE FUNCTION set_receipt_for_non_cash()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_method != 'Cash' THEN
    NEW.has_receipt = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER ensure_receipt_for_non_cash
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION set_receipt_for_non_cash();