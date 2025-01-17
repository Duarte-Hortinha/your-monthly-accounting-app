/*
  # Add date and time fields to transactions

  1. Changes
    - Add optional time field
    - Update transaction_date to be optional
*/

ALTER TABLE transactions
ALTER COLUMN transaction_date DROP NOT NULL,
ADD COLUMN transaction_time time;