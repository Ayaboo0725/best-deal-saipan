'use client';
import Link from '@/components/ui/Link';
import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { img } from '@/lib/aisles';
import { addToCart } from '@/lib/cart-actions';
import { canRunShader, prefersReduced } from '@/lib/motion';
import { money } from '@/lib/format';
import type { LiteProduct, Variant } from '@/lib/types';

type Row = { p: LiteProduct; v: Variant };
const FILTERS = [
  { key: '', label: 'All' },
  { key: '2-cycle', label: '2-cycle' },
  { key: 'gear', label: 'Gear' },
  { key: 'hydraulic', label: 'Hydraulic' },
  { key: 'atf', label: 'ATF' },
];

const rowName = (r: Row) => {
  const parts = (r.p.pgName ?? r.p.name).split(' · ');
  return [`${parts[0]} ${r.v.size}`, ...parts.slice(1)].join(' · ');
};

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLElement>(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    setN(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / 1400);
          setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return <b ref={ref}>{n}</b>;
}

/** "A living oil surface that moves when you do." */
export default function PureguardStage({ products }: { products: LiteProduct[] }) {
  const section = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const featImg = useRef<HTMLImageElement>(null);
  const [shader, setShader] = useState(false);
  const [filter, setFilter] = useState('');
  const rows: Row[] = useMemo(() => products.flatMap((p) => p.v.filter((v) => v.code).map((v) => ({ p, v }))), [products]);
  const [feat, setFeat] = useState<Row>(rows[0]);
  const shown = rows.filter((r) => !filter || r.p.pg === filter);

  useEffect(() => {
    const el = section.current;
    const host = bg.current;
    if (!el || !host) return;
    let dispose: (() => void) | null = null;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        // The capability probe creates a WebGL context — only pay for it when the section is close.
        if (!canRunShader()) return;
        import('./oilShader')
          .then((m) => {
            if (cancelled) return;
            dispose = m.mountOil(host);
            setShader(true);
          })
          .catch(() => setShader(false));
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      dispose?.();
    };
  }, []);

  // Animate the CSS fallback only while the section is on screen.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-live', e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!feat) return null;

  return (
    <section ref={section} className="pg cv-auto" id="pureguard" aria-labelledby="pg-title">
      <div className="pg__bg" aria-hidden="true">
        {!shader && <div className="pg__fallback" />}
        <div ref={bg} className="absolute inset-0" />
      </div>
      <div className="wrap grid w-full gap-12 lg:grid-cols-[1fr_minmax(0,520px)] lg:items-center">
        <div data-reveal>
          <p className="eyebrow !text-cream/70">
            <Icon name="oil" size={15} /> · Pureguard collection
          </p>
          <h2 id="pg-title" className="display pg__title mt-5">
            <span className="grad-pure">Pureguard</span>
            <span className="mt-1 block text-[0.42em] tracking-[0.04em] text-cream">Products</span>
          </h2>
          <p className="body-copy mt-6 max-w-[480px] !text-cream/75">
            Two-stroke to gear oil to hydraulic pails: the Pureguard line stocked for repair shops, fleets and boats across the CNMI.
          </p>
          <div className="mt-10 flex gap-12">
            <div className="pg-stat">
              <CountUp to={products.length} />
              <span>In the collection</span>
            </div>
            <div className="pg-stat">
              <CountUp to={rows.length} />
              <span>Pureguard codes on the shelf</span>
            </div>
          </div>
          <Link href="/shop/?collection=pureguard" className="btn btn-primary mt-10" data-magnetic>
            Shop Pureguard Products <Icon name="arrow-right" size={18} className="arrow" />
          </Link>
        </div>

        <div className="glass p-4 sm:p-5" data-reveal style={{ ['--i' as string]: 1 }}>
          <div className="flex items-center gap-4 rounded-2xl bg-black/30 p-3" aria-live="polite">
            <img ref={featImg} src={img(feat.p.slug)} alt="" width={112} height={112} className="h-[104px] w-[104px] flex-none rounded-xl object-cover sm:h-[112px] sm:w-[112px]" />
            <div className="min-w-0 flex-1">
              <p className="mono text-[12px] font-semibold text-[#c6ef6a]">{feat.v.code}</p>
              <p className="mt-1 text-[15px] font-semibold leading-snug">{rowName(feat)}</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="display text-[30px] text-cream">{money(feat.v.price)}</span>
                <button
                  type="button"
                  className="btn btn-cream btn-sm !h-9"
                  disabled={feat.v.stock <= 0}
                  onClick={() => addToCart(feat.p, feat.v, 1, { from: featImg.current, mode: 'quick' })}
                >
                  Add <Icon name="plus" size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto" role="group" aria-label="Filter Pureguard products">
            {FILTERS.map((f) => (
              <button key={f.key} type="button" className="chip !h-8 !px-3.5" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="mono mt-4 grid grid-cols-[56px_minmax(0,1fr)_62px_66px_34px] gap-[10px] px-3 pb-2 text-[9.5px] text-muted">
            <span>Code</span>
            <span>Product</span>
            <span>Size</span>
            <span className="text-right">Price</span>
            <span className="sr-only">Add</span>
          </div>
          <ul className="pg-table" data-lenis-prevent>
            {shown.map((r) => (
              <li
                key={r.v.id}
                className={`pg-row ${feat.v.id === r.v.id ? 'is-active' : ''}`}
                onPointerEnter={() => setFeat(r)}
                onFocus={() => setFeat(r)}
              >
                <span className="code">{r.v.code}</span>
                <span className="truncate">{(r.p.pgName ?? r.p.name).split(' · ').slice(0, 2).join(' · ')}</span>
                <span className="size">{r.v.size}</span>
                <span className="price">{money(r.v.price)}</span>
                <button
                  type="button"
                  className="add-round !h-8 !w-8"
                  disabled={r.v.stock <= 0}
                  aria-label={`Add ${r.v.code} ${rowName(r)} to cart`}
                  onClick={(e) => addToCart(r.p, r.v, 1, { from: e.currentTarget, mode: 'quick' })}
                >
                  <span aria-hidden="true" className="text-[18px] leading-none">+</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
