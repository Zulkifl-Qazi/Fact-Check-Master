import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

async function getDb() {
  if (!db) {
    db = await open({
      filename: path.join(__dirname, '../server/data.db'),
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
    const database = await getDb();

    if (req.method === 'POST') {
      // Create new feedback
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const result = await database.run(
        'INSERT INTO feedback (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [name, email, subject, message]
      );

      res.status(201).json({ 
        id: result.lastID,
        success: true,
        message: 'Feedback submitted successfully'
      });

    } else if (req.method === 'GET') {
      // Get all feedback (for admin)
      const feedbackList = await database.all(
        'SELECT * FROM feedback ORDER BY created_at DESC'
      );

      res.status(200).json(feedbackList);

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}