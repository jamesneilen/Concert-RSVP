import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

interface RsvpEntry {
  id: string;
  timestamp: string;
  fullName: string;
  tier: string;
  guestCount: number;
  passCode: string;
  email: string;
  phone: string;
  seatingZone: string;
  prayerIntentions: string;
  photoUrl?: string;
  status: string;
}

// In-memory + persistent file storage
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'rsvps.json');
const CONFIG_FILE = path.resolve(DATA_DIR, 'config.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default initial sample entries for St Cletus Choir
const defaultRsvps: RsvpEntry[] = [
  {
    id: 'rsvp-1',
    timestamp: '10/18/2026, 4:15:20 PM',
    fullName: 'Dr. Eleanor Vance',
    tier: 'VIP Benefactor (Reserved)',
    guestCount: 2,
    passCode: 'CK-2026-XMAS-7821',
    email: 'e.vance@cameroon-health.org',
    phone: '+237 677 82 91 04',
    seatingZone: 'Reserved Center Nave • Pew A-14',
    prayerIntentions: 'For peace and blessings over Bamenda and families in Christ the King Parish.',
    photoUrl: '/assets/avatars/avatar_eleanor.jpg',
    status: 'Confirmed • Active',
  },
  {
    id: 'rsvp-2',
    timestamp: '10/19/2026, 11:32:05 AM',
    fullName: 'Pa Julius Fomuso',
    tier: 'Choir Alumni',
    guestCount: 4,
    passCode: 'CK-2026-XMAS-4190',
    email: 'j.fomuso@yahoo.com',
    phone: '+237 675 14 30 89',
    seatingZone: 'Alumni Choir Wing • Reserved Gallery',
    prayerIntentions: 'Thanksgiving for 30 years of choral fellowship.',
    photoUrl: '/assets/avatars/avatar_julius.jpg',
    status: 'Confirmed • Active',
  },
  {
    id: 'rsvp-3',
    timestamp: '10/19/2026, 6:48:19 PM',
    fullName: 'Sr. Beatrice Lum',
    tier: 'Clergy Guest (Honorary)',
    guestCount: 1,
    passCode: 'CK-2026-XMAS-9032',
    email: 'sr.beatrice@cathedral-diocese.org',
    phone: '+237 672 40 18 22',
    seatingZone: 'Honorary Sanctuary Chancel • Presbytery',
    prayerIntentions: 'For vocations and sacred music ministry in the North West Region.',
    photoUrl: '/assets/avatars/avatar_beatrice.jpg',
    status: 'Confirmed • Active',
  }
];

function loadRsvps(): RsvpEntry[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading rsvps.json:', err);
  }
  saveRsvps(defaultRsvps);
  return defaultRsvps;
}

function saveRsvps(entries: RsvpEntry[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing rsvps.json:', err);
  }
}

const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyjc64Hrj0__ptUfvGv-vOsN3Yj18iePH6qO1DkRh589-wiNDWrG4rNvcWT1AFM-6KWOw/exec';

function loadConfig(): { googleSheetWebhookUrl?: string } {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      if (parsed && parsed.googleSheetWebhookUrl) return parsed;
    }
  } catch (err) {
    console.error('Error reading config.json:', err);
  }
  return {
    googleSheetWebhookUrl: process.env.GOOGLE_SHEET_WEBHOOK_URL || DEFAULT_WEBHOOK_URL,
  };
}

function saveConfig(config: { googleSheetWebhookUrl?: string }) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing config.json:', err);
  }
}

let rsvps: RsvpEntry[] = loadRsvps();
let config = loadConfig();

