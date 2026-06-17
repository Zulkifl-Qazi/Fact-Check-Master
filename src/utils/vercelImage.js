/**
 * vercelImage.js
 *
 * NOTE: Vercel image optimization via /_vercel/image requires the `images.domains`
 * allowlist in vercel.json. Since that config conflicts with non-Next.js Vite builds,
 * this helper currently returns the original URL unchanged.
 *
 * All other performance optimizations (font loading, JS splitting, lazy loading,
 * CSS animations, cache headers) remain active.
 *
 * To re-enable: add `images` block back to vercel.json once Vercel supports it
 * for Vite apps without build errors, or migrate images to Cloudflare CDN.
 */

/**
 * @param {string|null|undefined} src  - Original image URL
 * @param {number} [width=800]         - Desired width (reserved for future use)
 * @param {number} [quality=75]        - Quality (reserved for future use)
 * @returns {string}                   - Original src unchanged
 */
export function vercelImg(src, width = 800, quality = 75) {
  // Return original URL — Vercel image optimization disabled until
  // images.domains config can be safely added to vercel.json
  return src;
}

/**
 * @returns {undefined} — srcSet disabled, returns undefined so img ignores it
 */
export function vercelSrcSet(src, quality = 75) {
  return undefined;
}
