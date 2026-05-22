# Vercel hero and filtered posts runbook

## Environment

No new variables. Production continues to use `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` on the serverless `api/posts.js` handler only.

## Deploy

Push to the branch connected to Vercel, or trigger a production deploy from the Vercel dashboard. No database migration is strictly required: new behavior uses existing `posts.category` values (`breaking-news`, `trending-news`, etc.).

## Verify after deploy

1. **Unfiltered list (backward compatible)**  
   Open `https://<your-domain>/api/posts`  
   Expect: JSON array of all published posts (same as before).

2. **Filtered list**  
   `https://<your-domain>/api/posts?category=breaking-news&limit=5`  
   Expect: up to five posts where `category` is `breaking-news` or `featured-news`, newest first.

3. **Trending**  
   `https://<your-domain>/api/posts?category=trending-news&limit=20`

4. **Home**  
   Load `/`: hero should show breaking posts when present; otherwise it falls back to `latest-news` for the lead.

5. **News Dashboard**  
   `/news-dashboard?category=trending-news` should open the Trending feed.  
   `/news-dashboard?category=breaking-news` opens Featured / Breaking.

## Editorial

- Assign **Featured / Breaking** in Admin (category `breaking-news`) for items that should appear in the hero lane.  
- Assign **Trending** (`trending-news`) for the Trending hub.  
- See `supabase-hero-categories.sql` in the repo for slug reference and optional index.

## Local dev (Vite + Express on port 3001)

The Express `server/index.js` GET `/api/posts` mirrors query params (`category`, `limit`, `offset`, `id`) so the proxy behaves like Vercel. Ensure the SQLite `posts` table has a `category` column (added automatically on server start).
