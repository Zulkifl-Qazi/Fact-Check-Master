import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

async function getDb() {
  if (!db) {
    // For Vercel, create an in-memory database since file system is read-only
    const dbPath = process.env.NODE_ENV === 'production' ? ':memory:' : path.join(__dirname, '../../server/data.db');
    
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
    const { id } = req.query;
    const database = await getDb();

    if (req.method === 'GET') {
      // Get replies for specific feedback
      const replies = await database.all(
        'SELECT * FROM replies WHERE feedback_id = ? ORDER BY created_at ASC',
        [id]
      );

      res.status(200).json(replies);

    } else if (req.method === 'POST') {
      // Add new reply to feedback
      const { reply, adminKey } = req.body;
      
      if (!reply || !reply.trim()) {
        return res.status(400).json({ error: 'Reply text is required' });
      }

      const result = await database.run(
        'INSERT INTO replies (feedback_id, reply, replied_by) VALUES (?, ?, ?)',
        [id, reply.trim(), 'Admin']
      );

      res.status(201).json({ 
        id: result.lastID,
        success: true,
        message: 'Reply added successfully'
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}