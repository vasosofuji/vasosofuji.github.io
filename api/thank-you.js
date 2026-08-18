// Vercel Serverless Function - sends the visitor a thank you email through Brevo.
//
// The API key lives here, in the environment, and never reaches the browser.
// This site is otherwise entirely static and public: a key in client code would
// be readable by anyone and could be used to send mail as this domain.
//
// Required environment variables (Vercel -> Settings -> Environment Variables):
//   BREVO_API_KEY        a v3 API key from Brevo -> SMTP & API -> API keys
//
// Optional:
//   BREVO_SENDER_EMAIL   defaults to contact@vasojevich.com. Must be a sender
//                        Brevo has verified, or the send is rejected.
//   BREVO_SENDER_NAME    defaults to Mateja Vasojevikj
//   BREVO_LIST_ID        if set, the address is also added to this Brevo list,
//                        which is what an automation there would listen to
//   ALLOWED_ORIGIN       defaults to https://vasojevich.com
//
// With no key configured this endpoint does nothing and reports success, so the
// booking flow behaves exactly as it did before Brevo was introduced.

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://vasojevich.com';
const BREVO_API = 'https://api.brevo.com/v3';

const recent = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 4;

function rateLimited(key) {
  const now = Date.now();
  const hits = (recent.get(key) || []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 500) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

const clamp = (v, max) => String(v == null ? '' : v).slice(0, max).trim();
const esc = (v) =>
  clamp(v, 400).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Both languages, because the site is bilingual and someone who filled the form
// in Macedonian should not be answered in English.
function buildEmail(lang, name, date) {
  const firstName = clamp(name, 80).split(/\s+/)[0] || '';

  if (lang === 'mk') {
    const greeting = firstName ? `Здраво ${esc(firstName)},` : 'Здраво,';
    const when = date ? `<p>Барањето се однесува на <strong>${esc(date)}</strong>.</p>` : '';
    return {
      subject: 'Го примив вашето барање',
      html: `
        <p>${greeting}</p>
        <p>Ви благодарам што се јавивте. Го примив вашето барање и ќе ви одговорам
        лично во следните еден до два дена.</p>
        ${when}
        <p>Ако во меѓувреме ви текне нешто, слика што ви се допаѓа, локација, или
        груба идеја за тоа како замислувате дека треба да изгледа, само одговорете
        на овој мејл. Колку повеќе знам однапред, толку подобро ќе ве искористам
        времето кога ќе се сретнеме.</p>
        <p>До наскоро,<br>Матеја</p>
        <p style="color:#888;font-size:12px">vasojevich.com</p>`,
    };
  }

  const greeting = firstName ? `Hi ${esc(firstName)},` : 'Hi,';
  const when = date ? `<p>Your enquiry is for <strong>${esc(date)}</strong>.</p>` : '';
  return {
    subject: 'I have got your enquiry',
    html: `
      <p>${greeting}</p>
      <p>Thank you for getting in touch. Your enquiry has reached me and I will
      reply personally within the next day or two.</p>
      ${when}
      <p>If anything else comes to mind before then, a photograph of mine you
      liked, a location, or a rough idea of how you picture it looking, just
      reply to this email. The more I know beforehand, the better I can use the
      time once we are actually shooting.</p>
      <p>Talk soon,<br>Mateja</p>
      <p style="color:#888;font-size:12px">vasojevich.com</p>`,
  };
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin === ALLOWED_ORIGIN) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.BREVO_API_KEY;
  // Not configured is not an error. The booking has already been delivered by
  // this point and must never be reported as failed because a courtesy email
  // could not go out.
  if (!key) return res.status(204).end();

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many requests' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid payload' });

  const email = clamp(body.email, 200);
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  const lang = body.lang === 'mk' ? 'mk' : 'en';
  const name = clamp(body.name, 80);
  const { subject, html } = buildEmail(lang, name, clamp(body.date, 40));

  const headers = { 'api-key': key, 'Content-Type': 'application/json', accept: 'application/json' };

  try {
    // Adding the contact first, so an automation set up on the list has
    // something to fire on. A failure here must not stop the email.
    const listId = Number(process.env.BREVO_LIST_ID);
    if (Number.isFinite(listId) && listId > 0) {
      await fetch(`${BREVO_API}/contacts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          listIds: [listId],
          updateEnabled: true,
          attributes: name ? { FIRSTNAME: name.split(/\s+/)[0] } : undefined,
        }),
      }).catch(() => {});
    }

    const send = await fetch(`${BREVO_API}/smtp/email`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL || 'contact@vasojevich.com',
          name: process.env.BREVO_SENDER_NAME || 'Mateja Vasojevikj',
        },
        to: [{ email, name: name || undefined }],
        replyTo: {
          email: process.env.BREVO_SENDER_EMAIL || 'contact@vasojevich.com',
          name: process.env.BREVO_SENDER_NAME || 'Mateja Vasojevikj',
        },
        subject,
        htmlContent: `<!doctype html><html><body style="font-family:system-ui,sans-serif;line-height:1.6;color:#222">${html}</body></html>`,
      }),
    });

    if (!send.ok) {
      const detail = await send.text();
      console.error('thank-you: Brevo rejected the message', send.status, detail.slice(0, 300));
      return res.status(502).json({ error: 'Could not send the confirmation' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('thank-you: request to Brevo failed', err);
    return res.status(502).json({ error: 'Could not send the confirmation' });
  }
}
