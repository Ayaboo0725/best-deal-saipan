// Placeholder packshots ("photo" products) drawn at build time on a white tile.
// TODO(client): these stand in for the store's own product photos.
import { FONT_HEAD, FONT_MONO, FONT_SANS, esc, fitText, barcode, svgDoc, shade, luminance } from './common.mjs';

const W = 800;

// [body, accent/cap, label background, ink]
const BRAND = {
  Mobil: ['#1c1f26', '#d7262e', '#eef1f6', '#12306b'],
  Pureguard: ['#15532e', '#e3cf2f', '#f3f7ec', '#0f3d22'],
  Castrol: ['#0b6b3a', '#d7262e', '#f2f5f0', '#0b5a31'],
  Valvoline: ['#13294b', '#d7262e', '#f1f3f8', '#13294b'],
  Shell: ['#f2c318', '#d7262e', '#fff8dc', '#a3121a'],
  Havoline: ['#b3121a', '#1a1d24', '#f9f2f2', '#7a0c12'],
  STP: ['#c8102e', '#0b2d6b', '#f5f5f7', '#0b2d6b'],
  Lucas: ['#e9b912', '#1a1d24', '#fff9e0', '#1a1d24'],
  Marvel: ['#c8102e', '#f2c318', '#ffffff', '#8a0b1f'],
  Prestone: ['#f2c000', '#1f3a93', '#fff9dc', '#1f3a93'],
  Peak: ['#1f4fa3', '#e04b2a', '#eef3fb', '#163b7c'],
  Zerex: ['#1f7a32', '#f2c318', '#f0f7ee', '#145a24'],
  Toyota: ['#e4e5e8', '#d7262e', '#ffffff', '#b3121a'],
  "Bar's Leaks": ['#1f4fa3', '#f2c318', '#eef3fb', '#163b7c'],
  'Red Line': ['#c8102e', '#1a1d24', '#ffffff', '#8a0b1f'],
  CRC: ['#c8102e', '#1f3a93', '#f6f6f8', '#1f3a93'],
  'WD-40': ['#1f3a93', '#f2c318', '#f2f4fa', '#1f3a93'],
  Gunk: ['#1f7a32', '#f2c318', '#eef7ec', '#145a24'],
  Berryman: ['#c8102e', '#f2c318', '#ffffff', '#8a0b1f'],
  Chevron: ['#1f4fa3', '#d7262e', '#f2f5fb', '#163b7c'],
  'Sea Foam': ['#c8102e', '#e8e8ea', '#ffffff', '#8a0b1f'],
  'Liquid Wrench': ['#c8102e', '#1a1d24', '#ffffff', '#8a0b1f'],
  "PB B'laster": ['#e9b912', '#c8102e', '#fff9e0', '#8a0b1f'],
  Permatex: ['#f08a1c', '#1a1d24', '#fff4e6', '#7a3d06'],
  'Armor All': ['#1b2a5c', '#d9dbe0', '#f1f3f8', '#1b2a5c'],
  "Meguiar's": ['#1a1a1a', '#c9a227', '#f6f2e6', '#1a1a1a'],
  'Turtle Wax': ['#0b6b3a', '#f2c318', '#f0f7ee', '#0b5a31'],
  'Chemical Guys': ['#e44c8f', '#1a1a1a', '#fff0f6', '#8f1f52'],
  'Rain-X': ['#1f4fa3', '#f2c318', '#eef3fb', '#163b7c'],
  Simoniz: ['#c8102e', '#e8e8ea', '#ffffff', '#8a0b1f'],
  Mothers: ['#c9a227', '#1a1a1a', '#fbf5e3', '#5c4708'],
  'Simple Green': ['#1f7a32', '#e8e8ea', '#f0f7ee', '#145a24'],
  Clorox: ['#eef1f7', '#1f4fa3', '#ffffff', '#1f4fa3'],
  Lysol: ['#1f4fa3', '#d9dbe0', '#f2f5fb', '#163b7c'],
  'Pine-Sol': ['#e9b912', '#1f7a32', '#fff9e0', '#145a24'],
  Fabuloso: ['#7b3fb5', '#f2c318', '#f6f0fb', '#4b1f7a'],
  'Mr. Clean': ['#1f4fa3', '#f2c318', '#eef3fb', '#163b7c'],
  'Krud Kutter': ['#f08a1c', '#1a1d24', '#fff4e6', '#7a3d06'],
  Zep: ['#c8102e', '#1a1d24', '#ffffff', '#8a0b1f'],
  HTH: ['#1c1f26', '#d7262e', '#f2f2f4', '#1a1d24'],
  'Clorox Pool&Spa': ['#1f6fb5', '#eef1f7', '#ffffff', '#0f4f8a'],
  "Leslie's": ['#1f4fa3', '#5fe3f0', '#eef3fb', '#163b7c'],
  'In The Swim': ['#0b6f80', '#e8e8ea', '#ecf8fa', '#085563'],
  'Kem-Tek': ['#13294b', '#5fe3f0', '#f1f3f8', '#13294b'],
  Quikrete: ['#e9b912', '#c8102e', '#fff6cf', '#8a0b1f'],
  Sakrete: ['#c8102e', '#e8e8ea', '#ffffff', '#8a0b1f'],
  'Grip-Rite': ['#c8102e', '#1a1d24', '#ffffff', '#8a0b1f'],
  'Liquid Nails': ['#c8102e', '#e8e8ea', '#ffffff', '#8a0b1f'],
  DAP: ['#eef1f7', '#1f4fa3', '#ffffff', '#1f4fa3'],
  Gorilla: ['#1a1a1a', '#f08a1c', '#f3f3f3', '#1a1a1a'],
  '3M': ['#8e949c', '#d7262e', '#f4f4f6', '#1a1d24'],
  Henry: ['#1c1f26', '#1f4fa3', '#eef1f6', '#1f4fa3'],
  "Thompson's": ['#1f4fa3', '#f2c318', '#eef3fb', '#163b7c'],
  Husky: ['#f08a1c', '#1a1d24', '#fff4e6', '#1a1d24'],
  HDX: ['#8e949c', '#1a1d24', '#f4f4f6', '#1a1d24'],
  Philips: ['#0b4ea2', '#e8e8ea', '#eef3fb', '#0b4ea2'],
  GE: ['#1f4fa3', '#e8e8ea', '#eef3fb', '#163b7c'],
  Sylvania: ['#f08a1c', '#1a1d24', '#fff4e6', '#7a3d06'],
  'Feit Electric': ['#1f7a32', '#e8e8ea', '#f0f7ee', '#145a24'],
  Westinghouse: ['#13294b', '#f2c318', '#f1f3f8', '#13294b'],
  Energizer: ['#1a1a1a', '#8fd65c', '#f3f3f3', '#1a1a1a'],
  Leviton: ['#eef1f7', '#f08a1c', '#ffffff', '#1a1d24'],
  Eaton: ['#1f4fa3', '#e8e8ea', '#eef3fb', '#163b7c'],
  Woods: ['#f08a1c', '#1a1d24', '#fff4e6', '#1a1d24'],
  Ideal: ['#e9b912', '#c8102e', '#fff9e0', '#1a1d24'],
  Oregon: ['#f08a1c', '#1a1d24', '#fff4e6', '#1a1d24'],
  Echo: ['#f08a1c', '#2a2a2a', '#fff4e6', '#7a3d06'],
  'Miracle-Gro': ['#1f7a32', '#f2c318', '#f0f7ee', '#145a24'],
  Scotts: ['#1f7a32', '#e8e8ea', '#f0f7ee', '#145a24'],
  Ortho: ['#eef1f7', '#c8102e', '#ffffff', '#8a0b1f'],
  Spectracide: ['#eef1f7', '#1f7a32', '#ffffff', '#145a24'],
  Roundup: ['#1f7a32', '#f08a1c', '#f0f7ee', '#145a24'],
  Sevin: ['#e9b912', '#1f7a32', '#fff9e0', '#145a24'],
  'Briggs & Stratton': ['#1a1a1a', '#1f7a32', '#f3f3f3', '#1a1a1a'],
  'Sta-Bil': ['#c8102e', '#1a1a1a', '#ffffff', '#8a0b1f'],
  Husqvarna: ['#f08a1c', '#13294b', '#fff4e6', '#13294b'],
  'Poulan Pro': ['#1f7a32', '#1a1a1a', '#f0f7ee', '#145a24'],
  Iwatani: ['#eef1f7', '#c8102e', '#ffffff', '#1f3a93'],
  'Gas One': ['#c8102e', '#f2c318', '#ffffff', '#8a0b1f'],
  Ronson: ['#c8102e', '#1a1a1a', '#ffffff', '#8a0b1f'],
  Motul: ['#c8102e', '#1a1a1a', '#ffffff', '#8a0b1f'],
  DeWalt: ['#1a1a1a', '#f5c11a', '#fff7d6', '#1a1a1a'],
};

