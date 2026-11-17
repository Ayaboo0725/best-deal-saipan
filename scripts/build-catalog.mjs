// Build step: turns data/*.mjs into the typed catalog the site reads, and
// renders every product image as a static SVG (labels + packshots).
//   src/data/catalog.json       full catalog (server-rendered pages)
//   src/data/catalog-lite.json  slim catalog (shop grid, search, quick view)
//   src/data/aisles.json        21 aisles with counts + featured product
//   public/generated/p/*.svg    3 views per product
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AISLES } from '../data/aisles.mjs';
import { PRODUCTS } from '../data/products.mjs';
import { rng, hash, eanCheck } from './svg/common.mjs';
import { labelFront, labelBack, labelDetail } from './svg/label.mjs';
import { packshot } from './svg/packshot.mjs';
import { palmsSprite } from './svg/palms.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outData = path.join(root, 'src', 'data');
const outImg = path.join(root, 'public', 'generated', 'p');

const slugify = (s) =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/\+/g, ' plus ').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const pad = (n, w) => String(n).padStart(w, '0');
const money = (n) => Math.round(n * 100) / 100;

const RELATED = {
  'engine-oil': ['auto-parts-cleaner', 'engine-coolant'],
  lighting: ['electrical-supplies', 'lighting'],
  'construction-supplies': ['power-tools', 'construction-supplies'],
  'pool-maintenance': ['pool-maintenance', 'all-purpose-cleaner'],
  'power-steering-fluid': ['brake-fluid', 'engine-oil'],
  'kitchen-appliances': ['butane-gas', 'kitchen-appliances'],
  'butane-gas': ['kitchen-appliances', 'butane-gas'],
  'engine-coolant': ['engine-oil', 'auto-parts-cleaner'],
  'electrical-supplies': ['lighting', 'electrical-supplies'],
  'lawn-garden': ['bar-chain-lubricant', 'lawn-garden'],
  'auto-parts-cleaner': ['car-cleans-protectant', 'engine-oil'],
  'power-tools': ['construction-supplies', 'power-tools'],
  airconditioning: ['electrical-supplies', 'airconditioning'],
  'car-cleans-protectant': ['auto-parts-cleaner', 'car-cleans-protectant'],
  'all-purpose-cleaner': ['car-cleans-protectant', 'all-purpose-cleaner'],
  'brake-fluid': ['auto-parts-cleaner', 'power-steering-fluid'],
  'bar-chain-lubricant': ['lawn-garden', 'engine-oil'],
};

const sizeLabel = (s) => (s === 'each' ? 'Each' : s.replace(/-pack$/, '-Pack'));

// ── 1. Products ──────────────────────────────────────────────────────────
const products = [];
const slugs = new Set();
let id = 0;
let pgCode = 68; // Pureguard codes P068…P097

