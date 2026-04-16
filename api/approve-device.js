import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[Approve Device] Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Device-ID');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { deviceIdToApprove } = req.body;
    const requestingDeviceId = req.headers['x-device-id'];

    // Verify requesting device is approved
    const { data: requestingDevice } = await supabase
      .from('approved_devices')
      .select('*')
      .eq('device_id', requestingDeviceId)
      .eq('approved', true)
      .single();

    if (!requestingDevice) {
      return res.status(403).json({ 
        error: 'Unauthorized device'
      });
    }

    // Approve the device
    const { data, error } = await supabase
      .from('approved_devices')
      .update({ 
        approved: true,
        approved_at: new Date().toISOString(),
        approved_by: requestingDeviceId
      })
      .eq('device_id', deviceIdToApprove)
      .select()
      .single();

    if (error) throw error;

    return res.json({ 
      success: true, 
      device: data
    });

  } catch (error) {
    console.error('[Approve Device] Error:', error);
    res.status(500).json({ error: error.message });
  }
}
