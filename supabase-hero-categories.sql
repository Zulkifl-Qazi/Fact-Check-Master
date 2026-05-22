-- Hero and navigation categories (no schema change required if `posts.category` already exists).
-- Run in Supabase SQL Editor only if you need documentation in-repo; the app accepts these slugs as plain VARCHAR values.

-- Editorial slugs used by the home hero and News Dashboard:
--   breaking-news   — large hero lead + secondary column (API also matches legacy featured-news rows)
--   featured-news   — optional legacy slug; treated like breaking-news for hero queries
--   trending-news   — Trending section (navbar + /news-dashboard?category=trending-news)
--   latest-news     — Must-read pool and hero fallback when no breaking posts exist

-- Example: tag one post for the hero lead (editors normally do this via Admin UI):
-- UPDATE posts SET category = 'breaking-news', updated_at = NOW() WHERE id = 123;

-- Optional index for faster filtered reads (safe to run once):
-- CREATE INDEX IF NOT EXISTS idx_posts_category_published ON posts (category, status, created_at DESC);
