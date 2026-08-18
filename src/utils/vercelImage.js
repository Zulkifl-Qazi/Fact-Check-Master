/**
 * vercelImage.js — High-Performance Image Optimization via Global Edge Proxy (wsrv.nl / Cloudflare)
 *
 * Automatically resizes images to display dimensions, converts to modern WebP format,
 * applies quality compression, and caches at Cloudflare edge with 1-year max-age headers.
 */

/**
 * @param {string|null|undefined} src  - Original image URL
 * @param {number} [width]             - Display width in pixels
 * @param {number} [quality=80]        - Quality (1-100)
 * @returns {string}                   - Optimized WebP image URL
 */
export function vercelImg(src, width, quality = 65) {
  if (!src || typeof src !== 'string') return src || '';
  
  // Skip data URIs, SVGs, or already proxied URLs
  if (
    src.startsWith('data:') || 
    src.endsWith('.svg') || 
    src.includes('.svg?') || 
    src.includes('wsrv.nl')
  ) {
    return src;
  }

  // Construct absolute URL for relative paths
  let absoluteUrl = src;
  if (src.startsWith('/')) {
    if (typeof window !== 'undefined' && window.location?.origin) {
      absoluteUrl = `${window.location.origin}${src}`;
    } else {
      absoluteUrl = `https://www.factcheckmaster.com${src}`;
    }
  }

  // Generate wsrv.nl CDN proxy URL
  try {
    const params = new URLSearchParams();
    params.set('url', absoluteUrl);
    if (width && Number.isFinite(Number(width)) && Number(width) > 0) {
      params.set('w', String(Math.round(width)));
    }
    params.set('q', String(quality));
    params.set('output', 'webp');
    params.set('il', ''); // progressive load

    return `https://wsrv.nl/?${params.toString()}`;
  } catch (e) {
    return src;
  }
}

/**
 * @param {string} src
 * @param {number[]} widths
 * @returns {string|undefined}
 */
export function vercelSrcSet(src, widths = [320, 640, 960, 1200]) {
  if (!src || typeof src !== 'string') return undefined;
  return widths
    .map((w) => `${vercelImg(src, w)} ${w}w`)
    .join(', ');
}

