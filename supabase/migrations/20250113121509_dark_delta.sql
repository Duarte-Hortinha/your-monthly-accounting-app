-- Drop existing function if it exists
DROP FUNCTION IF EXISTS remove_user_category(UUID, TEXT);

-- Create function to handle category deletion
CREATE OR REPLACE FUNCTION remove_user_category(
  p_user_id UUID,
  p_category TEXT
) RETURNS void AS $$
BEGIN
  -- Validate inputs
  IF p_category IS NULL OR p_user_id IS NULL THEN
    RAISE EXCEPTION 'Category and user ID cannot be null';
  END IF;

  -- First update all transactions using this category to 'Outro'
  UPDATE transactions
  SET category = 'Outro'
  WHERE user_id = p_user_id
  AND category = p_category;

  -- Then delete the category from user_categories
  DELETE FROM user_categories
  WHERE user_id = p_user_id
  AND category = p_category;

  -- Get the number of rows affected
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Category not found for user';
  END IF;

  -- Return success
  RETURN;
EXCEPTION
  WHEN OTHERS THEN
    -- Re-raise the error with a more user-friendly message
    RAISE EXCEPTION 'Failed to delete category: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION remove_user_category(UUID, TEXT) TO authenticated;