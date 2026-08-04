import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

function stripHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const FALLBACK_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/jpeg" href="/logo.jpg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fact Check Master - Real-Time Fact Checking &amp; Verification</title>
    <meta name="description" content="Fact Check Master is a real-time fact-checking platform dedicated to verifying viral news, social media claims, and countering misinformation." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { type, id, slug } = req.query;
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.factcheckmaster.com';
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${protocol}://${host}`;

  let title = 'Fact Check Master - Real-Time Fact Checking & Verification';
  let description = 'Fact Check Master is a real-time fact-checking platform dedicated to verifying viral news, social media claims, and countering misinformation.';
  let imageUrl = `${baseUrl}/logo.jpg`;
  let pageUrl = baseUrl;

  // 1. Fetch Dynamic Content from Supabase if configured
  if (supabase) {
    try {
      if (type === 'post' && id) {
        const postId = parseInt(id, 10);
        if (!isNaN(postId)) {
          const { data: post } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .maybeSingle();

          if (post) {
            title = `${post.title} - Fact Check Master`;
            description = stripHtml(post.content).substring(0, 160);
            if (post.image_url) {
              imageUrl = post.image_url.startsWith('http') ? post.image_url : `${baseUrl}${post.image_url}`;
            }
            pageUrl = `${baseUrl}/post/${id}`;
          }
        }
      } else if (type === 'article' && slug) {
        const { data: article } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (article) {
          title = `${article.title} - Fact Check Master`;
          description = stripHtml(article.content || article.excerpt).substring(0, 160);
          if (article.cover_image) {
            imageUrl = article.cover_image.startsWith('http') ? article.cover_image : `${baseUrl}${article.cover_image}`;
          }
          pageUrl = `${baseUrl}/articles/${slug}`;
        }
      }
    } catch (dbErr) {
      console.error('[Share Preview] Database fetch error:', dbErr.message);
    }
  }

  // 2. Load index.html layout from filesystem or live deploy
  let htmlTemplate = '';
  try {
    const distPath = path.join(process.cwd(), 'dist', 'index.html');
    if (fs.existsSync(distPath)) {
      htmlTemplate = fs.readFileSync(distPath, 'utf8');
    } else {
      const rootPath = path.join(process.cwd(), 'index.html');
      if (fs.existsSync(rootPath)) {
        htmlTemplate = fs.readFileSync(rootPath, 'utf8');
      }
    }
  } catch (err) {
    console.warn('[Share Preview] Filesystem read error:', err.message);
  }

  // HTTP fallback if filesystem fails
  if (!htmlTemplate) {
    try {
      const indexRes = await fetch(`${baseUrl}/index.html`);
      if (indexRes.ok) {
        htmlTemplate = await indexRes.text();
      }
    } catch (err) {
      console.warn('[Share Preview] Fetch fallback error:', err.message);
    }
  }

  if (!htmlTemplate) {
    htmlTemplate = FALLBACK_HTML;
  }

  // 3. Inject Dynamic Tags right before </head>
  const tagsToInject = `
    <!-- Dynamic Social Share SEO Meta Tags (Server Injected) -->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:site_name" content="Fact Check Master" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
  `;

  // Strip existing static title/description tags to prevent duplicates
  let cleanHtml = htmlTemplate
    .replace(/<title>[^<]*<\/title>/gi, '')
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gi, '')
    .replace(/<meta\s+property="og:[^"]*"\s+content="[^"]*"\s*\/?>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"\s+content="[^"]*"\s*\/?>/gi, '');

  // Insert custom tags into head
  if (cleanHtml.includes('</head>')) {
    cleanHtml = cleanHtml.replace('</head>', `${tagsToInject}\n  </head>`);
  } else {
    cleanHtml = cleanHtml.replace('<head>', `<head>\n${tagsToInject}`);
  }

  // 4. Respond with HTML
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600');
  return res.status(200).send(cleanHtml);
}
