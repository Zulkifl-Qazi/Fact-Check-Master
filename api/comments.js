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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    // GET /api/comments
    if (req.method === 'GET') {
      if (!supabase) return res.status(200).json([]);

      const post_title = q(req.query, 'post_title');

      let query = supabase.from('comments').select('*');
      if (post_title) {
        query = query.ilike('post_title', post_title.trim()).order('created_at', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.warn('[Comments] Supabase query error:', error.message);
        return res.status(200).json([]);
      }
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

      if (error) {
        if (error.code === '42P01' || error.message?.includes('relation "comments" does not exist')) {
          return res.status(500).json({
            error: "Supabase table 'comments' does not exist. Please run the SQL migration script inside 'supabase-comments-table.sql' on your Supabase dashboard editor."
          });
        }
        throw error;
      }
      return res.status(201).json(data);
    }

    // DELETE /api/comments?id=...
    if (req.method === 'DELETE') {
      const id = q(req.query, 'id');
      if (!id) {
        return res.status(400).json({ error: 'Comment ID is required' });
      }

      const { data, error } = await supabase
        .from('comments')
        .delete()
        .eq('id', parseInt(id, 10))
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, deleted: data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API] Comments handler error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
