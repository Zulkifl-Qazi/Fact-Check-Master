-- =============================================================
-- supabase-popular-views.sql
-- Adds pinned_popular and views columns for the Most Popular feature.
-- Run this in your Supabase SQL Editor BEFORE deploying.
-- =============================================================

-- 1. Add pinned_popular column (boolean, default false)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'posts'
        AND column_name = 'pinned_popular'
    ) THEN
        ALTER TABLE posts ADD COLUMN pinned_popular BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'pinned_popular column added successfully';
    ELSE
        RAISE NOTICE 'pinned_popular column already exists';
    END IF;
END $$;

-- 2. Add views column (integer, default 0)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'posts'
        AND column_name = 'views'
    ) THEN
        ALTER TABLE posts ADD COLUMN views INTEGER DEFAULT 0;
        RAISE NOTICE 'views column added successfully';
    ELSE
        RAISE NOTICE 'views column already exists';
    END IF;
END $$;

-- 3. Initialize existing rows (set NULL values to defaults)
UPDATE posts SET pinned_popular = FALSE WHERE pinned_popular IS NULL;
UPDATE posts SET views = 0 WHERE views IS NULL;

-- 4. Indexes for popular sorting performance
CREATE INDEX IF NOT EXISTS idx_posts_pinned_popular
ON posts (pinned_popular DESC, views DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_views
ON posts (views DESC);