for (const aisle of AISLES) {
  const rows = PRODUCTS[aisle.slug];
  if (!rows) continue;
  rows.forEach((row, i) => {
    const [brand, name, spec, art, sizeStr, opts = {}] = row;
    id += 1;
    const aa = pad(aisle.num, 2);
    const sku = `BD-${aa}-${pad(i + 1, 3)}`;
    let slug = slugify(name);
    if (slugs.has(slug)) slug = `${slug}-${id}`;
    slugs.add(slug);

    const sizes = sizeStr.split('|').map((s) => {
      const [size, price] = s.split(':');
      return { size, price: Number(price) };
    });
    const wasRatio = opts.was ? opts.was / sizes[0].price : 0;
    const variants = sizes.map((s, vi) => {
      const r = rng(hash(`${sku}|${s.size}`));
      const a = r();
      const b = r();
      let stock = a < 0.05 ? 0 : a < 0.15 ? 1 + Math.floor(b * 4) : 6 + Math.floor(b * 54);
      if ((opts.deal || opts.pop || opts.spot) && stock < 6) stock = 12 + Math.floor(b * 30);
      const vsku = sizes.length > 1 ? `${sku}-${vi + 1}` : sku;
      const d12 = `20${aa}${pad(i + 1, 3)}${vi + 1}${pad(hash(vsku) % 10000, 4)}`.slice(0, 12);
      const v = {
        id: vsku,
        size: sizeLabel(s.size),
        price: s.price,
        stock,
        sku: vsku,
        ean: d12 + eanCheck(d12),
      };
      if (wasRatio) v.was = money(Math.ceil(s.price * wasRatio * 20) / 20 - 0.0);
      if (vi === 0 && opts.was) v.was = opts.was;
      if (brand === 'Pureguard') v.code = `P${pad(pgCode++, 3)}`;
      return v;
    });

    const sizeNames = variants.map((v) => v.size);
    const sizeText = sizeNames[0] === 'Each' ? '' : sizeNames.length > 1 ? `, available in ${sizeNames.slice(0, -1).join(', ')} and ${sizeNames.at(-1)}` : ` (${sizeNames[0]})`;
    products.push({
      id,
      slug,
      sku,
      name,
      brand,
      spec,
      art,
      photo: art !== 'label',
      realPhoto: false,
      aisle: aisle.slug,
      aisleNum: aisle.num,
      aisleName: aisle.name,
      collection: brand === 'Pureguard' ? 'pureguard' : aisle.collection,
      variants,
      price: variants[0].price,
      was: variants[0].was,
      stock: variants.reduce((n, v) => n + v.stock, 0),
      isNew: Boolean(opts.new),
      deal: Boolean(opts.deal),
      pop: opts.pop || 0,
      spot: opts.spot || null,
      family: opts.family || null,
      grade: opts.grade || null,
      pg: opts.pg || null,
      pgName: opts.pgName || null,
      description: `${name}${sizeText}. Stocked on aisle ${aa} (${aisle.name}) at Best Deal on Beach Road, Garapan — pick it up at the counter or have it delivered across Saipan. ${aisle.blurb}`,
      compat: aisle.compat,
      labelColors: aisle.label,
    });
  });
}

// ── 2. Featured ranking ──────────────────────────────────────────────────
const popularAisles = new Set(AISLES.filter((a) => a.popular).map((a) => a.slug));
const score = (p) =>
  (p.pop ? 1000 - p.pop * 10 : 0) + (p.deal ? 500 : 0) + (p.isNew ? 160 : 0) + (p.was ? 120 : 0) + (p.spot ? 80 : 0) + (popularAisles.has(p.aisle) ? 40 : 0) + (p.photo ? 10 : 0) - p.id * 0.01;
[...products].sort((a, b) => score(b) - score(a)).forEach((p, i) => (p.rank = i + 1));

// ── 3. Frequently bought together ────────────────────────────────────────
const byAisle = {};
for (const p of products) (byAisle[p.aisle] ||= []).push(p);
for (const list of Object.values(byAisle)) list.sort((a, b) => a.rank - b.rank);
for (const p of products) {
  const picks = [];
  for (const a of RELATED[p.aisle] || []) {
    const pool = (byAisle[a] || []).filter((q) => q.id !== p.id && q.stock > 0 && !picks.includes(q.slug));
    if (pool.length) picks.push(pool[(p.id * 7) % Math.min(pool.length, 5)].slug);
  }
  p.fbt = picks.slice(0, 2);
}

// ── 4. Images ────────────────────────────────────────────────────────────
fs.rmSync(path.join(root, 'public', 'generated'), { recursive: true, force: true });
fs.mkdirSync(outImg, { recursive: true });
for (const p of products) {
  const view = { ...p, size: p.variants[0].size, ean: p.variants[0].ean };
  const files = p.art !== 'label'
    ? [packshot(view, 'front'), packshot(view, 'back'), labelDetail(view)]
    : [labelFront(view), labelBack(view), labelDetail(view)];
  files.forEach((svg, i) => fs.writeFileSync(path.join(outImg, `${p.slug}-${i + 1}.svg`), svg));
}
// Palm silhouettes for the intro / hero scene (one cached sprite).
fs.mkdirSync(path.join(root, 'public', 'generated', 'scene'), { recursive: true });
fs.writeFileSync(path.join(root, 'public', 'generated', 'scene', 'palms.svg'), palmsSprite());

