// Typo-tolerant product search with match highlighting.
// "mobile oil" → Mobil products on the Engine Oil aisle; "iwatni" → Iwatani.
import type { LiteProduct } from './types';
import { aisleName } from './aisles';

type Tok = { t: string; w: number; start: number; end: number; field: 'name' | 'other' };
export type Hit = { p: LiteProduct; score: number; ranges: [number, number][] };

const STOP = new Set(['the', 'and', 'for', 'of', 'a', 'an', 'with', 'in']);

export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '');

/** Same length as the input, so match ranges map back onto the display name. */
const normKeep = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

function tokenize(s: string, w: number, field: Tok['field']): Tok[] {
  const out: Tok[] = [];
  const n = normKeep(s);
  const re = /[a-z0-9][a-z0-9.\-/]*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(n))) {
    const raw = m[0].replace(/[.\-/]+$/, '');
    out.push({ t: raw, w, start: m.index, end: m.index + raw.length, field });
    const squashed = raw.replace(/[.\-/]/g, '');
    if (squashed !== raw) out.push({ t: squashed, w, start: m.index, end: m.index + raw.length, field });
    if (/[\-/]/.test(raw)) {
      let off = m.index;
      for (const part of raw.split(/[\-/]/)) {
        if (part.length > 1) out.push({ t: part, w: w * 0.9, start: off, end: off + part.length, field });
        off += part.length + 1;
      }
    }
  }
  return out;
}

function lev(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    let best = prev[0];
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
      if (prev[j] < best) best = prev[j];
    }
    if (best > max) return max + 1;
  }
  return prev[b.length];
}

const edits = (len: number) => (len <= 3 ? 0 : len <= 6 ? 1 : 2);

function scoreToken(q: string, t: string): number {
  if (t === q) return 1;
  if (t.startsWith(q)) return q.length === 1 ? 0.3 : 0.9;
  if (q.length >= 4 && q.startsWith(t) && t.length >= 4) return 0.75; // "mobile" → "mobil"
  if (q.length >= 3 && t.includes(q)) return 0.65;
  const e = edits(q.length);
  if (e) {
    const d = lev(q, t, e);
    if (d <= e) return 0.62 - d * 0.08;
    if (t.length > q.length) {
      const dp = lev(q, t.slice(0, q.length), e);
      if (dp <= e && q.length >= 4) return 0.5 - dp * 0.08;
    }
  }
  return 0;
}

export type Index = { p: LiteProduct; toks: Tok[] }[];

export function buildIndex(products: LiteProduct[]): Index {
  return products.map((p) => ({
    p,
    toks: [
      ...tokenize(p.name, 3, 'name'),
      ...tokenize(p.brand, 2.5, 'other'),
      ...tokenize(aisleName(p.aisle), 1.2, 'other'),
      ...tokenize(p.spec, 1.5, 'other'),
      ...tokenize(p.sku, 2, 'other'),
      ...p.v.flatMap((v) => (v.code ? tokenize(v.code, 2.5, 'other') : [])),
      ...p.v.flatMap((v) => tokenize(v.size, 0.8, 'other')),
    ],
  }));
}

export function search(index: Index, query: string, limit = 60): Hit[] {
  const qs = norm(query)
    .split(/[\s,]+/)
    .map((q) => q.replace(/^[.\-/]+|[.\-/]+$/g, ''))
    .filter((q) => q && !STOP.has(q));
  if (!qs.length) return [];
  const hits: Hit[] = [];
  const nq = norm(query).trim();
  for (const { p, toks } of index) {
    let total = 0;
    let matched = 0;
    const ranges: [number, number][] = [];
    for (const q of qs) {
      let best = 0;
      let bestTok: Tok | null = null;
      for (const tk of toks) {
        const s = scoreToken(q, tk.t) * tk.w;
        if (s > best) {
          best = s;
          bestTok = tk;
        }
      }
      if (best > 0) {
        matched++;
        total += best;
        if (bestTok && bestTok.field === 'name') {
          const exactPrefix = bestTok.t.startsWith(q) && normKeep(p.name).slice(bestTok.start, bestTok.start + q.length) === q;
          ranges.push([bestTok.start, exactPrefix ? bestTok.start + q.length : bestTok.end]);
        }
      }
    }
    const need = qs.length <= 2 ? qs.length : qs.length - 1;
    if (matched < need) continue;
    if (normKeep(p.name).includes(nq)) total += 2;
    total += (300 - p.rank) / 3000;
    hits.push({ p, score: total, ranges });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}

/** Merge overlapping ranges and split a string into [text, isMatch] parts. */
export function highlight(text: string, ranges: [number, number][]): [string, boolean][] {
  if (!ranges.length) return [[text, false]];
  const rs = [...ranges].sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const r of rs) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([...r]);
  }
  const out: [string, boolean][] = [];
  let i = 0;
  for (const [a, b] of merged) {
    if (a > i) out.push([text.slice(i, a), false]);
    out.push([text.slice(a, b), true]);
    i = b;
  }
  if (i < text.length) out.push([text.slice(i), false]);
  return out;
}
