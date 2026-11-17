// Auto-generated spec labels for products without a photo.
// Dark gradient colour-coded by aisle · brand in mono caps · huge spec headline · barcode strip.
import { FONT_MONO, FONT_SANS, esc, fitText, headline, wrap, barcode, svgDoc } from './common.mjs';

const W = 800;

function defs(c, flip = false) {
  const [a, b, glow] = c;
  return `<defs>
<linearGradient id="g" x1="${flip ? 1 : 0}" y1="0" x2="${flip ? 0 : 1}" y2="1"><stop offset="0" stop-color="${b}"/><stop offset="0.55" stop-color="${a}"/><stop offset="1" stop-color="#050506"/></linearGradient>
<radialGradient id="r" cx="${flip ? 0.15 : 0.85}" cy="0.08" r="0.75"><stop offset="0" stop-color="${glow}" stop-opacity="0.38"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>
<pattern id="p" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><rect width="1.2" height="14" fill="#fff" fill-opacity="0.045"/></pattern>
</defs>`;
}

function frame(c, flip) {
  return `${defs(c, flip)}<rect width="${W}" height="${W}" fill="url(#g)"/><rect width="${W}" height="${W}" fill="url(#r)"/><rect width="${W}" height="${W}" fill="url(#p)"/>
<rect x="26" y="26" width="${W - 52}" height="${W - 52}" rx="30" fill="none" stroke="#fff" stroke-opacity="0.14" stroke-width="2"/>`;
}

export function labelFront(p) {
  const c = p.labelColors;
  const accent = c[2];
  const hl = headline(p.spec, { x: 62, y: 0, maxWidth: 676, maxSize: 290, minSize: 110 });
  const baseY = 352 + hl.size * 0.36;
  const nameLines = wrap(p.name, 36, 2);
  let s = frame(c, false);
  s += fitText(p.brand.toUpperCase(), { x: 62, y: 104, size: 30, maxWidth: 440, family: FONT_MONO, ratio: 0.6, spacing: 5, fill: accent, weight: 700 });
  s += fitText(`AISLE ${String(p.aisleNum).padStart(2, '0')}`, { x: 738, y: 102, size: 22, maxWidth: 220, family: FONT_MONO, ratio: 0.6, spacing: 4, fill: '#F4EDE1', opacity: 0.6, anchor: 'end' });
  s += `<rect x="62" y="132" width="676" height="2" fill="#fff" fill-opacity="0.16"/>`;
  s += `<rect x="62" y="132" width="120" height="2" fill="${accent}"/>`;
  s += hl.svg.replace('y="0"', `y="${baseY.toFixed(1)}"`);
  nameLines.forEach((line, i) => {
    s += fitText(line, { x: 62, y: 566 + i * 40, size: 31, maxWidth: 676, family: FONT_SANS, ratio: 0.5, fill: '#F4EDE1', opacity: 0.86, weight: 600 });
  });
  s += `<rect x="62" y="648" width="292" height="104" rx="12" fill="#F4EDE1"/>`;
  s += barcode(p.ean, { x: 92, y: 660, width: 248, height: 66, digits: true, digitSize: 15 });
  s += fitText(`SIZE ${p.size.toUpperCase()}`, { x: 738, y: 690, size: 22, maxWidth: 340, family: FONT_MONO, ratio: 0.6, spacing: 3, fill: '#F4EDE1', anchor: 'end', opacity: 0.9 });
  s += fitText(`SKU ${p.sku}`, { x: 738, y: 730, size: 22, maxWidth: 340, family: FONT_MONO, ratio: 0.6, spacing: 3, fill: '#F4EDE1', anchor: 'end', opacity: 0.6 });
  return svgDoc(W, W, s, `${p.name} — ${p.spec}`);
}

export function labelBack(p) {
  const c = p.labelColors;
  const accent = c[2];
  let s = frame(c, true);
  s += fitText('SPECIFICATIONS', { x: 62, y: 104, size: 26, maxWidth: 440, family: FONT_MONO, ratio: 0.6, spacing: 6, fill: accent, weight: 700 });
  s += fitText(p.brand.toUpperCase(), { x: 738, y: 102, size: 22, maxWidth: 300, family: FONT_MONO, ratio: 0.6, spacing: 4, fill: '#F4EDE1', opacity: 0.6, anchor: 'end' });
  s += `<rect x="62" y="132" width="676" height="2" fill="#fff" fill-opacity="0.16"/>`;
  const rows = [
    ['SPEC', p.spec],
    ['SIZE', p.size.toUpperCase()],
    ['AISLE', `${String(p.aisleNum).padStart(2, '0')} · ${p.aisleName.toUpperCase()}`],
    ['SKU', p.sku],
  ];
  rows.forEach(([k, v], i) => {
    const y = 196 + i * 58;
    s += fitText(k, { x: 62, y, size: 22, maxWidth: 160, family: FONT_MONO, ratio: 0.6, spacing: 3, fill: '#F4EDE1', opacity: 0.55 });
    s += fitText(v, { x: 738, y, size: 26, maxWidth: 470, family: FONT_MONO, ratio: 0.6, spacing: 1, fill: '#F4EDE1', anchor: 'end', weight: 700 });
    s += `<rect x="62" y="${y + 20}" width="676" height="1" fill="#fff" fill-opacity="0.1"/>`;
  });
  s += `<rect x="62" y="452" width="676" height="290" rx="16" fill="#F4EDE1"/>`;
  s += barcode(p.ean, { x: 132, y: 488, width: 536, height: 196, digits: true, digitSize: 30 });
  return svgDoc(W, W, s, `${p.name} — barcode and specifications`);
}

export function labelDetail(p) {
  const c = p.labelColors;
  const accent = c[2];
  let s = frame(c, false);
  const hl = headline(p.spec, { x: 400, y: 0, maxWidth: 700, maxSize: 420, minSize: 140, anchor: 'middle' });
  const baseY = 400 + hl.size * 0.36;
  s += hl.svg.replace('y="0"', `y="${baseY.toFixed(1)}"`).replace('fill="#F4EDE1"', `fill="${accent}"`);
  s += fitText(p.brand.toUpperCase(), { x: 400, y: 150, size: 30, maxWidth: 600, family: FONT_MONO, ratio: 0.6, spacing: 8, fill: '#F4EDE1', anchor: 'middle', weight: 700 });
  s += fitText('BEST DEAL · BEACH ROAD · SAIPAN', { x: 400, y: 700, size: 20, maxWidth: 600, family: FONT_MONO, ratio: 0.6, spacing: 6, fill: '#F4EDE1', anchor: 'middle', opacity: 0.55 });
  return svgDoc(W, W, s, `${p.name} — ${p.spec} detail`);
}

export const labelEsc = esc;
