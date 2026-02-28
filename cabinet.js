const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3002;
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET environment variable is required');
if (!process.env.INTERNAL_API_KEY) throw new Error('INTERNAL_API_KEY environment variable is required');
const JWT_SECRET = process.env.JWT_SECRET;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
const ADMIN_API_URL = process.env.ADMIN_API_URL || 'http://127.0.0.1:3000';
const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN || 'clawdcloud.codecrafters.kz';

// --- Rate limiting ---
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 attempts per window
  message: { error: 'Слишком много попыток входа. Попробуйте через 15 минут.' },
  standardHeaders: true,
  legacyHeaders: false,
});
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: { error: 'Слишком много запросов. Попробуйте позже.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Database (shared with landing) ---
const dbPath = process.env.DB_PATH || path.join(__dirname, 'clawd.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

const findUserByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const findUserById = db.prepare('SELECT * FROM users WHERE id = ?');
const updateBotTokenAndUsername = db.prepare(
  'UPDATE users SET bot_token = ?, bot_username = ? WHERE id = ?'
);
const updateUserActive = db.prepare(
  'UPDATE users SET status = ?, container_name = ? WHERE id = ?'
);
const markAutoPaired = db.prepare(
  'UPDATE users SET auto_paired = 1 WHERE id = ?'
);
const findUserByIdWithToken = db.prepare(
  'SELECT id, bot_token, status, telegram_chat_id FROM users WHERE id = ?'
);
const saveTelegramChatId = db.prepare(
  'UPDATE users SET telegram_chat_id = ? WHERE id = ? AND (telegram_chat_id IS NULL OR telegram_chat_id = "")'
);

// --- Security headers ---
app.use((_req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// --- HTTPS enforcement (behind reverse proxy) ---
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'http') {
    return res.redirect(301, 'https://' + req.headers.host + req.url);
  }
  next();
});

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// --- CSRF protection (double-submit header check) ---
function csrfCheck(req, res, next) {
  if (req.method === 'POST' && !req.path.startsWith('/login') && !req.path.startsWith('/webhook/')) {
    const xrw = req.headers['x-requested-with'];
    if (xrw !== 'XMLHttpRequest') {
      return res.status(403).json({ error: 'CSRF check failed' });
    }
  }
  next();
}
app.use(csrfCheck);

function resolveUser(req) {
  const token = req.cookies.cabinet_token;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return findUserById.get(payload.userId) || null;
  } catch {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const user = resolveUser(req);
  if (!user) {
    res.clearCookie('cabinet_token');
    return res.redirect('/login');
  }
  req.user = user;
  next();
}

function apiAuthMiddleware(req, res, next) {
  const user = resolveUser(req);
  if (!user) {
    res.clearCookie('cabinet_token');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = user;
  next();
}

function statusRedirect(user) {
  // No bot token yet → onboarding step 1
  if (!user.bot_token && user.status !== 'active') return '/onboarding';
  // Has bot token but not active → onboarding step 2 (wait for approval)
  if (user.bot_token && user.status !== 'active') return '/onboarding/complete';
  // Active → dashboard
  return '/dashboard';
}

// --- Routes ---

app.get('/', authMiddleware, (req, res) => {
  res.redirect(statusRedirect(req.user));
});

// --- Auto-login (from registration redirect) ---
app.get('/auto-login', (req, res) => {
  const { token } = req.query;
  if (!token) return res.redirect('/login');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.purpose !== 'auto-login') return res.redirect('/login');
    const user = findUserById.get(payload.userId);
    if (!user) return res.redirect('/login');
    const sessionToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('cabinet_token', sessionToken, {
      httpOnly: true, secure: true, sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(statusRedirect(user));
  } catch {
    res.redirect('/login');
  }
});

// --- Login ---
app.get('/login', (_req, res) => {
  res.sendFile(path.join(__dirname, 'cabinet', 'login.html'));
});

app.post('/login', loginLimiter, (req, res) => {
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
    secure: true,
    sameSite: 'strict',
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
  if (req.user.status === 'active') return res.redirect('/dashboard');
  if (req.user.bot_token) return res.redirect('/onboarding/complete');
  res.sendFile(path.join(__dirname, 'cabinet', 'onboarding.html'));
});

app.get('/onboarding/complete', authMiddleware, (req, res) => {
  if (req.user.status === 'active') return res.redirect('/dashboard');
  if (!req.user.bot_token) return res.redirect('/onboarding');
  res.sendFile(path.join(__dirname, 'cabinet', 'onboarding-complete.html'));
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
    // Validate token via Telegram getMe API and get bot username
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const tgData = await tgRes.json();
    if (!tgData.ok || !tgData.result?.username) {
      return res.status(400).json({ error: 'Токен недействителен. Проверьте и попробуйте снова.' });
    }
    const botUsername = tgData.result.username;

    updateBotTokenAndUsername.run(token, botUsername, req.user.id);

    // Set temporary Telegram webhook so bot can reply while pending
    const webhookUrl = `https://my.${PLATFORM_DOMAIN}/webhook/tg/${req.user.id}`;
    await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl }),
    }).catch(err => console.error('setWebhook error:', err));

    res.json({ redirect: '/onboarding/complete' });
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
app.get('/api/me', apiLimiter, apiAuthMiddleware, async (req, res) => {
  const user = findUserById.get(req.user.id);
  if (!user) return res.status(401).json({ error: 'User not found' });

  // Base response — always returned
  const result = {
    status: user.status,
    email: user.email,
    firstName: user.first_name,
    containerName: user.container_name || null,
    url: null,
    password: null,
    containerStatus: null,
    spend: 0,
    maxBudget: null,
    botToken: user.bot_token || null,
    botUsername: user.bot_username || null,
  };

  // Active user with container — fetch live info
  if (user.status === 'active' && user.container_name) {
    try {
      const resp = await fetch(
        `${ADMIN_API_URL}/api/containers/${user.container_name}/info`,
        { headers: { 'X-Internal-Key': INTERNAL_API_KEY } }
      );
      if (resp.ok) {
        const info = await resp.json();
        result.url = info.url || `https://${user.container_name}.${PLATFORM_DOMAIN}`;
        result.password = info.password || '';
        result.containerStatus = info.status || 'unknown';
        result.spend = info.spend || 0;
        result.maxBudget = info.max_budget || null;
      }
    } catch (err) {
      console.error('Container info error:', err);
      result.url = `https://${user.container_name}.${PLATFORM_DOMAIN}`;
      result.containerStatus = 'unknown';
    }
  }

  // Auto-pair first user (owner) silently
  if (user.status === 'active' && user.container_name && !user.auto_paired) {
    try {
      const pendingResp = await fetch(
        `${ADMIN_API_URL}/api/containers/${user.container_name}/pairing/pending`,
        { headers: { 'X-Internal-Key': INTERNAL_API_KEY } }
      );
      if (pendingResp.ok) {
        const pendingData = await pendingResp.json();
        const output = (pendingData.output || '').trim();
        // Parse markdown table to find first pairing code
        const code = parsePairingCode(output);
        if (code) {
          await fetch(
            `${ADMIN_API_URL}/api/containers/${user.container_name}/pairing/approve`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Internal-Key': INTERNAL_API_KEY,
              },
              body: JSON.stringify({ code }),
            }
          );
          markAutoPaired.run(user.id);
        }
      }
    } catch (err) {
      console.error('Auto-pair error:', err);
    }
  }

  res.json(result);
});

