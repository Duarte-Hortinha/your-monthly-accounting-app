/*
  # Add cascade delete for user transactions

  1. Changes
    - Modify foreign key constraint on transactions table to CASCADE on delete
    - This ensures when a user is deleted, all their transactions are automatically deleted

  2. Security
    - Maintains existing RLS policies
    - Only affects deletion behavior
*/

ALTER TABLE transactions
DROP CONSTRAINT IF EXISTS transactions_user_id_fkey,
ADD CONSTRAINT transactions_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;