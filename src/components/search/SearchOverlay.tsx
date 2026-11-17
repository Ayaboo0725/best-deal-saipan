'use client';
import Link from '@/components/ui/Link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { AISLES, TOTAL_PRODUCTS, img, loadLite, aisleName } from '@/lib/aisles';
import { buildIndex, highlight, search, type Index } from '@/lib/fuzzy';
import { useRecent, useUI } from '@/lib/store';
import { addToCart } from '@/lib/cart-actions';
import { money } from '@/lib/format';
import { whatsappLink } from '@/config/store';
import { useFocusTrap } from '@/lib/useFocusTrap';
import type { LiteProduct } from '@/lib/types';

export default function SearchOverlay() {
  const open = useUI((s) => s.searchOpen);
  const set = useUI((s) => s.set);
  const recent = useRecent((s) => s.queries);
  const pushRecent = useRecent((s) => s.push);
  const clearRecent = useRecent((s) => s.clear);
  const router = useRouter();
  const [products, setProducts] = useState<LiteProduct[] | null>(null);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  useFocusTrap(ref, open, inputRef);

  // Warm the catalog chunk when the browser is idle.
  useEffect(() => {
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const h = idle ? idle(() => loadLite()) : window.setTimeout(() => loadLite(), 2500);
    return () => {
      if (!idle) window.clearTimeout(h as number);
    };
  }, []);

  useEffect(() => {
    if (open && !products) loadLite().then(setProducts);
    if (open) setActive(0);
    if (!open) setQ('');
  }, [open, products]);

  const index: Index | null = useMemo(() => (products ? buildIndex(products) : null), [products]);
  const hits = useMemo(() => (index && q.trim() ? search(index, q, 40) : []), [index, q]);
  const popular = useMemo(() => (products ? products.filter((p) => p.pop).sort((a, b) => (a.pop ?? 0) - (b.pop ?? 0)) : []), [products]);
  const rows = q.trim() ? hits.map((h) => ({ p: h.p, ranges: h.ranges })) : popular.map((p) => ({ p, ranges: [] as [number, number][] }));

  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const close = () => set({ searchOpen: false });
  const go = (p: LiteProduct) => {
    if (q.trim()) pushRecent(q);
    close();
    router.push(`/product/${p.slug}/`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!rows.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % rows.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + rows.length) % rows.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const r = rows[active];
      if (r) go(r.p);
    }
  };

  const total = products?.length ?? TOTAL_PRODUCTS;
  const activeId = rows[active] ? `s-opt-${rows[active].p.id}` : undefined;

  return (
    <div ref={ref} className={`search ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Search products" inert={!open} data-lenis-prevent>
      <div className="wrap max-w-[1180px] pb-24 pt-6 md:pt-10">
        <div className="flex items-center justify-between">
          <span className="eyebrow">
            <span className="dot" /> Instant search
          </span>
          <button type="button" className="btn btn-glass btn-sm" onClick={close} aria-label="Close search">
            Esc <Icon name="close" size={16} />
          </button>
        </div>

        <div className="search__field mt-6 md:mt-10">
          <label htmlFor="search-input" className="sr-only">
            Search products
          </label>
          <input
            id="search-input"
            ref={inputRef}
            type="search"
            className="search__input"
            placeholder="Search products…"
            autoComplete="off"
            spellCheck={false}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={rows.length > 0}
            aria-controls="search-results"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="mono text-[11px] text-muted" aria-live="polite">
            {q.trim() ? (
              <>
                <b className="text-cream">{hits.length}</b> {hits.length === 1 ? 'result' : 'results'} in {total} products
              </>
            ) : (
              'Popular right now'
            )}
          </p>
          <p className="mono hidden text-[10.5px] text-muted md:block">↑ ↓ to move · Enter to open · Esc to close</p>
        </div>

        {!q.trim() && recent.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mono mr-1 text-[10.5px] text-muted">Recent</span>
            {recent.map((r) => (
              <button key={r} type="button" className="chip" onClick={() => setQ(r)}>
                <Icon name="clock" size={13} /> {r}
              </button>
            ))}
            <button type="button" className="mono text-[10.5px] text-muted underline-offset-4 hover:text-cream hover:underline" onClick={clearRecent}>
              Clear
            </button>
          </div>
        )}

        {!products ? (
          <ul className="mt-4 space-y-2" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="skel h-[78px] rounded-2xl" />
            ))}
          </ul>
        ) : rows.length ? (
          <ul id="search-results" ref={listRef} className="mt-4" role="listbox" aria-label="Search results">
            {rows.map(({ p, ranges }, i) => (
              <li
                key={p.id}
                id={`s-opt-${p.id}`}
                data-idx={i}
                role="option"
                aria-selected={i === active}
                className={`s-row ${i === active ? 'is-active' : ''}`}
                onMouseMove={() => setActive(i)}
              >
                <img src={img(p.slug)} alt="" width={58} height={58} loading="lazy" decoding="async" />
                <Link href={`/product/${p.slug}/`} className="min-w-0" onClick={(e) => { e.preventDefault(); go(p); }} tabIndex={-1}>
                  <span className="line-clamp-2 block text-[15px] font-semibold leading-snug">
                    {highlight(p.name, ranges).map(([t, m], k) => (m ? <mark key={k}>{t}</mark> : <span key={k}>{t}</span>))}
                  </span>
                  <span className="mono mt-1 block truncate text-[10.5px] text-muted">
                    {aisleName(p.aisle)} · {p.v.find((v) => v.code)?.code ?? p.sku}
                  </span>
                </Link>
                <span className="s-price price text-[15px]">{money(p.price)}</span>
                <button
                  type="button"
                  className="add-round"
                  aria-label={`Add ${p.name} to cart`}
                  disabled={p.v[0].stock <= 0}
                  onClick={(e) => addToCart(p, p.v[0], 1, { from: e.currentTarget.closest('li')?.querySelector('img'), mode: 'quick' })}
                >
                  <Icon name="bag" size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-3xl border border-line p-8 text-center">
            <p className="display text-[40px]">No results for “{q}”</p>
            <p className="body-copy mx-auto mt-2 max-w-md">Try a brand, a size or an aisle — or ask the counter. We can usually tell you in a minute whether it’s on the shelf.</p>
            <a className="btn btn-primary mt-6" href={whatsappLink(`Hi Best Deal! Do you have: ${q}?`)} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={18} /> Ask us on WhatsApp <Icon name="arrow-right" size={16} className="arrow" />
            </a>
          </div>
        )}

        <div className="mt-10">
          <p className="mono mb-3 text-[10.5px] text-muted">Browse aisles</p>
          <div className="flex flex-wrap gap-2">
            {AISLES.filter((a) => a.stocked).map((a) => (
              <Link key={a.slug} href={`/shop/?aisle=${a.slug}`} className="chip" onClick={close}>
                <Icon name={a.icon} size={14} /> {a.name} <span className="n">{a.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
