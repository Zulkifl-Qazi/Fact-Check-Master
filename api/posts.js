// Simple in-memory storage for Vercel serverless functions
// In production, you'd want to use a database service like Supabase, MongoDB Atlas, etc.

// Sample data that will be returned for demo purposes
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

// In a real app, you'd store this in a persistent database
let posts = [...SAMPLE_POSTS];

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log(`[Vercel API] ${req.method} /api/posts`);

  try {
    if (req.method === 'GET') {
      // Return all published posts
      const publishedPosts = posts.filter(post => post.status === 'published');
      console.log(`[Vercel API] Returning ${publishedPosts.length} posts`);
      res.status(200).json(publishedPosts);

    } else if (req.method === 'POST') {
      // Create new post
      const { title, content, author = 'Fact Check Master', fact_check_status = 'verified', imageUrl, postUrl } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const newPost = {
        id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        status: 'published',
        fact_check_status,
        image_url: imageUrl || null,
        source_url: postUrl || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      posts.unshift(newPost); // Add to beginning of array
      
      console.log(`[Vercel API] Created post with ID: ${newPost.id}`);
      res.status(201).json({ 
        id: newPost.id,
        success: true,
        message: 'Post created successfully'
      });

    } else if (req.method === 'DELETE') {
      // Delete post
      const postId = parseInt(req.query.id) || parseInt(req.url.split('/').pop());
      
      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      const initialLength = posts.length;
      posts = posts.filter(post => post.id !== postId);

      if (posts.length < initialLength) {
        console.log(`[Vercel API] Deleted post with ID: ${postId}`);
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
    console.error('[Vercel API] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}