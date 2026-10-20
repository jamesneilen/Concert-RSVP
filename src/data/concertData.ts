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

export interface PatronPassData {
  fullName: string;
  email: string;
  phone: string;
  tier: 'VIP Benefactor' | 'General Nave' | 'Guild Alumni' | 'Clergy Guest' | 'Choir Patron';
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
    title: 'Waloyo Yamoni',
    subtitle: 'Franz Xaver Gruber • All Sanctuary lights extinguished, choir surrounding Nave',
    tag: 'By Candlelight',
    tagType: 'gold',
    composer: 'Christopher Tin / Arr. Traditional African Carols',
    description: 'We overcome the wind! A stunning African choral arrangement performed entirely by candlelight throughout the sanctuary nave.',
    lyricsSnippet: 'Waloyo yamoni, koro piny obed mot. (We overcome the wind, now the world is at peace).'
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
  phone: '+237 677 82 91 04',
  tier: 'VIP Benefactor',
  guestCount: 2,
  seatingZone: 'Reserved Center Nave • Pew A-14',
  passCode: 'CK-2026-XMAS-7821',
  photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  prayerIntentions: 'For peace and blessings over Bamenda and families in Christ the King Parish.'
};

export const SAMPLE_AVATARS = [
  {
    name: 'Dr. Eleanor Vance',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Pa Julius Fomuso',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Sr. Beatrice Lum',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Che Emmanuel',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  }
];
