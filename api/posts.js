// Supabase configuration for permanent post storage
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Supabase configuration - you'll need to set these environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseConfigured = !!supabaseUrl && !!supabaseKey;

// Log configuration status (without exposing sensitive data)
console.log('[Supabase] URL configured:', !!supabaseUrl && !supabaseUrl.includes('your-project'));
console.log('[Supabase] Key configured:', !!supabaseKey && !supabaseKey.includes('your-anon-key'));

if (!supabaseConfigured || supabaseUrl.includes('your-project') || supabaseKey.includes('your-anon-key')) {
  console.error('[Supabase] WARNING: Supabase credentials not properly configured!');
  console.error('[Supabase] Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables in Vercel');
}

// Create Supabase client
const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

// Simple in-memory cache map for GET responses (persists while container is warm)
const apiCache = new Map();
const CACHE_TTL_MS = 300000; // 5 minutes (invalidated on writes)

// Helper to clean mathematical bold/italic characters to standard text for email subjects
function cleanSubjectText(text) {
  if (!text) return '';
  return [...text].map(char => {
    const code = char.codePointAt(0);
    if (!code) return char;
    // Bold Serif: 𝐀-𝐙 (U+1D400 to U+1D419)
    if (code >= 0x1D400 && code <= 0x1D419) return String.fromCharCode(code - 0x1D400 + 65);
    // Bold Serif: 𝐚-𝐳 (U+1D41A to U+1D433)
    if (code >= 0x1D41A && code <= 0x1D433) return String.fromCharCode(code - 0x1D41A + 97);
    // Italic Serif: 𝐴-𝑍 (U+1D434 to U+1D44D)
    if (code >= 0x1D434 && code <= 0x1D44D) return String.fromCharCode(code - 0x1D434 + 65);
    // Italic Serif: 𝑎-𝑧 (U+1D44E to U+1D467)
    if (code >= 0x1D44E && code <= 0x1D467) return String.fromCharCode(code - 0x1D44E + 97);
    // Bold Italic Serif: 𝑨-𝒁 (U+1D468 to U+1D481)
    if (code >= 0x1D468 && code <= 0x1D481) return String.fromCharCode(code - 0x1D468 + 65);
    // Bold Italic Serif: 𝒂-𝒛 (U+1D482 to U+1D49B)
    if (code >= 0x1D482 && code <= 0x1D49B) return String.fromCharCode(code - 0x1D482 + 97);
    // Sans-serif Bold: 𝗔-𝗭 (U+1D5D4 to U+1D5ED)
    if (code >= 0x1D5D4 && code <= 0x1D5ED) return String.fromCharCode(code - 0x1D5D4 + 65);
    // Sans-serif Bold: 𝗮-𝘇 (U+1D5EE to U+1D607)
    if (code >= 0x1D5EE && code <= 0x1D607) return String.fromCharCode(code - 0x1D5EE + 97);
    return char;
  }).join('');
}

