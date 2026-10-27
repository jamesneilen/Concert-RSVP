import { PatronPassData } from '../data/concertData';

export interface RsvpRecord {
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

export interface RsvpResponse {
  success: boolean;
  message?: string;
  count: number;
  totalSeats?: number;
  rsvps?: RsvpRecord[];
  entry?: RsvpRecord;
  hasWebhook?: boolean;
}

const LOCAL_STORAGE_BACKUP = 'st_cletus_rsvps_local_backup';

/**
 * Submits an RSVP to the backend spreadsheet registry (and local backup)
 */
export async function submitRsvpToSpreadsheet(patron: PatronPassData): Promise<{
  success: boolean;
  message: string;
  count: number;
}> {
  // Keep photos in the flyer only; never send base64 images to the function.
  const { photoUrl: _photo, confirmedAt: _confirmedAt, ...payload } = patron;

  // Prepare a local backup, persisted only after the server confirms the save.
  const existingLocal = getLocalRsvps();
  const newLocalItem: RsvpRecord = {
    id: `local-${Date.now()}`,
    timestamp: new Date().toLocaleString(),
    fullName: patron.fullName,
    tier: patron.tier,
    guestCount: patron.guestCount,
    passCode: patron.passCode,
    email: patron.email || 'N/A',
    phone: patron.phone || 'N/A',
    seatingZone: patron.seatingZone,
    prayerIntentions: patron.prayerIntentions || 'None',
    status: 'Confirmed • Active',
  };

  const filtered = existingLocal.filter((r) => r.passCode !== patron.passCode);
  const updatedLocal = [newLocalItem, ...filtered];
  // Submit to backend server endpoint /api/rsvp
  try {
    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(25000),
    });

    if (res.ok) {
      const data: RsvpResponse = await res.json();
      if (data.success !== true) throw new Error("RSVP was not saved.");
      try {
        localStorage.setItem(LOCAL_STORAGE_BACKUP, JSON.stringify(updatedLocal));
      } catch { /* A storage failure must not hide a confirmed server save. */ }
      return {
        success: true,
        message: data.message || `Recorded ${patron.fullName} in spreadsheet registry!`,
        count: data.count || updatedLocal.length,
      };
    }
    const failure = await res.json().catch(() => null);
    return { success: false, message: failure?.error || 'Your RSVP could not be saved. Please contact the organizers before retrying.', count: existingLocal.length };
  } catch (err) {
    console.warn('Backend /api/rsvp fetch failed, save was not confirmed:', err);
  }

  return {
    success: false,
    message: 'Your RSVP save could not be confirmed. Please contact the organizers before retrying.',
    count: existingLocal.length,
  };
}

/**
 * Retrieves all registered RSVPs from backend or local backup
 */
export async function fetchSpreadsheetRsvps(): Promise<{
  rsvps: RsvpRecord[];
  count: number;
  totalSeats: number;
  hasWebhook: boolean;
}> {
  try {
    const res = await fetch('/api/rsvps');
    if (res.ok) {
      const data: RsvpResponse = await res.json();
      if (data.rsvps && Array.isArray(data.rsvps)) {
        return {
          rsvps: data.rsvps,
          count: data.count,
          totalSeats: data.totalSeats || data.count,
          hasWebhook: !!data.hasWebhook,
        };
      }
    }
  } catch (err) {
    console.warn('Could not fetch from /api/rsvps, using local backup:', err);
  }

  const local = getLocalRsvps();
  return {
    rsvps: local,
    count: local.length,
    totalSeats: local.reduce((acc, curr) => acc + (curr.guestCount || 1), 0),
    hasWebhook: false,
  };
}

function getLocalRsvps(): RsvpRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BACKUP);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading local RSVPs:', e);
  }
  return [
    {
      id: 'rsvp-1',
      timestamp: '10/18/2026, 4:15:20 PM',
      fullName: 'Dr. Eleanor Vance',
      tier: 'VIP Benefactor (Reserved)',
      guestCount: 2,
      passCode: 'CK-2026-XMAS-7821',
      email: 'e.vance@cameroon-health.org',
      phone: '+237 675 360 863',
      seatingZone: 'Reserved Center Nave • Pew A-14',
      prayerIntentions: 'For peace and blessings over Bamenda and families in Christ the King Parish.',
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
      phone: '+237 672 668 334',
      seatingZone: 'Alumni Choir Wing • Reserved Gallery',
      prayerIntentions: 'Thanksgiving for 30 years of choral fellowship.',
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
      phone: '+237 675 360 863',
      seatingZone: 'Honorary Sanctuary Chancel • Presbytery',
      prayerIntentions: 'For vocations and sacred music ministry in the North West Region.',
      status: 'Confirmed • Active',
    }
  ];
}

/**
 * Generates and triggers CSV download for opening in Google Sheets or Excel
 */
export function downloadCsvSpreadsheet(rsvps: RsvpRecord[]) {
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
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'St_Cletus_Choir_Christmas_2026_RSVP_Registry.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
