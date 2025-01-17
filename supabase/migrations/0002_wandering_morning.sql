/*
  # Update payment methods enum

  1. Changes
    - Drop existing constraints and references
    - Create new payment method type enum
    - Update transactions table
    - Restore constraints
  
  2. Security
    - Maintains existing RLS policies
*/

-- Temporarily disable the constraint
ALTER TABLE transactions 
  DROP CONSTRAINT IF EXISTS valid_bank_account;

-- Create new enum type with correct values
CREATE TYPE payment_method_type_new AS ENUM (
  'Santander/MB Way',
  'Monese',
  'Revolut',
  'Cash'
);

-- Create a temporary column with the new type
ALTER TABLE transactions 
  ADD COLUMN payment_method_new payment_method_type_new;

-- Update the temporary column with converted values
UPDATE transactions 
SET payment_method_new = 
  CASE payment_method::text
    WHEN 'cash' THEN 'Cash'::payment_method_type_new
    WHEN 'bank_account' THEN 'Santander/MB Way'::payment_method_type_new
    ELSE 'Cash'::payment_method_type_new
  END;

-- Drop the old column and rename the new one
ALTER TABLE transactions 
  DROP COLUMN payment_method;
ALTER TABLE transactions 
  RENAME COLUMN payment_method_new TO payment_method;

-- Drop the old type
DROP TYPE payment_method_type;

-- Rename the new type
ALTER TYPE payment_method_type_new 
  RENAME TO payment_method_type;

-- Add NOT NULL constraint to the new column
ALTER TABLE transactions 
  ALTER COLUMN payment_method SET NOT NULL;