// Helper to broadcast emails on new post
async function sendNewPostNotifications(post) {
  if (!supabase) return;

  try {
    // 1. Fetch subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from('subscribers')
      .select('email, name');

    if (fetchError || !subscribers || subscribers.length === 0) {
      console.log('[Notifications] No subscribers found to notify.');
      return;
    }

    // 2. SMTP configuration
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const fromEmail = process.env.FROM_EMAIL || 'contact@factcheckmaster.com';

    const smtpConfigured = !!host && !!user && !!pass;

    if (smtpConfigured) {
      const mailer = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass }
      });

      const postUrl = `https://www.factcheckmaster.com/post/${post.id}`;
      const cleanContent = post.content
        ? post.content.replace(/<[^>]*>/g, '').substring(0, 250) + '...'
        : 'A new verification update has been posted on Fact Check Master.';

      const sendPromises = subscribers.map(async (sub) => {
        try {
          await mailer.sendMail({
            from: `"Fact Check Master" <${fromEmail}>`,
            to: sub.email,
            subject: `Alert: New Fact-Check Posted — ${cleanSubjectText(post.title)}`,
            html: `
              <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 32px 24px; text-align: center; color: #ffffff;">
                  <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">Fact Check Master</h1>
                  <p style="margin: 8px 0 0 0; font-size: 13px; color: #bfdbfe; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">New Verification Alert</p>
                </div>
                <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
                  <p style="margin-top: 0; font-size: 16px; font-weight: 700; color: #0f172a;">Hello ${sub.name || 'Subscriber'},</p>
                  <p style="font-size: 15px; color: #334155;">A new verification post has been published on the News Dashboard:</p>
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin: 24px 0;">
                    <h3 style="margin-top: 0; margin-bottom: 8px; color: #1e3a8a; font-size: 17px; font-weight: 800;">${post.title}</h3>
                    <p style="font-size: 12px; font-weight: 700; margin-top: 0; margin-bottom: 12px; color: #dc2626; text-transform: uppercase; letter-spacing: 0.5px;">Status: ${post.fact_check_status || 'Verified'}</p>
                    <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.5;">${cleanContent}</p>
                  </div>
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${postUrl}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.2);">
                      Read Full Fact-Check
                    </a>
                  </div>
                </div>
                <div style="background-color: #f8fafc; padding: 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
                  <p style="margin: 0 0 8px 0;">You are receiving this because you subscribed to alerts on Fact Check Master.</p>
                  <p style="margin: 0;">Fact Check Master &bull; Verification Division &bull; contact@factcheckmaster.com</p>
                </div>
              </div>
            `
          });
        } catch (err) {
          console.error(`[Notifications] Failed to send email to ${sub.email}:`, err);
        }
      });

      await Promise.all(sendPromises);
      console.log(`[Notifications] Broadcast sent successfully to ${subscribers.length} subscribers.`);
    } else {
      console.warn('[Notifications] SMTP not configured. Simulated dispatch for post:', post.title);
    }
  } catch (err) {
    console.error('[Notifications] Failed to dispatch notifications:', err);
  }
}

function getCachedData(key) {
  const cached = apiCache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    console.log(`[Cache] Hit for key: ${key}`);
    return cached.data;
  }
  if (cached) {
    console.log(`[Cache] Expired for key: ${key}`);
    apiCache.delete(key);
  }
  return null;
}

