# Fact Check Master - Full Project Documentation

Date: May 25, 2026
Project: Fact-Check-Master

## 1. Executive Summary
Fact Check Master is a web platform focused on identifying, publishing, and tracking fact-check content to combat misinformation. The platform provides:
- Public-facing content consumption (live feeds, categorized posts, article views).
- Admin publishing workflows (create, edit, delete posts with media).
- Device-based admin authorization.
- Feedback collection and admin replies.
- Supabase-backed persistent storage for posts and device approvals.
- Vercel deployment with serverless API routes.

The core product value is fast misinformation response, transparent publishing, and controlled admin access.

## 2. Primary Goals and Methodologies
### Product goals
- Counter misinformation with verified content.
- Publish quickly while preserving editorial control.
- Support rich media evidence (images and videos).
- Restrict admin actions to approved devices.

### Methodologies used in the app
- Structured fact-check categorization: posts are tagged by categories such as latest-news, world-news, viral-claims, military-claims, indian-claims, and afghan-claims.
- Editorial status labeling: verified, disputed, false, investigating.
- Device-based admin trust model: admin actions require approved device identity.
- Server-side enforcement: mutation endpoints validate authorization server-side.
- Progressive fallback behavior: client UI remains resilient if data sources fail.

## 3. High-Level Architecture
### Frontend
- Framework: React 18 + Vite.
- Routing: react-router-dom.
- UI/animation: Framer Motion, custom CSS, React Icons.
- Rich text editing: React Quill.

### Backend
- Deployment backend: Vercel serverless functions under api.
- Local development backend: Express server in server/index.js.
- Data services:
  - Supabase PostgreSQL for posts and approved devices.
  - SQLite for local feedback/reply workflows in local server context.

### Hosting and runtime
- Production hosting: Vercel.
- Database provider: Supabase.

## 4. Technology Stack and Tools
- React, Vite, JavaScript (ESM)
- Node.js
- Supabase JS SDK
- Axios
- Framer Motion
- React Quill
- Nodemailer
- Express, CORS
- SQLite3
- Tailwind/PostCSS (available in project tooling)
- ESLint

## 5. Core User-Facing Features
### Public side
- Homepage with hero content and content feeds.
- Live feed components.
- Category-filtered content browsing.
- Post detail view.
- About, Contact, Privacy Policy, Terms of Service pages.

### Media features
- Multiple images per post.
- Video URL support across platforms.
- Media carousel with preview/navigation.
- Backward compatibility with legacy image_url field.

### Contact and feedback
- Public contact submission.
- Admin review and reply workflows.
- Optional SMTP email sending.

## 6. Admin Features
- Admin login page.
- Device-based approval model.
- Device management page to view/approve/revoke devices.
- Admin posts page:
  - Create posts.
  - Edit posts.
  - Delete posts.
  - Apply status and category metadata.
  - Attach media payloads.

## 7. Important API Endpoints
### Content
- GET /api/posts
  - Returns published posts for public consumption.
- POST /api/posts
  - Creates new post (admin-approved device required).
- PUT /api/posts?id={id}
  - Updates an existing post (admin-approved device required).
- DELETE /api/posts?id={id}
  - Deletes a post (admin-approved device required).

### Device authorization
- POST /api/device-auth
  - Validates admin password and checks whether current device is approved.
  - If device is not approved, creates/updates a pending request.
- GET /api/device-auth
  - Returns devices list for approved admin device.
- DELETE /api/device-auth?deviceId={id}
  - Revokes device for approved admin device.
- POST /api/approve-device
  - Approves requested device for approved admin device.

### Feedback/replies
- /api/feedback
- /api/replies
- /api/feedback/[id]/replies
(Used for contact, admin feedback handling, and reply workflows.)

## 8. Database and RLS Security Model
### Main Supabase tables
- posts
- approved_devices

### Security posture
- RLS enabled for both posts and approved_devices.
- Public table-level access denied by policy.
- All privileged operations are mediated through serverless APIs using service-role credentials.

### Why this is important
- Protects against direct public table mutation.
- Ensures admin operations happen through controlled, auditable server code.
- Reduces unauthorized access risk flagged by Supabase security warnings.

## 9. Required Environment Variables
### Critical Supabase variables (production)
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

### Optional or additional variables
- SUPABASE_ANON_KEY (kept for compatibility/future client scenarios)
- ADMIN_PASSWORD (if customized)
- SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, FROM_EMAIL
- X_API_BEARER_TOKEN
- ADMIN_KEY, EXPORT_KEY (local/auxiliary guards)

