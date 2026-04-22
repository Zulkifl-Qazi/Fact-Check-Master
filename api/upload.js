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
      return res.status(500).json({ error: 'Supabase is not configured on the server. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' });
    }

    const { imageBase64, fileName, contentType } = req.body;
    
    if (!imageBase64 || !fileName) {
      return res.status(400).json({ error: 'Missing image data or filename' });
    }

    // Extract base64 data portion
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate unique name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeFileName = uniqueSuffix + '-' + fileName.replace(/[^a-zA-Z0-9.\-_]/g, '');

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(safeFileName, buffer, {
        contentType: contentType || 'image/jpeg',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('post-images')
      .getPublicUrl(safeFileName);

    return res.status(200).json({ imageUrl: publicData.publicUrl });
  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}