function setCachedData(key, data) {
  console.log(`[Cache] Set key: ${key}`);
  apiCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

function clearCache() {
  console.log('[Cache] Clearing all cached entries');
  apiCache.clear();
}

function requireSupabase(res) {
  if (!supabase) {
    res.status(500).json({ error: 'Supabase is not configured on the server' });
    return false;
  }
  return true;
}

async function requireApprovedAdmin(req, res) {
  const deviceId = req.headers && req.headers['x-device-id'];

  if (!deviceId) {
    res.status(403).json({ error: 'Approved device ID is required' });
    return null;
  }

  const { data, error } = await supabase
    .from('approved_devices')
    .select('device_id, device_name, approved')
    .eq('device_id', deviceId)
    .eq('approved', true)
    .single();

  if (error || !data) {
    res.status(403).json({ error: 'Unauthorized device' });
    return null;
  }

  return data;
}

// Sample data for initialization
const SAMPLE_POSTS = [
  {
    title: "Breaking: Fact Check Alert",
    content: "🚨 MISINFORMATION ALERT: Claims circulating about recent events have been fact-checked and found to be false. Always verify information with reliable sources. #FactCheck #TruthMatters",
    author: "Fact Check Master",
    status: "published",
    fact_check_status: "verified",
    category: "latest-news",
    image_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    source_url: "https://factcheckmaster.com"
  },
  {
    title: "Election Security Update",
    content: "📊 VERIFIED: Election security measures are working as intended. Independent audits confirm system integrity. Don't fall for disinformation campaigns. #ElectionSecurity",
    author: "Fact Check Master",
    status: "published",
    fact_check_status: "verified",
    category: "latest-news",
    image_url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    source_url: "https://factcheckmaster.com"
  },
  {
    title: "Health Information Verified",
    content: "🏥 FACT-CHECKED: Recent health claims trending on social media have been reviewed by medical experts. The information is accurate and backed by peer-reviewed research. #HealthFacts",
    author: "Fact Check Master",
    status: "published",
    fact_check_status: "verified",
    category: "latest-news",
    image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    source_url: "https://factcheckmaster.com"
  },
  {
    title: "Climate Data Confirmation",
    content: "🌍 VERIFIED DATA: Latest climate statistics being questioned online have been confirmed by multiple international agencies. The data is accurate and transparent. #ClimateScience",
    author: "Fact Check Master",
    status: "published",
    fact_check_status: "verified",
    category: "latest-news",
    image_url: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    source_url: "https://factcheckmaster.com"
  }
];

// Database functions for permanent storage
async function getAllPosts(popular, chronological) {
  try {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('status', 'published');

    if (popular === true || popular === 'true') {
      query = query
        .order('pinned_popular', { ascending: false, nullsFirst: false })
        .order('views', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });
    } else if (chronological === true || chronological === 'true') {
      query = query
        .order('created_at', { ascending: false });
    } else {
      query = query
        .order('pinned_hero', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });
    }

    // Default limit to prevent massive payload transfers
    query = query.limit(200);

    const { data, error } = await query;

    if (error) throw error;
    
    // Deduplicate by title
    const uniquePosts = [];
    const seenTitles = new Set();
    if (data) {
      for (const post of data) {
        const titleTrimmed = post.title ? post.title.trim().toLowerCase() : '';
        if (titleTrimmed && !seenTitles.has(titleTrimmed)) {
          seenTitles.add(titleTrimmed);
          uniquePosts.push(post);
        } else if (!titleTrimmed) {
          uniquePosts.push(post);
        }
      }
    }
    
    // Return posts from database (even if empty)
    console.log(`[Database] Retrieved ${data ? data.length : 0} posts from Supabase, unique: ${uniquePosts.length}`);
    // Truncate content field for listing responses to reduce payload (~2KB vs ~50KB per post)
    return uniquePosts.map(post => ({
      ...post,
      content: post.content ? post.content.substring(0, 300) : ''
    }));
  } catch (error) {
    console.error('[Database] Error fetching posts:', error);
    // Only use fallback sample data if database connection fails completely
    console.log('[Database] Using fallback sample data due to connection error');
    return SAMPLE_POSTS.map((post, index) => ({
      id: index + 1,
      ...post,
      category: post.category || 'latest-news',
      created_at: new Date(Date.now() - (index * 86400000)).toISOString(), // Stagger dates
      updated_at: new Date(Date.now() - (index * 86400000)).toISOString()
    }));
  }
}

const HERO_BREAKING_CATEGORIES = ['breaking-news', 'featured-news'];

/**
 * Filtered list for GET ?category=&limit=&offset=&ascending=
 * When category matches hero lane, includes both breaking-news and featured-news rows.
 */
async function getPostsList({ category, limit, offset, ascending, popular, chronological }) {
  try {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('status', 'published');

    if (category) {
      const cat = String(category).trim();
      if (HERO_BREAKING_CATEGORIES.includes(cat)) {
        query = query.in('category', HERO_BREAKING_CATEGORIES);
      } else if (cat === 'world-news') {
        query = query.in('category', ['world-news', 'international']);
      } else {
        query = query.eq('category', cat);
      }
    }

    if (popular === true || popular === 'true') {
      query = query
        .order('pinned_popular', { ascending: false, nullsFirst: false })
        .order('views', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });
    } else if (chronological === true || chronological === 'true') {
      const asc = ascending === true || ascending === 'true';
      query = query.order('created_at', { ascending: asc });
    } else {
      const asc = ascending === true || ascending === 'true';
      query = query.order('pinned_hero', { ascending: false, nullsFirst: false })
                   .order('created_at', { ascending: asc });
    }

    const limRaw = limit !== undefined && limit !== '' ? parseInt(limit, 10) : NaN;
    const offRaw = offset !== undefined && offset !== '' ? parseInt(offset, 10) : 0;
    const off = Number.isFinite(offRaw) && offRaw >= 0 ? offRaw : 0;

    // Fetch up to 500 rows to allow deduplication without missing slots
    query = query.range(0, 499);

    const { data, error } = await query;
    if (error) throw error;

    // Deduplicate by title
    const uniquePosts = [];
    const seenTitles = new Set();
    if (data) {
      for (const post of data) {
        const titleTrimmed = post.title ? post.title.trim().toLowerCase() : '';
        if (titleTrimmed && !seenTitles.has(titleTrimmed)) {
          seenTitles.add(titleTrimmed);
          uniquePosts.push(post);
        } else if (!titleTrimmed) {
          uniquePosts.push(post);
        }
      }
    }

    let slicedPosts = uniquePosts;
    if (Number.isFinite(limRaw) && limRaw > 0) {
      slicedPosts = uniquePosts.slice(off, off + limRaw);
    } else {
      slicedPosts = uniquePosts.slice(off);
    }

    // Truncate content for listing responses to reduce payload
    return slicedPosts.map(post => ({
      ...post,
      content: post.content ? post.content.substring(0, 300) : ''
    }));
  } catch (error) {
    console.error('[Database] Error in getPostsList:', error);
    return [];
  }
}

