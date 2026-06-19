/**
 * vercelImage.js — Image URL helper
 *
 * IMPORTANT: Vercel Image Optimization (/_vercel/image) is a Next.js-only
 * feature. It does NOT work for Vite/React SPA apps deployed on Vercel.
 * Requests to /_vercel/image return 404 on non-Next.js projects.
 *
 * This module keeps the function signatures so existing imports don't break,
 * but always returns the original URL unchanged.
 *
 * Future: If the project migrates to Next.js, re-enable the proxy here and
 * add images.domains back to vercel.json (or next.config.js).
 */

/**
 * @param {string|null|undefined} src  - Original image URL
 * @param {number} [_width]            - Reserved (unused)
 * @param {number} [_quality]          - Reserved (unused)
 * @returns {string}                   - Original src unchanged
 */
export function vercelImg(src, _width, _quality) {
  return src;
}

/**
 * @returns {undefined}
 */
export function vercelSrcSet() {
  return undefined;
}
