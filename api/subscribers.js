import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

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

async function requireApprovedAdmin(req) {
  const deviceId = req.headers && req.headers['x-device-id'];
  if (!deviceId || !supabase) return null;

  try {
    const { data } = await supabase
      .from('approved_devices')
      .select('device_id, approved')
      .eq('device_id', deviceId)
      .eq('approved', true)
      .maybeSingle();

    return data || null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Device-ID');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET /api/subscribers?email=...
    // Or GET /api/subscribers (lists all for admin)
    if (req.method === 'GET') {
      try {
        const email = q(req.query, 'email');
        
        if (!email) {
          if (!supabase) return res.status(200).json([]);
          // Admin call — verify admin device
          const adminDevice = await requireApprovedAdmin(req);
          if (!adminDevice) {
            return res.status(403).json({ error: 'Unauthorized admin device. Admin login required.' });
          }

          const { data } = await supabase
            .from('subscribers')
            .select('*')
            .order('created_at', { ascending: false });

          return res.status(200).json(data || []);
        }

        if (!supabase) {
          return res.status(200).json({ subscribed: false, subscriber: null });
        }

        const { data } = await supabase
          .from('subscribers')
          .select('*')
          .eq('email', email.trim().toLowerCase())
          .maybeSingle();

        return res.status(200).json({
          subscribed: !!data,
          subscriber: data || null
        });
      } catch (getErr) {
        console.warn('[Subscribers GET Fallback]:', getErr.message);
        const isSingleCheck = !!q(req.query, 'email');
        return res.status(200).json(isSingleCheck ? { subscribed: false, subscriber: null } : []);
      }
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    // POST /api/subscribers
    if (req.method === 'POST') {
      const { email, name, provider, action, subject, body, targetGroup } = req.body || {};

      // Admin mass email broadcast
      if (action === 'broadcast') {
        const adminDevice = await requireApprovedAdmin(req);
        if (!adminDevice) {
          return res.status(403).json({ error: 'Unauthorized admin device. Admin login required.' });
        }

        if (!subject || !body) {
          return res.status(400).json({ error: 'Subject and body are required for email broadcast.' });
        }

        const host = process.env.SMTP_HOST || 'smtp.gmail.com';
        const port = process.env.SMTP_PORT || 587;
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        if (!user || !pass) {
          return res.status(500).json({ error: 'SMTP credentials not configured on server.' });
        }

        let query = supabase.from('subscribers').select('email, name');
        if (targetGroup && targetGroup !== 'all') {
          query = query.eq('provider', targetGroup);
        }

        const { data: subscribers, error: fetchErr } = await query;
        if (fetchErr || !subscribers || subscribers.length === 0) {
          return res.status(400).json({ error: 'No subscribers found for the selected target group.' });
        }

        const mailer = nodemailer.createTransporter({
          host,
          port,
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user, pass }
        });

        const fromEmail = process.env.FROM_EMAIL || user;
        let sentCount = 0;
        let failCount = 0;

        for (const sub of subscribers) {
          try {
            await mailer.sendMail({
              from: `"Fact Check Master" <${fromEmail}>`,
              to: sub.email,
              subject: subject,
              html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                  <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 32px 24px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">Fact Check Master</h1>
                    <p style="margin: 8px 0 0 0; font-size: 13px; color: #bfdbfe; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Official Announcement</p>
                  </div>
                  <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
                    <p style="margin-top: 0; font-size: 16px; font-weight: 700; color: #0f172a;">Hello ${sub.name || 'Subscriber'},</p>
                    <div style="font-size: 15px; color: #334155;">${body}</div>
                  </div>
                  <div style="background-color: #f8fafc; padding: 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
                    <p style="margin: 0 0 8px 0;">You are receiving this official update because you subscribed to Fact Check Master.</p>
                    <p style="margin: 0;">Fact Check Master &bull; Verification Division &bull; contact@factcheckmaster.com</p>
                  </div>
                </div>
              `
            });
            sentCount++;
          } catch (e) {
            console.error(`Failed to send to ${sub.email}:`, e.message);
            failCount++;
          }
        }

        return res.status(200).json({
          success: true,
          message: `Broadcast completed. Sent: ${sentCount}, Failed: ${failCount}`,
          sentCount,
          failCount
        });
      }

      // Public subscription / unsubscription
      if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Valid email address is required.' });
      }

      const cleanEmail = email.trim().toLowerCase();

      // Check if already subscribed
      const { data: existing } = await supabase
        .from('subscribers')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (action === 'unsubscribe') {
        if (existing) {
          await supabase.from('subscribers').delete().eq('email', cleanEmail);
        }
        return res.status(200).json({ success: true, message: 'Unsubscribed successfully.' });
      }

      if (existing) {
        return res.status(200).json({ success: true, message: 'Already subscribed!', subscriber: existing });
      }

      const newSub = {
        email: cleanEmail,
        name: (name || '').trim() || cleanEmail.split('@')[0],
        provider: provider || 'email',
        created_at: new Date().toISOString()
      };

      const { data: inserted, error: insertErr } = await supabase
        .from('subscribers')
        .insert([newSub])
        .select()
        .single();

      if (insertErr) {
        throw insertErr;
      }

      return res.status(200).json({ success: true, message: 'Subscribed successfully!', subscriber: inserted });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[Subscribers API Error]:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
