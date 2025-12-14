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
-- Create approved_devices table for device-based authentication
CREATE TABLE IF NOT EXISTS approved_devices (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(255) UNIQUE NOT NULL,
  device_name VARCHAR(255) NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  requested_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by VARCHAR(255),
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_device_id ON approved_devices(device_id);
CREATE INDEX IF NOT EXISTS idx_approved ON approved_devices(approved);