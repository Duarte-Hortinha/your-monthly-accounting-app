-- Drop existing function
DROP FUNCTION IF EXISTS update_category(UUID, TEXT, TEXT);

-- Create improved category update function with transaction support
CREATE OR REPLACE FUNCTION update_category(
  p_user_id UUID,
  p_old_category TEXT,
  p_new_category TEXT
) RETURNS void AS $$
BEGIN
  -- Validate inputs
  IF p_old_category IS NULL OR p_new_category IS NULL OR p_user_id IS NULL THEN
    RAISE EXCEPTION 'Category and user ID cannot be null';
  END IF;

  -- Start an explicit transaction block
  BEGIN
    -- First update all transactions using this category
    UPDATE transactions
    SET category = p_new_category
    WHERE user_id = p_user_id
    AND category = p_old_category;

    -- Then update or insert the category in user_categories
    INSERT INTO user_categories (user_id, category)
    VALUES (p_user_id, p_new_category)
    ON CONFLICT (user_id, category) 
    DO NOTHING;

    -- Delete the old category if it exists
    DELETE FROM user_categories
    WHERE user_id = p_user_id
    AND category = p_old_category;

    -- If no transactions were updated and the category didn't exist in user_categories,
    -- raise an exception
    IF NOT FOUND AND NOT EXISTS (
      SELECT 1 FROM transactions 
      WHERE user_id = p_user_id 
      AND category = p_old_category
    ) THEN
      RAISE EXCEPTION 'Category not found for user';
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Failed to update category: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_category(UUID, TEXT, TEXT) TO authenticated;