## 10. Project File and Module Map
### Key frontend pages
- src/pages/HomePage.jsx
- src/pages/NewsDashboard.jsx
- src/pages/PostView.jsx
- src/pages/AdminLogin.jsx
- src/pages/AdminPosts.jsx
- src/pages/AdminFeedback.jsx
- src/pages/DeviceManagement.jsx

### Key components
- src/components/LiveFeed.jsx
- src/components/LiveFeedSimple.jsx
- src/components/CategoryFeed.jsx
- src/components/MediaCarousel.jsx
- src/components/Hero.jsx
- src/components/Navbar.jsx

### Key utilities
- src/utils/deviceFingerprint.js
- src/utils/videoParser.js

### Key backend routes
- api/posts.js
- api/device-auth.js
- api/approve-device.js
- api/feedback.js
- api/replies.js
- api/fetch-post.js

### Key docs/config
- SUPABASE_SETUP.md
- MEDIA_FEATURE.md
- EMAIL_TESTING.md
- supabase-migration.sql
- vercel.json

## 11. Recent Updates and Historical Work

### May 25, 2026 (Performance & Loading Optimizations)
1. **Eliminated route chunk waterfalls**: Removed lazy loading of `HomePage` in [App.jsx](file:///c:/Users/qzulk/Desktop/ISPR/Fact%20Check%20Master/src/App.jsx) to make the landing page render immediately on startup.
2. **Batched and cached API requests**: Batched multiple individual post category fetches into a single `/api/posts` query shared between the Hero editorial grid and the Live feed. This reduces initial load network calls from 6 down to 2.
3. **In-memory backend caching**: Configured a 10-second TTL in-memory cache in [posts.js](file:///c:/Users/qzulk/Desktop/ISPR/Fact%20Check%20Master/api/posts.js) that automatically clears on write/update/delete operations, preventing Supabase performance degradation under traffic.
4. **Mobile responsiveness improvements**: Cleaned up the phone/mobile view layouts for the Admin panel so that delete/edit buttons are fully visible and readable.
5. **Compilation verification**: Successfully verified production build with `npm run build` and deployed updates.

### April 16, 2026 (Security and Connectivity Fixes)
1. Investigated Supabase failures and identified root cause:
- RLS enabled while APIs were previously using wrong or inconsistent key assumptions.

2. Hardened server-side Supabase usage:
- Standardized server routes to use SUPABASE_SERVICE_ROLE_KEY.
- Added fail-fast behavior so missing key produces clear server configuration error.
- Removed placeholder fallback credentials to avoid misleading Invalid API key behavior.

3. Enforced admin authorization for post mutations:
- POST/PUT/DELETE /api/posts now require approved device identity via X-Device-ID.
- Frontend admin post actions now send device header consistently.

4. Improved RLS safety posture:
- Updated migration/documentation to keep RLS enabled and deny direct public table access.
- Kept admin operations mediated through server APIs.

5. Cleaned login authorization behavior:
- Removed temporary bootstrap fallback and restored strict validation against existing approved device rows.

6. Committed and pushed multiple updates to main and deployed latest production build.

### Deployment status
- Latest deployment marked Ready in Vercel production.
- Verified that Vercel now includes SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, and SUPABASE_ANON_KEY.

## 12. Operational Runbook
### If admin login fails
1. Check Vercel env vars for production:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
2. Confirm key type is secret/service role, not publishable.
3. Redeploy after env changes.
4. Verify approved_devices contains current device_id with approved=true.
5. Check /api/device-auth function logs.

### If post mutations fail
1. Confirm device is approved.
2. Confirm X-Device-ID header reaches API.
3. Check /api/posts logs for authorization errors.

### If Supabase errors appear
1. Confirm exact project URL.
2. Confirm service role key validity and rotation status.
3. Re-run migration SQL if schema or policy drift is suspected.

## 13. Current Security Assumptions
- Browser clients are untrusted.
- Serverless endpoints are trusted boundary.
- Service role key remains server-only and never exposed to client code.
- RLS remains enabled for sensitive tables.

## 14. Known Improvement Opportunities
- Add structured logging identifiers per request for faster production debugging.
- Add health endpoint for env validation at startup.
- Add automated integration tests for admin login and device approval flow.
- Add docs for key rotation playbook (Supabase secret keys).

## 15. Final Notes
The platform is now aligned with a secure model:
- RLS enabled.
- Public table access denied.
- Admin actions enforced server-side via approved device checks.
- Deployment dependencies explicit and fail-fast.

This document reflects repository state and operational work completed on May 25, 2026.
