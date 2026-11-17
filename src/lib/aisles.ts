// Client-safe catalog helpers.
import aislesRaw from '@/data/aisles.json';
import photosRaw from '@/data/photos.json';
import type { Aisle, LiteProduct } from './types';

/** Real photos found in public/products at build time (slug → view → path). */
const PHOTOS = photosRaw as unknown as Record<string, Partial<Record<'1' | '2', string>>>;

export const AISLES = aislesRaw as unknown as Aisle[];
export const aisleBySlug = (slug: string) => AISLES.find((a) => a.slug === slug);
export const aisleName = (slug: string) => aisleBySlug(slug)?.name ?? '';
export const TOTAL_PRODUCTS = AISLES.reduce((n, a) => n + a.count, 0);
export const STOCKED_AISLES = AISLES.filter((a) => a.stocked).length;

export const img = (slug: string, view: 1 | 2 | 3 = 1) => (view !== 3 && PHOTOS[slug]?.[String(view) as '1' | '2']) || `/generated/p/${slug}-${view}.svg`;

let litePromise: Promise<LiteProduct[]> | null = null;
/** Lazy-load the slim catalog (code-split into its own chunk). */
export function loadLite() {
  litePromise ??= import('@/data/catalog-lite.json').then((m) => (m.default ?? m) as unknown as LiteProduct[]);
  return litePromise;
}
