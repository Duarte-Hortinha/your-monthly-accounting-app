-- Drop existing function
DROP FUNCTION IF EXISTS update_category(UUID, TEXT, TEXT);

-- Create improved category update function with better error handling
CREATE OR REPLACE FUNCTION update_category(
  p_user_id UUID,
  p_old_category TEXT,
  p_new_category TEXT
) RETURNS void AS $$
DECLARE
  category_exists BOOLEAN;
BEGIN
  -- Validate inputs
  IF p_old_category IS NULL OR p_new_category IS NULL OR p_user_id IS NULL THEN
    RAISE EXCEPTION 'Category and user ID cannot be null';
  END IF;

  -- Check if the category exists for this user
  SELECT EXISTS (
    SELECT 1 
    FROM user_categories 
    WHERE user_id = p_user_id 
    AND category = p_old_category
  ) INTO category_exists;

  IF NOT category_exists THEN
    -- If category doesn't exist in user_categories but exists in transactions,
    -- insert it into user_categories first
    IF EXISTS (
      SELECT 1 
      FROM transactions 
      WHERE user_id = p_user_id 
      AND category = p_old_category
    ) THEN
      INSERT INTO user_categories (user_id, category)
      VALUES (p_user_id, p_old_category);
    ELSE
      RAISE EXCEPTION 'Category not found for user';
    END IF;
  END IF;

  -- Update the category in user_categories
  UPDATE user_categories
  SET category = p_new_category
  WHERE user_id = p_user_id
  AND category = p_old_category;

  -- Update all transactions using this category
  UPDATE transactions
  SET category = p_new_category
  WHERE user_id = p_user_id
  AND category = p_old_category;

  -- Return success
  RETURN;
EXCEPTION
  WHEN OTHERS THEN
    -- Re-raise the error with a more user-friendly message
    RAISE EXCEPTION 'Failed to update category: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_category(UUID, TEXT, TEXT) TO authenticated;