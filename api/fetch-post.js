import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Fetch the webpage content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    
    // Extract metadata using various selectors
    let title = '';
    let content = '';
    let author = '';
    let imageUrl = '';

    // Try different methods to extract title
    title = $('meta[property="og:title"]').attr('content') ||
            $('meta[name="twitter:title"]').attr('content') ||
            $('title').text() ||
            $('h1').first().text();

    // Try different methods to extract content/description
    content = $('meta[property="og:description"]').attr('content') ||
              $('meta[name="twitter:description"]').attr('content') ||
              $('meta[name="description"]').attr('content') ||
              $('p').first().text();

    // Try different methods to extract author
    author = $('meta[name="author"]').attr('content') ||
             $('meta[property="article:author"]').attr('content') ||
             $('meta[name="twitter:creator"]').attr('content') ||
             $('.author').text() ||
             $('[data-testid="User-Names"]').first().text() ||
             'Unknown Author';

    // Try different methods to extract image
    imageUrl = $('meta[property="og:image"]').attr('content') ||
               $('meta[name="twitter:image"]').attr('content') ||
               $('meta[name="twitter:image:src"]').attr('content') ||
               $('img').first().attr('src');

    // Clean up extracted data
    title = title.trim().substring(0, 200);
    content = content.trim().substring(0, 500);
    author = author.trim().substring(0, 100);
    
    // Handle relative URLs for images
    if (imageUrl && imageUrl.startsWith('/')) {
      const urlObj = new URL(url);
      imageUrl = urlObj.origin + imageUrl;
    }

    // Fallback values
    if (!title) title = 'Post from ' + new URL(url).hostname;
    if (!content) content = 'Content fetched from ' + url;
    if (!author) author = 'User';

    res.json({
      title,
      content,
      author,
      imageUrl,
      sourceUrl: url
    });

  } catch (error) {
    console.error('Error fetching post data:', error);
    
    // Return a more user-friendly error
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(400).json({ error: 'Unable to connect to the URL. Please check if the URL is correct and accessible.' });
    }
    
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'The page was not found. Please check the URL.' });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch post data. The website might not allow automated access or the URL format is not supported.',
      details: error.message
    });
  }
}