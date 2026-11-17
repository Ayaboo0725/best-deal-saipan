// Shop filtering, URL-synced. Pure functions shared by the shop UI.
import type { LiteProduct } from './types';
import { buildIndex, search, type Index } from './fuzzy';

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name' | 'new' | 'sale';
export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'sale', label: 'On sale first' },
  { key: 'new', label: 'Newest' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
  { key: 'name', label: 'Name A–Z' },
];

/** Price slider stops (catalog runs from ~$2 to ~$1,400, heavily skewed low). */
export const PRICE_STOPS = [0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 300, 500, 750, 1000, 1500];

export type Filters = {
  collection: string;
  aisles: string[];
  brands: string[];
  min: number;
  max: number;
  stock: boolean;
  q: string;
  sort: SortKey;
  view: 'grid' | 'list';
};

const list = (v: string | null) => (v ? v.split(',').map((x) => x.trim()).filter(Boolean) : []);

export function parseFilters(sp: URLSearchParams | null): Filters {
  const g = (k: string) => sp?.get(k) ?? null;
  const sort = (g('sort') as SortKey) || 'featured';
  return {
    collection: g('collection') ?? '',
    aisles: list(g('aisle')),
    brands: list(g('brand')),
    min: Number(g('min') ?? 0) || 0,
    max: Number(g('max') ?? PRICE_STOPS[PRICE_STOPS.length - 1]) || PRICE_STOPS[PRICE_STOPS.length - 1],
    stock: g('stock') === '1',
    q: g('q') ?? '',
    sort: SORTS.some((s) => s.key === sort) ? sort : 'featured',
    view: g('view') === 'list' ? 'list' : 'grid',
  };
}

export function toQuery(f: Filters) {
  const sp = new URLSearchParams();
  if (f.collection) sp.set('collection', f.collection);
  if (f.aisles.length) sp.set('aisle', f.aisles.join(','));
  if (f.brands.length) sp.set('brand', f.brands.join(','));
  if (f.min > 0) sp.set('min', String(f.min));
  if (f.max < PRICE_STOPS[PRICE_STOPS.length - 1]) sp.set('max', String(f.max));
  if (f.stock) sp.set('stock', '1');
  if (f.q.trim()) sp.set('q', f.q.trim());
  if (f.sort !== 'featured') sp.set('sort', f.sort);
  if (f.view !== 'grid') sp.set('view', f.view);
  const s = sp.toString().replace(/%2C/g, ',');
  return s ? `?${s}` : '';
}

let cachedIndex: { src: LiteProduct[]; idx: Index } | null = null;
const indexFor = (products: LiteProduct[]) => {
  if (!cachedIndex || cachedIndex.src !== products) cachedIndex = { src: products, idx: buildIndex(products) };
  return cachedIndex.idx;
};

const discount = (p: LiteProduct) => (p.was ? 1 - p.price / p.was : 0);

/** Everything except aisle + brand (used for facet counts). */
export function baseFilter(products: LiteProduct[], f: Filters) {
  let out = products;
  if (f.q.trim()) {
    const hits = search(indexFor(products), f.q, 400);
    const order = new Map(hits.map((h, i) => [h.p.id, i]));
    out = out.filter((p) => order.has(p.id)).sort((a, b) => order.get(a.id)! - order.get(b.id)!);
  }
  if (f.collection) out = out.filter((p) => p.col === f.collection);
  if (f.stock) out = out.filter((p) => p.stock > 0);
  out = out.filter((p) => p.price >= f.min && p.price <= f.max);
  return out;
}

export function applyFilters(products: LiteProduct[], f: Filters) {
  let out = baseFilter(products, f);
  if (f.aisles.length) out = out.filter((p) => f.aisles.includes(p.aisle));
  if (f.brands.length) {
    const b = f.brands.map((x) => x.toLowerCase());
    out = out.filter((p) => b.includes(p.brand.toLowerCase()));
  }
  const searched = !!f.q.trim();
  const sorted = [...out];
  switch (f.sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'new':
      sorted.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew) || a.rank - b.rank);
      break;
    case 'sale':
      sorted.sort((a, b) => discount(b) - discount(a) || a.rank - b.rank);
      break;
    default:
      if (!searched) sorted.sort((a, b) => a.rank - b.rank);
  }
  return sorted;
}

export function countBy<T extends string>(items: LiteProduct[], key: (p: LiteProduct) => T) {
  const m = new Map<T, number>();
  for (const p of items) m.set(key(p), (m.get(key(p)) ?? 0) + 1);
  return m;
}
