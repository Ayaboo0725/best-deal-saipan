// ─────────────────────────────────────────────────────────────────────────────
// Store settings. Everything marked TODO(client) is a placeholder that must be
// confirmed with Best Deal before launch (see README → "Content needed").
// ─────────────────────────────────────────────────────────────────────────────

export const STORE = {
  name: 'Best Deal',
  tagline: 'The best deals in the Marianas',
  // Small mono subline under the wordmark — unreadable in the source video [UNCLEAR].
  subline: 'Beach Road · Saipan',
  established: 'October 2014',
  since: 2014,

  address: {
    line1: 'Beach Road',
    line2: 'Garapan, Saipan, MP 96950',
    short: 'Beach Road, Garapan',
  },
  coords: { lat: 15.21, lng: 145.75, label: '15.21°N · 145.75°E' },
  timeZone: 'Pacific/Saipan', // ChST, UTC+10, no daylight saving

  // TODO(client): real phone / WhatsApp / Messenger / email
  phone: { display: '(670) 555-0142', tel: '+16705550142' },
  whatsapp: '16705550142',
  messenger: 'bestdealsaipan',
  email: '' as string, // shown on Contact when set

  // TODO(client): real store hours. 0 = Sunday … 6 = Saturday, 24h "HH:MM".
  hours: [
    { day: 0, open: '09:00', close: '17:00' },
    { day: 1, open: '08:00', close: '19:00' },
    { day: 2, open: '08:00', close: '19:00' },
    { day: 3, open: '08:00', close: '19:00' },
    { day: 4, open: '08:00', close: '19:00' },
    { day: 5, open: '08:00', close: '19:00' },
    { day: 6, open: '08:00', close: '19:00' },
  ] as { day: number; open: string | null; close: string | null }[],

  // TODO(client): delivery zones, fee and free-delivery threshold
  freeDeliveryThreshold: 75,
  deliveryFee: 10,
  deliveryNote: 'Island delivery across Saipan, usually next business day.',

  payments: ['Visa', 'Mastercard', 'Cash'],

  // TODO(client): real social profile URLs + Google Business link
  socials: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
  },
  maps: {
    embed: 'https://www.google.com/maps?q=Beach+Road,+Garapan,+Saipan&z=15&output=embed',
    directions: 'https://www.google.com/maps/dir/?api=1&destination=Beach+Road%2C+Garapan%2C+Saipan',
    reviews: 'https://www.google.com/maps/search/?api=1&query=Best+Deal+Beach+Road+Garapan+Saipan',
  },

  credit: { label: 'Pacific Nexus AI', url: '#' },
} as const;

export const NAV = [
  { href: '/shop/', label: 'Shop' },
  { href: '/shop/?collection=pureguard', label: 'Pureguard Products' },
  { href: '/contact/', label: 'Contact us' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/blog/', label: 'Blog' },
  { href: '/about/', label: 'About Us' },
] as const;

export const COLLECTIONS = [
  { slug: '', label: 'All' },
  { slug: 'pureguard', label: 'Pureguard Products' },
  { slug: 'shop', label: 'Shop' },
  { slug: 'home-garden', label: 'Home & Garden' },
] as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${STORE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
export const messengerLink = () => `https://m.me/${STORE.messenger}`;
