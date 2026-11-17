'use client';
import Link from '@/components/ui/Link';
import { useSearchParams } from 'next/navigation';
import { Suspense, startTransition, useEffect, useMemo, useRef, useState } from 'react';
import liteRaw from '@/data/catalog-lite.json';
import Icon from '@/components/ui/Icon';
import ProductCard from '@/components/product/ProductCard';
import { AISLES, aisleBySlug } from '@/lib/aisles';
import { COLLECTIONS } from '@/config/store';
import { PRICE_STOPS, SORTS, applyFilters, baseFilter, countBy, parseFilters, toQuery, type Filters, type SortKey } from '@/lib/shop';
import { money } from '@/lib/format';
import { useFocusTrap } from '@/lib/useFocusTrap';
import type { LiteProduct } from '@/lib/types';

const PRODUCTS = liteRaw as unknown as LiteProduct[];
const PAGE = 40;
const FIRST = 10;
const MAXP = PRICE_STOPS[PRICE_STOPS.length - 1];
const BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort((a, b) => a.localeCompare(b));

function nearestStop(v: number) {
  let best = 0;
  PRICE_STOPS.forEach((s, i) => {
    if (Math.abs(s - v) < Math.abs(PRICE_STOPS[best] - v)) best = i;
  });
  return best;
}

function FilterPanel({ f, update, base }: { f: Filters; update: (p: Partial<Filters>) => void; base: LiteProduct[] }) {
  const [showAllBrands, setShowAllBrands] = useState(false);
  const aisleCounts = useMemo(() => countBy(base, (p) => p.aisle), [base]);
  const brandCounts = useMemo(() => countBy(base, (p) => p.brand), [base]);
  const brandList = useMemo(() => {
    const sorted = [...BRANDS].sort((a, b) => (brandCounts.get(b) ?? 0) - (brandCounts.get(a) ?? 0) || a.localeCompare(b));
    const selected = sorted.filter((b) => f.brands.some((x) => x.toLowerCase() === b.toLowerCase()));
    const rest = sorted.filter((b) => !selected.includes(b));
    const all = [...selected, ...rest];
    return showAllBrands ? all : all.slice(0, Math.max(10, selected.length));
  }, [brandCounts, f.brands, showAllBrands]);
  const lo = nearestStop(f.min);
  const hi = nearestStop(f.max);
  const toggle = (arr: string[], v: string) => (arr.some((x) => x.toLowerCase() === v.toLowerCase()) ? arr.filter((x) => x.toLowerCase() !== v.toLowerCase()) : [...arr, v]);

  return (
    <div>
      <div className="f-group !pt-0">
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <span className="text-[14px] font-semibold">In stock only</span>
          <input type="checkbox" className="toggle" checked={f.stock} onChange={(e) => update({ stock: e.target.checked })} />
        </label>
      </div>
      <fieldset className="f-group">
        <legend className="contents">
          <h3>Price range</h3>
        </legend>
        <div className="mb-3 flex items-center justify-between font-mono text-[13px]">
          <span>{money(PRICE_STOPS[lo]).replace('.00', '')}</span>
          <span>{hi === PRICE_STOPS.length - 1 ? `${money(PRICE_STOPS[hi]).replace('.00', '')}+` : money(PRICE_STOPS[hi]).replace('.00', '')}</span>
        </div>
        <div className="range">
          <div className="range__track" />
          <div className="range__fill" style={{ left: `${(lo / (PRICE_STOPS.length - 1)) * 100}%`, right: `${100 - (hi / (PRICE_STOPS.length - 1)) * 100}%` }} />
          <input
            type="range"
            min={0}
            max={PRICE_STOPS.length - 1}
            step={1}
            value={lo}
            aria-label="Minimum price"
            aria-valuetext={money(PRICE_STOPS[lo])}
            onChange={(e) => update({ min: PRICE_STOPS[Math.min(Number(e.target.value), hi - 1)] })}
          />
          <input
            type="range"
            min={0}
            max={PRICE_STOPS.length - 1}
            step={1}
            value={hi}
            aria-label="Maximum price"
            aria-valuetext={money(PRICE_STOPS[hi])}
            onChange={(e) => update({ max: PRICE_STOPS[Math.max(Number(e.target.value), lo + 1)] })}
          />
        </div>
      </fieldset>
      <fieldset className="f-group">
        <legend className="contents">
          <h3>Aisle</h3>
        </legend>
        {AISLES.filter((a) => a.stocked).map((a) => {
          const n = aisleCounts.get(a.slug) ?? 0;
          return (
            <label key={a.slug} className={`check ${n === 0 && !f.aisles.includes(a.slug) ? 'is-disabled' : ''}`}>
              <input type="checkbox" checked={f.aisles.includes(a.slug)} onChange={() => update({ aisles: toggle(f.aisles, a.slug) })} />
              {a.name}
              <span className="n">{n}</span>
            </label>
          );
        })}
      </fieldset>
      <fieldset className="f-group">
        <legend className="contents">
          <h3>Brand</h3>
        </legend>
        {brandList.map((b) => {
          const n = brandCounts.get(b) ?? 0;
          const on = f.brands.some((x) => x.toLowerCase() === b.toLowerCase());
          return (
            <label key={b} className={`check ${n === 0 && !on ? 'is-disabled' : ''}`}>
              <input type="checkbox" checked={on} onChange={() => update({ brands: toggle(f.brands, b) })} />
              {b}
              <span className="n">{n}</span>
            </label>
          );
        })}
        <button type="button" className="mono mt-2 text-[11px] text-sun-1 hover:text-sun-2" onClick={() => setShowAllBrands((s) => !s)} aria-expanded={showAllBrands}>
          {showAllBrands ? 'Show fewer brands' : `Show all ${BRANDS.length} brands`}
        </button>
      </fieldset>
    </div>
  );
}