export function brandColors(brand, aisleLabel) {
  return BRAND[brand] || [aisleLabel[1], aisleLabel[2], '#f4f2ee', aisleLabel[0]];
}

function defs(c) {
  const [body, cap] = c;
  return `<defs>
<radialGradient id="bg" cx="0.5" cy="0.42" r="0.75"><stop offset="0" stop-color="#ffffff"/><stop offset="0.7" stop-color="#F1EEE8"/><stop offset="1" stop-color="#E6E1D8"/></radialGradient>
<linearGradient id="bd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${shade(body, -0.32)}"/><stop offset="0.16" stop-color="${shade(body, 0.14)}"/><stop offset="0.42" stop-color="${body}"/><stop offset="0.84" stop-color="${shade(body, -0.16)}"/><stop offset="1" stop-color="${shade(body, -0.38)}"/></linearGradient>
<linearGradient id="cp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${shade(cap, -0.35)}"/><stop offset="0.25" stop-color="${shade(cap, 0.18)}"/><stop offset="0.6" stop-color="${cap}"/><stop offset="1" stop-color="${shade(cap, -0.4)}"/></linearGradient>
<linearGradient id="gl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="gs" cx="0.38" cy="0.32" r="0.7"><stop offset="0" stop-color="#ffffff"/><stop offset="0.65" stop-color="#eef2f6"/><stop offset="1" stop-color="#cfd6df"/></radialGradient>
<filter id="sh" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="12"/></filter>
</defs>`;
}

