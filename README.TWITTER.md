This project integrates a Twitter/X feed without using the official API.

What this file contains
- Explanation of the embed + fallback approach used in `src/components/LiveFeed.jsx`.
- How to change settings (items/theme) — saved in localStorage.
- How to upgrade to API-based fetching later.

Overview
--------
The app currently uses Twitter's official embed widget (platform.twitter.com/widgets.js) to render the profile timeline for `@fcheckmaster`. This approach requires no API credentials and is supported by Twitter. Because embedded widgets can be blocked by browsers, privacy extensions, or network policies, the component provides a graceful client-side fallback:

- Lazy-loads the Twitter widget when the feed enters the viewport.
- Shows an accessible skeleton while loading.
- If the widget fails or is blocked, displays animated sample tweets (editable in the component source).
- Provides a small Settings panel that controls the number of sample items and a theme selector. Settings are saved to localStorage (`lf_showCount`, `lf_widgetTheme`).

Why no API
----------
- You indicated you don't have API access yet. Using the embed is the safest option and avoids exposing any secrets.

Upgrading to Twitter/X API v2 later
----------------------------------
If you obtain API credentials later we recommend implementing a small server endpoint to fetch tweets using a server-side bearer token. This keeps secrets off the client and allows:

- Richer tweet rendering (media, metrics, threads).
- Server-side caching to avoid rate-limits.
- Sanitization and moderation before display.

Rough steps to upgrade:
1. Add a server endpoint (Node/Express or serverless) that calls Twitter API v2 `users/by/username` -> `users/:id/tweets` with required fields.
2. Cache responses (in-memory or Redis) for a short period (30–60s) to reduce calls.
3. Replace the embed in `LiveFeed.jsx` with a fetch to `/api/twitter?handle=fcheckmaster` and render the returned JSON with the same UI/animations.

If you want, I can add that server endpoint and wire it up once you have API credentials.