function parseQueryParam(query, key) {
  const v = query?.[key];
  return Array.isArray(v) ? v[0] : v;
}

async function getPostById(postId) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('[Database] Error fetching post by ID:', error);
    // Backward-compatible fallback path
    const posts = await getAllPosts();
    return posts.find((post) => String(post.id) === String(postId)) || null;
  }
}

async function addNewPost(postData) {
  try {
    console.log('[Database] Creating new post with data:', postData);
    
    // Prepare post data
    const postToInsert = {
      title: postData.title.trim(),
      content: postData.content.trim(),
      author: postData.author?.trim() || 'Fact Check Master',
      status: 'published',
      fact_check_status: postData.fact_check_status || 'verified',
      source_url: postData.postUrl || null
    };

    // Handle media (images and videos)
    if (postData.media) {
      console.log('[Database] Media received:', postData.media);
      console.log('[Database] Media type:', typeof postData.media);
      
      // Ensure media is an object, not a string
      let mediaObj = postData.media;
      if (typeof postData.media === 'string') {
        try {
          mediaObj = JSON.parse(postData.media);
        } catch (e) {
          console.error('[Database] Failed to parse media string:', e);
          mediaObj = { images: [], videos: [] };
        }
      }
      
      postToInsert.media = mediaObj;
      console.log('[Database] Media to save:', JSON.stringify(mediaObj));
      
      // Backward compatibility: set image_url to first image if exists
      if (mediaObj.images && mediaObj.images.length > 0) {
        postToInsert.image_url = mediaObj.images[0];
      } else {
        postToInsert.image_url = null;
      }
    } else if (postData.imageUrl) {
      // Backward compatibility for old imageUrl field
      console.log('[Database] Using legacy imageUrl:', postData.imageUrl);
      postToInsert.image_url = postData.imageUrl;
      postToInsert.media = { images: [postData.imageUrl], videos: [] };
    } else {
      console.log('[Database] No media provided');
      postToInsert.image_url = null;
      postToInsert.media = { images: [], videos: [] };
    }

    // Handle both single category and multiple categories
    if (postData.categories && Array.isArray(postData.categories)) {
      // For multiple categories, store as comma-separated string or create multiple entries
      // For now, store the primary category (first in array)
      postToInsert.category = postData.categories[0];
    } else if (postData.category) {
      // Backward compatibility for single category
      postToInsert.category = postData.category;
    }

    console.log('[Database] Inserting post:', JSON.stringify(postToInsert, null, 2));
    console.log('[Database] Media value:', postToInsert.media);
    console.log('[Database] Media type:', typeof postToInsert.media);

    // If multiple categories, create duplicate entries for each category
    if (postData.categories && postData.categories.length > 1) {
      const allPosts = [];
      for (const category of postData.categories) {
        const categoryPost = { ...postToInsert, category };
        const { data, error } = await supabase
          .from('posts')
          .insert(categoryPost)
          .select()
          .single();
        
        if (error) {
          console.error(`[Database] Supabase error for category ${category}:`, error);
          throw error;
        }
        allPosts.push(data);
        console.log(`[Database] Successfully created post with ID: ${data.id} for category: ${category}`);
        console.log('[Database] Created post data:', JSON.stringify(data, null, 2));
      }
      return allPosts[0]; // Return first post as primary
    } else {
      // Single category insertion
      const { data, error } = await supabase
        .from('posts')
        .insert(postToInsert)
        .select()
        .single();

      if (error) {
        console.error('[Database] Supabase error:', error);
        throw error;
      }

      console.log(`[Database] Successfully created post with ID: ${data.id}`);
      console.log('[Database] Created post data:', JSON.stringify(data, null, 2));
      return data;
    }
  } catch (error) {
    console.error('[Database] Error creating post:', error);
    throw new Error(`Failed to create post in database: ${error.message}`);
  }
}

