export type PatronTier =
  | 'General Admission (Free)'
  | 'VIP Benefactor (Reserved)'
  | 'Clergy Guest (Honorary)'
  | 'Choir Patron'
  | 'Choir Alumni';

export interface PatronTierInfo {
  id: PatronTier;
  label: string;
  seatingDefault: string;
}

export const PATRON_TIERS: PatronTierInfo[] = [
  {
    id: 'General Admission (Free)',
    label: 'General Admission (Free)',
    seatingDefault: 'Main Sanctuary Nave • Open Seating',
  },
  {
    id: 'VIP Benefactor (Reserved)',
    label: 'VIP Benefactor (Reserved)',
    seatingDefault: 'Reserved Center Nave • Pew A-14',
  },
  {
    id: 'Clergy Guest (Honorary)',
    label: 'Clergy Guest (Honorary)',
    seatingDefault: 'Honorary Sanctuary Chancel • Presbytery',
  },
  {
    id: 'Choir Patron',
    label: 'Choir Patron',
    seatingDefault: 'Patron Chancel Circle • Reserved Front Pews',
  },
  {
    id: 'Choir Alumni',
    label: 'Choir Alumni',
    seatingDefault: 'Alumni Choir Wing • Reserved Gallery',
  },
];

export interface PatronPassData {
  fullName: string;
  email: string;
  phone: string;
  tier: PatronTier;
  guestCount: number;
  seatingZone: string;
  passCode: string;
  photoUrl: string;
  confirmedAt?: string;
  prayerIntentions?: string;
}

export const INITIAL_PATRON: PatronPassData = {
  fullName: '',
  email: '',
  phone: '',
  tier: 'General Admission (Free)',
  guestCount: 1,
  seatingZone: 'Main Sanctuary Nave • Open Seating',
  passCode: 'RSVP-PREVIEW',
  photoUrl: '/assets/avatars/choir-rsvp-portrait.webp',
  prayerIntentions: '',
};

export const SAMPLE_AVATARS = [
  { name: 'Portrait 1', url: '/assets/avatars/choir-rsvp-portrait.webp' },
  { name: 'Portrait 2', url: '/assets/avatars/avatar_julius.jpg' },
  { name: 'Portrait 3', url: '/assets/avatars/avatar_beatrice.jpg' },
  { name: 'Portrait 4', url: '/assets/avatars/avatar_emmanuel.jpg' },
  { name: 'Portrait 5', url: '/assets/avatars/avatar_collette.jpg' },
];
