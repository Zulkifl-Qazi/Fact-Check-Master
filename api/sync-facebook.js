import { createClient } from '@supabase/supabase-js';

// Sync Facebook and Instagram feed updates (Vercel deployment trigger comment)

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const fbPageId = process.env.FACEBOOK_PAGE_ID;
const fbAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const cronSecret = process.env.CRON_SECRET;
const fbVerifyToken = process.env.FB_VERIFY_TOKEN || process.env.CRON_SECRET;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Device-ID');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ────────────────────────────────────────────────────────
  // 1. WEBHOOK VERIFICATION (GET request from Meta)
  // ────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === fbVerifyToken) {
        console.log('[FB Webhook] Webhook verified successfully.');
        return res.status(200).send(challenge);
      }
      console.warn('[FB Webhook] Verification token mismatch.');
      return res.status(403).json({ error: 'Verification token mismatch' });
    }
  }

  // Verify auth for POST/Sync requests
  const authHeader = req.headers && req.headers.authorization;
  const isCronAuthorized = cronSecret && authHeader === `Bearer ${cronSecret}`;
  
  // Also check for Meta Webhook signature or direct POST from Meta
  const isMetaWebhook = req.headers && (req.headers['x-hub-signature-256'] || req.headers['x-hub-signature']);

  // Also allow trigger if requested by an approved administrator via Device ID
  let isAdminAuthorized = false;
  const deviceId = req.headers && req.headers['x-device-id'];
  if (supabase && deviceId) {
    const { data: approvedDevice } = await supabase
      .from('approved_devices')
      .select('approved')
      .eq('device_id', deviceId)
      .eq('approved', true)
      .single();
    if (approvedDevice) {
      isAdminAuthorized = true;
    }
  }

  if (!isCronAuthorized && !isAdminAuthorized && !isMetaWebhook) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase credentials missing on server' });
  }

  if (!fbPageId || !fbAccessToken) {
    return res.status(500).json({ error: 'Facebook API credentials missing on server' });
  }

  try {
    const syncedPosts = [];

    // ────────────────────────────────────────────────────────
    // 2. SYNC FACEBOOK POSTS
    // ────────────────────────────────────────────────────────
    console.log(`[FB Sync] Fetching feed for Page ID: ${fbPageId}`);
    const fbFeedUrl = `https://graph.facebook.com/v18.0/${fbPageId}/feed?fields=id,message,created_time,full_picture,permalink_url&access_token=${fbAccessToken}&limit=10`;
    const fbRes = await fetch(fbFeedUrl);
    const fbData = await fbRes.json();

    if (fbData.error) {
      console.error('[FB Sync] Meta API error (Facebook):', fbData.error);
    } else if (fbData.data && fbData.data.length > 0) {
      for (const item of fbData.data) {
        // Skip if post has no message text
        if (!item.message) continue;

        const permalink = item.permalink_url || `https://facebook.com/${item.id}`;

        // Deduplicate: check if post already exists by source_url
        const { data: existing } = await supabase
          .from('posts')
          .select('id')
          .eq('source_url', permalink)
          .maybeSingle();

        if (existing) continue; // Already synced

        // Format post details
        const title = item.message.split('\n')[0].substring(0, 80) || 'Facebook Update';
        const imageUrl = item.full_picture || null;

        const newPost = {
          title: title.trim(),
          content: item.message.trim(),
          author: 'Fact Check Master (Facebook)',
          status: 'published',
          fact_check_status: 'verified',
          category: 'latest-news',
          source_url: permalink,
          image_url: imageUrl,
          media: {
            images: imageUrl ? [imageUrl] : [],
            videos: []
          },
          created_at: item.created_time
        };

        const { data: inserted, error: insertErr } = await supabase
          .from('posts')
          .insert(newPost)
          .select()
          .single();

        if (insertErr) {
          console.error('[FB Sync] Error inserting FB post:', insertErr);
        } else if (inserted) {
          syncedPosts.push(inserted);
        }
      }
    }

    // ────────────────────────────────────────────────────────
    // 3. SYNC INSTAGRAM POSTS (if Instagram Business Account is linked)
    // ────────────────────────────────────────────────────────
    console.log('[FB Sync] Querying linked Instagram Business Account...');
    const pageDetailsUrl = `https://graph.facebook.com/v18.0/${fbPageId}?fields=instagram_business_account&access_token=${fbAccessToken}`;
    const pageDetailsRes = await fetch(pageDetailsUrl);
    const pageDetails = await pageDetailsRes.json();

    const igBusinessId = pageDetails?.instagram_business_account?.id;

    if (igBusinessId) {
      console.log(`[FB Sync] Linked Instagram Business ID found: ${igBusinessId}`);
      const igMediaUrl = `https://graph.facebook.com/v18.0/${igBusinessId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,thumbnail_url&access_token=${fbAccessToken}&limit=10`;
      const igRes = await fetch(igMediaUrl);
      const igData = await igRes.json();

      if (igData.error) {
        console.error('[FB Sync] Meta API error (Instagram):', igData.error);
      } else if (igData.data && igData.data.length > 0) {
        for (const item of igData.data) {
          const permalink = item.permalink || `https://instagram.com/p/${item.id}`;

          // Deduplicate
          const { data: existing } = await supabase
            .from('posts')
            .select('id')
            .eq('source_url', permalink)
            .maybeSingle();

          if (existing) continue;

          // Format post details
          const contentText = item.caption || '';
          const title = contentText.split('\n')[0].substring(0, 80) || 'Instagram Update';
          
          // Media handling
          const isVideo = item.media_type === 'VIDEO';
          const imageUrl = isVideo ? (item.thumbnail_url || item.media_url) : (item.media_url || null);
          const videoUrl = isVideo ? item.media_url : null;

          const newPost = {
            title: title.trim(),
            content: contentText.trim() || 'Instagram Photo Update',
            author: 'Fact Check Master (Instagram)',
            status: 'published',
            fact_check_status: 'verified',
            category: 'latest-news',
            source_url: permalink,
            image_url: imageUrl,
            media: {
              images: imageUrl ? [imageUrl] : [],
              videos: videoUrl ? [videoUrl] : []
            },
            created_at: item.timestamp
          };

          const { data: inserted, error: insertErr } = await supabase
            .from('posts')
            .insert(newPost)
            .select()
            .single();

          if (insertErr) {
            console.error('[FB Sync] Error inserting IG post:', insertErr);
          } else if (inserted) {
            syncedPosts.push(inserted);
          }
        }
      }
    } else {
      console.log('[FB Sync] No linked Instagram Business Account found for this Page.');
    }

    return res.status(200).json({
      success: true,
      syncedCount: syncedPosts.length,
      syncedPosts: syncedPosts.map(p => ({ id: p.id, title: p.title, author: p.author }))
    });
  } catch (error) {
    console.error('[FB Sync] Error in sync handler:', error);
    return res.status(500).json({ error: error.message || 'Internal server error during sync' });
  }
}
