const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'dev-internal-key';
const ADMIN_API_URL = process.env.ADMIN_API_URL || 'http://127.0.0.1:3000';
const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN || 'opencloude.codecrafters.kz';

// --- Database (shared with landing) ---
const dbPath = process.env.DB_PATH || path.join(__dirname, 'clawd.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

const findUserByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const findUserById = db.prepare('SELECT * FROM users WHERE id = ?');
const updateBotToken = db.prepare(
  'UPDATE users SET bot_token = ? WHERE id = ?'
);
const updateUserActive = db.prepare(
  'UPDATE users SET status = ?, container_name = ? WHERE id = ?'
);

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

function authMiddleware(req, res, next) {
  const token = req.cookies.cabinet_token;
  if (!token) return res.redirect('/login');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserById.get(payload.userId);
    if (!user) {
      res.clearCookie('cabinet_token');
      return res.redirect('/login');
    }
    req.user = user;
    next();
  } catch {
    res.clearCookie('cabinet_token');
    return res.redirect('/login');
  }
}

function statusRedirect(user) {
  // No bot token yet → onboarding first (regardless of status)
  if (!user.bot_token && user.status !== 'active') return '/onboarding';
  // Has bot token or active → dashboard (shows pending or active state)
  return '/dashboard';
}

// --- Routes ---

app.get('/', authMiddleware, (req, res) => {
  res.redirect(statusRedirect(req.user));
});

// --- Login ---
app.get('/login', (_req, res) => {
  res.sendFile(path.join(__dirname, 'cabinet', 'login.html'));
});

app.post('/login', (req, res) => {
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

  res.cookie('cabinet_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ redirect: statusRedirect(user) });
});

// --- Logout ---
app.get('/logout', (_req, res) => {
  res.clearCookie('cabinet_token');
  res.redirect('/login');
});

// --- Onboarding ---
app.get('/onboarding', authMiddleware, (req, res) => {
  // If already has bot token, go to dashboard
  if (req.user.bot_token || req.user.status === 'active') {
    return res.redirect('/dashboard');
  }
  res.sendFile(path.join(__dirname, 'cabinet', 'onboarding.html'));
});

app.post('/onboarding', authMiddleware, async (req, res) => {
  if (req.user.bot_token || req.user.status === 'active') {
    return res.status(400).json({ error: 'Онбординг уже пройден' });
  }

  const { botToken } = req.body;
  if (!botToken || !/^\d+:[A-Za-z0-9_-]{35,}$/.test(botToken.trim())) {
    return res.status(400).json({ error: 'Некорректный формат токена бота' });
  }

  const token = botToken.trim();

  try {
    // Just save the bot token — container will be created after admin approval
    updateBotToken.run(token, req.user.id);
    res.json({ redirect: '/dashboard' });
  } catch (err) {
    console.error('Save bot token error:', err);
    res.status(500).json({ error: 'Ошибка сохранения токена' });
  }
});

// --- Dashboard ---
app.get('/dashboard', authMiddleware, async (req, res) => {
  // If no bot token yet, do onboarding first
  if (!req.user.bot_token && req.user.status !== 'active') {
    return res.redirect('/onboarding');
  }
  res.sendFile(path.join(__dirname, 'cabinet', 'dashboard.html'));
});

// JSON API for dashboard data
app.get('/api/me', authMiddleware, async (req, res) => {
  const user = findUserById.get(req.user.id);
  if (!user) return res.status(401).json({ error: 'User not found' });

  // Pending: bot token saved, waiting for admin approval
  if (user.status === 'pending') {
    return res.json({
      status: 'pending',
      email: user.email,
      firstName: user.first_name,
    });
  }

  // Approved but no container yet (shouldn't normally happen with new flow)
  if (user.status === 'approved' && !user.container_name) {
    return res.json({
      status: 'approved',
      email: user.email,
      firstName: user.first_name,
    });
  }

  // Active — get container info
  const containerName = user.container_name;
  let containerInfo = {};

  try {
    const resp = await fetch(
      `${ADMIN_API_URL}/api/containers/${containerName}/info`,
      { headers: { 'X-Internal-Key': INTERNAL_API_KEY } }
    );
    if (resp.ok) containerInfo = await resp.json();
  } catch (err) {
    console.error('Container info error:', err);
  }

  res.json({
    status: user.status,
    email: user.email,
    firstName: user.first_name,
    containerName,
    url: containerInfo.url || `https://${containerName}.${PLATFORM_DOMAIN}`,
    password: containerInfo.password || '',
    containerStatus: containerInfo.status || 'unknown',
    spend: containerInfo.spend || 0,
    maxBudget: containerInfo.max_budget || null,
  });
});

// --- Static for cabinet pages ---
app.use('/static', express.static(path.join(__dirname, 'cabinet', 'static')));

// --- Start ---
app.listen(PORT, () => {
  console.log(`Cabinet server running at http://localhost:${PORT}`);
});
