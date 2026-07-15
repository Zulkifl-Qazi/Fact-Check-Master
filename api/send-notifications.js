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

async function requireApprovedAdmin(req) {
  const deviceId = req.headers['x-device-id'];
  if (!deviceId || !supabase) return null;

  const { data } = await supabase
    .from('approved_devices')
    .select('device_id, approved')
    .eq('device_id', deviceId)
    .eq('approved', true)
    .maybeSingle();

  return data || null;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Device-ID');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  // Authentication check
  const adminDevice = await requireApprovedAdmin(req);
  if (!adminDevice) {
    return res.status(403).json({ error: 'Unauthorized device. Admin login required.' });
  }

  try {
    const { subject, body, targetGroup } = req.body;

    if (!subject || !body) {
      return res.status(400).json({ error: 'Subject and Body are required fields' });
    }

    // Fetch subscribers
    let selectQuery = supabase.from('subscribers').select('*');
    
    // Filter target group if requested
    // "gmail/google logged-in users only"
    if (targetGroup === 'google') {
      selectQuery = selectQuery.eq('provider', 'google');
    }

    const { data: subscribers, error: fetchError } = await selectQuery;

    if (fetchError) {
      if (fetchError.code === '42P01' || fetchError.message?.includes('relation "subscribers" does not exist')) {
        return res.status(500).json({
          error: "Supabase table 'subscribers' does not exist. Please run the SQL migration."
        });
      }
      throw fetchError;
    }

    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({
        success: true,
        sentCount: 0,
        subscribersCount: 0,
        message: 'No matching subscribers found to notify.',
        simulated: false
      });
    }

    // SMTP Configuration
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const fromEmail = process.env.FROM_EMAIL || 'contact@factcheckmaster.com';

    const smtpConfigured = !!host && !!user && !!pass;
    let sentCount = 0;
    let errorCount = 0;
    let errors = [];

    if (smtpConfigured) {
      const mailer = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass }
      });

      // Send to all subscribers matching target group in parallel
      const sendPromises = subscribers.map(async (sub) => {
        try {
          await mailer.sendMail({
            from: `Fact Check Master <${fromEmail}>`,
            to: sub.email,
            subject: subject,
            html: `
              <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <!-- Header Banner -->
                <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 32px 24px; text-align: center; color: #ffffff;">
                  <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">Fact Check Master</h1>
                  <p style="margin: 8px 0 0 0; font-size: 13px; color: #bfdbfe; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Misinformation Verification Alert</p>
                </div>
                
                <!-- Body -->
                <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
                  <p style="margin-top: 0; font-size: 16px; font-weight: 700; color: #0f172a;">Hello ${sub.name || 'Subscriber'},</p>
                  
                  <div style="font-size: 15px; color: #334155; margin-bottom: 24px;">
                    ${body.replace(/\n/g, '<br />')}
                  </div>
                  
                  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                  
                  <!-- Call to Action -->
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="https://www.factcheckmaster.com" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.2);">
                      Visit News Dashboard
                    </a>
                  </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8fafc; padding: 24px; border-t: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
                  <p style="margin: 0 0 8px 0;">You are receiving this because you subscribed to alerts on Fact Check Master.</p>
                  <p style="margin: 0;">Fact Check Master &bull; Verification Division &bull; contact@factcheckmaster.com</p>
                </div>
              </div>
            `
          });
          sentCount++;
        } catch (err) {
          console.error(`[SMTP] Error sending to ${sub.email}:`, err);
          errorCount++;
          errors.push({ email: sub.email, error: err.message });
        }
      });

      await Promise.all(sendPromises);

      return res.status(200).json({
        success: true,
        sentCount,
        errorCount,
        errors,
        subscribersCount: subscribers.length,
        message: `Successfully sent notifications to ${sentCount} subscribers. Errors: ${errorCount}.`,
        simulated: false
      });

    } else {
      // SMTP not configured - simulate sending and print log for local developers
      console.log(`[SIMULATE EMAIL]
        From: Fact Check Master <contact@factcheckmaster.com>
        Subject: ${subject}
        Recipient Count: ${subscribers.length}
        Recipients: ${subscribers.map(s => `${s.name} <${s.email}>`).join(', ')}
        Content:
        --------------------------
        ${body}
        --------------------------
      `);

      return res.status(200).json({
        success: true,
        sentCount: subscribers.length,
        errorCount: 0,
        subscribersCount: subscribers.length,
        message: `[Simulated] SMTP credentials not set on server. Simulated email delivery to ${subscribers.length} subscribers.`,
        simulated: true,
        simulatedRecipients: subscribers.map(s => ({ name: s.name, email: s.email, provider: s.provider }))
      });
    }

  } catch (error) {
    console.error('[API] Send Notifications error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
