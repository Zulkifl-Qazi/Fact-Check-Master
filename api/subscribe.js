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
    // GET /api/subscribe?email=... (checks subscription state) OR GET /api/subscribe (lists all for admin)
    if (req.method === 'GET') {
      const email = q(req.query, 'email');
      
      if (!email) {
        // Admin call — verify admin device
        const deviceId = req.headers['x-device-id'];
        if (!deviceId) {
          return res.status(403).json({ error: 'Approved device ID is required to list subscribers' });
        }
        const { data: adminDevice, error: authError } = await supabase
          .from('approved_devices')
          .select('device_id, approved')
          .eq('device_id', deviceId)
          .eq('approved', true)
          .maybeSingle();

        if (authError || !adminDevice) {
          return res.status(403).json({ error: 'Unauthorized admin device' });
        }

        const { data, error } = await supabase
          .from('subscribers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          if (error.code === '42P01' || error.message?.includes('relation "subscribers" does not exist')) {
            return res.status(200).json([]);
          }
          throw error;
        }
        return res.status(200).json(data || []);
      }

      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (error) {
        // Handle missing table error gracefully
        if (error.code === '42P01' || error.message?.includes('relation "subscribers" does not exist')) {
          return res.status(200).json({
            subscribed: false,
            error: "Subscribers table does not exist. Please run SQL migration.",
            tableMissing: true
          });
        }
        throw error;
      }

      return res.status(200).json({
        subscribed: !!data,
        subscriber: data || null
      });
    }

    // POST /api/subscribe
    if (req.method === 'POST') {
      const { email, name, provider, action } = req.body;

      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email is required' });
      }

      const cleanEmail = email.trim().toLowerCase();

      if (action === 'unsubscribe') {
        const { error } = await supabase
          .from('subscribers')
          .delete()
          .eq('email', cleanEmail);

        if (error) throw error;

        return res.status(200).json({
          success: true,
          subscribed: false,
          message: 'Unsubscribed successfully'
        });
      }

      // Default is subscribe
      const subscriberData = {
        email: cleanEmail,
        name: name ? name.trim() : cleanEmail.split('@')[0],
        provider: provider || 'email'
      };

      const { data, error } = await supabase
        .from('subscribers')
        .upsert(subscriberData, { onConflict: 'email' })
        .select()
        .single();

      if (error) {
        if (error.code === '42P01' || error.message?.includes('relation "subscribers" does not exist')) {
          return res.status(500).json({
            error: "Supabase table 'subscribers' does not exist. Please run the SQL migration script inside 'supabase-subscribers-table.sql' on your Supabase dashboard editor."
          });
        }
        throw error;
      }

      return res.status(200).json({
        success: true,
        subscribed: true,
        subscriber: data
      });
    }

    res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('[API] Subscribe error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