const bg = (sw) =>
  `<rect width="${W}" height="${W}" fill="url(#bg)"/><ellipse cx="400" cy="684" rx="${sw}" ry="20" fill="#000" fill-opacity="0.2" filter="url(#sh)"/>`;

// ── Shapes: each returns { body, label: {x,y,w,h,rx} | circle, sw, tf? } ──
const SHAPES = {
  bottle: (c) => ({
    sw: 140,
    body: `<path fill-rule="evenodd" fill="url(#bd)" d="M330 255 L298 292 Q285 307 285 332 L285 626 Q285 662 321 662 L479 662 Q515 662 515 626 L515 300 Q515 255 470 255 Z M457 290 h32 a10 10 0 0 1 10 10 v50 a10 10 0 0 1 -10 10 h-32 a10 10 0 0 1 -10 -10 v-50 a10 10 0 0 1 10 -10 Z"/>
<rect x="318" y="210" width="56" height="52" fill="${shade(c[0], -0.2)}"/>
<rect x="305" y="150" width="82" height="66" rx="9" fill="url(#cp)"/>${ridges(312, 156, 380, 210, 8)}
<rect x="294" y="300" width="22" height="340" rx="11" fill="url(#gl)" opacity="0.5"/>`,
    label: { x: 300, y: 386, w: 200, h: 236, rx: 12 },
  }),
  jug: (c) => ({
    sw: 180,
    body: `<path fill-rule="evenodd" fill="url(#bd)" d="M268 262 L240 300 Q228 316 228 342 L228 628 Q228 666 266 666 L534 666 Q572 666 572 628 L572 310 Q572 262 524 262 Z M486 290 h40 a18 18 0 0 1 18 18 v50 a18 18 0 0 1 -18 18 h-40 a18 18 0 0 1 -18 -18 v-50 a18 18 0 0 1 18 -18 Z"/>
<rect x="268" y="214" width="72" height="56" fill="${shade(c[0], -0.2)}"/>
<rect x="255" y="160" width="98" height="62" rx="10" fill="url(#cp)"/>${ridges(263, 166, 346, 216, 9)}
<rect x="238" y="330" width="22" height="300" rx="11" fill="url(#gl)" opacity="0.45"/>`,
    label: { x: 250, y: 410, w: 300, h: 228, rx: 14 },
  }),
  pail: (c) => ({
    sw: 180,
    body: `<path d="M214 250 Q400 58 586 250" fill="none" stroke="#5b5f66" stroke-width="7"/>
<rect x="358" y="140" width="84" height="22" rx="11" fill="#22252b"/>
<path fill="url(#bd)" d="M218 236 L582 236 L552 664 Q550 676 538 676 L262 676 Q250 676 248 664 Z"/>
<rect x="204" y="214" width="392" height="36" rx="9" fill="url(#cp)"/>
<path d="M219 276 L581 276 L580 292 L220 292 Z" fill="${shade(c[0], -0.3)}"/>
<path d="M232 300 L252 300 L270 660 L262 660 Z" fill="#fff" fill-opacity="0.18"/>`,
    label: { x: 256, y: 330, w: 288, h: 268, rx: 10 },
  }),
  aerosol: (c) => ({
    sw: 110,
    body: `<path fill="url(#cp)" d="M334 224 L334 172 Q334 138 400 136 Q466 138 466 172 L466 224 Z"/>
<ellipse cx="400" cy="230" rx="44" ry="11" fill="#c9ccd2"/>
<path fill="url(#bd)" d="M322 268 Q322 240 352 232 Q400 222 448 232 Q478 240 478 268 L478 640 Q478 668 450 668 L350 668 Q322 668 322 640 Z"/>
<rect x="322" y="640" width="156" height="14" fill="${shade(c[0], -0.35)}"/>
<rect x="336" y="250" width="18" height="400" rx="9" fill="url(#gl)" opacity="0.55"/>`,
    label: { x: 322, y: 300, w: 156, h: 326, rx: 0 },
  }),
  trigger: (c) => ({
    sw: 130,
    body: `<path fill="url(#bd)" d="M332 352 Q332 330 360 326 L440 326 Q468 330 468 352 L486 420 Q492 440 492 470 L492 632 Q492 668 456 668 L344 668 Q308 668 308 632 L308 470 Q308 440 314 420 Z"/>
<rect x="360" y="292" width="80" height="42" rx="6" fill="url(#cp)"/>
<path fill="url(#cp)" d="M350 298 L350 238 Q350 198 392 192 L510 188 Q530 188 530 206 L530 238 Q530 252 514 254 L452 260 L452 298 Z"/>
<rect x="522" y="198" width="26" height="26" rx="5" fill="${shade(c[1], -0.45)}"/>
<path fill="${shade(c[1], -0.25)}" d="M440 260 Q472 264 478 302 Q480 320 470 324 Q460 324 458 308 Q454 286 436 274 Z"/>
<rect x="318" y="450" width="18" height="190" rx="9" fill="url(#gl)" opacity="0.5"/>`,
    label: { x: 324, y: 444, w: 152, h: 196, rx: 12 },
  }),
  bulb: (c) => ({
    sw: 190,
    body: `<path fill="${shade(c[0], 0.12)}" d="M240 330 L280 300 L600 300 L560 330 Z"/>
<path fill="${shade(c[0], -0.35)}" d="M560 330 L600 300 L600 640 L560 670 Z"/>
<rect x="240" y="330" width="320" height="340" fill="url(#bd)"/>
<path fill="url(#gs)" stroke="#c3cad4" stroke-width="3" d="M312 343 A128 128 0 1 1 488 343 Q470 372 456 402 L344 402 Q330 372 312 343 Z"/>
<path d="M372 300 L384 360 L400 312 L416 360 L428 300" fill="none" stroke="#f0b429" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
<ellipse cx="350" cy="210" rx="26" ry="42" fill="#fff" opacity="0.8" transform="rotate(-25 350 210)"/>
<rect x="346" y="400" width="108" height="66" rx="6" fill="#b9bec6"/>
${[0, 1, 2, 3].map((i) => `<rect x="346" y="${408 + i * 14}" width="108" height="5" fill="#8d939c"/>`).join('')}
<path d="M370 466 L430 466 L416 488 L384 488 Z" fill="#3a3d43"/>`,
    label: { x: 256, y: 498, w: 288, h: 156, rx: 8 },
  }),
  canister: (c, p) => {
    const multi = /pack/i.test(p.size);
    const can = (cx, dark, lbl) => `<rect x="${cx - 14}" y="176" width="28" height="28" rx="4" fill="#c9ccd2"/><rect x="${cx - 6}" y="160" width="12" height="18" rx="2" fill="#9aa0a8"/>
<path fill="${dark ? shade(c[0], -0.25) : 'url(#bd)'}" d="M${cx - 62} 250 Q${cx - 62} 202 ${cx} 198 Q${cx + 62} 202 ${cx + 62} 250 L${cx + 62} 644 Q${cx + 62} 664 ${cx + 42} 664 L${cx - 42} 664 Q${cx - 62} 664 ${cx - 62} 644 Z"/>
${dark ? `<rect x="${cx - 62}" y="320" width="124" height="70" fill="${shade(c[1], -0.2)}"/>` : ''}
${lbl ? `<rect x="${cx - 50}" y="232" width="16" height="410" rx="8" fill="url(#gl)" opacity="0.5"/>` : ''}`;
    return {
      sw: multi ? 230 : 110,
      body: multi ? can(278, true) + can(522, true) + can(400, false, true) : can(400, false, true),
      label: { x: 338, y: 300, w: 124, h: 320, rx: 0 },
    };
  },
  box: (c) => ({
    sw: 200,
    body: `<path fill="${shade(c[0], 0.14)}" d="M232 262 L300 214 L600 214 L532 262 Z"/>
<path fill="${shade(c[0], -0.38)}" d="M532 262 L600 214 L600 614 L532 662 Z"/>
<rect x="232" y="262" width="300" height="400" fill="url(#bd)"/>
<rect x="232" y="262" width="300" height="10" fill="#fff" fill-opacity="0.2"/>`,
    label: { x: 250, y: 300, w: 264, h: 330, rx: 8 },
  }),
  bag: (c) => ({
    sw: 170,
    body: `<path fill="url(#bd)" d="M262 178 L538 178 Q556 300 552 420 Q556 560 540 664 L260 664 Q244 560 248 420 Q244 300 262 178 Z"/>
<path fill="${shade(c[0], -0.3)}" d="${zigzag(262, 538, 166, 190)}"/>
<path fill="${shade(c[0], -0.3)}" d="${zigzag(260, 540, 652, 676)}"/>
<path d="M270 200 Q262 420 272 650" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="14"/>`,
    label: { x: 276, y: 246, w: 248, h: 340, rx: 10 },
  }),
  roll: (c) => ({
    sw: 220,
    body: `<path fill="url(#bd)" d="M190 330 L190 500 A210 74 0 0 0 610 500 L610 330 Z"/>
<ellipse cx="400" cy="330" rx="210" ry="74" fill="${shade(c[0], 0.18)}"/>
${[200, 180, 160, 140, 120].map((r) => `<ellipse cx="400" cy="330" rx="${r}" ry="${(r * 74) / 210}" fill="none" stroke="${shade(c[0], -0.2)}" stroke-opacity="0.35" stroke-width="2"/>`).join('')}
<ellipse cx="400" cy="330" rx="90" ry="32" fill="#c79f62"/>
<ellipse cx="400" cy="333" rx="72" ry="25" fill="#E9E5DE"/>`,
    label: { x: 246, y: 392, w: 308, h: 124, rx: 8 },
  }),
  tube: (c) => ({
    sw: 120,
    tf: 'rotate(-16 400 420)',
    body: `<g transform="rotate(-16 400 420)"><path d="M374 250 L392 112 L408 112 L426 250 Z" fill="#f2f2f2" stroke="#cfd3d8" stroke-width="2"/>
<rect x="360" y="234" width="80" height="24" rx="5" fill="#dfe2e6"/>
<rect x="334" y="252" width="132" height="392" rx="10" fill="url(#bd)"/>
<rect x="328" y="628" width="144" height="24" rx="6" fill="#9aa0a8"/>
<rect x="344" y="262" width="16" height="360" rx="8" fill="url(#gl)" opacity="0.5"/></g>`,
    label: { x: 342, y: 300, w: 116, h: 300, rx: 6 },
  }),
  tub: (c) => ({
    sw: 170,
    body: `<path fill="url(#bd)" d="M262 336 L538 336 L522 640 Q520 662 498 662 L302 662 Q280 662 278 640 Z"/>
<rect x="244" y="294" width="312" height="52" rx="10" fill="url(#cp)"/>
<rect x="252" y="338" width="296" height="8" fill="${shade(c[1], -0.4)}"/>`,
    label: { x: 290, y: 378, w: 220, h: 244, rx: 10 },
  }),
  spool: (c) => ({
    sw: 200,
    body: `<circle cx="400" cy="410" r="212" fill="url(#cp)"/>
<circle cx="400" cy="410" r="188" fill="url(#bd)"/>
${Array.from({ length: 11 }, (_, i) => `<circle cx="400" cy="410" r="${102 + i * 8}" fill="none" stroke="${shade(c[0], -0.3)}" stroke-opacity="0.3" stroke-width="2"/>`).join('')}
<circle cx="400" cy="410" r="98" fill="${shade(c[1], -0.5)}"/>`,
    circle: { cx: 400, cy: 410, r: 82 },
  }),
};

