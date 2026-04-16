import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[Device Auth] Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Device-ID');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      // Check device authorization
      const { deviceId, deviceName, password } = req.body;
      
      // Verify password first
      if (password !== (process.env.ADMIN_PASSWORD || 'factadmin')) {
        return res.status(401).json({ 
          error: 'Invalid password'
        });
      }

      // Bootstrap the first approved admin device so a fresh deployment can recover cleanly.
      const { count: approvedCount, error: countError } = await supabase
        .from('approved_devices')
        .select('id', { count: 'exact', head: true });

      if (countError) throw countError;

      if ((approvedCount || 0) === 0) {
        const { error: bootstrapError } = await supabase
          .from('approved_devices')
          .upsert({
            device_id: deviceId,
            device_name: deviceName,
            approved: true,
            approved_at: new Date().toISOString(),
            approved_by: 'bootstrap',
            requested_at: new Date().toISOString(),
            last_used: new Date().toISOString()
          }, {
            onConflict: 'device_id'
          });

        if (bootstrapError) throw bootstrapError;

        return res.json({
          approved: true,
          bootstrap: true,
          deviceName: deviceName
        });
      }

      // Check if device is approved
      const { data: device } = await supabase
        .from('approved_devices')
        .select('*')
        .eq('device_id', deviceId)
        .single();

      if (device && device.approved) {
        // Update last used
        await supabase
          .from('approved_devices')
          .update({ last_used: new Date().toISOString() })
          .eq('device_id', deviceId);

        return res.json({ 
          approved: true,
          deviceName: device.device_name
        });
      }

      // Device not approved - save request
      const { error } = await supabase
        .from('approved_devices')
        .upsert({
          device_id: deviceId,
          device_name: deviceName,
          approved: false,
          requested_at: new Date().toISOString()
        }, {
          onConflict: 'device_id'
        });

      if (error) throw error;

      return res.json({ 
        approved: false,
        needsApproval: true,
        deviceId: deviceId,
        deviceName: deviceName
      });

    } else if (req.method === 'GET') {
      // Get all devices
      const deviceId = req.headers['x-device-id'];
      
      // Verify requesting device is approved
      const { data: device } = await supabase
        .from('approved_devices')
        .select('*')
        .eq('device_id', deviceId)
        .eq('approved', true)
        .single();

      if (!device) {
        return res.status(403).json({ error: 'Unauthorized device' });
      }

      const { data: allDevices } = await supabase
        .from('approved_devices')
        .select('*')
        .order('requested_at', { ascending: false });

      return res.json(allDevices || []);

    } else if (req.method === 'DELETE') {
      // Revoke device
      const { deviceId } = req.query;
      const requestingDeviceId = req.headers['x-device-id'];

      const { data: requestingDevice } = await supabase
        .from('approved_devices')
        .select('*')
        .eq('device_id', requestingDeviceId)
        .eq('approved', true)
        .single();

      if (!requestingDevice) {
        return res.status(403).json({ error: 'Unauthorized device' });
      }

      await supabase
        .from('approved_devices')
        .delete()
        .eq('device_id', deviceId);

      return res.json({ success: true });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('[Device Auth] Error:', error);
    res.status(500).json({ error: error.message });
  }
}
