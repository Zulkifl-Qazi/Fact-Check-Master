# Vercel RUNBOOK: Hero, Categories & Supabase Integration

This document outlines the deployment and verification steps for the new editorial hero layout and category architecture.

## 1. Database Migrations
1. Open your Supabase Dashboard and go to the **SQL Editor**.
2. Copy and paste the contents of `supabase-hero-updates.sql`.
3. Run the script. This ensures the `category` column is indexed and allows you to manually seed test data if needed.
4. No data drops or destructive changes occur in this script.

## 2. Environment Variables
No new environment variables are strictly required for this release. Ensure your Vercel project already has the following configured:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 3. Deployment
1. Commit the recent codebase changes (`git commit -m "feat: complete hero and category integration"`).
2. Push to your main branch linked to Vercel, or manually deploy via the Vercel CLI (`vercel --prod`).
3. Vercel will automatically build the React frontend and deploy the updated serverless functions.

## 4. Verification Steps
After the deployment is live, perform the following tests:

### API Verification
1. Open a browser or use curl to test the endpoint:
   `https://<your-vercel-domain>.vercel.app/api/posts?category=breaking-news&limit=5`
2. Expected result: A JSON array containing up to 5 posts tagged as `breaking-news`. If there are no posts, it should return an empty array `[]` (HTTP 200).
3. Test `https://<your-vercel-domain>.vercel.app/api/posts` (no params) to ensure backward compatibility. It should return all published posts.

### Frontend Verification
1. **Home Page**: The top hero should load gracefully. If no `breaking-news` exists, it will fall back to displaying the `latest-news`.
2. **Navbar & Routing**: Click on "Trending" in the navbar. It should route to `/news-dashboard?category=trending-news`.
3. **Admin Panel**: Go to `/admin/posts`. Try creating a post and verify that `Featured / Breaking (hero)` and `Trending` are selectable categories.
4. **Deduplication**: If you created a post with multiple categories (e.g. `breaking-news` and `latest-news`), verify that the frontend hero deduplicates the articles by title and doesn't display the exact same article in two different slots.