function ridges(x0, y0, x1, y1, step) {
  let s = '';
  for (let x = x0; x <= x1; x += step) s += `<rect x="${x}" y="${y0}" width="2" height="${y1 - y0}" fill="#000" fill-opacity="0.18"/>`;
  return s;
}

function zigzag(x0, x1, ya, yb) {
  let d = `M${x0} ${yb} `;
  let up = true;
  for (let x = x0; x <= x1; x += 14) {
    d += `L${x} ${up ? ya : yb} `;
    up = !up;
  }
  return d + `L${x1} ${yb} Z`;
}

function frontLabel(L, c, p, tf) {
  const [, accent, lb, ink] = c;
  const inkOnLb = luminance(lb) > 0.5 ? ink : '#ffffff';
  const bandH = Math.round(L.h * 0.2);
  const pad = Math.round(L.w * 0.08);
  const cx = L.x + L.w / 2;
  const specSize = Math.min(L.h * 0.3, (L.w * 0.86) / Math.max(2, p.spec.length * 0.5));
  const specW = Math.min(L.w * 0.86, p.spec.length * specSize * 0.5);
  let s = `<g${tf ? ` transform="${tf}"` : ''}>`;
  s += `<rect x="${L.x}" y="${L.y}" width="${L.w}" height="${L.h}" rx="${L.rx}" fill="${lb}"/>`;
  s += `<rect x="${L.x}" y="${L.y}" width="${L.w}" height="${bandH}" rx="${L.rx}" fill="${ink}"/>`;
  s += `<rect x="${L.x}" y="${L.y + bandH - Math.min(L.rx, bandH / 2)}" width="${L.w}" height="${Math.min(L.rx, bandH / 2)}" fill="${ink}"/>`;
  s += fitText(p.brand.toUpperCase(), { x: cx, y: L.y + bandH * 0.68, size: Math.min(bandH * 0.5, 30), maxWidth: L.w - pad * 2, family: FONT_SANS, ratio: 0.62, weight: 800, fill: lb, anchor: 'middle', spacing: 1 });
  s += `<rect x="${L.x}" y="${L.y + bandH}" width="${L.w}" height="${Math.max(4, L.h * 0.025)}" fill="${accent}"/>`;
  s += `<text x="${cx}" y="${(L.y + bandH + (L.h - bandH) * 0.52 + specSize * 0.36).toFixed(1)}" font-family="${esc(FONT_HEAD)}" font-size="${specSize.toFixed(1)}" font-weight="700" fill="${inkOnLb}" text-anchor="middle" textLength="${specW.toFixed(1)}" lengthAdjust="spacingAndGlyphs">${esc(p.spec)}</text>`;
  s += fitText(p.size.toUpperCase(), { x: cx, y: L.y + L.h - L.h * 0.08, size: Math.min(20, L.w * 0.1), maxWidth: L.w - pad * 2, family: FONT_MONO, ratio: 0.6, fill: inkOnLb, anchor: 'middle', opacity: 0.75, spacing: 2 });
  return s + '</g>';
}

