const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// --- Database setup ---
const db = new Database(path.join(__dirname, 'clawd.db'));
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

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    email          TEXT NOT NULL UNIQUE,
    password_hash  TEXT NOT NULL,
    first_name     TEXT NOT NULL,
    last_name      TEXT DEFAULT '',
    telegram       TEXT DEFAULT '',
    status         TEXT DEFAULT 'pending',
    container_name TEXT DEFAULT '',
    bot_token      TEXT DEFAULT '',
    created_at     TEXT DEFAULT (datetime('now'))
  )
`);

// --- Prepared statements ---
const insertWaitlist = db.prepare(`
  INSERT INTO waitlist (first_name, last_name, email, telegram, use_case)
  VALUES (@first_name, @last_name, @email, @telegram, @use_case)
`);
const countWaitlist = db.prepare('SELECT COUNT(*) as count FROM waitlist');
const allWaitlist = db.prepare('SELECT * FROM waitlist ORDER BY created_at DESC');

const insertUser = db.prepare(`
  INSERT INTO users (email, password_hash, first_name, last_name, telegram)
  VALUES (@email, @password_hash, @first_name, @last_name, @telegram)
`);
const findUserByEmail = db.prepare('SELECT * FROM users WHERE email = ?');

// --- Middleware ---
app.use(express.json());
app.use(express.static(__dirname, { index: 'index.html' }));

// --- API Routes ---

// Register new user
app.post('/api/register', (req, res) => {
  const { firstName, lastName, email, password, telegram } = req.body;

  if (!firstName || !email || !password) {
    return res.status(400).json({ error: 'Имя, email и пароль обязательны' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Некорректный email' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
  }

  try {
    const hash = bcrypt.hashSync(password, 10);
    insertUser.run({
      email: email.trim().toLowerCase(),
      password_hash: hash,
      first_name: firstName.trim(),
      last_name: (lastName || '').trim(),
      telegram: (telegram || '').trim(),
    });
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Этот email уже зарегистрирован' });
    }
    console.error('DB error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }

  const user = findUserByEmail.get(email.trim().toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({ token, status: user.status });
});

// Submit waitlist form (kept for backward compatibility)
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
    insertWaitlist.run({
      first_name: firstName.trim(),
      last_name: (lastName || '').trim(),
      email: email.trim().toLowerCase(),
      telegram: (telegram || '').trim(),
      use_case: (useCase || '').trim(),
    });

    const { count } = countWaitlist.get();
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
  const { count } = countWaitlist.get();
  res.json({ count });
});

// View all entries (simple admin)
app.get('/api/waitlist', (req, res) => {
  const token = req.query.token;
  if (token !== process.env.ADMIN_TOKEN && token !== 'clawd-admin-2026') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const entries = allWaitlist.all();
  res.json(entries);
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`Clawd server running at http://localhost:${PORT}`);
});

module.exports = { db };
