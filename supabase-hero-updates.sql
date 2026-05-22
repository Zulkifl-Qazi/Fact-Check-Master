-- supabase-hero-updates.sql
-- Append-only style instructions for Supabase SQL editor.
-- Since the `category` column is a simple VARCHAR, we don't need to add new ENUM values.

-- 1. Ensure the category column exists (in case it wasn't added yet)
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
    END IF;
END $$;

-- 2. Ensure the pinned_hero column exists (for the Pin to Hero feature)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'posts'
        AND column_name = 'pinned_hero'
    ) THEN
        ALTER TABLE posts ADD COLUMN pinned_hero BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'pinned_hero column added successfully';
    END IF;
END $$;

-- 3. Ensure the media column exists (for storing image/video arrays as JSON)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'posts'
        AND column_name = 'media'
    ) THEN
        ALTER TABLE posts ADD COLUMN media JSONB;
        RAISE NOTICE 'media column added successfully';
    END IF;
END $$;

-- 3. Optional: Index for faster retrieval by category and publish status
CREATE INDEX IF NOT EXISTS idx_posts_category_published
ON posts (category, status, created_at DESC);

-- 4. Index for pinned_hero lookup
CREATE INDEX IF NOT EXISTS idx_posts_pinned_hero
ON posts (pinned_hero) WHERE pinned_hero = TRUE;

-- 3. Seed / Tag specific posts for testing the new Hero & Trending functionality
-- IMPORTANT: Replace the IDs (1, 2, 3...) with valid post IDs from your database

-- Set latest/breaking posts for the Hero lead & secondary column
-- UPDATE posts
-- SET category = 'breaking-news', updated_at = NOW()
-- WHERE id IN (1, 2, 3);

-- Set posts for the Trending feed
-- UPDATE posts
-- SET category = 'trending-news', updated_at = NOW()
-- WHERE id IN (4, 5);

-- Set regular latest posts
-- UPDATE posts
-- SET category = 'latest-news', updated_at = NOW()
-- WHERE id IN (6, 7, 8);
