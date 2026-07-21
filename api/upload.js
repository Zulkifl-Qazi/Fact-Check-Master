import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseConfigured = !!supabaseUrl && !!supabaseKey;

const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Device-ID');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!supabase) {
      console.error('[Upload] Supabase is not configured');
      return res.status(500).json({ error: 'Supabase storage is not configured on server' });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error('[Upload] Error parsing JSON body:', e);
      }
    }

    const { imageBase64, fileName, contentType } = body || {};
    
    if (!imageBase64 || !fileName) {
      console.error('[Upload] Missing image data or fileName');
      return res.status(400).json({ error: 'Missing image data or filename' });
    }

    // Extract base64 data portion
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate unique name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeFileName = uniqueSuffix + '-' + String(fileName).replace(/[^a-zA-Z0-9.\-_]/g, '');

    console.log(`[Upload] Uploading ${safeFileName} to Supabase bucket 'post-images' (${buffer.length} bytes)...`);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(safeFileName, buffer, {
        contentType: contentType || 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('[Upload] Supabase storage error:', error);
      return res.status(500).json({ error: `Supabase Storage error: ${error.message}` });
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('post-images')
      .getPublicUrl(safeFileName);

    console.log('[Upload] Upload successful:', publicData.publicUrl);
    return res.status(200).json({ imageUrl: publicData.publicUrl });
  } catch (error) {
    console.error('[Upload] Unexpected handler error:', error);
    return res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
}