// Parse first pairing code from openclaw CLI markdown table output
function parsePairingCode(output) {
  if (!output) return null;
  const lines = output.split('\n').filter(l => l.trim());
  const headerIdx = lines.findIndex(l => /code/i.test(l) && l.includes('|'));
  if (headerIdx < 0) return null;
  const dataStart = headerIdx + 2; // skip separator line
  for (let i = dataStart; i < lines.length; i++) {
    const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length >= 1 && cells[0]) return cells[0];
  }
  return null;
}

// --- Telegram pairing ---
app.get('/api/pairing/pending', apiLimiter, apiAuthMiddleware, async (req, res) => {
  if (!req.user.container_name) {
    return res.json({ exit_code: -1, output: 'No container' });
  }
  try {
    const resp = await fetch(
      `${ADMIN_API_URL}/api/containers/${req.user.container_name}/pairing/pending`,
      { headers: { 'X-Internal-Key': INTERNAL_API_KEY } }
    );
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error('Pairing pending error:', err);
    res.status(500).json({ error: 'Failed to fetch pairing requests' });
  }
});

app.post('/api/pairing/approve', apiLimiter, apiAuthMiddleware, async (req, res) => {
  if (!req.user.container_name) {
    return res.status(400).json({ error: 'No container' });
  }
  const { code } = req.body;
  if (!code || typeof code !== 'string' || code.length > 20) {
    return res.status(400).json({ error: 'Invalid pairing code' });
  }
  try {
    const resp = await fetch(
      `${ADMIN_API_URL}/api/containers/${req.user.container_name}/pairing/approve`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Key': INTERNAL_API_KEY,
        },
        body: JSON.stringify({ code: code.trim() }),
      }
    );
    const data = await resp.json();
    if (!resp.ok) {
      return res.status(resp.status).json(data);
    }
    res.json(data);
  } catch (err) {
    console.error('Pairing approve error:', err);
    res.status(500).json({ error: 'Failed to approve pairing' });
  }
});

// --- Telegram webhook (temporary, while container is pending) ---
app.post('/webhook/tg/:userId', async (req, res) => {
  res.sendStatus(200); // always reply 200 to Telegram

  const user = findUserByIdWithToken.get(req.params.userId);
  if (!user || !user.bot_token) return;

  // If container is active, OpenClaw handles the webhook — ignore
  if (user.status === 'active') return;

  const msg = req.body?.message;
  if (!msg?.chat?.id) return;

  // Save chat_id for future notifications (e.g. approval)
  if (!user.telegram_chat_id) {
    saveTelegramChatId.run(String(msg.chat.id), user.id);
  }

  const text = 'Привет! Ваша заявка на рассмотрении. Как только администратор подтвердит вашу учётную запись, я напишу вам и продолжим работу.';

  await fetch(`https://api.telegram.org/bot${user.bot_token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: msg.chat.id, text }),
  }).catch(err => console.error('Webhook reply error:', err));
});

// --- Static for cabinet pages ---
app.use('/static', express.static(path.join(__dirname, 'cabinet', 'static')));

// --- Start ---
app.listen(PORT, () => {
  console.log(`Cabinet server running at http://localhost:${PORT}`);
});