/** Reads the URL (client-only, renders nothing) and reports it to ShopView. */
function ParamsSync({ onChange }: { onChange: (qs: string) => void }) {
  const sp = useSearchParams();
  const qs = sp.toString();
  useEffect(() => onChange(qs), [qs, onChange]);
  return null;
}

/**
 * The grid is server-rendered with default filters and hydrated normally;
 * the URL's filters are applied right after hydration via ParamsSync.
 * (Calling useSearchParams here directly would make a static export throw
 * the whole grid away and re-render it on the client.)
 */
export function ShopView() {
  const [qsState, setQsState] = useState<string | null>(null);
  const params = useMemo(() => (qsState === null ? null : new URLSearchParams(qsState)), [qsState]);
  const f = useMemo(() => parseFilters(params), [params]);
  const [q, setQ] = useState(f.q);
  // First paint/hydration covers 10 cards; the rest of the first page renders
  // right after in a (time-sliced) transition.
  const [visible, setVisible] = useState(FIRST);
  useEffect(() => {
    startTransition(() => setVisible((v) => Math.max(v, PAGE)));
  }, []);
  const [loading, setLoading] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [sheetEver, setSheetEver] = useState(false);
  useEffect(() => {
    if (sheet) setSheetEver(true);
  }, [sheet]);
  const sheetRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const gridTop = useRef<HTMLDivElement>(null);
  useFocusTrap(sheetRef, sheet);

  const loadTimer = useRef(0);
  const navigate = (next: Filters) => {
    const url = `/shop/${toQuery(next)}`;
    window.history.replaceState(null, '', url);
    // Brief skeleton while the grid swaps (user-initiated changes only).
    setLoading(true);
    window.clearTimeout(loadTimer.current);
    loadTimer.current = window.setTimeout(() => setLoading(false), 260);
  };
  const update = (patch: Partial<Filters>) => navigate({ ...f, ...patch });

  useEffect(() => setQ(f.q), [f.q]);
  // Debounced live filter input → URL.
  useEffect(() => {
    if (q === f.q) return;
    const id = window.setTimeout(() => update({ q }), 220);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const key = toQuery({ ...f, view: 'grid' });
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setVisible(PAGE);
  }, [key]);

  const base = useMemo(() => baseFilter(PRODUCTS, { ...f, aisles: [], brands: [] }), [f]);
  const results = useMemo(() => applyFilters(PRODUCTS, f), [f]);
  const shown = results.slice(0, visible);

  const single = f.aisles.length === 1 ? aisleBySlug(f.aisles[0]) : null;
  const coll = COLLECTIONS.find((c) => c.slug === f.collection && c.slug);
  const title = single?.name ?? (f.brands.length === 1 ? f.brands[0] : coll ? coll.label : 'All products');
  const activeCount = f.aisles.length + f.brands.length + (f.stock ? 1 : 0) + (f.min > 0 || f.max < MAXP ? 1 : 0);
  const clearAll = () => navigate({ ...parseFilters(null), view: f.view, sort: f.sort });

  return (
    <>
      <Suspense fallback={null}>
        <ParamsSync onChange={setQsState} />
      </Suspense>
      <section className={`shop-hero ${qsState !== null ? 'is-synced' : ''}`}>
        <div className="wrap">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/shop/">Shop</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <p className="eyebrow mt-8">{single ? `Aisle ${String(single.num).padStart(2, '0')}` : 'Collection'}</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h1 className="display text-[clamp(56px,9vw,128px)]">{title}</h1>
            <p className="mono pb-3 text-[12px] text-muted">
              {results.length} {results.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          {single && <p className="body-copy mt-4 max-w-2xl">{single.blurb}</p>}
        </div>
      </section>

      <div className="toolbar">
        <div className="wrap flex flex-col gap-3 py-3 lg:flex-row lg:items-center">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label="Collections">
            {COLLECTIONS.map((c) => (
              <button key={c.slug || 'all'} type="button" className="chip" aria-pressed={f.collection === c.slug} onClick={() => update({ collection: c.slug })}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex flex-1 items-center gap-2 lg:justify-end">
            <label className="relative min-w-0 flex-1 lg:max-w-[320px]">
              <span className="sr-only">Filter products</span>
              <Icon name="search" size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input className="field !h-[42px] !rounded-full !pl-11" type="search" placeholder={`Filter ${PRODUCTS.length} products`} value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <label className="hidden sm:block">
              <span className="sr-only">Sort by</span>
              <select className="select" value={f.sort} onChange={(e) => update({ sort: e.target.value as SortKey })}>
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="hidden items-center rounded-full border border-line p-1 md:flex" role="group" aria-label="Layout">
              <button type="button" className={`icon-btn !h-8 !w-8 ${f.view === 'grid' ? 'bg-white/10' : ''}`} aria-pressed={f.view === 'grid'} aria-label="Grid view" onClick={() => update({ view: 'grid' })}>
                <Icon name="grid" size={16} />
              </button>
              <button type="button" className={`icon-btn !h-8 !w-8 ${f.view === 'list' ? 'bg-white/10' : ''}`} aria-pressed={f.view === 'list'} aria-label="List view" onClick={() => update({ view: 'list' })}>
                <Icon name="list" size={16} />
              </button>
            </div>
            <button type="button" className="btn btn-glass btn-sm lg:hidden" onClick={() => setSheet(true)} aria-haspopup="dialog">
              <Icon name="sliders" size={16} /> Filters{activeCount ? ` (${activeCount})` : ''}
            </button>
          </div>
        </div>
      </div>

      <div className={`shop-body wrap grid gap-10 pb-28 pt-8 lg:grid-cols-[250px_minmax(0,1fr)] ${qsState !== null ? 'is-synced' : ''}`}>
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-[calc(var(--hdr-h)+84px)] max-h-[calc(100vh-var(--hdr-h)-110px)] overflow-y-auto pr-2" data-lenis-prevent>
            <div className="mb-2 flex items-center justify-between">
              <span className="mono text-[11px] text-cream">Filters</span>
              {activeCount > 0 && (
                <button type="button" className="mono text-[11px] text-sun-1 hover:text-sun-2" onClick={clearAll}>
                  Clear all
                </button>
              )}
            </div>
            <FilterPanel f={f} update={update} base={base} />
          </div>
        </aside>

        <div ref={gridTop} className="min-w-0">
          <h2 className="sr-only">Products</h2>
          {(activeCount > 0 || f.q) && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {f.q && (
                <button type="button" className="chip" onClick={() => { setQ(''); update({ q: '' }); }}>
                  “{f.q}” <Icon name="close" size={13} />
                </button>
              )}
              {f.aisles.map((a) => (
                <button key={a} type="button" className="chip" onClick={() => update({ aisles: f.aisles.filter((x) => x !== a) })}>
                  {aisleBySlug(a)?.name ?? a} <Icon name="close" size={13} />
                </button>
              ))}
              {f.brands.map((b) => (
                <button key={b} type="button" className="chip" onClick={() => update({ brands: f.brands.filter((x) => x !== b) })}>
                  {b} <Icon name="close" size={13} />
                </button>
              ))}
              {f.stock && (
                <button type="button" className="chip" onClick={() => update({ stock: false })}>
                  In stock <Icon name="close" size={13} />
                </button>
              )}
              {(f.min > 0 || f.max < MAXP) && (
                <button type="button" className="chip" onClick={() => update({ min: 0, max: MAXP })}>
                  {money(f.min).replace('.00', '')}–{f.max >= MAXP ? 'any' : money(f.max).replace('.00', '')} <Icon name="close" size={13} />
                </button>
              )}
              <button type="button" className="mono ml-1 text-[11px] text-muted hover:text-cream" onClick={() => { setQ(''); clearAll(); }}>
                Clear all
              </button>
            </div>
          )}

          {loading ? (
            <div className={f.view === 'list' ? 'space-y-4' : 'pgrid pgrid--5'} aria-busy="true" aria-label="Loading products">
              {Array.from({ length: f.view === 'list' ? 6 : 10 }).map((_, i) =>
                f.view === 'list' ? (
                  <div key={i} className="skel h-[120px] rounded-2xl" />
                ) : (
                  <div key={i}>
                    <div className="skel aspect-square rounded-[20px]" />
                    <div className="skel mt-4 h-3 w-1/2" />
                    <div className="skel mt-2 h-4 w-full" />
                    <div className="skel mt-2 h-4 w-2/3" />
                  </div>
                ),
              )}
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-3xl border border-line p-10 text-center">
              <p className="display text-[44px]">Nothing matches — yet</p>
              <p className="body-copy mx-auto mt-3 max-w-md">Try removing a filter, or ask the counter — we can often order it in.</p>
              <button type="button" className="btn btn-primary mt-6" onClick={() => { setQ(''); clearAll(); }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className={f.view === 'list' ? 'space-y-4' : 'pgrid pgrid--5'}>
              {shown.map((p, i) => (
                <ProductCard key={p.id} p={p} layout={f.view} index={i} priority={i < 4} reveal={i >= 10} />
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="mt-14 flex flex-col items-center gap-4">
              <p className="mono text-[11px] text-muted" aria-live="polite">
                Showing {Math.min(visible, results.length)} of {results.length}
              </p>
              <div className="h-1 w-56 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[image:var(--grad-btn)]" style={{ width: `${(Math.min(visible, results.length) / results.length) * 100}%` }} />
              </div>
              {visible < results.length && (
                <button type="button" className="btn btn-glass mt-2" onClick={() => setVisible((v) => v + PAGE)}>
                  Load more <Icon name="plus" size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`scrim lg:hidden ${sheet ? 'is-on' : ''}`} onClick={() => setSheet(false)} aria-hidden="true" />
      <div ref={sheetRef} className={`sheet lg:hidden ${sheet ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Filters" inert={!sheet}>
        <div className="sheet__grip" aria-hidden="true" />
        <div className="flex items-center justify-between px-5 pb-2 pt-1">
          <p className="display text-[30px]">Filters</p>
          <button type="button" className="icon-btn" onClick={() => setSheet(false)} aria-label="Close filters">
            <Icon name="close" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5" data-lenis-prevent>
          {(sheet || sheetEver) && (
          <>
          <label className="mb-2 block sm:hidden">
            <span className="mono mb-2 block text-[11px] text-muted">Sort by</span>
            <select className="select w-full" value={f.sort} onChange={(e) => update({ sort: e.target.value as SortKey })}>
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <FilterPanel f={f} update={update} base={base} />
          </>
          )}
        </div>
        <div className="flex gap-3 border-t border-line p-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
          <button type="button" className="btn btn-glass btn-sm flex-1" onClick={clearAll}>
            Clear all
          </button>
          <button type="button" className="btn btn-primary btn-sm flex-[2]" onClick={() => setSheet(false)}>
            Show {results.length} results
          </button>
        </div>
      </div>
    </>
  );
}

