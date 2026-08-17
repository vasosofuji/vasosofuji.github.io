// Vercel Serverless Function - sends booking notifications to Telegram.
//
// The bot token lives here, in the environment, and never reaches the browser.
// This site is otherwise entirely static and public: a token in client code
// would be readable by anyone and the bot could be taken over.
//
// Required environment variables (Vercel → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN   from @BotFather
//   TELEGRAM_CHAT_ID     the chat to notify - message @userinfobot to get yours
//
// Optional:
//   ALLOWED_ORIGIN       defaults to https://vasojevich.com

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://vasojevich.com';

// Simple in-memory throttle. Serverless instances are recycled, so this is a
// speed bump against casual abuse rather than a guarantee.
const recent = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;

function rateLimited(key) {
  const now = Date.now();
  const hits = (recent.get(key) || []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 500) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

const clamp = (v, max) => String(v == null ? '' : v).slice(0, max).trim();

// Telegram's HTML parse mode only permits a small tag set; everything the
// visitor typed is escaped so it cannot inject markup or break the message.
const esc = (v) =>
  clamp(v, 1500).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function buildMessage(kind, d) {
  const title =
    kind === 'abandoned'
      ? '⚠️ <b>Unfinished booking</b>'
      : '📸 <b>New booking request</b>';

  const rows = [
    ['Name', d.name],
    ['Email', d.email],
    ['Phone', d.phone],
    ['Date', d.date],
    ['Type', d.eventType],
    ['Message', d.message],
    ['Notes', d.notes],
  ].filter(([, v]) => clamp(v, 1500).length > 0);

  const body = rows.map(([k, v]) => `<b>${k}:</b> ${esc(v)}`).join('\n');

  const footer =
    kind === 'abandoned'
      ? '\n\n<i>They entered an email but did not submit. They agreed to be contacted about it.</i>'
      : '';

  const reached = clamp(d.reachedStep, 40);
  const step = kind === 'abandoned' && reached ? `\n<b>Got as far as:</b> ${esc(reached)}` : '';

  return `${title}\n\n${body}${step}${footer}`;
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin === ALLOWED_ORIGIN) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    // Never echo which one is missing.
    console.error('notify: Telegram environment variables are not configured');
    return res.status(500).json({ error: 'Notifications are not configured' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many requests' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid payload' });

  const kind = body.kind === 'abandoned' ? 'abandoned' : 'booking';

  // An abandoned-booking alert is only permitted when the visitor ticked the
  // box agreeing to be contacted about an unfinished enquiry. Without that
  // there is no basis to message about someone who never submitted.
  if (kind === 'abandoned' && body.consent !== true) {
    return res.status(204).end();
  }

  const email = clamp(body.email, 200);
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  const text = buildMessage(kind, {
    name: body.name,
    email,
    phone: body.phone,
    date: body.date,
    eventType: body.eventType,
    message: body.message,
    notes: body.notes,
    reachedStep: body.reachedStep,
  });

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!tg.ok) {
      const detail = await tg.text();
      console.error('notify: Telegram rejected the message', tg.status, detail.slice(0, 300));
      return res.status(502).json({ error: 'Could not deliver the notification' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('notify: request to Telegram failed', err);
    return res.status(502).json({ error: 'Could not deliver the notification' });
  }
}
