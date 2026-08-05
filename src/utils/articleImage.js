/**
 * Helper utility to determine the best cover image for an article.
 * If an explicit cover image is uploaded, it is returned.
 * If not, the function scans the article HTML content for the first img tag and uses its src attribute.
 */
export function getArticleCover(article) {
  if (!article) return null;
  
  if (article.cover_image && article.cover_image.trim()) {
    return article.cover_image.trim();
  }
  
  // If cover_image is empty, try to parse the first img src from HTML content
  if (article.content) {
    const imgRegex = /<img[^>]+src="([^">]+)"/i;
    const match = article.content.match(imgRegex);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}
