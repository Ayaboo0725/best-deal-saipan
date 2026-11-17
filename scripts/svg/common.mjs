// Shared helpers for build-time SVG generation (labels + packshots).
// SVGs are used through <img>, so only system fonts are available.

export const FONT_HEAD = "Impact, Haettenschweiler, 'Arial Narrow Bold', 'Roboto Condensed', 'Arial Black', sans-serif";
export const FONT_MONO = "Consolas, Menlo, 'DejaVu Sans Mono', 'Courier New', monospace";
export const FONT_SANS = "'Segoe UI', 'Helvetica Neue', Roboto, Arial, sans-serif";

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Deterministic PRNG (mulberry32). */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Text that never overflows: estimate the natural width for the font and only
 * compress (textLength) when it would exceed maxWidth. `ratio` ≈ average glyph
 * width / font size for the font stack.
 */
export function fitText(text, { x, y, size, maxWidth, ratio = 0.56, anchor = 'start', fill = '#fff', family = FONT_SANS, weight = 400, spacing = 0, opacity = 1, extra = '' }) {
  const t = String(text);
  const natural = t.length * size * ratio + Math.max(0, t.length - 1) * spacing;
  const fit = natural > maxWidth ? ` textLength="${maxWidth.toFixed(1)}" lengthAdjust="spacingAndGlyphs"` : '';
  const ls = spacing ? ` letter-spacing="${spacing}"` : '';
  const op = opacity !== 1 ? ` fill-opacity="${opacity}"` : '';
  return `<text x="${x}" y="${y}" font-family="${esc(family)}" font-size="${size}" font-weight="${weight}" fill="${fill}"${op} text-anchor="${anchor}"${ls}${fit}${extra}>${esc(t)}</text>`;
}

/** Headline sized to fill the width, normalised across fonts with textLength. */
export function headline(text, { x, y, maxWidth, maxSize = 300, minSize = 90, fill = '#F4EDE1', anchor = 'start', ratio = 0.5, extra = '' }) {
  const t = String(text);
  const size = Math.max(minSize, Math.min(maxSize, maxWidth / (t.length * ratio)));
  const width = Math.min(maxWidth, t.length * size * ratio);
  return {
    size,
    svg: `<text x="${x}" y="${y}" font-family="${esc(FONT_HEAD)}" font-size="${size.toFixed(1)}" font-weight="700" fill="${fill}" text-anchor="${anchor}" textLength="${width.toFixed(1)}" lengthAdjust="spacingAndGlyphs"${extra}>${esc(t)}</text>`,
  };
}

/** Split a product name into ≤ maxLines lines of ~maxChars. */
export function wrap(text, maxChars, maxLines = 2) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/\s*\S*$/, '') + '…';
    return kept;
  }
  return lines;
}

// ── EAN-13 ────────────────────────────────────────────────────────────────
const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
const R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
const PARITY = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

export function eanCheck(d12) {
  let s = 0;
  for (let i = 0; i < 12; i++) s += Number(d12[i]) * (i % 2 ? 3 : 1);
  return String((10 - (s % 10)) % 10);
}

/** 95-module bit string for a 13-digit EAN. */
export function eanBits(ean) {
  const d = ean.split('').map(Number);
  const par = PARITY[d[0]];
  let bits = '101';
  for (let i = 1; i <= 6; i++) bits += (par[i - 1] === 'L' ? L : G)[d[i]];
  bits += '01010';
  for (let i = 7; i <= 12; i++) bits += R[d[i]];
  bits += '101';
  return bits;
}

/** Barcode bars as SVG rects. Guard bars extend lower. */
export function barcode(ean, { x, y, width, height, fill = '#0B0B0C', digits = true, digitFill = '#0B0B0C', digitSize = 22 }) {
  const bits = eanBits(ean);
  const m = width / 95;
  const guard = new Set([0, 1, 2, 45, 46, 47, 48, 49, 92, 93, 94]);
  let out = '';
  let i = 0;
  while (i < 95) {
    if (bits[i] === '1') {
      let j = i;
      while (j < 95 && bits[j] === '1') j++;
      const isGuard = guard.has(i);
      const h = digits ? (isGuard ? height : height - digitSize * 0.9) : height;
      out += `<rect x="${(x + i * m).toFixed(2)}" y="${y}" width="${((j - i) * m).toFixed(2)}" height="${h.toFixed(1)}" fill="${fill}"/>`;
      i = j;
    } else i++;
  }
  if (digits) {
    const ty = y + height + 2;
    const t = (s, cx) => `<text x="${cx.toFixed(1)}" y="${ty}" font-family="${esc(FONT_MONO)}" font-size="${digitSize}" fill="${digitFill}" text-anchor="middle">${s}</text>`;
    out += t(ean[0], x - m * 5);
    out += t(ean.slice(1, 7), x + m * 24);
    out += t(ean.slice(7), x + m * 71);
  }
  return out;
}

export function svgDoc(w, h, body, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img"><title>${esc(title)}</title>${body}</svg>`;
}

export function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = (c) => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  r = f(r); g = f(g); b = f(b);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

export function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
