-- ============================================================
-- Articles table for long-form blog content
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author TEXT DEFAULT 'Fact Check Master',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  read_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Fast slug lookups for article pages (/articles/:slug)
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- Fast listing of published articles sorted by date
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status, created_at DESC);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public read access for published articles
CREATE POLICY "Public can read published articles"
  ON articles FOR SELECT
  USING (status = 'published');

-- Service role has full access (API uses service role key)
CREATE POLICY "Service role full access"
  ON articles FOR ALL
  USING (true)
  WITH CHECK (true);
