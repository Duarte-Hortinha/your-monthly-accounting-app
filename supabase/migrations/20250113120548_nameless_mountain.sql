-- Add updated_at column to user_categories if it doesn't exist
DO $$ BEGIN
  ALTER TABLE user_categories 
    ADD COLUMN updated_at timestamptz DEFAULT now();
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- Update the category update function
CREATE OR REPLACE FUNCTION update_category(
  p_user_id UUID,
  p_old_category TEXT,
  p_new_category TEXT
) RETURNS void AS $$
BEGIN
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
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_category(UUID, TEXT, TEXT) TO authenticated;