'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartLine } from './types';

const storage = createJSONStorage(() => {
  try {
    const k = '__bd';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return localStorage;
  } catch {
    const mem = new Map<string, string>();
    return {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    };
  }
});

// ── Cart (persisted) ────────────────────────────────────────────────────
type CartState = {
  lines: CartLine[];
  add: (line: Omit<CartLine, 'qty' | 'key'>, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (line, qty = 1) =>
        set((s) => {
          const key = `${line.slug}::${line.variantId}`;
          const existing = s.lines.find((l) => l.key === key);
          if (existing) {
            return { lines: s.lines.map((l) => (l.key === key ? { ...l, qty: Math.min(l.max, l.qty + qty) } : l)) };
          }
          return { lines: [...s.lines, { ...line, key, qty: Math.min(line.max, qty) }] };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.key !== key) : s.lines.map((l) => (l.key === key ? { ...l, qty: Math.min(l.max, qty) } : l)),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
    }),
    { name: 'bd-cart', storage, skipHydration: true, version: 1 },
  ),
);

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0);
export const cartTotal = (lines: CartLine[]) => Math.round(lines.reduce((n, l) => n + l.qty * l.price, 0) * 100) / 100;

// ── Wishlist (persisted) ────────────────────────────────────────────────
type WishState = { slugs: string[]; toggle: (slug: string) => void };
export const useWish = create<WishState>()(
  persist(
    (set) => ({
      slugs: [],
      toggle: (slug) => set((s) => ({ slugs: s.slugs.includes(slug) ? s.slugs.filter((x) => x !== slug) : [slug, ...s.slugs] })),
    }),
    { name: 'bd-wish', storage, skipHydration: true },
  ),
);

// ── Recent searches (persisted) ─────────────────────────────────────────
type RecentState = { queries: string[]; push: (q: string) => void; clear: () => void };
export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      queries: [],
      push: (q) => {
        const t = q.trim();
        if (t.length < 2) return;
        set((s) => ({ queries: [t, ...s.queries.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 5) }));
      },
      clear: () => set({ queries: [] }),
    }),
    { name: 'bd-recent', storage, skipHydration: true },
  ),
);

// ── UI (not persisted) ──────────────────────────────────────────────────
export type Toast = { id: number; title: string; slug: string } | null;
type UIState = {
  hydrated: boolean;
  cartOpen: boolean;
  searchOpen: boolean;
  aislesOpen: boolean;
  menuOpen: boolean;
  quickView: string | null;
  toast: Toast;
  bump: number;
  set: (p: Partial<Omit<UIState, 'set' | 'closeAll'>>) => void;
  closeAll: () => void;
};
export const useUI = create<UIState>()((set) => ({
  hydrated: false,
  cartOpen: false,
  searchOpen: false,
  aislesOpen: false,
  menuOpen: false,
  quickView: null,
  toast: null,
  bump: 0,
  set: (p) => set(p),
  closeAll: () => set({ cartOpen: false, searchOpen: false, aislesOpen: false, menuOpen: false, quickView: null }),
}));

export const anyOverlayOpen = (s: UIState) => s.cartOpen || s.searchOpen || s.menuOpen || !!s.quickView || s.aislesOpen;
