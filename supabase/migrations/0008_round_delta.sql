/*
  # Add sample data for specific user

  1. Purpose
    - Add December 2024 sample transactions for marian.popup@gmail.com
*/

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get user ID for marian.popup@gmail.com
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'marian.popup@gmail.com';

  -- If user found, insert transactions
  IF v_user_id IS NOT NULL THEN
    PERFORM insert_december_2024_transactions(v_user_id);
  END IF;
END $$;