// Forward entry to Google Sheet webhook if configured (Google Apps Script Web App)
async function forwardToGoogleSheetWebhook(entry: RsvpEntry): Promise<{
  success: boolean;
  status?: number;
  message?: string;
  error?: string;
  authRequired?: boolean;
  rawResponse?: string;
  details?: any;
}> {
  const webhookUrl = config.googleSheetWebhookUrl || process.env.GOOGLE_SHEET_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;
  if (!webhookUrl) return { success: false, error: 'No webhook URL configured' };

  try {
    const payload = {
      timestamp: entry.timestamp,
      fullName: entry.fullName,
      name: entry.fullName,
      tier: entry.tier,
      guestCount: entry.guestCount,
      guests: entry.guestCount,
      passCode: entry.passCode,
      code: entry.passCode,
      email: entry.email,
      phone: entry.phone,
      seatingZone: entry.seatingZone,
      prayerIntentions: entry.prayerIntentions,
      specialRequests: entry.prayerIntentions,
      status: entry.status,
    };

    // Google Apps Script Web Apps prefer text/plain for postData parsing without CORS preflight issues
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const isRedirectToLogin = res.url && res.url.includes('accounts.google.com');

    if (res.status === 401 || isRedirectToLogin) {
      console.warn(`[Google Sheet Webhook Auth Warning] Webhook returned HTTP ${res.status} or redirected to Google Sign-in. In Google Apps Script, make sure Deploy > Manage Deployments > 'Who has access' is set to 'Anyone'.`);
      return {
        success: false,
        status: res.status,
        authRequired: true,
        error: "Google Apps Script deployment requires setting 'Who has access' to 'Anyone' in Deploy > Manage Deployments.",
      };
    }

    const text = await res.text();
    let parsed: any = null;
    try {
      parsed = JSON.parse(text);
    } catch (_) {}

    if (res.ok) {
      if (parsed && parsed.result === 'error') {
        console.warn(`[Google Sheet Error Response]`, parsed.message || text);
        return {
          success: false,
          status: res.status,
          error: parsed.message || 'Google Apps Script reported an error',
          rawResponse: text,
        };
      }
      console.log(`[Google Sheet] Synced RSVP for ${entry.fullName}:`, text.slice(0, 100));
      return {
        success: true,
        status: res.status,
        message: 'Synced to Google Sheet',
        details: parsed || text,
      };
    } else {
      console.warn(`[Google Sheet] Webhook returned status ${res.status}:`, text.substring(0, 200));
      return { success: false, status: res.status, error: text.substring(0, 200) };
    }
  } catch (err: any) {
    console.warn('[Google Sheet] Webhook forward error:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

// REST API Endpoints
// 1. GET /api/rsvps - retrieve all registered attendees
app.get('/api/rsvps', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: rsvps.length,
    totalSeats: rsvps.reduce((acc, curr) => acc + (curr.guestCount || 1), 0),
    rsvps,
    hasWebhook: !!(config.googleSheetWebhookUrl || process.env.GOOGLE_SHEET_WEBHOOK_URL || DEFAULT_WEBHOOK_URL),
    webhookUrl: config.googleSheetWebhookUrl || DEFAULT_WEBHOOK_URL,
  });
});

// 2. POST /api/webhook/test - test Google Apps Script connectivity
app.post('/api/webhook/test', async (_req: Request, res: Response) => {
  const testEntry: RsvpEntry = {
    id: `test-${Date.now()}`,
    timestamp: new Date().toLocaleString(),
    fullName: 'Webhook Test Entry',
    tier: 'VIP Benefactor',
    guestCount: 1,
    passCode: 'CK-TEST-DIAG',
    email: 'test@example.com',
    phone: '+237 672 668 334',
    seatingZone: 'Center Nave',
    prayerIntentions: 'Testing Google Sheet sync connection',
    status: 'Confirmed',
  };
  const result = await forwardToGoogleSheetWebhook(testEntry);
  res.json({
    webhookUrl: config.googleSheetWebhookUrl || DEFAULT_WEBHOOK_URL,
    result,
  });
});

// 2b. POST /api/rsvps/sync-all - push all registered patrons to Google Sheet
app.post('/api/rsvps/sync-all', async (_req: Request, res: Response) => {
  const syncResults = [];
  for (const entry of rsvps) {
    const resSync = await forwardToGoogleSheetWebhook(entry);
    syncResults.push({ name: entry.fullName, passCode: entry.passCode, success: resSync.success, error: resSync.error });
  }
  res.json({
    success: true,
    message: `Attempted sync of ${rsvps.length} entries to Google Sheet.`,
    total: rsvps.length,
    synced: syncResults.filter((r) => r.success).length,
    details: syncResults,
  });
});

