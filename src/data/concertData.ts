export interface RepertoireItem {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  tag: string;
  tagType: 'gold' | 'mint' | 'crimson' | 'muted';
  composer: string;
  description: string;
  lyricsSnippet?: string;
}

export type PatronTier =
  | 'General Admission (Free)'
  | 'VIP Benefactor (Reserved)'
  | 'Clergy Guest (Honorary)'
  | 'Choir Patron'
  | 'Choir Alumni';

export interface PatronTierInfo {
  id: PatronTier;
  label: string;
  badgeStyle: string;
  seatingDefault: string;
  description: string;
}

export const PATRON_TIERS: PatronTierInfo[] = [
  {
    id: 'General Admission (Free)',
    label: 'General Admission (Free)',
    badgeStyle: 'bg-[#313632] text-[#dfe4de] border border-[#e9c349]/30',
    seatingDefault: 'Main Sanctuary Nave • Open Seating',
    description: 'Complimentary admission for all parish faithful and community visitors.',
  },
  {
    id: 'VIP Benefactor (Reserved)',
    label: 'VIP Benefactor (Reserved)',
    badgeStyle: 'bg-[#e9c349] text-[#3c2f00] font-bold shadow-sm',
    seatingDefault: 'Reserved Center Nave • Pew A-14',
    description: 'Reserved prime seating honoring distinguished concert benefactors and donors.',
  },
  {
    id: 'Clergy Guest (Honorary)',
    label: 'Clergy Guest (Honorary)',
    badgeStyle: 'bg-[#8b0014] text-[#dfe4de] border border-[#ffb3ae]/40 font-bold',
    seatingDefault: 'Honorary Sanctuary Chancel • Presbytery',
    description: 'Honorary chancel seating reserved for Priests, Religious, and diocesan guests.',
  },
  {
    id: 'Choir Patron',
    label: 'Choir Patron',
    badgeStyle: 'bg-[#af8d11] text-[#0a0f0c] border border-[#ffe088]/60 font-bold shadow-sm',
    seatingDefault: 'Patron Chancel Circle • Reserved Front Pews',
    description: 'Special reserved seating honoring devoted sponsors and friends of St. Cletus Choir.',
  },
  {
    id: 'Choir Alumni',
    label: 'Choir Alumni',
    badgeStyle: 'bg-[#1f4a3c] text-[#a3d0be] border border-[#a3d0be]/40 font-bold',
    seatingDefault: 'Alumni Choir Wing • Reserved Gallery',
    description: 'Special seating honoring former choristers and past members of St. Cletus Choir.',
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

export const REPERTOIRE_LIST: RepertoireItem[] = [
  {
    id: 'm1',
    num: 'I.',
    title: 'Sing Unto God',
    subtitle: 'from Judas Maccabaeus, By GFH',
    tag: 'Congregational & Choir',
    tagType: 'gold',
    composer: 'George Frideric Handel',
    description: 'A jubilant festive anthem of triumphant praise featuring organ thunder and trumpet fanfare.',
    lyricsSnippet: 'Sing unto God, and high affections raise, to crown this day with harmony and praise!'
  },
  {
    id: 'm2',
    num: 'II.',
    title: 'For Unto Us a Child Is Born',
    subtitle: 'By G.F Handel',
    tag: 'A Cappella Chancel',
    tagType: 'mint',
    composer: 'George Frideric Handel',
    description: 'Transcendent contrapuntal polyphony celebrating the prophecy of the Prince of Peace.',
    lyricsSnippet: 'For unto us a Child is born, unto us a Son is given: and the government shall be upon His shoulder...'
  },
  {
    id: 'm3',
    num: 'III.',
    title: 'The Coming of The Lord',
    subtitle: 'Antonio Vivaldi • Choristers with Baroque Chamber Ensemble',
    tag: 'Strings & Continuo',
    tagType: 'gold',
    composer: 'Antonio Vivaldi (Arr. J. Neilen)',
    description: 'Dynamic baroque strings weave together with the crystalline youth voices of Nacho Choristers.',
    lyricsSnippet: 'Gloria in excelsis Deo, et in terra pax hominibus bonae voluntatis.'
  },
  {
    id: 'm4',
    num: 'IV.',
    title: 'The Messiah',
    subtitle: 'Adolphe Adam • Tenor Solo • Pipe Organ Accompaniment',
    tag: 'Tenor Soloist & Chancel',
    tagType: 'crimson',
    composer: 'Adolphe Adam',
    description: 'A deeply moving tenor solo accompanied by the Christ the King historic sanctuary pipe organ.',
    lyricsSnippet: 'Long lay the world in sin and error pining, till He appeared and the soul felt its worth.'
  },
  {
    id: 'm5',
    num: 'V.',
    title: 'Mary Did You Know',
    subtitle: 'Pentatonix • All Sanctuary lights extinguished, choir surrounding Nave',
    tag: 'By Candlelight',
    tagType: 'gold',
    composer: 'Pentatonix',
    description: 'An evocative, haunting a cappella choral arrangement performed in solemn candlelight as choristers encircle the entire sanctuary nave, weaving rich multi-part harmonies into an intimate meditation on the Nativity.',
    lyricsSnippet: 'Mary, did you know that your baby boy would one day walk on water? Did you know that your baby boy would save our sons and daughters? This Child that you delivered will soon deliver you.'
  },
  {
    id: 'm6',
    num: 'VI.',
    title: 'For Unto Us a Child Is Born & Carol Climax',
    subtitle: 'Combined Choirs, Festival Brass, Organ & All Parish Faithful',
    tag: 'Grand Finale',
    tagType: 'crimson',
    composer: 'George Frideric Handel & Traditional Carols',
    description: 'The monumental climax of the concert: 80 voices, blazing brass, and sanctuary bells ringing in Christmas glory.',
    lyricsSnippet: 'For unto us a Child is born, unto us a Son is given: and the government shall be upon His shoulder!'
  }
];

export const INITIAL_PATRON: PatronPassData = {
  fullName: 'Dr. Eleanor Vance',
  email: 'e.vance@cameroon-health.org',
  phone: '+237 675 360 863',
  tier: 'VIP Benefactor (Reserved)',
  guestCount: 2,
  seatingZone: 'Reserved Center Nave • Pew A-14',
  passCode: 'CK-2026-XMAS-7821',
  photoUrl: '/assets/avatars/avatar_eleanor.jpg',
  prayerIntentions: 'For peace and blessings over Bamenda and families in Christ the King Parish.'
};

export const SAMPLE_AVATARS = [
  {
    name: 'Dr. Eleanor Vance',
    url: '/assets/avatars/avatar_eleanor.jpg'
  },
  {
    name: 'Pa Julius Fomuso',
    url: '/assets/avatars/avatar_julius.jpg'
  },
  {
    name: 'Sr. Beatrice Lum',
    url: '/assets/avatars/avatar_beatrice.jpg'
  },
  {
    name: 'Che Emmanuel',
    url: '/assets/avatars/avatar_emmanuel.jpg'
  },
  {
    name: 'Mbah Collette',
    url: '/assets/avatars/avatar_collette.jpg'
  }
];
