-- Add category column to posts table if it doesn't exist
-- Run this in your Supabase SQL Editor

-- Check if column exists and add if not
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'posts' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE posts ADD COLUMN category VARCHAR(50) DEFAULT 'latest-news';
        RAISE NOTICE 'Category column added successfully';
    ELSE
        RAISE NOTICE 'Category column already exists';
    END IF;
END $$;

-- Update existing posts to have default category
UPDATE posts 
SET category = 'latest-news' 
WHERE category IS NULL;
