import type { IncomingMessage, ServerResponse } from 'node:http';

// Vercel runs this route independently of the local Express development server.
export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  const send = (status: number, body: object) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(body));
  };
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(405, { error: 'Use POST to submit an RSVP.' });
  }
  let body = req.body;
  try {
    if (typeof body === 'string') body = JSON.parse(body);
  } catch {
    return send(400, { error: 'Invalid RSVP data.' });
  }
  const { fullName, guestCount, passCode, tier, email, phone, seatingZone, prayerIntentions } = body || {};
  if (typeof fullName !== 'string' || !fullName.trim() || fullName.trim().length > 120) {
    return send(400, { error: 'Please enter your name (up to 120 characters).' });
  }
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
    return send(400, { error: 'Please choose between 1 and 10 guests.' });
  }
  if (typeof passCode !== 'string' || passCode.length > 80 || !passCode.trim()) {
    return send(400, { error: 'Please generate a valid RSVP pass.' });
  }
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbyjc64Hrj0__ptUfvGv-vOsN3Yj18iePH6qO1DkRh589-wiNDWrG4rNvcWT1AFM-6KWOw/exec';
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        timestamp: new Date().toISOString(), fullName: fullName.trim(), name: fullName.trim(),
        guestCount, guests: guestCount, passCode, code: passCode,
        tier: typeof tier === 'string' ? tier.slice(0, 80) : 'General Admission (Free)',
        email: typeof email === 'string' ? email.slice(0, 254) : '',
        phone: typeof phone === 'string' ? phone.slice(0, 80) : '',
        seatingZone: typeof seatingZone === 'string' ? seatingZone.slice(0, 200) : '',
        prayerIntentions: typeof prayerIntentions === 'string' ? prayerIntentions.slice(0, 2000) : '',
        status: 'Confirmed • Active',
      }),
    });
    const result = await response.json();
    if (!response.ok || !(result.result === 'success' || result.success === true)) {
      return send(502, { error: 'The RSVP registry could not confirm your reservation. Please try again or contact the choir.' });
    }
    return send(200, { success: true, message: 'Your RSVP is confirmed.', count: result.count ?? 0 });
  } catch {
    return send(502, { error: 'The RSVP registry is temporarily unavailable. Please try again or contact the choir.' });
  }
}
