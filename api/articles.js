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

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function estimateReadTime(html) {
  if (!html) return 1;
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text.split(' ').length;
  return Math.max(1, Math.round(words / 200));
}

async function requireApprovedAdmin(req, res) {
  const deviceId = req.headers && req.headers['x-device-id'];
  if (!deviceId || !supabase) {
    res.status(403).json({ error: 'Approved device ID is required' });
    return null;
  }

  try {
    const { data } = await supabase
      .from('approved_devices')
      .select('device_id, approved')
      .eq('device_id', deviceId)
      .eq('approved', true)
      .maybeSingle();

    if (!data) {
      res.status(403).json({ error: 'Unauthorized device' });
      return null;
    }
    return data;
  } catch {
    res.status(403).json({ error: 'Unauthorized device' });
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Device-ID');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ─── GET ─────────────────────────────────────────────────
    if (req.method === 'GET') {
      try {
        if (!supabase) {
          return res.status(200).json([]);
        }

        const slug = q(req.query, 'slug');
        const id = q(req.query, 'id');
        const all = q(req.query, 'all');

        // Single article by slug
        if (slug) {
          const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .maybeSingle();

          if (error || !data) return res.status(404).json({ error: 'Article not found' });

          res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
          return res.status(200).json(data);
        }

        // Single article by ID
        if (id) {
          const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('id', parseInt(id, 10))
            .maybeSingle();

          if (error || !data) return res.status(404).json({ error: 'Article not found' });

          res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
          return res.status(200).json(data);
        }

        // List all (admin) or published only
        let query = supabase.from('articles').select('*');

        if (all === 'true') {
          const admin = await requireApprovedAdmin(req, res);
          if (!admin) return;
          query = query.order('created_at', { ascending: false });
        } else {
          query = query.eq('status', 'published').order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (error) {
          console.warn('[Articles GET Query Error]:', error.message);
          return res.status(200).json([]);
        }

        if (all === 'true') {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        } else {
          res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
        }
        return res.status(200).json(data || []);
      } catch (getErr) {
        console.warn('[Articles GET Exception]:', getErr.message);
        return res.status(200).json([]);
      }
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    // ─── POST (create) ──────────────────────────────────────
    if (req.method === 'POST') {
      const admin = await requireApprovedAdmin(req, res);
      if (!admin) return;

      const { title, slug, content, excerpt, cover_image, author, status } = req.body || {};
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const finalSlug = slug ? slugify(slug) : slugify(title);
      const read_time = estimateReadTime(content);
      const finalCoverImage = (cover_image && typeof cover_image === 'string' && cover_image.trim()) ? cover_image.trim() : null;

      const newArticle = {
        title: title.trim(),
        slug: finalSlug,
        content,
        excerpt: excerpt || content.replace(/<[^>]+>/g, ' ').substring(0, 160) + '...',
        cover_image: finalCoverImage,
        author: author || 'Fact Check Master',
        status: status || 'draft',
        read_time,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('articles')
        .insert([newArticle])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    // ─── PUT (update) ───────────────────────────────────────
    if (req.method === 'PUT') {
      const admin = await requireApprovedAdmin(req, res);
      if (!admin) return;

      const id = q(req.query, 'id');
      if (!id) return res.status(400).json({ error: 'Article ID required' });

      const { title, slug, content, excerpt, cover_image, author, status } = req.body || {};
      const updates = { updated_at: new Date().toISOString() };

      if (title) updates.title = title.trim();
      if (slug) updates.slug = slugify(slug);
      if (content) {
        updates.content = content;
        updates.read_time = estimateReadTime(content);
      }
      if (excerpt !== undefined) updates.excerpt = excerpt;
      if (cover_image !== undefined) {
        updates.cover_image = (cover_image && typeof cover_image === 'string' && cover_image.trim()) ? cover_image.trim() : null;
      }
      if (author) updates.author = author;
      if (status) updates.status = status;

      const { data, error } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', parseInt(id, 10))
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    // ─── DELETE ─────────────────────────────────────────────
    if (req.method === 'DELETE') {
      const admin = await requireApprovedAdmin(req, res);
      if (!admin) return;

      const id = q(req.query, 'id');
      if (!id) return res.status(400).json({ error: 'Article ID required' });

      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', parseInt(id, 10));

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Article deleted' });
    }

    // ─── PATCH (action=view) ────────────────────────────────
    if (req.method === 'PATCH') {
      const id = q(req.query, 'id');
      const action = q(req.query, 'action');

      if (action === 'view' && id) {
        const { data: current } = await supabase
          .from('articles')
          .select('views')
          .eq('id', parseInt(id, 10))
          .single();

        const currentViews = current?.views || 0;
        const { data, error } = await supabase
          .from('articles')
          .update({ views: currentViews + 1 })
          .eq('id', parseInt(id, 10))
          .select('id, views')
          .single();

        if (error) throw error;
        return res.status(200).json(data);
      }

      return res.status(400).json({ error: 'Invalid PATCH action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[Articles API Error]:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
