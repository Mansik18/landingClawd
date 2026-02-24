const translations = {
  ru: {
    // Announcement
    "ann.text": "Открыт ранний доступ к ClawdCloud —",
    "ann.cta": "Развернуть OpenClaw &rarr;",

    // Nav
    "nav.features": "Возможности",
    "nav.cases": "Кейсы",
    "nav.pricing": "Тарифы",
    "nav.faq": "FAQ",
    "nav.cta": "Развернуть",

    // Hero
    "hero.badge": "Уже <strong>847+</strong> развернули OpenClaw",
    "hero.title1": "Разверни OpenClaw",
    "hero.title2": '<span class="gradient-text">в два клика</span>',
    "hero.subtitle": 'Никаких серверов, установки и танцев с бубном. ClawdCloud — платформа, которая разворачивает OpenClaw за вас. <strong>Два клика. 60 секунд. Работает.</strong>',
    "hero.cta1": "Развернуть OpenClaw",
    "hero.cta2": "Что внутри?",

    // Terminal
    "terminal.cmd1": "clawdcloud deploy --plan hobby",
    "terminal.out1": "> OpenClaw развёрнут на managed VPS. Статус: online. Время: 47 сек.",
    "terminal.cmd2": "clawdcloud status",
    "terminal.out2": "> OpenClaw v3.2.1 | Uptime: 99.98% | RAM: 1.2/2GB | Бэкап: 2 часа назад",
    "terminal.cmd3": "clawdcloud connect --telegram @mybot",
    "terminal.out3": "> Telegram-бот подключён. OpenClaw доступен в чате. Всё готово.",
    "terminal.cmd4": "clawdcloud upgrade --plan pro",
    "terminal.out4": "> Тариф обновлён до Pro. 8GB RAM, +$50 бонусных кредитов. Без простоя.",
    "terminal.cmd5": "clawdcloud logs --tail 5",
    "terminal.out5": "> [OK] 12 задач выполнено | [OK] Бэкап завершён | [OK] Обновление установлено",

    // Marquee
    "marquee.1": "Деплой за 60 секунд",
    "marquee.2": "Без установки",
    "marquee.3": "Без настройки серверов",
    "marquee.4": "Управляемый VPS",
    "marquee.5": "Авто-обновления",
    "marquee.6": "Бэкапы из коробки",
    "marquee.7": "OpenClaw полная версия",

    // How it works
    "how.badge": "Как это работает",
    "how.title": 'Два клика — и OpenClaw<br><span class="gradient-text">уже работает</span>',
    "how.subtitle": "Без SSH, без Docker, без конфигов. Мы убрали весь геморрой между вами и рабочим OpenClaw.",
    "how.step1.title": "Создайте аккаунт",
    "how.step1.text": "Один email — и ваша панель управления готова. Быстрее, чем заварить кофе.",
    "how.step1.time": "~15 сек",
    "how.step2.title": "Нажмите «Развернуть»",
    "how.step2.text": "Выберите тариф, нажмите кнопку — ClawdCloud разворачивает OpenClaw на управляемом VPS.",
    "how.step2.time": "~45 сек",
    "how.step3.title": "Пользуйтесь",
    "how.step3.text": "OpenClaw работает. Обновления, бэкапы, мониторинг — всё на нас. Вы просто пользуетесь.",

    // Features
    "feat.badge": "Всё что нужно",
    "feat.title": 'Готовый OpenClaw.<br><span class="gradient-text">Ноль настроек.</span>',
    "feat.subtitle": "Не хостинг, а полноценная среда. Запустили — работает. Точка.",
    "feat.tag.ai": "AI",
    "feat.routing.title": 'Автоматический выбор <span class="gradient-text">модели</span>',
    "feat.routing.text": "Лёгкий запрос — быстрая модель. Глубокий анализ — тяжёлая. ClawdCloud подбирает оптимальную модель под каждую задачу на лету.",
    "feat.tag.savings": "Выгода",
    "feat.savings.title": 'AI расходы <span class="gradient-text">в 2x меньше</span>',
    "feat.savings.text": "Оптимизация контекста, кэширование и умная маршрутизация. Вы получаете тот же результат, но платите вдвое меньше, чем при self-host.",
    "feat.chart.label": "Стоимость токенов/мес",
    "feat.savings.badge": "экономия/мес",
    "feat.security.title": "Защита данных",
    "feat.security.text": "Изолированный контейнер, шифрование на диске, ежедневные бэкапы. Ваши данные под замком.",
    "feat.search.title": "Встроенный веб-поиск",
    "feat.search.text": "OpenClaw ищет в интернете из коробки. Никаких дополнительных ключей — подключено и работает.",
    "feat.browser.title": "Браузер-агент",
    "feat.browser.text": "Headless-браузер настроен с первой минуты. Парсинг, заполнение форм, скриншоты — готово.",
    "feat.updates.title": "Обновления на автомате",
    "feat.updates.text": "Вышел новый OpenClaw? Он уже у вас. Мы обновляем всё автоматически, без простоев.",

    // Integrations
    "int.title": 'Все интеграции <span class="gradient-text">из коробки</span>',
    "int.subtitle": "OpenClaw на ClawdCloud уже подключен к сотням сервисов. Никакой ручной настройки.",

    // Use Cases
    "cases.badge": "Примеры",
    "cases.title": 'Одно сообщение —<br><span class="gradient-text">готовый результат.</span>',
    "cases.subtitle": "Напишите OpenClaw что нужно. Он разберётся сам — найдёт, сделает, отчитается.",
    "cases.cat.personal": "Личное",
    "cases.cat.business": "Бизнес",
    "cases.cat.dev": "Разработка",
    "cases.cat.content": "Контент",
    "cases.cat.research": "Исследование",
    "cases.cat.monitoring": "Мониторинг",
    "cases.prompt1": "\"Найди билеты в Стамбул на выходные, до 30к, прямой рейс. Скинь топ-3 варианта.\"",
    "cases.result1": "Нашёл 3 рейса, отправил в Telegram",
    "cases.prompt2": "\"Собери отчёт по продажам за январь из Google Sheets. Графики + выводы.\"",
    "cases.result2": "PDF-отчёт готов, отправлен на почту",
    "cases.prompt3": "\"Проверь последний PR на баги, напиши ревью и алертни в Slack если что-то критичное.\"",
    "cases.result3": "Ревью опубликовано, 2 замечания",
    "cases.prompt4": "\"Напиши 5 постов для Telegram-канала на эту неделю. Тема: AI-продуктивность.\"",
    "cases.result4": "5 постов готовы, запланированы",
    "cases.prompt5": "\"Изучи конкурентов в нише SaaS-аналитики. Цены, фичи, слабые места. Таблицей.\"",
    "cases.result5": "Сравнительная таблица на 12 конкурентов",
    "cases.prompt6": "\"Следи за сайтом 24/7. Если упадёт — перезапусти и напиши мне в Telegram.\"",
    "cases.result6": "Мониторинг активен, uptime 99.9%",

    // Pricing
    "price.badge": "Старт",
    "price.title": "Бесплатно",
    "price.subtitle": "Полноценный OpenClaw на управляемом VPS. Без карты и скрытых платежей.",
    "price.free.badge": "БЕСПЛАТНО",
    "price.free.name": "Free",
    "price.free.credits": "Бесплатный триал до 14 дней",
    "price.free.f1": "Управляемый VPS",
    "price.free.f2": "Веб-поиск",
    "price.free.f3": "Браузер-агент",
    "price.free.f4": "Авто-обновления",
    "price.free.f5": "Ежедневные бэкапы",
    "price.free.f6": "Telegram / WhatsApp",
    "price.free.cta": "Начать бесплатно",

    // Deploy Modal
    "deploy.title": "Развернуть OpenClaw",
    "deploy.notice": "Сейчас платформа испытывает высокую нагрузку. Каждая заявка проходит дополнительную проверку и ручное рассмотрение, поэтому подключение может занять некоторое время. Оставьте свои данные — мы обработаем вашу заявку в порядке очереди.",

    // Waitlist form
    "wl.firstName": "Имя *",
    "wl.firstName.ph": "Александр",
    "wl.lastName": "Фамилия",
    "wl.lastName.ph": "Иванов",
    "wl.email": "Email *",
    "wl.telegram": "Telegram",
    "wl.useCase": "Как будете использовать?",
    "wl.useCase.select": "Выберите...",
    "wl.useCase.personal": "Личные дела",
    "wl.useCase.work": "Рабочие задачи",
    "wl.useCase.dev": "Разработка",
    "wl.useCase.content": "Контент",
    "wl.useCase.other": "Другое",
    "wl.submit": "Оставить заявку",
    "wl.note": "Никакого спама. Только уведомление о запуске.",
    "wl.success.title": "Заявка принята!",
    "wl.success.text": "Ваша заявка добавлена в очередь (позиция: №{pos}).\nОжидайте ответ в течение нескольких дней (2–5). Спасибо за понимание.",
    "wl.success.ok": "Понятно",

    // FAQ
    "faq.badge": "FAQ",
    "faq.title": 'Вопросы? <span class="gradient-text">Ответы.</span>',
    "faq.q1": "Что такое ClawdCloud?",
    "faq.a1": "ClawdCloud — платформа для деплоя OpenClaw. Мы берём на себя сервер, установку, настройку, обновления и бэкапы. Вы просто нажимаете «Развернуть» и пользуетесь готовым OpenClaw.",
    "faq.q2": "Серьёзно бесплатно? В чём подвох?",
    "faq.a2": "Никакого подвоха. Мы даём бесплатный триал для первых пользователей — полноценный VPS + AI кредиты. Хотим, чтобы вы попробовали и убедились сами, прежде чем мы запустим платные тарифы.",
    "faq.q3": "Я не программист. Мне это подойдёт?",
    "faq.a3": "В этом и смысл ClawdCloud. Никакого SSH, Docker или терминала. Два клика в браузере — и OpenClaw развёрнут. Проще, чем зарегаться в соцсети.",
    "faq.q4": "Почему не захостить OpenClaw самому?",
    "faq.a4": "Можно. Но это VPS, SSH, Docker, конфиги, SSL, обновления, бэкапы, мониторинг... ClawdCloud делает всё это за вас в два клика. Тот же OpenClaw, ноль DevOps.",
    "faq.q5": "Мои данные в безопасности?",
    "faq.a5": "Ваши данные — это ваши данные. Шифрование, изоляция, экспорт одним кликом. Никакой привязки. Удалите аккаунт — мы удалим всё.",
    "faq.q6": "Можно ли использовать свой API ключ?",
    "faq.a6": "Да. Принесите свой ключ OpenAI, Anthropic или любой другой — без наценки. Или используйте наши кредиты — как удобнее.",

    // CTA
    "cta.title": 'Хватит настраивать серверы.<br><span class="gradient-text">Просто разверните OpenClaw.</span>',
    "cta.subtitle": "Два клика. 60 секунд. Бесплатно. Без карты.",
    "cta.btn": "Развернуть OpenClaw",

    // Footer
    "footer.desc": "Платформа для деплоя OpenClaw. Без геморроя.",
    "footer.product": "Продукт",
    "footer.resources": "Ресурсы",
    "footer.company": "Компания",
    "footer.partner": "Партнёрская программа",
    "footer.contact": "Контакт",
    "footer.privacy": "Конфиденциальность",
    "footer.terms": "Условия",
    "footer.copy": "&copy; 2026 ClawdCloud. Все права защищены.",

    // Meta
    "meta.title": "ClawdCloud — Разверни OpenClaw в два клика",
    "meta.description": "Платформа для деплоя OpenClaw без геморроя. Никаких серверов, установки и настройки — просто разверни и пользуйся.",

    // Form submit
    "form.sending": "Отправка...",
    "form.error": "Ошибка сервера"
  },

  en: {
    // Announcement
    "ann.text": "Early access to ClawdCloud is open —",
    "ann.cta": "Deploy OpenClaw &rarr;",

    // Nav
    "nav.features": "Features",
    "nav.cases": "Use Cases",
    "nav.pricing": "Pricing",
    "nav.faq": "FAQ",
    "nav.cta": "Deploy",

    // Hero
    "hero.badge": "Already <strong>847+</strong> deployed OpenClaw",
    "hero.title1": "Deploy OpenClaw",
    "hero.title2": '<span class="gradient-text">in two clicks</span>',
    "hero.subtitle": 'No servers, no setup, no headaches. ClawdCloud is a platform that deploys OpenClaw for you. <strong>Two clicks. 60 seconds. Done.</strong>',
    "hero.cta1": "Deploy OpenClaw",
    "hero.cta2": "What's inside?",

    // Terminal
    "terminal.cmd1": "clawdcloud deploy --plan hobby",
    "terminal.out1": "> OpenClaw deployed on managed VPS. Status: online. Time: 47 sec.",
    "terminal.cmd2": "clawdcloud status",
    "terminal.out2": "> OpenClaw v3.2.1 | Uptime: 99.98% | RAM: 1.2/2GB | Backup: 2 hours ago",
    "terminal.cmd3": "clawdcloud connect --telegram @mybot",
    "terminal.out3": "> Telegram bot connected. OpenClaw available in chat. All set.",
    "terminal.cmd4": "clawdcloud upgrade --plan pro",
    "terminal.out4": "> Plan upgraded to Pro. 8GB RAM, +$50 bonus credits. Zero downtime.",
    "terminal.cmd5": "clawdcloud logs --tail 5",
    "terminal.out5": "> [OK] 12 tasks completed | [OK] Backup done | [OK] Update installed",

    // Marquee
    "marquee.1": "Deploy in 60 seconds",
    "marquee.2": "No installation",
    "marquee.3": "No server setup",
    "marquee.4": "Managed VPS",
    "marquee.5": "Auto-updates",
    "marquee.6": "Backups included",
    "marquee.7": "Full OpenClaw version",

    // How it works
    "how.badge": "How it works",
    "how.title": 'Two clicks — and OpenClaw<br><span class="gradient-text">is already running</span>',
    "how.subtitle": "No SSH, no Docker, no configs. We removed all the hassle between you and a working OpenClaw.",
    "how.step1.title": "Create an account",
    "how.step1.text": "One email — and your dashboard is ready. Faster than making coffee.",
    "how.step1.time": "~15 sec",
    "how.step2.title": "Click \"Deploy\"",
    "how.step2.text": "Choose a plan, click the button — ClawdCloud deploys OpenClaw on a managed VPS.",
    "how.step2.time": "~45 sec",
    "how.step3.title": "Start using it",
    "how.step3.text": "OpenClaw is running. Updates, backups, monitoring — all on us. You just use it.",

    // Features
    "feat.badge": "Everything you need",
    "feat.title": 'Ready-made OpenClaw.<br><span class="gradient-text">Zero config.</span>',
    "feat.subtitle": "Not hosting — a complete environment. Launch it — it works. Period.",
    "feat.tag.ai": "AI",
    "feat.routing.title": 'Automatic model <span class="gradient-text">selection</span>',
    "feat.routing.text": "Simple query — fast model. Deep analysis — powerful one. ClawdCloud picks the optimal model for each task on the fly.",
    "feat.tag.savings": "Savings",
    "feat.savings.title": 'AI costs <span class="gradient-text">2x lower</span>',
    "feat.savings.text": "Context optimization, caching, and smart routing. Same results, half the price compared to self-hosting.",
    "feat.chart.label": "Token cost/month",
    "feat.savings.badge": "savings/month",
    "feat.security.title": "Data protection",
    "feat.security.text": "Isolated container, disk encryption, daily backups. Your data is locked down.",
    "feat.search.title": "Built-in web search",
    "feat.search.text": "OpenClaw searches the web out of the box. No extra API keys — connected and working.",
    "feat.browser.title": "Browser agent",
    "feat.browser.text": "Headless browser configured from minute one. Parsing, form filling, screenshots — ready.",
    "feat.updates.title": "Auto-updates",
    "feat.updates.text": "New OpenClaw release? Already installed. We update everything automatically, zero downtime.",

    // Integrations
    "int.title": 'All integrations <span class="gradient-text">out of the box</span>',
    "int.subtitle": "OpenClaw on ClawdCloud is already connected to hundreds of services. No manual setup.",

    // Use Cases
    "cases.badge": "Examples",
    "cases.title": 'One message —<br><span class="gradient-text">done.</span>',
    "cases.subtitle": "Tell OpenClaw what you need. It figures out the rest — finds, does, reports back.",
    "cases.cat.personal": "Personal",
    "cases.cat.business": "Business",
    "cases.cat.dev": "Development",
    "cases.cat.content": "Content",
    "cases.cat.research": "Research",
    "cases.cat.monitoring": "Monitoring",
    "cases.prompt1": "\"Find flights to Istanbul this weekend, under $300, direct. Send me top 3.\"",
    "cases.result1": "Found 3 flights, sent to Telegram",
    "cases.prompt2": "\"Build a January sales report from Google Sheets. Charts + insights.\"",
    "cases.result2": "PDF report ready, sent to email",
    "cases.prompt3": "\"Review the latest PR for bugs, write a review, alert Slack if anything critical.\"",
    "cases.result3": "Review published, 2 comments",
    "cases.prompt4": "\"Write 5 posts for our Telegram channel this week. Topic: AI productivity.\"",
    "cases.result4": "5 posts ready, scheduled",
    "cases.prompt5": "\"Research competitors in the SaaS analytics niche. Pricing, features, weak points. As a table.\"",
    "cases.result5": "Comparison table for 12 competitors",
    "cases.prompt6": "\"Monitor the website 24/7. If it goes down — restart and message me on Telegram.\"",
    "cases.result6": "Monitoring active, uptime 99.9%",

    // Pricing
    "price.badge": "Get started",
    "price.title": "Free",
    "price.subtitle": "Full OpenClaw on a managed VPS. No card required and no hidden fees.",
    "price.free.badge": "FREE",
    "price.free.name": "Free",
    "price.free.credits": "Free trial up to 14 days",
    "price.free.f1": "Managed VPS",
    "price.free.f2": "Web search",
    "price.free.f3": "Browser agent",
    "price.free.f4": "Auto-updates",
    "price.free.f5": "Daily backups",
    "price.free.f6": "Telegram / WhatsApp",
    "price.free.cta": "Start for free",

    // Deploy Modal
    "deploy.title": "Deploy OpenClaw",
    "deploy.notice": "The platform is currently experiencing high demand. Each application undergoes additional verification and manual review, so onboarding may take some time. Leave your details — we'll process your request in order.",

    // Waitlist form
    "wl.firstName": "First name *",
    "wl.firstName.ph": "John",
    "wl.lastName": "Last name",
    "wl.lastName.ph": "Doe",
    "wl.email": "Email *",
    "wl.telegram": "Telegram",
    "wl.useCase": "How will you use it?",
    "wl.useCase.select": "Select...",
    "wl.useCase.personal": "Personal tasks",
    "wl.useCase.work": "Work tasks",
    "wl.useCase.dev": "Development",
    "wl.useCase.content": "Content",
    "wl.useCase.other": "Other",
    "wl.submit": "Submit request",
    "wl.note": "No spam. Just a launch notification.",
    "wl.success.title": "Request accepted!",
    "wl.success.text": "Your request has been added to the queue (position: #{pos}).\nPlease expect a response within a few days (2–5). Thank you for your patience.",
    "wl.success.ok": "Got it",

    // FAQ
    "faq.badge": "FAQ",
    "faq.title": 'Questions? <span class="gradient-text">Answers.</span>',
    "faq.q1": "What is ClawdCloud?",
    "faq.a1": "ClawdCloud is a platform for deploying OpenClaw. We handle the server, installation, configuration, updates, and backups. You just click \"Deploy\" and use a ready-made OpenClaw.",
    "faq.q2": "Really free? What's the catch?",
    "faq.a2": "No catch. We're offering a free trial for early users — full VPS + AI credits. We want you to try it and see for yourself before we launch paid plans.",
    "faq.q3": "I'm not a developer. Is this for me?",
    "faq.a3": "That's exactly the point of ClawdCloud. No SSH, Docker, or terminal. Two clicks in a browser — and OpenClaw is deployed. Easier than signing up for social media.",
    "faq.q4": "Why not self-host OpenClaw?",
    "faq.a4": "You can. But that means VPS, SSH, Docker, configs, SSL, updates, backups, monitoring... ClawdCloud does all of that for you in two clicks. Same OpenClaw, zero DevOps.",
    "faq.q5": "Is my data safe?",
    "faq.a5": "Your data is your data. Encryption, isolation, one-click export. No lock-in. Delete your account — we delete everything.",
    "faq.q6": "Can I use my own API key?",
    "faq.a6": "Yes. Bring your OpenAI, Anthropic, or any other key — no markup. Or use our credits — whatever works for you.",

    // CTA
    "cta.title": 'Stop configuring servers.<br><span class="gradient-text">Just deploy OpenClaw.</span>',
    "cta.subtitle": "Two clicks. 60 seconds. Free. No card.",
    "cta.btn": "Deploy OpenClaw",

    // Footer
    "footer.desc": "Platform for deploying OpenClaw. Hassle-free.",
    "footer.product": "Product",
    "footer.resources": "Resources",
    "footer.company": "Company",
    "footer.partner": "Affiliate program",
    "footer.contact": "Contact",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.copy": "&copy; 2026 ClawdCloud. All rights reserved.",

    // Meta
    "meta.title": "ClawdCloud — Deploy OpenClaw in Two Clicks",
    "meta.description": "Platform for deploying OpenClaw hassle-free. No servers, no setup — just deploy and use.",

    // Form submit
    "form.sending": "Sending...",
    "form.error": "Server error"
  }
};

