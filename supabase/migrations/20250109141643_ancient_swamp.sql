-- Update the payment_method_type enum to use "Dinheiro" instead of "Cash"
ALTER TYPE payment_method_type RENAME TO payment_method_type_old;

CREATE TYPE payment_method_type AS ENUM (
  'Santander/MB Way',
  'Monese',
  'Revolut',
  'Dinheiro'
);

ALTER TABLE transactions 
  ALTER COLUMN payment_method TYPE payment_method_type 
  USING (CASE 
    WHEN payment_method::text = 'Cash' THEN 'Dinheiro'::payment_method_type 
    ELSE payment_method::text::payment_method_type 
  END);

DROP TYPE payment_method_type_old;