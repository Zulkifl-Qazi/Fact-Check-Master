/**
 * /api/articles — CRUD API for long-form articles/blog posts.
 *
 * Public endpoints:
 *   GET  /api/articles                   — list published articles
 *   GET  /api/articles?slug=<slug>       — get article by slug
 *   GET  /api/articles?id=<id>           — get article by ID
 *   PATCH /api/articles?id=<id>&action=view — increment view count
 *
 * Admin endpoints (require X-Device-ID header):
 *   GET  /api/articles?all=true          — list ALL articles (incl. drafts)
 *   POST /api/articles                   — create article
 *   PUT  /api/articles?id=<id>           — update article
 *   DELETE /api/articles?id=<id>         — delete article
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

// ─── Helpers ───────────────────────────────────────────────────
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

/** Estimate read time from HTML content */
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

  const { data, error } = await supabase
    .from('approved_devices')
    .select('device_id, approved')
    .eq('device_id', deviceId)
    .eq('approved', true)
    .maybeSingle();

  if (error || !data) {
    res.status(403).json({ error: 'Unauthorized device' });
    return null;
  }

  return data;
}

// ─── Handler ───────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Device-ID');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ─── GET ─────────────────────────────────────────────────
    if (req.method === 'GET') {
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
        // Admin: return all, newest first
        query = query.order('created_at', { ascending: false });
      } else {
        // Public: only published, newest first
        query = query.eq('status', 'published').order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) {
        console.warn('[Articles] Supabase query error:', error.message);
        return res.status(200).json([]);
      }

      if (all === 'true') {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      } else {
        res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
      }
      return res.status(200).json(data || []);
    }

    // ─── POST (create) ──────────────────────────────────────
    if (req.method === 'POST') {
      const admin = await requireApprovedAdmin(req, res);
      if (!admin) return;

      const { title, slug, content, excerpt, cover_image, author, status } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const finalSlug = slug ? slugify(slug) : slugify(title);
      const read_time = estimateReadTime(content);
      const finalCoverImage = (cover_image && typeof cover_image === 'string' && cover_image.trim()) ? cover_image.trim() : null;

      const { data, error } = await supabase
        .from('articles')
        .insert({
          title: title.trim(),
          slug: finalSlug,
          content,
          excerpt: excerpt || '',
          cover_image: finalCoverImage,
          author: author?.trim() || 'Fact Check Master',
          status: status || 'draft',
          read_time,
        })
        .select()
        .single();

      if (error) {
        // Duplicate slug
        if (error.code === '23505') {
          return res.status(409).json({ error: 'An article with this title already exists' });
        }
        throw error;
      }

      return res.status(201).json({ success: true, article: data });
    }

    // ─── PUT (update) ────────────────────────────────────────
    if (req.method === 'PUT') {
      const admin = await requireApprovedAdmin(req, res);
      if (!admin) return;

      const id = parseInt(q(req.query, 'id'), 10);
      if (!id) return res.status(400).json({ error: 'Article ID is required' });

      const { title, slug, content, excerpt, cover_image, author, status } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const finalSlug = slug ? slugify(slug) : slugify(title);
      const read_time = estimateReadTime(content);
      const finalCoverImage = (cover_image && typeof cover_image === 'string' && cover_image.trim()) ? cover_image.trim() : null;

      const { data, error } = await supabase
        .from('articles')
        .update({
          title: title.trim(),
          slug: finalSlug,
          content,
          excerpt: excerpt || '',
          cover_image: finalCoverImage,
          author: author?.trim() || 'Fact Check Master',
          status: status || 'draft',
          read_time,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(409).json({ error: 'An article with this title already exists' });
        }
        throw error;
      }

      return res.status(200).json({ success: true, article: data });
    }

    // ─── DELETE ──────────────────────────────────────────────
    if (req.method === 'DELETE') {
      const admin = await requireApprovedAdmin(req, res);
      if (!admin) return;

      const id = parseInt(q(req.query, 'id'), 10);
      if (!id) return res.status(400).json({ error: 'Article ID is required' });

      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;

      return res.status(200).json({ success: true, message: 'Article deleted' });
    }

    // ─── PATCH (view count) ──────────────────────────────────
    if (req.method === 'PATCH') {
      const id = parseInt(q(req.query, 'id'), 10);
      const action = q(req.query, 'action');

      if (!id) return res.status(400).json({ error: 'Article ID is required' });

      if (action === 'view') {
        const { data: article, error: fetchErr } = await supabase
          .from('articles')
          .select('views')
          .eq('id', id)
          .single();

        if (fetchErr || !article) return res.status(404).json({ error: 'Article not found' });

        const newViews = (article.views || 0) + 1;
        const { error: updateErr } = await supabase
          .from('articles')
          .update({ views: newViews })
          .eq('id', id);

        if (updateErr) throw updateErr;
        return res.status(200).json({ success: true, views: newViews });
      }

      return res.status(400).json({ error: 'Unknown action' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[Articles API] Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
