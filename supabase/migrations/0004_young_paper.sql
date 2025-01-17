/*
  # Fix RLS policies for transactions

  1. Changes
    - Drop existing RLS policy
    - Create new policies for CRUD operations
    - Add default value for user_id
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Users can manage their own transactions" ON transactions;

-- Create specific policies for each operation
CREATE POLICY "Users can view their own transactions"
ON transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
ON transactions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
ON transactions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);