async function updatePost(postId, postData) {
  try {
    console.log('[Database] Updating post with ID:', postId);
    
    // 1. Fetch original post title
    const { data: originalPost, error: fetchErr } = await supabase
      .from('posts')
      .select('title, category')
      .eq('id', postId)
      .single();
      
    if (fetchErr || !originalPost) {
      throw fetchErr || new Error('Original post not found');
    }
    const originalTitle = originalPost.title;

    const postToUpdate = {
      title: postData.title.trim(),
      content: postData.content.trim(),
      author: postData.author?.trim() || 'Fact Check Master',
      fact_check_status: postData.fact_check_status || 'verified',
      source_url: postData.postUrl || null,
      updated_at: new Date().toISOString()
    };

    // Handle media (images and videos)
    if (postData.media) {
      let mediaObj = postData.media;
      if (typeof postData.media === 'string') {
        try {
          mediaObj = JSON.parse(postData.media);
        } catch (e) {
          mediaObj = { images: [], videos: [] };
        }
      }
      postToUpdate.media = mediaObj;
      if (mediaObj.images && mediaObj.images.length > 0) {
        postToUpdate.image_url = mediaObj.images[0];
      } else {
        postToUpdate.image_url = null;
      }
    } else if (postData.imageUrl) {
      postToUpdate.image_url = postData.imageUrl;
      postToUpdate.media = { images: [postData.imageUrl], videos: [] };
    } else {
      postToUpdate.image_url = null;
      postToUpdate.media = { images: [], videos: [] };
    }

    const categoriesList = postData.categories || [originalPost.category || 'latest-news'];
    postToUpdate.category = categoriesList[0];

    // 2. Update primary row
    const { data: updatedPrimary, error: updateErr } = await supabase
      .from('posts')
      .update(postToUpdate)
      .eq('id', postId)
      .select()
      .single();

    if (updateErr) throw updateErr;

    // 3. Delete other rows sharing original title with different IDs
    const { error: deleteErr } = await supabase
      .from('posts')
      .delete()
      .eq('title', originalTitle)
      .neq('id', postId);

    if (deleteErr) {
      console.error('[Database] Failed to delete other category entries:', deleteErr);
    }

    // 4. Insert new rows for extra categories
    if (categoriesList.length > 1) {
      for (let i = 1; i < categoriesList.length; i++) {
        const extraPost = {
          ...postToUpdate,
          category: categoriesList[i]
        };
        const { error: insertErr } = await supabase
          .from('posts')
          .insert(extraPost);
        if (insertErr) {
          console.error(`[Database] Failed to insert extra category ${categoriesList[i]}:`, insertErr);
        }
      }
    }

    return updatedPrimary;
  } catch (error) {
    console.error('[Database] Error updating post:', error);
    throw new Error(`Failed to update post in database: ${error.message}`);
  }
}

