/**
 * Video URL Parser and Embed Generator
 * Supports: YouTube, Vimeo, Twitter/X, Facebook, TikTok, Direct video files
 */

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Extract Vimeo video ID
 */
function extractVimeoId(url) {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

/**
 * Extract TikTok video ID
 */
function extractTikTokId(url) {
  const match = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Parse video URL and return structured video object
 */
export function parseVideoUrl(url) {
  if (!url || typeof url !== 'string') return null;
  
  // Trim and normalize URL (fix multiple slashes)
  const trimmedUrl = url.trim().replace(/([^:]\/)\/+/g, '$1');
  
  // YouTube
  if (trimmedUrl.includes('youtube.com') || trimmedUrl.includes('youtu.be')) {
    const videoId = extractYouTubeId(trimmedUrl);
    if (!videoId) return null;
    
    return {
      url: trimmedUrl,
      platform: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
  }
  
  // Vimeo
  if (trimmedUrl.includes('vimeo.com')) {
    const videoId = extractVimeoId(trimmedUrl);
    if (!videoId) return null;
    
    return {
      url: trimmedUrl,
      platform: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
      thumbnail: null // Vimeo thumbnails require API call
    };
  }
  
  // Twitter/X
  if (trimmedUrl.includes('twitter.com') || trimmedUrl.includes('x.com')) {
    // Extract tweet/status ID from various URL formats
    // Supports: /status/123456789, /status/123456789/video/1, /status/123456789/photo/1
    const statusMatch = trimmedUrl.match(/\/status\/(\d+)/);
    const statusId = statusMatch ? statusMatch[1] : null;
    
    return {
      url: trimmedUrl,
      platform: 'twitter',
      videoId: statusId,
      embedUrl: statusId ? `https://platform.twitter.com/embed/Tweet.html?id=${statusId}` : trimmedUrl,
      thumbnail: null
    };
  }
  
  // TikTok
  if (trimmedUrl.includes('tiktok.com')) {
    const videoId = extractTikTokId(trimmedUrl);
    return {
      url: trimmedUrl,
      platform: 'tiktok',
      videoId,
      embedUrl: trimmedUrl,
      thumbnail: null
    };
  }
  
  // Facebook
  if (trimmedUrl.includes('facebook.com') || trimmedUrl.includes('fb.watch')) {
    return {
      url: trimmedUrl,
      platform: 'facebook',
      embedUrl: trimmedUrl,
      thumbnail: null
    };
  }
  
  // Direct video file
  if (trimmedUrl.match(/\.(mp4|webm|mov|avi|mkv|flv|wmv|m4v)(\?.*)?$/i)) {
    return {
      url: trimmedUrl,
      platform: 'direct',
      embedUrl: trimmedUrl,
      thumbnail: null
    };
  }
  
  // Unknown or unsupported format
  return {
    url: trimmedUrl,
    platform: 'unknown',
    embedUrl: trimmedUrl,
    thumbnail: null
  };
}

/**
 * Validate if URL is a valid video URL
 */
export function isValidVideoUrl(url) {
  const video = parseVideoUrl(url);
  return video !== null && video.platform !== 'unknown';
}

/**
 * Get platform icon/emoji
 */
export function getVideoPlatformIcon(platform) {
  const icons = {
    youtube: '▶️',
    vimeo: '🎬',
    twitter: '🐦',
    tiktok: '🎵',
    facebook: '👥',
    direct: '🎥',
    unknown: '🔗'
  };
  return icons[platform] || icons.unknown;
}

/**
 * Get platform display name
 */
export function getVideoPlatformName(platform) {
  const names = {
    youtube: 'YouTube',
    vimeo: 'Vimeo',
    twitter: 'Twitter/X',
    tiktok: 'TikTok',
    facebook: 'Facebook',
    direct: 'Direct Video',
    unknown: 'Video Link'
  };
  return names[platform] || names.unknown;
}
