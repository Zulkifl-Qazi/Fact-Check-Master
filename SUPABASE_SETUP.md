# 🗄️ Supabase Database Setup for Permanent Post Storage

## Why Supabase?
- ✅ **100% Free Tier** (up to 500MB storage)
- ✅ **Permanent Storage** - Posts never disappear
- ✅ **Real-time Updates** - Instant synchronization
- ✅ **PostgreSQL Database** - Reliable and scalable
- ✅ **Easy Integration** - Works perfectly with Vercel

## Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)
4. Create a new project:
   - **Project Name**: `fact-check-master`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to you

## Step 2: Create Posts Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Paste this SQL code:

```sql
-- Create posts table for permanent storage
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Fact Check Master',
  status TEXT DEFAULT 'published',
  fact_check_status TEXT DEFAULT 'verified',
  image_url TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- The live app reads and writes posts through /api/posts using the service-role key,
-- so direct public access to the table is not needed.
DROP POLICY IF EXISTS "Deny public access to posts" ON posts;
CREATE POLICY "Deny public access to posts" ON posts
FOR ALL USING (false) WITH CHECK (false);

-- Create an index for better performance
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_status ON posts(status);
```

4. Click **"Run"** to execute

## Step 3: Get API Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefghijk.supabase.co`)
   - **Anon public** key (starts with `eyJ...`)

## Step 4: Add Environment Variables to Vercel

1. Go to your Vercel dashboard
2. Select your `fact-check-master` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
SUPABASE_URL = https://your-project-ref.supabase.co
SUPABASE_ANON_KEY = your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key-here
```

Use `SUPABASE_SERVICE_ROLE_KEY` for the serverless APIs in this project. The browser app talks to `/api/posts` and `/api/device-auth`, not directly to Supabase tables.

Approved admin devices should be created or updated in `approved_devices` through the admin flow or by a one-time manual SQL update in Supabase. The login endpoint only validates against existing approved rows.

## Step 5: Deploy

Once you've completed the setup:

1. The database will be ready
2. Posts will be permanently stored
3. No more auto-deletion issues
4. Real-time synchronization across all users

## Benefits After Setup:

✅ **Permanent Posts** - Never disappear  
✅ **Real-time Updates** - Changes appear instantly  
✅ **Backup & Recovery** - Data is safely stored  
✅ **Scalable** - Handles unlimited posts  
✅ **Fast Performance** - Optimized for speed  

## Next Steps:

1. Complete the Supabase setup
2. Add the environment variables to Vercel
3. Deploy the updated code
4. Test adding/deleting posts
5. Enjoy permanent storage! 🚀

---

**Need Help?** The setup takes about 5-10 minutes and your posts will be permanent forever!