// Line icons (24×24, 1.6 stroke). UI icons + one icon per aisle.
const P: Record<string, string> = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.2-3.6 4.2-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/>',
  orders: '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9M7.8 5.3l8.4 4.5"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"/>',
  'heart-fill': '<path fill="currentColor" d="M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"/>',
  bag: '<path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.4"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4"/>',
  'arrow-right': '<path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5"/>',
  'arrow-left': '<path d="M20 12H5M10.5 6.5 5 12l5.5 5.5"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8.5 7H17v8.5"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-left': '<path d="m15 6-6 6 6 6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  share: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  whatsapp: '<path d="M4 20.5 5.3 16A8.3 8.3 0 1 1 8.4 19z"/><path d="M9.2 8.3c.3-.4.7-.4 1-.1l.9 1.6c.2.3.1.6-.1.9l-.5.6a6 6 0 0 0 2.6 2.6l.6-.5c.3-.2.6-.3.9-.1l1.6.9c.3.2.3.7-.1 1-.6.6-1.4 1-2.3.8-2.6-.6-4.6-2.6-5.2-5.2-.2-.9.2-1.7.6-2.5z"/>',
  messenger: '<path d="M12 3.5c-4.8 0-8.5 3.5-8.5 8 0 2.5 1.2 4.7 3 6.1V21l2.9-1.6c.8.2 1.7.3 2.6.3 4.8 0 8.5-3.5 8.5-8s-3.7-8.2-8.5-8.2z"/><path d="m7.5 13.6 3-3.3 2.2 1.8 3.8-2.6-3 3.3-2.2-1.8z"/>',
  facebook: '<path d="M14 21v-7.5h2.6l.4-3H14V8.6c0-.9.3-1.5 1.6-1.5H17V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9v2.3H8.5v3H11V21"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
  flame: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.3 2.4-5.3 3.6-7.8.4 1.6 1.3 2.7 2.2 3.1C11 7 12.6 4.6 14.9 3c-.3 2.9 3.6 5.7 3.6 10.6 0 4.4-2.6 7.4-6.5 7.4z"/><path d="M12 21c-1.6 0-2.8-1.2-2.8-2.8 0-1.8 1.6-2.7 2.3-4.1.6 1 2.1 1.6 3.1 3.1.2.3.2.6.2 1 0 1.6-1.2 2.8-2.8 2.8z"/>',
  check: '<path d="m5 12.5 4.2 4.2L19 7"/>',
  truck: '<path d="M3 6.5h11v9.5H3zM14 9.5h3.8l3.2 3.4v3.1h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  store: '<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/><path d="M5.5 11.5V20h13v-8.5M10 20v-5h4v5"/>',
  card: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 9.5h18M6.5 15h4"/>',
  shield: '<path d="M12 3.5 19 6v5.5c0 4.3-3 7.8-7 9-4-1.2-7-4.7-7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  phone: '<path d="M5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 4.9 4.9l1.3-2 4 1.6V17a3 3 0 0 1-3 3A13 13 0 0 1 4 7a3 3 0 0 1 1-3z"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  list: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><circle cx="4.8" cy="6.5" r="1"/><circle cx="4.8" cy="12" r="1"/><circle cx="4.8" cy="17.5" r="1"/>',
  home: '<path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z"/>',
  chat: '<path d="M4.5 18.5V6.8a2.3 2.3 0 0 1 2.3-2.3h10.4a2.3 2.3 0 0 1 2.3 2.3v7.4a2.3 2.3 0 0 1-2.3 2.3H8.5z"/><path d="M8.5 9.5h7M8.5 12.5h4.5"/>',
  trash: '<path d="M5 7h14M10 4h4M7 7l.8 12.2a1.5 1.5 0 0 0 1.5 1.3h5.4a1.5 1.5 0 0 0 1.5-1.3L17 7"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  tag: '<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.4 1.4 0 0 1 0 2l-6.6 6.6a1.4 1.4 0 0 1-2 0z"/><circle cx="8" cy="8" r="1.5"/>',
  wrench: '<path d="M15.6 4.2a4.5 4.5 0 0 0-5.3 5.9l-6.1 6.1a1.9 1.9 0 0 0 2.7 2.7l6.1-6.1a4.5 4.5 0 0 0 5.9-5.3l-2.6 2.6-2.4-.3-.3-2.4z"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>',
  star: '<path d="m12 3.8 2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8z"/>',
  zoom: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5M11 8.5v5M8.5 11h5"/>',
  sparkle: '<path d="M12 3.5 13.8 10l6.7 2-6.7 2L12 20.5 10.2 14l-6.7-2 6.7-2z"/><path d="M19 3.5v3M17.5 5h3"/>',
  // aisles
  oil: '<path d="M3.5 11.5H7l2-2.5h6.2l1.6 1.6 4.2-1.6-4.6 5.6H5.5a2 2 0 0 1-2-2z"/><path d="M10.5 9V6.5h3V9M5.5 14.6V19h11v-4.4"/><path d="M20.3 15.5c0 .8-.5 1.3-1 1.3s-1-.5-1-1.3c0-.6 1-1.8 1-1.8s1 1.2 1 1.8z"/>',
  bulb: '<path d="M9 17.5h6M9.5 20.5h5M12 3.5a5.8 5.8 0 0 0-3.4 10.5c.6.5.9 1.1.9 1.9v1.6h5v-1.6c0-.8.3-1.4.9-1.9A5.8 5.8 0 0 0 12 3.5z"/>',
  brick: '<rect x="3" y="5" width="18" height="14" rx="1.2"/><path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 9.7v4.6M9 14.3V19M15 5v4.7"/>',
  wave: '<path d="M3 9c2 0 2-1.5 4.5-1.5S9.5 9 12 9s2-1.5 4.5-1.5S18.5 9 21 9M3 14c2 0 2-1.5 4.5-1.5S9.5 14 12 14s2-1.5 4.5-1.5S18.5 14 21 14M3 19c2 0 2-1.5 4.5-1.5S9.5 19 12 19s2-1.5 4.5-1.5S18.5 19 21 19"/>',
  steering: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.2"/><path d="M3.8 10.5c2.6-.9 5.4-.9 8.2-.9s5.6 0 8.2.9M10.3 13.6 8.4 20M13.7 13.6l1.9 6.4"/>',
  pot: '<path d="M4.5 10h15v6.5a3.5 3.5 0 0 1-3.5 3.5H8a3.5 3.5 0 0 1-3.5-3.5z"/><path d="M2.5 10h2M19.5 10h2M6 7h12M10 7V5.5h4V7"/>',
  thermo: '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 16.5V9M17 6h3M17 9h2M17 12h3"/>',
  clip: '<path d="M8 7v9a4 4 0 0 0 8 0V6.5a2.8 2.8 0 0 0-5.6 0V16a1.6 1.6 0 0 0 3.2 0V8"/>',
  plug: '<path d="M9 3.5V8M15 3.5V8M6.5 8h11v3a5.5 5.5 0 0 1-11 0zM12 16.5V21"/>',
  leaf: '<path d="M5 19c0-8 5.5-14 15-14 0 9.5-6 15-14 15M5 19c3-4 6-6.5 10-8.5"/>',
  spray: '<path d="M8 9.5h6.5V21H8zM9.5 9.5V6.5h3.5v3M9 6.5V4h6l1.5 2"/><path d="M18.5 5h1.5M18.5 8.2l1.2.7M18.5 1.8l1.2-.7"/>',
  drill: '<path d="M4 7h11.5a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H11l-1.5 8h-4L7 12H4z"/><path d="M17.5 9.5h3M20.5 8v3"/>',
  snow: '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/><path d="m9.5 4.5 2.5 2 2.5-2M9.5 19.5l2.5-2 2.5 2"/>',
  car: '<path d="M4 15.5V12l2-4.5a2 2 0 0 1 1.8-1.2h8.4A2 2 0 0 1 18 7.5l2 4.5v3.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M4 12h16"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/>',
  disc: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 6v.01M18 12v.01M12 18v.01M6 12v.01"/><path d="M16.5 3.8a9.5 9.5 0 0 1 3.7 4"/>',
  chain: '<rect x="2.5" y="9" width="10.5" height="6" rx="3"/><rect x="11" y="9" width="10.5" height="6" rx="3"/>',
  ball: '<circle cx="12" cy="12" r="8.5"/><path d="M5 6.5c3 1.5 4.5 5 4 11M19 6.5c-3 1.5-4.5 5-4 11M3.5 12h17"/>',
  faucet: '<path d="M4 10.5h9a4 4 0 0 1 4 4V16h3v-1.5a7 7 0 0 0-7-7H11V5.5H8.5v2H4z"/><path d="M8 3.5h4M18.5 19v1.5"/>',
  roller: '<rect x="3.5" y="4" width="14" height="5" rx="1.5"/><path d="M17.5 6.5H20v5h-9v3"/><rect x="9.5" y="14.5" width="3" height="6" rx="1"/>',
};

export type IconName = keyof typeof P | string;

export default function Icon({ name, size = 20, className, strokeWidth = 1.6, label }: { name: IconName; size?: number; className?: string; strokeWidth?: number; label?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: P[name] ?? P.tag }}
    />
  );
}
