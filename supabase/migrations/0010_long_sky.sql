/*
  # Execute sample data and fix date handling
  
  1. Execute sample data function for test user
  2. Add index on transaction_date for better performance
*/

-- Add index for better date filtering performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);

-- Execute sample data function for test user
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get user ID for test account
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'test@example.com';

  -- If user found, insert transactions
  IF v_user_id IS NOT NULL THEN
    PERFORM generate_sample_data_2023_2024(v_user_id);
  END IF;
END $$;