// Real product photos: drop public/products/<slug>.(avif|webp|jpg|png) — and
// optionally <slug>-2.* for the alternate angle. They replace the artwork.
const photoDir = path.join(root, 'public', 'products');
const photos = {};
if (fs.existsSync(photoDir)) {
  const files = new Set(fs.readdirSync(photoDir));
  for (const p of products) {
    for (const v of [1, 2]) {
      const base = v === 1 ? p.slug : `${p.slug}-2`;
      const hit = ['avif', 'webp', 'jpg', 'jpeg', 'png'].map((e) => `${base}.${e}`).find((n) => files.has(n));
      if (hit) (photos[p.slug] ||= {})[v] = `/products/${hit}`;
    }
    if (photos[p.slug]?.[1]) {
      p.photo = true;
      p.realPhoto = true;
    }
  }
}

// ── 5. Aisles ────────────────────────────────────────────────────────────
const aisles = AISLES.map((a) => {
  const list = byAisle[a.slug] || [];
  const featured = list.find((p) => p.photo) || list[0];
  return {
    num: a.num,
    slug: a.slug,
    name: a.name,
    icon: a.icon,
    stocked: Boolean(a.stocked && list.length),
    popular: Boolean(a.popular),
    collection: a.collection,
    count: list.length,
    blurb: a.blurb,
    label: a.label,
    featured: featured ? { slug: featured.slug, name: featured.name, price: featured.price } : null,
  };
});

// ── 6. Write JSON ────────────────────────────────────────────────────────
fs.mkdirSync(outData, { recursive: true });
const full = products.map(({ labelColors, art, ...p }) => p);
const lite = products.map((p) => {
  const o = {
    id: p.id, slug: p.slug, sku: p.sku, name: p.name, brand: p.brand, spec: p.spec, aisle: p.aisle, col: p.collection,
    photo: p.photo, price: p.price, stock: p.stock, rank: p.rank,
    v: p.variants.map(({ ean, ...v }) => v),
  };
  if (p.was) o.was = p.was;
  if (p.isNew) o.isNew = true;
  if (p.deal) o.deal = true;
  if (p.pop) o.pop = p.pop;
  if (p.spot) o.spot = p.spot;
  if (p.pg) { o.pg = p.pg; o.pgName = p.pgName; }
  return o;
});
fs.writeFileSync(path.join(outData, 'catalog.json'), JSON.stringify(full));
fs.writeFileSync(path.join(outData, 'catalog-lite.json'), JSON.stringify(lite));
fs.writeFileSync(path.join(outData, 'aisles.json'), JSON.stringify(aisles, null, 1));
fs.writeFileSync(path.join(outData, 'photos.json'), JSON.stringify(photos));

// ── Sanity checks ────────────────────────────────────────────────────────
const stockedAisles = aisles.filter((a) => a.stocked).length;
const codes = products.flatMap((p) => p.variants.map((v) => v.code).filter(Boolean));
const mobil = products.filter((p) => /mobil/i.test(p.name)).length;
console.log(`catalog: ${products.length} products · ${aisles.length} aisles (${stockedAisles} stocked) · ${codes.length} Pureguard codes (${codes[0]}–${codes.at(-1)}) · ${mobil} Mobil · ${products.length * 3} SVGs`);
if (products.length !== 202) throw new Error(`Expected 202 products, got ${products.length}`);
if (stockedAisles !== 17) throw new Error(`Expected 17 stocked aisles, got ${stockedAisles}`);
