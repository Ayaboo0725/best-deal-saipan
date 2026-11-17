// Catalog access for SERVER components only (prerendered pages).
// Never import this from a 'use client' file — client code uses ./aisles.ts
// and lazy-loads catalog-lite.json, so the full catalog stays out of bundles.
import full from '@/data/catalog.json';
import liteRaw from '@/data/catalog-lite.json';
import aislesRaw from '@/data/aisles.json';
import type { Aisle, LiteProduct, Product } from './types';

export const PRODUCTS = full as unknown as Product[];
export const LITE = liteRaw as unknown as LiteProduct[];
export const AISLES = aislesRaw as unknown as Aisle[];

const bySlug = new Map(PRODUCTS.map((p) => [p.slug, p]));
const liteBySlug = new Map(LITE.map((p) => [p.slug, p]));

export const getProduct = (slug: string) => bySlug.get(slug);
export const getLite = (slug: string) => liteBySlug.get(slug);
export const getAisle = (slug: string) => AISLES.find((a) => a.slug === slug);

export const featured = () => [...LITE].sort((a, b) => a.rank - b.rank);
export const deals = () => LITE.filter((p) => p.deal).slice(0, 4);
export const popular = () => LITE.filter((p) => p.pop).sort((a, b) => (a.pop ?? 0) - (b.pop ?? 0));
export const spotlight = (key: string) => LITE.filter((p) => p.spot === key);
export const byAisle = (slug: string) => LITE.filter((p) => p.aisle === slug).sort((a, b) => a.rank - b.rank);
export const pureguard = () => LITE.filter((p) => p.col === 'pureguard');

export function family(p: Product) {
  if (!p.family) return [];
  return PRODUCTS.filter((q) => q.family === p.family).map((q) => ({ slug: q.slug, grade: q.grade ?? q.spec }));
}
