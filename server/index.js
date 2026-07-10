import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import nodemailer from 'nodemailer';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createServer } from 'http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists for local testing
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000", "https://*.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});
const PORT = process.env.PORT || 3001;
const EXPORT_KEY = process.env.EXPORT_KEY || null; // optional simple guard for exports
const ADMIN_KEY = process.env.ADMIN_KEY || null;   // optional simple guard for admin-write actions
const X_API_BEARER_TOKEN = process.env.X_API_BEARER_TOKEN || null;  // X API token for fetching real tweets

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "https://*.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

let db;
let mailer = null;
let smtpConfigured = false;

function initMailer() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    console.warn('[mail] SMTP not configured; replies will not be emailed. Set SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, FROM_EMAIL');
    smtpConfigured = false;
    mailer = null;
    return;
  }

  mailer = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
  smtpConfigured = true;
}

async function initDb() {
  console.log('[DB] Initializing database...');
  console.log('[DB] Current working directory:', process.cwd());
  console.log('[DB] __dirname:', __dirname);
  
  const dbPath = path.join(__dirname, 'data.db');
  console.log('[DB] Database path:', dbPath);
  
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    console.log('[DB] Database opened successfully');
  } catch (error) {
    console.error('[DB] Failed to open database:', error);
    throw error;
  }

  // Ensure FKs
  await db.exec('PRAGMA foreign_keys = ON');

  // Base table
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

  // Ensure subject column exists on older databases
  const cols = await db.all("PRAGMA table_info(feedback)");
  const hasSubject = cols.some(c => c.name === 'subject');
  if (!hasSubject) {
    try {
      await db.exec('ALTER TABLE feedback ADD COLUMN subject TEXT');
    } catch (e) {
      // ignore if migration not applicable
    }
  }

  // Replies table (for admin or staff responses)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS feedback_replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      feedback_id INTEGER NOT NULL,
      reply TEXT NOT NULL,
      replied_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      emailed INTEGER DEFAULT 0,
      delivered_at DATETIME,
      email_error TEXT,
      FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
    )
  `);

  // Posts table (for admin-created posts)
  console.log('[DB] Creating posts table...');
  await db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT DEFAULT 'Admin',
      status TEXT DEFAULT 'published',
      fact_check_status TEXT DEFAULT 'verified',
      image_url TEXT,
      source_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('[DB] Posts table created successfully');

  // Add new columns to existing posts table if they don't exist
  try {
    await db.exec('ALTER TABLE posts ADD COLUMN image_url TEXT');
  } catch (e) {
    // Column already exists
  }
  
  try {
    await db.exec('ALTER TABLE posts ADD COLUMN source_url TEXT');
  } catch (e) {
    // Column already exists
  }

  try {
    await db.exec('ALTER TABLE posts ADD COLUMN category TEXT DEFAULT "latest-news"');
  } catch (e) {
    // Column already exists
  }

  try {
    await db.exec('ALTER TABLE posts ADD COLUMN pinned_hero INTEGER DEFAULT 0');
  } catch (e) {
    // Column already exists
  }

  try {
    await db.exec('ALTER TABLE posts ADD COLUMN media TEXT');
  } catch (e) {
    // Column already exists
  }

  try {
    await db.exec('ALTER TABLE posts ADD COLUMN pinned_popular INTEGER DEFAULT 0');
  } catch (e) {
    // Column already exists
  }

  try {
    await db.exec('ALTER TABLE posts ADD COLUMN views INTEGER DEFAULT 0');
  } catch (e) {
    // Column already exists
  }

  // Migrate columns for older databases
  const rcols = await db.all("PRAGMA table_info(feedback_replies)");
  const hasEmailed = rcols.some(c => c.name === 'emailed');
  const hasDeliveredAt = rcols.some(c => c.name === 'delivered_at');
  const hasEmailError = rcols.some(c => c.name === 'email_error');
  try {
    if (!hasEmailed) await db.exec('ALTER TABLE feedback_replies ADD COLUMN emailed INTEGER DEFAULT 0');
  } catch {}
  try {
    if (!hasDeliveredAt) await db.exec('ALTER TABLE feedback_replies ADD COLUMN delivered_at DATETIME');
  } catch {}
  try {
    if (!hasEmailError) await db.exec('ALTER TABLE feedback_replies ADD COLUMN email_error TEXT');
  } catch {}

  // Create comments table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_title TEXT NOT NULL,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      avatar_url TEXT,
      provider TEXT DEFAULT 'email',
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('[DB] Comments table initialized');
}

// Mock device auth for local testing (mimics Vercel serverless function)
app.post('/api/device-auth', (req, res) => {
  res.json({ approved: true });
});

// Toggle pinned_hero for a post (only one post can be pinned at a time)
app.patch('/api/posts/:id/pin', async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    if (Number.isNaN(postId)) return res.status(400).json({ error: 'Invalid post ID' });

    const post = await db.get('SELECT id, pinned_hero FROM posts WHERE id = ?', [postId]);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const newVal = post.pinned_hero ? 0 : 1;

    // Unpin all others first, then pin this one
    if (newVal === 1) {
      await db.run('UPDATE posts SET pinned_hero = 0 WHERE pinned_hero = 1');
    }
    await db.run('UPDATE posts SET pinned_hero = ? WHERE id = ?', [newVal, postId]);

    const updated = await db.get('SELECT * FROM posts WHERE id = ?', [postId]);
    if (global.broadcastPostsUpdate) global.broadcastPostsUpdate('updated', updated);

    res.json({ success: true, pinned_hero: newVal, post: updated });
  } catch (err) {
    console.error('Pin toggle error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle pinned_popular for a post
app.patch('/api/posts/:id/pin-popular', async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    if (Number.isNaN(postId)) return res.status(400).json({ error: 'Invalid post ID' });

    const post = await db.get('SELECT id, pinned_popular FROM posts WHERE id = ?', [postId]);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const newVal = post.pinned_popular ? 0 : 1;
    await db.run('UPDATE posts SET pinned_popular = ? WHERE id = ?', [newVal, postId]);

    const updated = await db.get('SELECT * FROM posts WHERE id = ?', [postId]);
    if (global.broadcastPostsUpdate) global.broadcastPostsUpdate('updated', updated);

    res.json({ success: true, pinned_popular: newVal, post: updated });
  } catch (err) {
    console.error('Popular pin toggle error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unified PATCH endpoint using query params (matching Vercel API)
app.patch('/api/posts', async (req, res) => {
  try {
    const action = req.query.action;
    const postId = parseInt(req.query.id, 10);
    if (Number.isNaN(postId)) return res.status(400).json({ error: 'Invalid post ID' });

    if (action === 'view') {
      await db.run('UPDATE posts SET views = IFNULL(views, 0) + 1 WHERE id = ?', [postId]);
      const updated = await db.get('SELECT * FROM posts WHERE id = ?', [postId]);
      if (global.broadcastPostsUpdate) global.broadcastPostsUpdate('updated', updated);
      return res.json({ success: true, views: updated ? updated.views : 0, post: updated });
    }

    if (action === 'pin-popular') {
      const post = await db.get('SELECT id, pinned_popular FROM posts WHERE id = ?', [postId]);
      if (!post) return res.status(404).json({ error: 'Post not found' });

      const newVal = post.pinned_popular ? 0 : 1;
      await db.run('UPDATE posts SET pinned_popular = ? WHERE id = ?', [newVal, postId]);

      const updated = await db.get('SELECT * FROM posts WHERE id = ?', [postId]);
      if (global.broadcastPostsUpdate) global.broadcastPostsUpdate('updated', updated);
      return res.json({ success: true, pinned_popular: newVal, post: updated });
    }

    // Default: pin to hero
    const post = await db.get('SELECT id, pinned_hero FROM posts WHERE id = ?', [postId]);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const newVal = post.pinned_hero ? 0 : 1;
    if (newVal === 1) {
      await db.run('UPDATE posts SET pinned_hero = 0 WHERE pinned_hero = 1');
    }
    await db.run('UPDATE posts SET pinned_hero = ? WHERE id = ?', [newVal, postId]);

    const updated = await db.get('SELECT * FROM posts WHERE id = ?', [postId]);
    if (global.broadcastPostsUpdate) global.broadcastPostsUpdate('updated', updated);
    return res.json({ success: true, pinned_hero: newVal, post: updated });
  } catch (err) {
    console.error('PATCH /api/posts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Increment view count for a post (POST)
app.post('/api/posts/:id/view', async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    if (Number.isNaN(postId)) return res.status(400).json({ error: 'Invalid post ID' });

    await db.run('UPDATE posts SET views = IFNULL(views, 0) + 1 WHERE id = ?', [postId]);

    const updated = await db.get('SELECT * FROM posts WHERE id = ?', [postId]);
    if (global.broadcastPostsUpdate) global.broadcastPostsUpdate('updated', updated);

    res.json({ success: true, views: updated ? updated.views : 0, post: updated });
  } catch (err) {
    console.error('Increment views error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Also support PATCH for views
app.patch('/api/posts/:id/view', async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    if (Number.isNaN(postId)) return res.status(400).json({ error: 'Invalid post ID' });

    await db.run('UPDATE posts SET views = IFNULL(views, 0) + 1 WHERE id = ?', [postId]);

    const updated = await db.get('SELECT * FROM posts WHERE id = ?', [postId]);
    if (global.broadcastPostsUpdate) global.broadcastPostsUpdate('updated', updated);

    res.json({ success: true, views: updated ? updated.views : 0, post: updated });
  } catch (err) {
    console.error('Increment views error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/upload', (req, res) => {
  try {
    const { imageBase64, fileName } = req.body;
    
    if (!imageBase64 || !fileName) {
      return res.status(400).json({ error: 'Missing image data or filename' });
    }

    // Extract base64 data portion
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate unique name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeFileName = uniqueSuffix + '-' + fileName.replace(/[^a-zA-Z0-9.\-_]/g, '');

    // Save locally
    fs.writeFileSync(path.join(uploadsDir, safeFileName), buffer);
    
    const imageUrl = `/uploads/${safeFileName}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const result = await db.run('INSERT INTO feedback (name, email, subject, message) VALUES (?, ?, ?, ?)', [name || null, email || null, subject || null, message]);
    res.json({ id: result.lastID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a reply for a specific feedback item
app.post('/api/feedback/:id/replies', async (req, res) => {
  try {
    if (ADMIN_KEY && req.header('x-admin-key') !== ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const feedbackId = Number(req.params.id);
    const { reply, repliedBy } = req.body || {};
    if (!feedbackId || !Number.isInteger(feedbackId)) {
      return res.status(400).json({ error: 'Invalid feedback id' });
    }
    if (!reply || !reply.trim()) {
      return res.status(400).json({ error: 'Reply text is required' });
    }

    // Ensure feedback exists
    const feedbackRow = await db.get('SELECT id, email, subject FROM feedback WHERE id = ?', [feedbackId]);
    if (!feedbackRow) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Insert reply first
    const result = await db.run(
      'INSERT INTO feedback_replies (feedback_id, reply, replied_by) VALUES (?, ?, ?)',
      [feedbackId, reply.trim(), repliedBy || null]
    );

    // Attempt to email if SMTP configured and feedback has an email
    let emailed = 0;
    let deliveredAt = null;
    let emailError = null;
    const to = (feedbackRow.email || '').trim();
    if (smtpConfigured && to) {
      try {
        const fromAddr = process.env.FROM_EMAIL || process.env.SMTP_USER;
        const subject = `Reply to your feedback${feedbackRow.subject ? `: ${feedbackRow.subject}` : ''}`;
        await mailer.sendMail({
          from: fromAddr,
          to,
          subject,
          text: reply.trim(),
          html: `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Arial,sans-serif;line-height:1.5">${
            reply.trim().replace(/\n/g, '<br/>')
          }</div>`
        });
        emailed = 1;
        deliveredAt = new Date().toISOString();
      } catch (e) {
        console.error('[mail] failed to send reply email:', e?.message || e);
        emailError = e?.message || String(e);
      }
    }

    // Persist email status
    await db.run(
      'UPDATE feedback_replies SET emailed = ?, delivered_at = ?, email_error = ? WHERE id = ?',
      [emailed, deliveredAt, emailError, result.lastID]
    );

    return res.json({ id: result.lastID, feedback_id: feedbackId, emailed: !!emailed, delivered_at: deliveredAt, email_error: emailError });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get replies for a specific feedback item
app.get('/api/feedback/:id/replies', async (req, res) => {
  try {
    const feedbackId = Number(req.params.id);
    if (!feedbackId || !Number.isInteger(feedbackId)) {
      return res.status(400).json({ error: 'Invalid feedback id' });
    }

    const replies = await db.all(
      'SELECT id, feedback_id, reply, replied_by, created_at, emailed, delivered_at, email_error FROM feedback_replies WHERE feedback_id = ? ORDER BY created_at ASC',
      [feedbackId]
    );
    return res.json(replies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const rows = await db.all('SELECT id, name, email, subject, message, created_at FROM feedback ORDER BY created_at DESC LIMIT 100');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export feedback as CSV or JSON
app.get('/api/feedback/export', async (req, res) => {
  try {
    // Optional simple key check
    if (EXPORT_KEY && req.query.key !== EXPORT_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const format = (req.query.format || 'csv').toString().toLowerCase();
    const rows = await db.all('SELECT id, name, email, subject, message, created_at FROM feedback ORDER BY created_at DESC');

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="feedback-${new Date().toISOString().slice(0,10)}.json"`);
      return res.status(200).send(JSON.stringify(rows, null, 2));
    }

    // default CSV
    const headers = ['id','name','email','subject','message','created_at'];
    const escape = (val) => {
      if (val === null || val === undefined) return '';
      const s = String(val).replace(/\r?\n/g, '\n');
      // Wrap in quotes and escape inner quotes
      return '"' + s.replace(/"/g, '""') + '"';
    };
    const csvLines = [headers.join(',')].concat(
      rows.map(r => headers.map(h => escape(r[h])).join(','))
    );

    const csv = csvLines.join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="feedback-${new Date().toISOString().slice(0,10)}.csv"`);
    return res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get tweets from file or cached source
app.get('/api/tweets', async (req, res) => {
  try {
    // Try to fetch from X API if Bearer token is configured
    if (X_API_BEARER_TOKEN) {
      console.log('📡 Fetching real tweets from X API...');
      const tweetRes = await fetch('https://api.twitter.com/2/tweets/search/recent?query=from:fcheckmaster&max_results=10&tweet.fields=created_at,author_id&expansions=author_id&user.fields=username', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${X_API_BEARER_TOKEN}`,
          'User-Agent': 'FactCheckMaster/1.0'
        }
      });

      if (tweetRes.ok) {
        const data = await tweetRes.json();
        if (data.data && Array.isArray(data.data)) {
          const tweets = data.data.map((t, idx) => ({
            id: t.id,
            author: 'Fact Check Master',
            text: t.text,
            date: new Date(t.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            url: `https://twitter.com/fcheckmaster/status/${t.id}`
          }));
          console.log('✅ Successfully fetched', tweets.length, 'real tweets from X API');
          return res.json(tweets);
        }
      } else {
        console.error('❌ X API error:', tweetRes.status, tweetRes.statusText);
      }
    }

    // Fallback: serve from JSON file
    console.log('📁 Falling back to sample tweets from JSON file');
    const tweetsPath = path.join(__dirname, '..', 'data', 'sample-tweets.json');
    if (fs.existsSync(tweetsPath)) {
      const tweets = JSON.parse(fs.readFileSync(tweetsPath, 'utf-8'));
      return res.json(tweets);
    }
    res.json([]);
  } catch (err) {
    console.error('Error fetching tweets:', err);
    // Return sample tweets as fallback
    const tweetsPath = path.join(__dirname, '..', 'data', 'sample-tweets.json');
    try {
      const tweets = JSON.parse(fs.readFileSync(tweetsPath, 'utf-8'));
      return res.json(tweets);
    } catch {
      res.status(500).json({ error: 'Failed to fetch tweets' });
    }
  }
});

// Feedback API endpoints
app.get('/api/feedback', async (req, res) => {
  try {
    const feedbackList = await db.all(
      'SELECT * FROM feedback ORDER BY created_at DESC'
    );
    res.status(200).json(feedbackList);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await db.run(
      'INSERT INTO feedback (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );

    // Send confirmation email if configured
    let emailSent = false;
    if (smtpConfigured && mailer) {
      try {
        const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;
        await mailer.sendMail({
          from: `"Fact Check Master" <${fromEmail}>`,
          to: email,
          subject: `Thank you for contacting us - ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Fact Check Master</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Thank you for reaching out!</p>
              </div>
              
              <div style="background: #f8fafc; padding: 30px;">
                <h2 style="color: #1e293b; margin-bottom: 20px;">We've received your message</h2>
                
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                  <p style="margin: 0 0 10px 0; color: #64748b;"><strong>Subject:</strong> ${subject}</p>
                  <p style="margin: 0 0 15px 0; color: #64748b;"><strong>Your message:</strong></p>
                  <p style="color: #1e293b; line-height: 1.6; margin: 0;">${message}</p>
                </div>
                
                <p style="color: #64748b; margin-top: 20px; line-height: 1.6;">
                  Our team will review your message and get back to you within 24-48 hours. 
                  Thank you for helping us fight misinformation!
                </p>
              </div>
            </div>
          `
        });
        emailSent = true;
      } catch (emailError) {
        console.warn('Email sending failed:', emailError);
      }
    }

    res.status(201).json({ 
      id: result.lastID,
      success: true,
      message: 'Feedback submitted successfully',
      emailSent: emailSent
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Replies API endpoints
app.get('/api/replies', async (req, res) => {
  try {
    const { feedback_id } = req.query;
    
    if (!feedback_id) {
      return res.status(400).json({ error: 'feedback_id is required' });
    }

    const replies = await db.all(
      'SELECT * FROM feedback_replies WHERE feedback_id = ? ORDER BY created_at ASC',
      [feedback_id]
    );

    res.status(200).json(replies);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/replies', async (req, res) => {
  try {
    const { feedback_id, reply } = req.body;
    
    if (!feedback_id || !reply || !reply.trim()) {
      return res.status(400).json({ error: 'feedback_id and reply are required' });
    }

    // Get the feedback details for email notification
    const feedback = await db.get(
      'SELECT * FROM feedback WHERE id = ?',
      [feedback_id]
    );

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Send email notification if configured
    let emailSent = false;
    let emailError = null;
    if (smtpConfigured && mailer) {
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
            </div>
          `
        });
        emailSent = true;
      } catch (err) {
        console.error('Email sending failed:', err);
        emailError = err.message;
      }
    }

    // Insert the reply
    const result = await db.run(
      'INSERT INTO feedback_replies (feedback_id, reply, replied_by) VALUES (?, ?, ?)',
      [feedback_id, reply.trim(), 'Admin']
    );

    res.status(201).json({ 
      id: result.lastID,
      success: true,
      message: 'Reply added successfully',
      emailSent: emailSent,
      emailError: emailError
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Posts API endpoints
app.get('/api/posts', async (req, res) => {
  console.log('[API] GET /api/posts called');
  try {
    const { id, category: rawCategory, limit: rawLimit, offset: rawOffset, popular } = req.query;

    if (id !== undefined && id !== '') {
      const postId = parseInt(id, 10);
      if (Number.isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }
      const post = await db.get(
        'SELECT * FROM posts WHERE id = ? AND status = "published"',
        [postId]
      );
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      return res.status(200).json(post);
    }

    const categoryTrimmed =
      rawCategory !== undefined && rawCategory !== null && String(rawCategory).trim() !== ''
         ? String(rawCategory).trim()
         : undefined;

    let sql = 'SELECT * FROM posts WHERE status = "published"';
    const params = [];

    if (categoryTrimmed) {
      if (categoryTrimmed === 'breaking-news' || categoryTrimmed === 'featured-news') {
        sql += ' AND category IN ("breaking-news", "featured-news")';
      } else if (categoryTrimmed === 'world-news') {
        sql += ' AND category IN ("world-news", "international")';
      } else {
        sql += ' AND IFNULL(category, "latest-news") = ?';
        params.push(categoryTrimmed);
      }
    }

    if (popular === 'true') {
      sql += ' ORDER BY IFNULL(pinned_popular,0) DESC, IFNULL(views,0) DESC, datetime(created_at) DESC';
    } else {
      sql += ' ORDER BY IFNULL(pinned_hero,0) DESC, datetime(created_at) DESC';
    }

    // Always fetch a generous limit (500) to allow deduplication in memory
    sql += ' LIMIT 500';

    const posts = await db.all(sql, params);

    // Deduplicate by title
    const uniquePosts = [];
    const seenTitles = new Set();
    for (const post of posts) {
      const titleTrimmed = post.title ? post.title.trim().toLowerCase() : '';
      if (titleTrimmed && !seenTitles.has(titleTrimmed)) {
        seenTitles.add(titleTrimmed);
        uniquePosts.push(post);
      } else if (!titleTrimmed) {
        uniquePosts.push(post);
      }
    }

    // Apply offset and limit on the deduplicated array
    const limitNum =
      rawLimit !== undefined && rawLimit !== '' && rawLimit !== null
        ? parseInt(rawLimit, 10)
        : NaN;
    const offsetNum =
      rawOffset !== undefined && rawOffset !== '' && rawOffset !== null
        ? parseInt(rawOffset, 10)
        : 0;
    const off = Number.isFinite(offsetNum) && offsetNum >= 0 ? offsetNum : 0;

    let slicedPosts = uniquePosts;
    if (Number.isFinite(limitNum) && limitNum > 0) {
      slicedPosts = uniquePosts.slice(off, off + limitNum);
    } else {
      slicedPosts = uniquePosts.slice(off, off + 100); // Default to max 100 posts
    }

    console.log('[API] Found', slicedPosts.length, 'posts (deduplicated)');
    return res.status(200).json(slicedPosts);
  } catch (error) {
    console.error('[API] Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, author = 'Admin', fact_check_status = 'verified', imageUrl, postUrl, media, categories } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Resolve image_url: prefer media.images[0], fall back to imageUrl
    let resolvedImageUrl = imageUrl || null;
    let mediaJson = null;
    if (media && typeof media === 'object') {
      mediaJson = JSON.stringify(media);
      if (media.images && media.images.length > 0) {
        resolvedImageUrl = media.images[0];
      }
    }

    const allCategories = categories && categories.length > 0 ? categories : ['latest-news'];
    const primaryCategory = allCategories[0];

    const result = await db.run(
      'INSERT INTO posts (title, content, author, fact_check_status, image_url, source_url, media, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title.trim(), content.trim(), author.trim(), fact_check_status, resolvedImageUrl, postUrl || null, mediaJson, primaryCategory]
    );

    const primaryId = result.lastID;

    // Create duplicate entries for remaining categories to match Supabase behavior
    if (allCategories.length > 1) {
      for (let i = 1; i < allCategories.length; i++) {
        await db.run(
          'INSERT INTO posts (title, content, author, fact_check_status, image_url, source_url, media, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [title.trim(), content.trim(), author.trim(), fact_check_status, resolvedImageUrl, postUrl || null, mediaJson, allCategories[i]]
        );
      }
    }

    const newPost = await db.get('SELECT * FROM posts WHERE id = ?', [primaryId]);
    
    // Broadcast to all connected clients
    if (global.broadcastPostsUpdate) {
      global.broadcastPostsUpdate('created', newPost);
    }

    res.status(201).json({ 
      id: primaryId,
      success: true,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/posts', async (req, res) => {
  try {
    const { id } = req.query;
    const { title, content, author = 'Admin', fact_check_status = 'verified', imageUrl, postUrl, categories, media } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Post ID is required' });
    }
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Resolve image_url: prefer media.images[0], fall back to imageUrl
    let resolvedImageUrl = imageUrl || null;
    let mediaJson = null;
    if (media && typeof media === 'object') {
      mediaJson = JSON.stringify(media);
      if (media.images && media.images.length > 0) {
        resolvedImageUrl = media.images[0];
      }
    }

    // Fetch original title
    const post = await db.get('SELECT title, category FROM posts WHERE id = ?', [id]);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const originalTitle = post.title;

    const allCategories = categories && categories.length > 0 ? categories : [post.category || 'latest-news'];
    const primaryCategory = allCategories[0];

    // Update primary row
    let sql = 'UPDATE posts SET title = ?, content = ?, author = ?, fact_check_status = ?, image_url = ?, source_url = ?, media = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const params = [title.trim(), content.trim(), author.trim(), fact_check_status, resolvedImageUrl, postUrl || null, mediaJson, primaryCategory, id];

    await db.run(sql, params);

    // Delete other rows matching original title with different IDs
    await db.run('DELETE FROM posts WHERE title = ? AND id != ?', [originalTitle, id]);

    // Insert extra category rows
    if (allCategories.length > 1) {
      for (let i = 1; i < allCategories.length; i++) {
        await db.run(
          'INSERT INTO posts (title, content, author, fact_check_status, image_url, source_url, media, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [title.trim(), content.trim(), author.trim(), fact_check_status, resolvedImageUrl, postUrl || null, mediaJson, allCategories[i]]
        );
      }
    }

    const updatedPost = await db.get('SELECT * FROM posts WHERE id = ?', [id]);
    
    // Broadcast to all connected clients
    if (global.broadcastPostsUpdate) {
      global.broadcastPostsUpdate('updated', updatedPost);
    }

    res.status(200).json({ 
      success: true,
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch title to delete all category copies
    const post = await db.get('SELECT title FROM posts WHERE id = ?', [id]);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await db.run(
      'DELETE FROM posts WHERE title = ?',
      [post.title]
    );

    // Broadcast to all connected clients
    if (global.broadcastPostsUpdate) {
      global.broadcastPostsUpdate('deleted', { id: parseInt(id) });
    }

    res.status(200).json({ 
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Comments endpoints
app.get('/api/comments', async (req, res) => {
  try {
    const { post_title } = req.query;
    let comments;
    if (post_title) {
      comments = await db.all(
        'SELECT * FROM comments WHERE LOWER(TRIM(post_title)) = LOWER(TRIM(?)) ORDER BY created_at ASC',
        [post_title]
      );
    } else {
      comments = await db.all('SELECT * FROM comments ORDER BY created_at DESC');
    }
    res.json(comments);
  } catch (error) {
    console.error('[API] Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const { post_title, username, email, avatar_url, provider, content } = req.body;
    if (!post_title || !username || !email || !content) {
      return res.status(400).json({ error: 'Missing required comment fields' });
    }
    const result = await db.run(
      'INSERT INTO comments (post_title, username, email, avatar_url, provider, content) VALUES (?, ?, ?, ?, ?, ?)',
      [post_title.trim(), username.trim(), email.trim(), avatar_url || null, provider || 'email', content.trim()]
    );
    const newComment = await db.get('SELECT * FROM comments WHERE id = ?', [result.lastID]);
    
    // Broadcast through WebSockets
    io.emit('comment_added', newComment);

    res.status(201).json(newComment);
  } catch (error) {
    console.error('[API] Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM comments WHERE id = ?', [id]);
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('[API] Error deleting comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[AUTH] Generated OTP for ${email}: ${code}`);

    let emailSent = false;
    let emailError = null;

    if (smtpConfigured && mailer) {
      try {
        await mailer.sendMail({
          from: process.env.FROM_EMAIL || process.env.SMTP_USER,
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
        console.error('[AUTH] Failed to send email:', err);
        emailError = err.message;
      }
    }

    res.json({
      success: true,
      emailSent,
      emailError,
      otp: code
    });
  } catch (error) {
    console.error('[API] Error sending OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/youtube-feed', (req, res) => {
  res.json({
    isLive: false,
    videoId: '5c-PzN0a1s8',
    title: '[Local Mock] Latest Press Briefing by DG ISPR',
    publishedAt: new Date().toISOString(),
    channelId: 'UCw8U3G10a8d672rDkC6W4Yw'
  });
});

// Fetch post data from URL
app.post('/api/fetch-post', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('Fetching URL:', url);

    // Special handling for X/Twitter URLs
    if (url.includes('x.com') || url.includes('twitter.com')) {
      // For X/Twitter, extract basic info from URL and provide fallback
      const urlParts = url.split('/');
      const username = urlParts.find((part, index) => urlParts[index - 1] === 'x.com' || urlParts[index - 1] === 'twitter.com');
      const tweetId = urlParts.find(part => /^\d+$/.test(part));
      
      return res.json({
        title: `Post from @${username || 'Twitter User'}`,
        content: 'Please manually enter the post content or copy the tweet text.',
        author: `@${username || 'TwitterUser'}`,
        imageUrl: '',
        sourceUrl: url,
        message: 'Twitter/X URLs require manual content entry due to access restrictions. Please copy the tweet text and paste it in the content field.'
      });
    }

    // For other URLs, try to fetch content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      },
      timeout: 15000,
      maxRedirects: 5
    });

    const $ = cheerio.load(response.data);
    
    // Extract metadata using various selectors
    let title = '';
    let content = '';
    let author = '';
    let imageUrl = '';

    // Try different methods to extract title
    title = $('meta[property="og:title"]').attr('content') ||
            $('meta[name="twitter:title"]').attr('content') ||
            $('title').text() ||
            $('h1').first().text() ||
            $('h2').first().text();

    // Try different methods to extract content/description
    content = $('meta[property="og:description"]').attr('content') ||
              $('meta[name="twitter:description"]').attr('content') ||
              $('meta[name="description"]').attr('content') ||
              $('article p').first().text() ||
              $('p').first().text();

    // Try different methods to extract author
    author = $('meta[name="author"]').attr('content') ||
             $('meta[property="article:author"]').attr('content') ||
             $('meta[name="twitter:creator"]').attr('content') ||
             $('.author').text() ||
             $('[rel="author"]').text() ||
             $('.byline').text();

    // Try different methods to extract image
    imageUrl = $('meta[property="og:image"]').attr('content') ||
               $('meta[name="twitter:image"]').attr('content') ||
               $('meta[name="twitter:image:src"]').attr('content') ||
               $('meta[property="og:image:url"]').attr('content') ||
               $('article img').first().attr('src') ||
               $('.featured-image img').attr('src') ||
               $('img[alt*="main"], img[alt*="featured"], img[alt*="hero"]').first().attr('src');

    // Clean up extracted data
    title = title ? title.trim().substring(0, 200) : '';
    content = content ? content.trim().substring(0, 1000) : '';
    author = author ? author.trim().substring(0, 100).replace(/^by\s+/i, '') : '';
    
    // Handle relative URLs for images
    if (imageUrl) {
      if (imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      } else if (imageUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imageUrl = urlObj.origin + imageUrl;
      }
    }

    // Fallback values with better defaults
    const hostname = new URL(url).hostname.replace('www.', '');
    if (!title) title = `Article from ${hostname}`;
    if (!content) content = 'Please manually enter the content from the linked page.';
    if (!author) author = hostname;

    console.log('Extracted data:', { title, content, author, imageUrl });

    res.json({
      title,
      content,
      author,
      imageUrl: imageUrl || '',
      sourceUrl: url
    });

  } catch (error) {
    console.error('Error fetching post data:', error.message);
    
    // Provide helpful fallback response
    try {
      const hostname = new URL(req.body.url).hostname.replace('www.', '');
      return res.json({
        title: `Post from ${hostname}`,
        content: 'Could not automatically extract content. Please manually enter the post content.',
        author: hostname,
        imageUrl: '',
        sourceUrl: req.body.url,
        message: 'Automatic content extraction failed. Please copy and paste the content manually.'
      });
    } catch (urlError) {
      return res.status(400).json({ 
        error: 'Invalid URL or unable to fetch content. Please check the URL and try again.',
        details: error.message
      });
    }
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const row = await db.get('SELECT 1 as ok');
    res.json({ status: 'ok', db: !!row });
  } catch (e) {
    res.status(500).json({ status: 'error' });
  }
});

// Serve frontend in production (after API routes)
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // Join admin room for real-time updates
  socket.on('join_admin', () => {
    socket.join('admins');
    console.log(`Socket ${socket.id} joined admin room`);
  });
  
  // Join live feed room for real-time updates
  socket.on('join_livefeed', () => {
    socket.join('livefeed');
    console.log(`Socket ${socket.id} joined livefeed room`);
  });
});

// Broadcast function for posts updates
function broadcastPostsUpdate(eventType, data) {
  io.to('admins').emit('posts_updated', { type: eventType, data });
  io.to('livefeed').emit('posts_updated', { type: eventType, data });
}

// Make broadcast function available globally
global.broadcastPostsUpdate = broadcastPostsUpdate;

initDb().then(() => {
  initMailer();
  server.listen(PORT, () => console.log(`Server listening on port ${PORT} with WebSocket support`));
}).catch(err => {
  console.error('Failed to initialize DB', err);
});