// CIS country codes
const CIS_COUNTRIES = ['RU', 'KZ', 'BY', 'UZ', 'KG', 'TJ', 'TM', 'AZ', 'AM', 'GE', 'MD', 'UA'];

function detectLanguage() {
  const saved = localStorage.getItem('clawdcloud-lang');
  if (saved) return saved;

  // Check browser language first as fast fallback
  const browserLang = navigator.language || navigator.languages?.[0] || '';
  if (/^ru/i.test(browserLang)) return 'ru';

  return null; // Will be resolved by geo lookup
}

async function detectByGeo() {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    return CIS_COUNTRIES.includes(data.country_code) ? 'ru' : 'en';
  } catch {
    // Fallback: check timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (/Moscow|Kiev|Kyiv|Almaty|Minsk|Tashkent|Baku|Yerevan|Tbilisi/i.test(tz)) return 'ru';
    return 'en';
  }
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = translations[lang]?.[key];
    if (val !== undefined) el.innerHTML = val;
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    const val = translations[lang]?.[key];
    if (val !== undefined) el.placeholder = val;
  });

  // Update meta
  document.title = translations[lang]['meta.title'];
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = translations[lang]['meta.description'];

  // Update toggle button
  const toggle = document.getElementById('langToggle');
  if (toggle) toggle.textContent = lang === 'ru' ? 'EN' : 'RU';

  localStorage.setItem('clawdcloud-lang', lang);
  window.__currentLang = lang;
}

function toggleLanguage() {
  const current = window.__currentLang || 'ru';
  const next = current === 'ru' ? 'en' : 'ru';
  applyLanguage(next);
  if (typeof window.trackEvent === 'function') {
    window.trackEvent('language_toggle', { from: current, to: next });
  }
}

// Initialize
async function initI18n() {
  let lang = detectLanguage();
  if (!lang) {
    // Apply Russian as default while geo loads
    applyLanguage('ru');
    lang = await detectByGeo();
  }
  applyLanguage(lang);
}
