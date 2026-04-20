// Supabase configuration for permanent post storage
import { createClient } from '@supabase/supabase-js';

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

function requireSupabase(res) {
  if (!supabase) {
    res.status(500).json({ error: 'Supabase is not configured on the server' });
    return false;
  }
  return true;
}

async function requireApprovedAdmin(req, res) {
  const deviceId = req.headers['x-device-id'];

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
    image_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    source_url: "https://factcheckmaster.com"
  },
  {
    title: "Election Security Update",
    content: "📊 VERIFIED: Election security measures are working as intended. Independent audits confirm system integrity. Don't fall for disinformation campaigns. #ElectionSecurity",
    author: "Fact Check Master",
    status: "published",
    fact_check_status: "verified",
    image_url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    source_url: "https://factcheckmaster.com"
  },
  {
    title: "Health Information Verified",
    content: "🏥 FACT-CHECKED: Recent health claims trending on social media have been reviewed by medical experts. The information is accurate and backed by peer-reviewed research. #HealthFacts",
    author: "Fact Check Master",
    status: "published",
    fact_check_status: "verified",
    image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    source_url: "https://factcheckmaster.com"
  },
  {
    title: "Climate Data Confirmation",
    content: "🌍 VERIFIED DATA: Latest climate statistics being questioned online have been confirmed by multiple international agencies. The data is accurate and transparent. #ClimateScience",
    author: "Fact Check Master",
    status: "published",
    fact_check_status: "verified",
    image_url: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    source_url: "https://factcheckmaster.com"
  }
];

// Database functions for permanent storage
async function getAllPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Return posts from database (even if empty)
    console.log(`[Database] Retrieved ${data ? data.length : 0} posts from Supabase`);
    return data || [];
  } catch (error) {
    console.error('[Database] Error fetching posts:', error);
    // Only use fallback sample data if database connection fails completely
    console.log('[Database] Using fallback sample data due to connection error');
    return SAMPLE_POSTS.map((post, index) => ({
      id: index + 1,
      ...post,
      created_at: new Date(Date.now() - (index * 86400000)).toISOString(), // Stagger dates
      updated_at: new Date(Date.now() - (index * 86400000)).toISOString()
    }));
  }
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
    console.log('[Database] Incoming postData:', JSON.stringify(postData, null, 2));
    
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
      
      postToUpdate.media = mediaObj;
      console.log('[Database] Media to save:', JSON.stringify(mediaObj));
      
      // Backward compatibility: set image_url to first image if exists
      if (mediaObj.images && mediaObj.images.length > 0) {
        postToUpdate.image_url = mediaObj.images[0];
      } else {
        postToUpdate.image_url = null;
      }
    } else if (postData.imageUrl) {
      // Backward compatibility for old imageUrl field
      console.log('[Database] Using legacy imageUrl:', postData.imageUrl);
      postToUpdate.image_url = postData.imageUrl;
      postToUpdate.media = { images: [postData.imageUrl], videos: [] };
    } else {
      console.log('[Database] No media provided');
      postToUpdate.image_url = null;
      postToUpdate.media = { images: [], videos: [] };
    }
    
    console.log('[Database] Final update object:', JSON.stringify(postToUpdate, null, 2));

    // Handle categories - update the category field with the first category
    if (postData.categories && Array.isArray(postData.categories) && postData.categories.length > 0) {
      postToUpdate.category = postData.categories[0];
    }

    console.log('[Database] About to update with:', postToUpdate);
    console.log('[Database] Media value type:', typeof postToUpdate.media);

    const { data, error } = await supabase
      .from('posts')
      .update(postToUpdate)
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('[Database] Supabase update error:', error);
      throw error;
    }

    console.log(`[Database] Successfully updated post with ID: ${postId}`);
    console.log('[Database] Updated post data:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('[Database] Error updating post:', error);
    throw new Error(`Failed to update post in database: ${error.message}`);
  }
}

async function removePost(postId) {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;

    console.log(`[Database] Successfully deleted post with ID: ${postId}`);
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

      if (requestedId !== undefined) {
        const postId = parseInt(requestedId, 10);
        if (Number.isNaN(postId)) {
          return res.status(400).json({ error: 'Invalid post ID' });
        }

        const post = await getPostById(postId);
        if (!post) {
          return res.status(404).json({ error: 'Post not found' });
        }

        res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
        return res.status(200).json(post);
      }

      const posts = await getAllPosts();
      console.log(`[API] Returning ${posts.length} posts from permanent database`);
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
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
      
      res.status(200).json({ 
        success: true,
        message: 'Post deleted successfully from permanent database'
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('[API] Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}