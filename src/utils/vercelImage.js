/**
 * vercelImage.js
 * 
 * Returns an optimized image URL via Vercel's built-in image optimization endpoint.
 * Works for any Vercel-deployed app (not just Next.js).
 * 
 * Endpoint: /_vercel/image?url=<encoded-url>&w=<width>&q=<quality>
 * 
 * Falls back to the original src if:
 * - src is empty / null
 * - src is a relative path (e.g. /uploads/...)
 * - src is a blob: or data: URL
 * - we are running on localhost (dev mode)
 */

const IS_LOCAL = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1');

/**
 * @param {string|null|undefined} src  - Original image URL
 * @param {number} [width=800]         - Desired width in px
 * @param {number} [quality=75]        - Quality 1–100 (75 is a good balance)
 * @returns {string}                   - Optimized URL or original src
 */
export function vercelImg(src, width = 800, quality = 75) {
  if (!src) return src;

  // Don't optimize relative URLs, blobs, data URIs, or in dev mode
  if (
    IS_LOCAL ||
    src.startsWith('/') ||
    src.startsWith('blob:') ||
    src.startsWith('data:')
  ) {
    return src;
  }

  return `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

/**
 * Returns a srcSet string for responsive images via Vercel.
 * Usage: <img srcSet={vercelSrcSet(src)} sizes="(max-width:768px) 100vw, 800px" />
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
