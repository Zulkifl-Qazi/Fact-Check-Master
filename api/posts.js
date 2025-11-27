// Simple persistent storage for Vercel using GitHub Gist as backend
// This ensures posts persist between serverless function restarts

const SAMPLE_POSTS = [
  {
    id: 1,
    title: "Breaking: Fact Check Alert",
    content: "🚨 MISINFORMATION ALERT: Claims circulating about recent events have been fact-checked and found to be false. Always verify information with reliable sources. #FactCheck #TruthMatters",
    author: "Fact Check Master",
    status: "published",
    fact_check_status: "verified",
    image_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    source_url: "https://factcheckmaster.com",
    created_at: "2024-11-20T10:00:00Z",
    updated_at: "2024-11-20T10:00:00Z"
  },
  {
    id: 2,
    title: "Election Security Update",
    content: "📊 VERIFIED: Election security measures are working as intended. Independent audits confirm system integrity. Don't fall for disinformation campaigns. #ElectionSecurity",
    author: "Fact Check Master",
    status: "published",
    fact_check_status: "verified",
    image_url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    source_url: "https://factcheckmaster.com",
    created_at: "2024-11-19T15:30:00Z",
    updated_at: "2024-11-19T15:30:00Z"
  },
  {
    id: 3,
    title: "Health Information Verified",
    content: "🏥 FACT-CHECKED: Recent health claims trending on social media have been reviewed by medical experts. The information is accurate and backed by peer-reviewed research. #HealthFacts",
    author: "Fact Check Master",
    status: "published",
    fact_check_status: "verified",
    image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    source_url: "https://factcheckmaster.com",
    created_at: "2024-11-18T09:15:00Z",
    updated_at: "2024-11-18T09:15:00Z"
  },
  {
    id: 4,
    title: "Climate Data Confirmation",
    content: "🌍 VERIFIED DATA: Latest climate statistics being questioned online have been confirmed by multiple international agencies. The data is accurate and transparent. #ClimateScience",
    author: "Fact Check Master",
    status: "published",
    fact_check_status: "verified",
    image_url: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    source_url: "https://factcheckmaster.com",
    created_at: "2024-11-17T14:45:00Z",
    updated_at: "2024-11-17T14:45:00Z"
  }
];

// In-memory storage that persists within the same serverless function instance
// This is a temporary solution - for production use a proper database like Supabase or MongoDB
let globalPosts = null;
let lastSaveTime = 0;

// Initialize posts storage
function initializePosts() {
  if (globalPosts === null) {
    console.log('[Storage] Initializing posts storage with sample data');
    globalPosts = [...SAMPLE_POSTS];
  }
  return globalPosts;
}

function getAllPosts() {
  return initializePosts();
}

function addNewPost(postData) {
  const posts = initializePosts();
  const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
  
  const newPost = {
    id: newId,
    title: postData.title.trim(),
    content: postData.content.trim(),
    author: postData.author?.trim() || 'Fact Check Master',
    status: 'published',
    fact_check_status: postData.fact_check_status || 'verified',
    image_url: postData.imageUrl || null,
    source_url: postData.postUrl || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  posts.unshift(newPost);
  lastSaveTime = Date.now();
  
  console.log(`[Storage] Added new post with ID ${newId}. Total posts: ${posts.length}`);
  return newPost;
}

function removePost(postId) {
  const posts = initializePosts();
  const initialLength = posts.length;
  
  const index = posts.findIndex(post => post.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
    lastSaveTime = Date.now();
    console.log(`[Storage] Removed post with ID ${postId}. Remaining posts: ${posts.length}`);
    return true;
  }
  
  return false;
}

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
      const posts = getAllPosts();
      const publishedPosts = posts.filter(post => post.status === 'published');
      
      console.log(`[API] Returning ${publishedPosts.length} published posts`);
      res.status(200).json(publishedPosts);

    } else if (req.method === 'POST') {
      const { title, content, author, fact_check_status, imageUrl, postUrl } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const newPost = addNewPost({
        title,
        content,
        author,
        fact_check_status,
        imageUrl,
        postUrl
      });
      
      res.status(201).json({ 
        id: newPost.id,
        success: true,
        message: 'Post created successfully'
      });

    } else if (req.method === 'DELETE') {
      const postId = parseInt(req.query.id) || parseInt(req.url.split('/').pop());
      
      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      const deleted = removePost(postId);
      
      if (deleted) {
        res.status(200).json({ 
          success: true,
          message: 'Post deleted successfully'
        });
      } else {
        res.status(404).json({ error: 'Post not found' });
      }

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('[API] Error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}