function circleLabel(C, c, p) {
  const [, , lb, ink] = c;
  const specSize = Math.min(64, (C.r * 1.5) / Math.max(2, p.spec.length * 0.5));
  return `<circle cx="${C.cx}" cy="${C.cy}" r="${C.r}" fill="${lb}"/>
${fitText(p.brand.toUpperCase(), { x: C.cx, y: C.cy - C.r * 0.42, size: 18, maxWidth: C.r * 1.4, family: FONT_SANS, ratio: 0.62, weight: 800, fill: ink, anchor: 'middle' })}
<text x="${C.cx}" y="${(C.cy + specSize * 0.36).toFixed(1)}" font-family="${esc(FONT_HEAD)}" font-size="${specSize.toFixed(1)}" font-weight="700" fill="${ink}" text-anchor="middle">${esc(p.spec)}</text>
${fitText(p.size.toUpperCase(), { x: C.cx, y: C.cy + C.r * 0.62, size: 15, maxWidth: C.r * 1.3, family: FONT_MONO, ratio: 0.6, fill: ink, anchor: 'middle', opacity: 0.75 })}
<circle cx="${C.cx}" cy="${C.cy}" r="16" fill="#E9E5DE"/>`;
}

function backLabel(L, c, p, tf) {
  const [, , lb, ink] = c;
  const pad = Math.round(L.w * 0.09);
  let s = `<g${tf ? ` transform="${tf}"` : ''}>`;
  s += `<rect x="${L.x}" y="${L.y}" width="${L.w}" height="${L.h}" rx="${L.rx}" fill="${lb}"/>`;
  s += fitText('DIRECTIONS', { x: L.x + pad, y: L.y + pad + 12, size: Math.min(16, L.w * 0.08), maxWidth: L.w - pad * 2, family: FONT_MONO, ratio: 0.6, fill: ink, weight: 700, spacing: 2 });
  const lines = Math.max(3, Math.floor((L.h * 0.5) / 18));
  for (let i = 0; i < lines; i++) {
    const w = (L.w - pad * 2) * (0.55 + ((i * 37) % 40) / 100);
    s += `<rect x="${L.x + pad}" y="${L.y + pad + 30 + i * 16}" width="${w.toFixed(1)}" height="6" rx="3" fill="${ink}" fill-opacity="0.22"/>`;
  }
  const bw = Math.min(L.w - pad * 2, 200);
  const bh = Math.min(L.h * 0.28, 70);
  const bx = L.x + (L.w - bw) / 2;
  const by = L.y + L.h - bh - pad - 14;
  s += `<rect x="${bx - 8}" y="${by - 8}" width="${bw + 16}" height="${bh + 30}" fill="#fff"/>`;
  s += barcode(p.ean, { x: bx + 6, y: by, width: bw - 12, height: bh, digits: true, digitSize: Math.max(10, Math.min(14, bw / 15)) });
  return s + '</g>';
}

