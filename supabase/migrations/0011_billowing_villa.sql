-- Populate sample data for authenticated users
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the current user ID from the RLS context
  v_user_id := auth.uid();
  
  -- Only proceed if we have a valid user ID
  IF v_user_id IS NOT NULL THEN
    -- Call the sample data generation function
    PERFORM generate_sample_data_2023_2024(v_user_id);
  END IF;
END $$;