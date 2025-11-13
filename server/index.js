import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const EXPORT_KEY = process.env.EXPORT_KEY || null; // optional simple guard for exports
const ADMIN_KEY = process.env.ADMIN_KEY || null;   // optional simple guard for admin-write actions
const X_API_BEARER_TOKEN = process.env.X_API_BEARER_TOKEN || null;  // X API token for fetching real tweets

app.use(cors());
app.use(express.json());

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
  db = await open({
    filename: path.join(__dirname, 'data.db'),
    driver: sqlite3.Database
  });

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
}

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

initDb().then(() => {
  initMailer();
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}).catch(err => {
  console.error('Failed to initialize DB', err);
});
