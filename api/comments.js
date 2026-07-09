import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

function q(query, key) {
  const v = query?.[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    // GET /api/comments?post_title=...
    if (req.method === 'GET') {
      const post_title = q(req.query, 'post_title');
      if (!post_title) {
        return res.status(400).json({ error: 'Post title is required' });
      }

      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_title', post_title.trim())
        .order('created_at', { ascending: true });

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    // POST /api/comments
    if (req.method === 'POST') {
      const { post_title, username, email, avatar_url, provider, content } = req.body;
      if (!post_title || !username || !email || !content) {
        return res.status(400).json({ error: 'Missing required comment fields' });
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_title: post_title.trim(),
          username: username.trim(),
          email: email.trim(),
          avatar_url: avatar_url || null,
          provider: provider || 'email',
          content: content.trim()
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API] Comments handler error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