async function removePost(postId) {
  try {
    // 1. Fetch title to delete all category copies
    const { data: post, error: fetchErr } = await supabase
      .from('posts')
      .select('title')
      .eq('id', postId)
      .single();

    if (fetchErr) {
      if (fetchErr.code === 'PGRST116') {
        console.log(`[Database] Post with ID ${postId} already deleted (0 rows).`);
        return true;
      }
      throw fetchErr;
    }

    if (!post) {
      console.log(`[Database] Post with ID ${postId} not found.`);
      return true;
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('title', post.title);

    if (error) throw error;

    console.log(`[Database] Successfully deleted all posts with title: ${post.title}`);
    return true;
  } catch (error) {
    console.error('[Database] Error deleting post:', error);
    throw new Error('Failed to delete post from database');
  }
}

async function initializeSamplePosts() {
  try {
    const { error } = await supabase
      .from('posts')
      .insert(SAMPLE_POSTS);

    if (error) throw error;

    console.log('[Database] Successfully initialized with sample posts');
    return true;
  } catch (error) {
    console.error('[Database] Error initializing sample posts:', error);
    return false;
  }
}

// API Handler with permanent database storage
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Device-ID');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log(`[API] ${req.method} /api/posts`);

  try {
    if (!requireSupabase(res)) return;

    if (req.method === 'GET') {
      const requestedId = Array.isArray(req.query?.id) ? req.query.id[0] : req.query?.id;
      const isAdmin = !!(req.headers && req.headers['x-device-id']);
      const cacheKey = JSON.stringify(req.query);

      if (requestedId !== undefined) {
        const postId = parseInt(requestedId, 10);
        if (Number.isNaN(postId)) {
          return res.status(400).json({ error: 'Invalid post ID' });
        }

        const singleCacheKey = `post_${postId}`;
        if (!isAdmin) {
          const cachedPost = getCachedData(singleCacheKey);
          if (cachedPost) {
            res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600');
            return res.status(200).json(cachedPost);
          }
        }

        const post = await getPostById(postId);
        if (!post) {
          return res.status(404).json({ error: 'Post not found' });
        }

        if (!isAdmin) {
          setCachedData(singleCacheKey, post);
        }

        res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600');
        return res.status(200).json(post);
      }

      // Serve from in-memory cache if available (public requests only)
      if (!isAdmin) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600');
          return res.status(200).json(cachedData);
        }
      }

      const rawCategory = parseQueryParam(req.query, 'category');
      const rawLimit = parseQueryParam(req.query, 'limit');
      const rawOffset = parseQueryParam(req.query, 'offset');
      const rawAscending = parseQueryParam(req.query, 'ascending');
      const popular = parseQueryParam(req.query, 'popular');
      const chronological = parseQueryParam(req.query, 'chronological');

      const categoryTrimmed =
        rawCategory !== undefined && rawCategory !== null && String(rawCategory).trim() !== ''
          ? String(rawCategory).trim()
          : undefined;
      const hasListFilters =
        categoryTrimmed !== undefined ||
        (rawLimit !== undefined && rawLimit !== '' && rawLimit !== null) ||
        (rawOffset !== undefined && rawOffset !== '' && rawOffset !== null) ||
        (popular !== undefined && popular !== '' && popular !== null) ||
        (chronological !== undefined && chronological !== '' && chronological !== null);

      if (hasListFilters) {
        const posts = await getPostsList({
          category: categoryTrimmed,
          limit: rawLimit,
          offset: rawOffset,
          ascending: rawAscending,
          popular: popular,
          chronological: chronological
        });
        console.log(`[API] Returning ${posts.length} posts (filtered list)`);
        
        if (!isAdmin) {
          setCachedData(cacheKey, posts);
        }
        
        res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600');
        return res.status(200).json(posts);
      }

      const posts = await getAllPosts(popular, chronological);
      console.log(`[API] Returning ${posts.length} posts from permanent database`);
      
      if (!isAdmin) {
        setCachedData(cacheKey, posts);
      }

      res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600');
      res.status(200).json(posts);

    } else if (req.method === 'POST') {
      const approvedAdmin = await requireApprovedAdmin(req, res);
      if (!approvedAdmin) return;

      console.log('[API] POST request body:', JSON.stringify(req.body, null, 2));
      const { title, content, author, fact_check_status, imageUrl, postUrl, category, categories, media } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      console.log('[API] Extracted media from request:', media);

      const newPost = await addNewPost({
        title,
        content,
        author,
        fact_check_status,
        imageUrl,
        postUrl,
        media,
        categories: categories || (category ? [category] : ['latest-news'])
      });
      
      // Invalidate frontend caches
      clearCache();

      // Dispatch alert notifications to all subscribers in background (non-blocking)
      sendNewPostNotifications(newPost).catch(err => {
        console.error('[Notifications] Background dispatch error:', err);
      });

      res.status(201).json({ 
        id: newPost.id,
        success: true,
        message: 'Post created successfully in permanent database'
      });

    } else if (req.method === 'PUT') {
      const approvedAdmin = await requireApprovedAdmin(req, res);
      if (!approvedAdmin) return;

      const postId = parseInt(req.query.id);
      
      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      console.log('[API] PUT request body:', JSON.stringify(req.body, null, 2));
      const { title, content, author, fact_check_status, imageUrl, postUrl, categories, category, media } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      console.log('[API] Extracted media from request:', media);

      const updatedPost = await updatePost(postId, {
        title,
        content,
        author,
        fact_check_status,
        imageUrl,
        postUrl,
        media,
        categories: categories || (category ? [category] : null)
      });
      
      // Invalidate frontend caches
      clearCache();

      res.status(200).json({ 
        success: true,
        message: 'Post updated successfully in permanent database',
        post: updatedPost
      });

    } else if (req.method === 'DELETE') {
      const approvedAdmin = await requireApprovedAdmin(req, res);
      if (!approvedAdmin) return;

      const postId = parseInt(req.query.id) || parseInt(req.url.split('/').pop());
      
      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      await removePost(postId);
      
      // Invalidate frontend caches
      clearCache();

      res.status(200).json({ 
        success: true,
        message: 'Post deleted successfully from permanent database'
      });

    } else if (req.method === 'PATCH') {
      const action = parseQueryParam(req.query, 'action');
      const postId = parseInt(parseQueryParam(req.query, 'id'), 10);
      if (!postId || Number.isNaN(postId)) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      // View count increment does NOT require admin approval
      if (action === 'view') {
        const { data: post, error: fetchErr } = await supabase
          .from('posts')
          .select('views')
          .eq('id', postId)
          .single();

        if (fetchErr || !post) {
          return res.status(404).json({ error: 'Post not found' });
        }

        const newViews = (post.views || 0) + 1;
        const { data: updated, error: updateErr } = await supabase
          .from('posts')
          .update({ views: newViews })
          .eq('id', postId)
          .select()
          .single();

        if (updateErr) throw updateErr;

        return res.status(200).json({ success: true, views: newViews, post: updated });
      }

      // Pin/unpin a post requires admin approval
      const approvedAdmin = await requireApprovedAdmin(req, res);
      if (!approvedAdmin) return;

      if (action === 'pin-popular') {
        const { data: current, error: fetchErr } = await supabase
          .from('posts')
          .select('id, title, pinned_popular')
          .eq('id', postId)
          .single();
        if (fetchErr || !current) {
          return res.status(404).json({ error: 'Post not found' });
        }

        const newVal = current.pinned_popular ? false : true;

        // Update all posts sharing the same title
        const { data: updatedRows, error: updateErr } = await supabase
          .from('posts')
          .update({ pinned_popular: newVal })
          .eq('title', current.title)
          .select();

        if (updateErr) throw updateErr;

        const updated = updatedRows.find(p => p.id === postId) || updatedRows[0];

        // Invalidate frontend caches on layout changes
        clearCache();

        return res.status(200).json({ success: true, pinned_popular: newVal, post: updated });
      }

      // Pin to Hero (explicit action OR legacy default)
      if (!action || action === 'pin-hero') {
        const { data: current, error: fetchErr } = await supabase
          .from('posts')
          .select('id, title, pinned_hero')
          .eq('id', postId)
          .single();
        if (fetchErr || !current) {
          return res.status(404).json({ error: 'Post not found' });
        }

        const newVal = current.pinned_hero ? false : true;

        // Update all posts sharing the same title
        const { data: updatedRows, error: updateErr } = await supabase
          .from('posts')
          .update({ pinned_hero: newVal })
          .eq('title', current.title)
          .select();

        if (updateErr) throw updateErr;

        const updated = updatedRows.find(p => p.id === postId) || updatedRows[0];

        // Invalidate frontend caches on layout changes
        clearCache();

        return res.status(200).json({ success: true, pinned_hero: newVal, post: updated });
      }

      return res.status(400).json({ error: `Unknown action: ${action}` });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('[API] Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}