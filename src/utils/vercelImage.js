/**
 * vercelImage.js
 *
 * Serves images through Vercel's built-in Image Optimization endpoint:
 *   /_vercel/image?url=<encoded-url>&w=<width>&q=<quality>
 *
 * - Automatically converts to WebP/AVIF (free on Hobby: 1000 images/month)
 * - After limit is hit, images are served unoptimized — never broken
 * - Domain allowlist: bswvizupdnwrdhtnmgqw.supabase.co (set in vercel.json)
 * - Falls back to original URL in dev mode and for non-http(s) URLs
 */

const IS_LOCAL =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

/**
 * @param {string|null|undefined} src  - Original image URL
 * @param {number} [width=800]         - Desired output width in px
 * @param {number} [quality=75]        - Quality 1–100
 * @returns {string}                   - Optimized URL or original src
 */
export function vercelImg(src, width = 800, quality = 75) {
  if (!src) return src;

  // Skip in dev mode — /_vercel/image is only available on Vercel servers
  if (IS_LOCAL) return src;

  // Skip relative, blob, and data URLs
  if (
    src.startsWith('/') ||
    src.startsWith('blob:') ||
    src.startsWith('data:')
  ) {
    return src;
  }

  // Only proxy http/https URLs (Supabase storage)
  if (!src.startsWith('http://') && !src.startsWith('https://')) {
    return src;
  }

  return `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

/**
 * Returns a srcSet string for responsive images via Vercel.
 */
export function vercelSrcSet(src, quality = 75) {
  if (!src || IS_LOCAL || src.startsWith('/') || src.startsWith('blob:') || src.startsWith('data:')) {
    return undefined;
  }
  const widths = [320, 640, 800, 1200];
  return widths
    .map(w => `/_vercel/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality} ${w}w`)
    .join(', ');
}
