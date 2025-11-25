import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

// Email configuration
const createMailer = () => {
  // Use environment variables for email configuration
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = process.env.SMTP_PORT || 587;
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn('SMTP not configured - emails will not be sent');
    return null;
  }

  return nodemailer.createTransporter({
    host,
    port,
    secure,
    auth: { user, pass }
  });
};

const sendReplyNotification = async (feedback, reply) => {
  const mailer = createMailer();
  if (!mailer) return { sent: false, error: 'SMTP not configured' };

  try {
    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;
    
    await mailer.sendMail({
      from: `"Fact Check Master" <${fromEmail}>`,
      to: feedback.email,
      subject: `Reply to your message: ${feedback.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Fact Check Master</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">We've responded to your message!</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px;">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Our Response</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
              <h3 style="color: #059669; margin: 0 0 15px 0;">Admin Reply:</h3>
              <p style="color: #1e293b; line-height: 1.6; margin: 0;">${reply}</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 3px solid #6b7280;">
              <h4 style="color: #374151; margin: 0 0 10px 0;">Your Original Message:</h4>
              <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;"><strong>Subject:</strong> ${feedback.subject}</p>
              <p style="color: #4b5563; line-height: 1.5; margin: 0; font-size: 14px;">${feedback.message}</p>
            </div>
            
            <p style="color: #64748b; margin-top: 20px; line-height: 1.6;">
              If you have any follow-up questions, feel free to contact us again. 
              Thank you for helping us fight misinformation!
            </p>
          </div>
          
          <div style="background: #1e293b; padding: 20px; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 14px;">
              © ${new Date().getFullYear()} Fact Check Master | Fighting misinformation since 2024
            </p>
          </div>
        </div>
      `
    });
    
    return { sent: true, error: null };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { sent: false, error: error.message };
  }
};

async function getDb() {
  if (!db) {
    // For Vercel, create an in-memory database since file system is read-only
    const dbPath = process.env.NODE_ENV === 'production' ? ':memory:' : path.join(__dirname, '../server/data.db');
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Create feedback table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        subject TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create replies table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        feedback_id INTEGER,
        reply TEXT,
        replied_by TEXT DEFAULT 'Admin',
        emailed BOOLEAN DEFAULT 0,
        email_error TEXT,
        delivered_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (feedback_id) REFERENCES feedback (id)
      )
    `);
  }
  return db;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { feedback_id } = req.query;
    const database = await getDb();

    if (req.method === 'GET') {
      // Get replies for specific feedback
      if (!feedback_id) {
        return res.status(400).json({ error: 'feedback_id is required' });
      }

      const replies = await database.all(
        'SELECT * FROM replies WHERE feedback_id = ? ORDER BY created_at ASC',
        [feedback_id]
      );

      res.status(200).json(replies);

    } else if (req.method === 'POST') {
      // Add new reply to feedback
      const { reply, feedback_id: bodyFeedbackId } = req.body;
      const targetFeedbackId = feedback_id || bodyFeedbackId;
      
      if (!reply || !reply.trim()) {
        return res.status(400).json({ error: 'Reply text is required' });
      }

      if (!targetFeedbackId) {
        return res.status(400).json({ error: 'feedback_id is required' });
      }

      // Get the feedback details for email notification
      const feedback = await database.get(
        'SELECT * FROM feedback WHERE id = ?',
        [targetFeedbackId]
      );

      if (!feedback) {
        return res.status(404).json({ error: 'Feedback not found' });
      }

      // Send email notification
      const emailResult = await sendReplyNotification(feedback, reply.trim());

      // Insert the reply with email status
      const result = await database.run(
        'INSERT INTO replies (feedback_id, reply, replied_by, emailed, email_error, delivered_at) VALUES (?, ?, ?, ?, ?, ?)',
        [
          targetFeedbackId, 
          reply.trim(), 
          'Admin',
          emailResult.sent ? 1 : 0,
          emailResult.error,
          emailResult.sent ? new Date().toISOString() : null
        ]
      );

      res.status(201).json({ 
        id: result.lastID,
        success: true,
        message: 'Reply added successfully',
        emailSent: emailResult.sent,
        emailError: emailResult.error
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}