export function packshot(p, view = 'front') {
  const c = brandColors(p.brand, p.labelColors);
  const shape = (SHAPES[p.art] || SHAPES.box)(c, p);
  const zoom = (inner) => `<g transform="translate(400 430) scale(1.2) translate(-400 -430)">${inner}</g>`;
  let s = defs(c);
  if (view === 'front') {
    s += `<rect width="${W}" height="${W}" fill="url(#bg)"/>`;
    s += zoom(bg(shape.sw).replace(/<rect[^>]*\/>/, '') + shape.body + (shape.circle ? circleLabel(shape.circle, c, p) : frontLabel(shape.label, c, p, shape.tf)));
    return svgDoc(W, W, s, `${p.name}`);
  }
  // back view: mirrored silhouette, back panel with directions + barcode
  s += `<rect width="${W}" height="${W}" fill="url(#bg)"/>`;
  let inner = bg(shape.sw).replace(/<rect[^>]*\/>/, '') + `<g transform="translate(${W} 0) scale(-1 1)">${shape.body}</g>`;
  if (shape.circle) {
    inner += circleLabel(shape.circle, c, p);
  } else {
    const L = { ...shape.label, x: W - shape.label.x - shape.label.w };
    const tf = shape.tf ? shape.tf.replace('-16', '16') : '';
    inner += backLabel(L, c, p, tf);
  }
  s += zoom(inner);
  return svgDoc(W, W, s, `${p.name} — back`);
}
