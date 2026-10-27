import type { IncomingMessage, ServerResponse } from 'node:http';

// Vercel discovers this function independently of the static Vite build.
export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse,
) {
  const reply = (status: number, body: object) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(body));
  };
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(405, { success: false, error: 'Method not allowed.' });
  }
  if (!String(req.headers?.['content-type'] || '').toLowerCase().startsWith('application/json')) {
    return reply(415, { success: false, error: 'Content-Type must be application/json.' });
  }
  let body: Record<string, unknown>;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
    if (Buffer.byteLength(JSON.stringify(body)) > 16384) {
      return reply(413, { success: false, error: 'RSVP payload is too large. Do not include photos.' });
    }
  } catch {
    return reply(400, { success: false, error: 'Invalid JSON body.' });
  }
  const limits: Record<string, number> = {
    fullName: 150, tier: 100, passCode: 100, email: 254,
    phone: 40, seatingZone: 200, prayerIntentions: 2000,
  };
  for (const [field, limit] of Object.entries(limits)) {
    if (body[field] !== undefined && (typeof body[field] !== 'string' || (body[field] as string).length > limit)) {
      return reply(400, { success: false, error: `Invalid ${field}; maximum length is ${limit}.` });
    }
  }
  if (typeof body.fullName !== 'string' || !body.fullName.trim()) {
    return reply(400, { success: false, error: 'Attendee full name is required.' });
  }
  // Require the browser's stable identifier; generating one here would duplicate retries.
  if (typeof body.passCode !== 'string' || !/^CK-2026-XMAS-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.passCode)) {
    return reply(400, { success: false, error: 'A valid reservation ID is required. Refresh the page before submitting.' });
  }
  const webhook = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  try {
    const url = new URL(webhook || '');
    if (url.protocol !== 'https:' || url.hostname !== 'script.google.com' || !url.pathname.endsWith('/exec')) throw new Error();
  } catch {
    return reply(503, { success: false, error: 'The spreadsheet connection is not configured. Please contact the organizers.' });
  }
  const guestCount = body.guestCount ?? 1;
  if (typeof guestCount !== 'number' || !Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20) {
    return reply(400, { success: false, error: 'Guest count must be an integer between 1 and 20.' });
  }
  const entry = {
    timestamp: new Date().toISOString(),
    fullName: body.fullName.trim(),
    tier: String(body.tier || 'VIP Benefactor'),
    guestCount,
    passCode: body.passCode,
    email: String(body.email || 'N/A'),
    phone: String(body.phone || 'N/A'),
    seatingZone: String(body.seatingZone || 'Main Sanctuary Nave'),
    prayerIntentions: String(body.prayerIntentions || 'None'),
    status: 'Confirmed • Active',
  };
  try {
    const upstream = await fetch(webhook!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    });
    if (!upstream.ok) throw new Error('Webhook HTTP failure');
    const result = await upstream.json();
    // Apps Script must confirm the write, rather than returning a login/error page.
    if (result.success !== true && result.status !== 'success') throw new Error('Webhook did not confirm save');
    return reply(200, { success: true, message: 'Your RSVP was saved to the spreadsheet.', entry });
  } catch {
    console.error('RSVP spreadsheet delivery failed; check Apps Script deployment access and response contract.');
    return reply(502, { success: false, error: 'The spreadsheet did not confirm your RSVP. Please contact the organizers before retrying.' });
  }
}
