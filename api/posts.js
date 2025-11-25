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
    const dbPath = process.env.NODE_ENV === 'production' ? ':memory:' : path.join(__dirname, '../server/data.db');
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Create posts table if it doesn't exist
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
    
    // Add new columns to existing table if they don't exist
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
  }
  return db;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const database = await getDb();

    if (req.method === 'GET') {
      // Get all published posts
      const posts = await database.all(
        'SELECT * FROM posts WHERE status = ? ORDER BY created_at DESC',
        ['published']
      );

      res.status(200).json(posts);

    } else if (req.method === 'POST') {
      // Create new post
      const { title, content, author = 'Admin', fact_check_status = 'verified', imageUrl, postUrl } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const result = await database.run(
        'INSERT INTO posts (title, content, author, fact_check_status, image_url, source_url) VALUES (?, ?, ?, ?, ?, ?)',
        [title.trim(), content.trim(), author.trim(), fact_check_status, imageUrl || null, postUrl || null]
      );

      res.status(201).json({ 
        id: result.lastID,
        success: true,
        message: 'Post created successfully'
      });

    } else if (req.method === 'DELETE') {
      // Delete post (extract ID from query or URL)
      const postId = req.query.id || req.url.split('/').pop();
      
      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      const result = await database.run(
        'DELETE FROM posts WHERE id = ?',
        [postId]
      );

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json({ 
        success: true,
        message: 'Post deleted successfully'
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}