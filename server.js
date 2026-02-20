const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database setup ---
const db = new Database(path.join(__dirname, 'waitlist.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT DEFAULT '',
    email TEXT NOT NULL UNIQUE,
    telegram TEXT DEFAULT '',
    use_case TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

const insertStmt = db.prepare(`
  INSERT INTO waitlist (first_name, last_name, email, telegram, use_case)
  VALUES (@first_name, @last_name, @email, @telegram, @use_case)
`);

const countStmt = db.prepare('SELECT COUNT(*) as count FROM waitlist');
const allStmt = db.prepare('SELECT * FROM waitlist ORDER BY created_at DESC');

// --- Middleware ---
app.use(express.json());
app.use(express.static(__dirname));

// --- API Routes ---

// Submit waitlist form
app.post('/api/waitlist', (req, res) => {
  const { firstName, lastName, email, telegram, useCase } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'Имя и email обязательны' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Некорректный email' });
  }

  try {
    insertStmt.run({
      first_name: firstName.trim(),
      last_name: (lastName || '').trim(),
      email: email.trim().toLowerCase(),
      telegram: (telegram || '').trim(),
      use_case: (useCase || '').trim(),
    });

    const { count } = countStmt.get();
    res.json({ success: true, position: count });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Этот email уже в списке' });
    }
    console.error('DB error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Get waitlist count (public)
app.get('/api/waitlist/count', (_req, res) => {
  const { count } = countStmt.get();
  res.json({ count });
});

// View all entries (simple admin — protect in production)
app.get('/api/waitlist', (req, res) => {
  const token = req.query.token;
  if (token !== process.env.ADMIN_TOKEN && token !== 'clawd-admin-2026') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const entries = allStmt.all();
  res.json(entries);
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`Clawd server running at http://localhost:${PORT}`);
});