// 3. POST /api/rsvp - submit new patron RSVP & update the sheet
app.post('/api/rsvp', async (req: Request, res: Response) => {
  const {
    fullName,
    tier,
    guestCount,
    passCode,
    email,
    phone,
    seatingZone,
    prayerIntentions,
    photoUrl,
  } = req.body;

  if (!fullName) {
    res.status(400).json({ error: 'Attendee full name is required.' });
    return;
  }

  const newEntry: RsvpEntry = {
    id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toLocaleString(),
    fullName: String(fullName).trim(),
    tier: tier || 'VIP Benefactor',
    guestCount: parseInt(String(guestCount || 1), 10),
    passCode: passCode || `CK-2026-XMAS-${Math.floor(1000 + Math.random() * 9000)}`,
    email: email ? String(email).trim() : 'N/A',
    phone: phone ? String(phone).trim() : 'N/A',
    seatingZone: seatingZone || 'Main Sanctuary Nave',
    prayerIntentions: prayerIntentions ? String(prayerIntentions).trim() : 'None',
    photoUrl: photoUrl || '',
    status: 'Confirmed • Active',
  };

  // Check if updating existing by passCode or adding new
  const existingIdx = rsvps.findIndex((r) => r.passCode === newEntry.passCode);
  if (existingIdx >= 0) {
    rsvps[existingIdx] = newEntry;
  } else {
    rsvps.unshift(newEntry);
  }

  saveRsvps(rsvps);

  // Trigger sync to Google Sheet webhook
  const webhookResult = await forwardToGoogleSheetWebhook(newEntry);

  res.status(200).json({
    success: true,
    message: webhookResult.success
      ? `Attendee ${newEntry.fullName} recorded & synced to Google Sheet registry!`
      : `Attendee ${newEntry.fullName} recorded in attendee registry.${webhookResult.authRequired ? " Note: Google Sheet permissions require 'Who has access: Anyone' in Apps Script." : ""}`,
    entry: newEntry,
    count: rsvps.length,
    totalSeats: rsvps.reduce((acc, curr) => acc + (curr.guestCount || 1), 0),
    webhookResult,
  });
});

// 3. GET /api/rsvps/export.csv - download formatted CSV for Google Sheets / Excel
app.get('/api/rsvps/export.csv', (_req: Request, res: Response) => {
  const headers = [
    'Timestamp',
    'Full Name',
    'Patron Tier',
    'Seats Reserved',
    'Pass Code',
    'Email Address',
    'WhatsApp / Phone',
    'Seating Zone',
    'Special Petitions & Requests',
    'Admission Status'
  ];

  const escapeCsv = (val: string | number) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = rsvps.map((r) => [
    escapeCsv(r.timestamp),
    escapeCsv(r.fullName),
    escapeCsv(r.tier),
    r.guestCount || 1,
    escapeCsv(r.passCode),
    escapeCsv(r.email),
    escapeCsv(r.phone),
    escapeCsv(r.seatingZone),
    escapeCsv(r.prayerIntentions),
    escapeCsv(r.status),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename="St_Cletus_Choir_Christmas_2026_RSVP_Registry.csv"'
  );
  res.send(csvContent);
});

// 4. GET /api/settings - get configuration
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json({
    googleSheetWebhookUrl: config.googleSheetWebhookUrl || '',
    isConfigured: !!config.googleSheetWebhookUrl,
  });
});

// 5. POST /api/settings - update Google Sheet Webhook URL
app.post('/api/settings', (req: Request, res: Response) => {
  const { googleSheetWebhookUrl } = req.body;
  config.googleSheetWebhookUrl = String(googleSheetWebhookUrl || '').trim();
  saveConfig(config);
  res.json({
    success: true,
    message: 'Google Sheet webhook updated successfully.',
    isConfigured: !!config.googleSheetWebhookUrl,
  });
});

async function start() {
  // Serve public static assets (images, avatars, audio)
  app.use('/assets', express.static(path.resolve(process.cwd(), 'public/assets')));
  app.use('/audio', express.static(path.resolve(process.cwd(), 'public/audio')));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[St Cletus Server] Running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('[St Cletus Server] Failed to start:', err);
  process.exit(1);
});
