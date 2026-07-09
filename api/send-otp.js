import nodemailer from 'nodemailer';

function q(query, key) {
  const v = query?.[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[AUTH] Generated OTP for ${email}: ${code}`);

    let emailSent = false;
    let emailError = null;

    // Check SMTP configuration
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      try {
        const mailer = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass }
        });

        await mailer.sendMail({
          from: process.env.FROM_EMAIL || user,
          to: email.trim(),
          subject: 'Your Fact Check Master Login Code',
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #2563eb; margin-top: 0; font-weight: 800;">Fact Check Master</h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6;">Hello,</p>
              <p style="color: #475569; font-size: 15px; line-height: 1.6;">Use the following verification code to complete your login. This code will expire shortly.</p>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #1e293b; font-family: monospace;">${code}</span>
              </div>
              <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">If you did not request this login, please ignore this email.</p>
            </div>
          `
        });
        emailSent = true;
      } catch (err) {
        console.error('[AUTH] Failed to send email via SMTP:', err);
        emailError = err.message;
      }
    } else {
      console.warn('[AUTH] SMTP credentials not fully configured in environment variables');
    }

    // Return the response, including code so that in case SMTP fails/is not configured, 
    // the frontend can print the OTP code to allow direct sandbox testing login.
    return res.status(200).json({
      success: true,
      emailSent,
      emailError,
      otp: code
    });
  } catch (error) {
    console.error('[API] Send OTP error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
