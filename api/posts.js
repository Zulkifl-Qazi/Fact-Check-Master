// Supabase configuration for permanent post storage
import { createClient } from '@supabase/supabase-js';

// Supabase configuration - you'll need to set these environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Log configuration status (without exposing sensitive data)
console.log('[Supabase] URL configured:', !!supabaseUrl && !supabaseUrl.includes('your-project'));
console.log('[Supabase] Key configured:', !!supabaseKey && !supabaseKey.includes('your-anon-key'));

if (!supabaseUrl || supabaseUrl.includes('your-project') || !supabaseKey || supabaseKey.includes('your-anon-key')) {
  console.error('[Supabase] WARNING: Supabase credentials not properly configured!');
  console.error('[Supabase] Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables in Vercel');
}

// Create Supabase client
const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder-key');

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
      image_url: postData.imageUrl || null,
      source_url: postData.postUrl || null
    };

    // Only add category if provided (for backward compatibility)
    if (postData.category) {
      postToInsert.category = postData.category;
    }

    console.log('[Database] Inserting post:', postToInsert);

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
    return data;
  } catch (error) {
    console.error('[Database] Error creating post:', error);
    throw new Error(`Failed to create post in database: ${error.message}`);
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log(`[API] ${req.method} /api/posts`);

  try {
    if (req.method === 'GET') {
      const posts = await getAllPosts();
      console.log(`[API] Returning ${posts.length} posts from permanent database`);
      res.status(200).json(posts);

    } else if (req.method === 'POST') {
      const { title, content, author, fact_check_status, imageUrl, postUrl, category } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const newPost = await addNewPost({
        title,
        content,
        author,
        fact_check_status,
        imageUrl,
        postUrl,
        category
      });
      
      res.status(201).json({ 
        id: newPost.id,
        success: true,
        message: 'Post created successfully in permanent database'
      });

    } else if (req.method === 'DELETE') {
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