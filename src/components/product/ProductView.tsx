'use client';
import Link from '@/components/ui/Link';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import FreeDelivery from '@/components/ui/FreeDelivery';
import Barcode from './Barcode';
import { useCart, useUI, useWish, cartTotal } from '@/lib/store';
import { img } from '@/lib/aisles';
import { addToCart } from '@/lib/cart-actions';
import { money, pct, stockLabel, stockState, titleWithSize } from '@/lib/format';
import { fmtTime, hoursFor, openStatus, saipanNow } from '@/lib/hours';
import { STORE, whatsappLink } from '@/config/store';
import { finePointer } from '@/lib/motion';
import type { Aisle, LiteProduct, Product } from '@/lib/types';

type Props = { product: Product; family: { slug: string; grade: string }[]; fbt: LiteProduct[]; aisle: Aisle };

function Gallery({ p, view, setView, imgRef }: { p: Product; view: 1 | 2 | 3; setView: (v: 1 | 2 | 3) => void; imgRef: React.RefObject<HTMLImageElement | null> }) {
  const box = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);

  // Hover zoom (desktop) + pinch zoom (touch).
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const pts = new Map<number, { x: number; y: number }>();
    let startDist = 0;
    const dist = () => {
      const [a, b] = Array.from(pts.values());
      return Math.hypot(a.x - b.x, a.y - b.y);
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {
        startDist = dist();
        const r = el.getBoundingClientRect();
        const [a, b] = Array.from(pts.values());
        el.style.setProperty('--zx', `${(((a.x + b.x) / 2 - r.left) / r.width) * 100}%`);
        el.style.setProperty('--zy', `${(((a.y + b.y) / 2 - r.top) / r.height) * 100}%`);
        el.classList.add('is-zoomed', 'is-pinching');
      }
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' || !pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2 && startDist) {
        e.preventDefault();
        el.style.setProperty('--zs', String(Math.max(1, Math.min(3.2, dist() / startDist))));
      }
    };
    const up = (e: PointerEvent) => {
      pts.delete(e.pointerId);
      if (pts.size < 2 && el.classList.contains('is-pinching')) {
        el.classList.remove('is-pinching', 'is-zoomed');
        el.style.removeProperty('--zs');
        startDist = 0;
      }
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move, { passive: false });
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, []);

  const onMove = (e: React.MouseEvent) => {
    if (!finePointer() || !box.current) return;
    const r = box.current.getBoundingClientRect();
    box.current.style.setProperty('--zx', `${((e.clientX - r.left) / r.width) * 100}%`);
    box.current.style.setProperty('--zy', `${((e.clientY - r.top) / r.height) * 100}%`);
    if (!zoomed) setZoomed(true);
  };

  const label = !p.photo || view === 3;
  return (
    <div className="pdp__gallery">
      <div
        ref={box}
        className={`zoom ${label ? 'is-label' : ''} ${zoomed ? 'is-zoomed' : ''}`}
        onMouseMove={onMove}
        onMouseLeave={() => setZoomed(false)}
        data-cursor="view"
      >
        <img ref={imgRef} src={img(p.slug, view)} alt={`${p.name}${view === 2 ? ' — back' : view === 3 ? ' — detail' : ''}`} width={800} height={800} fetchPriority="high" />
        <span className="mono pointer-events-none absolute bottom-4 left-4 hidden items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-[10px] text-cream backdrop-blur md:inline-flex">
          <Icon name="zoom" size={13} /> Hover to zoom
        </span>
      </div>
      <div className="thumbs" role="group" aria-label="Product images">
        {([1, 2, 3] as const).map((n) => (
          <button key={n} type="button" className="thumb" aria-current={view === n} onClick={() => setView(n)} aria-label={['Front', 'Back', 'Detail'][n - 1] + ' view'}>
            <img src={img(p.slug, n)} alt="" width={84} height={84} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Tabs({ p, aisle, vSku, ean }: { p: Product; aisle: Aisle; vSku: string; ean?: string }) {
  const [tab, setTab] = useState(0);
  const tabs = ['Specs', 'Compatibility', 'Shipping & Pickup'];
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = (tab + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setTab(n);
    refs.current[n]?.focus();
  };
  const sizes = p.variants.map((v) => v.size).join(' · ');
  return (
    <section className="mt-20" aria-label="Product information">
      <div className="tabs" role="tablist" onKeyDown={onKey}>
        {tabs.map((t, i) => (
          <button
            key={t}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${i}`}
            aria-selected={tab === i}
            aria-controls={`panel-${i}`}
            tabIndex={tab === i ? 0 : -1}
            className="tab"
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="max-w-3xl pt-8">
        {tab === 0 && (
          <div role="tabpanel" id="panel-0" aria-labelledby="tab-0">
            <p className="body-copy mb-6">{p.description}</p>
            <table className="spec-table">
              <tbody>
                <tr>
                  <th scope="row">Brand</th>
                  <td>{p.brand}</td>
                </tr>
                <tr>
                  <th scope="row">{p.grade ? 'Grade' : 'Spec'}</th>
                  <td>{p.grade ?? p.spec}</td>
                </tr>
                <tr>
                  <th scope="row">Sizes</th>
                  <td>{sizes}</td>
                </tr>
                <tr>
                  <th scope="row">Aisle</th>
                  <td>
                    {String(aisle.num).padStart(2, '0')} · {aisle.name}
                  </td>
                </tr>
                {p.pgName && (
                  <tr>
                    <th scope="row">Pureguard codes</th>
                    <td className="font-mono text-[13px]">{p.variants.map((v) => `${v.code} (${v.size})`).join(' · ')}</td>
                  </tr>
                )}
                <tr>
                  <th scope="row">SKU</th>
                  <td className="font-mono text-[13px]">{vSku}</td>
                </tr>
                {ean && (
                  <tr>
                    <th scope="row">Barcode (EAN-13)</th>
                    <td className="font-mono text-[13px]">{ean}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {tab === 1 && (
          <div role="tabpanel" id="panel-1" aria-labelledby="tab-1" className="prose">
            <p>{p.compat}</p>
            <p>
              Still not sure it fits? Message the counter with your make, model and year (or a photo of the old part) and we’ll check before you buy.
            </p>
            <a className="btn btn-glass btn-sm not-prose" href={whatsappLink(`Hi Best Deal! Will ${p.name} (${vSku}) fit my vehicle/equipment?`)} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={16} /> Ask about fitment
            </a>
          </div>
        )}
        {tab === 2 && (
          <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" className="prose">
            <h2 className="!mt-0">In-store pickup</h2>
            <p>
              Free. Pick up at the counter on {STORE.address.short} during store hours. In-stock items are usually ready the same day — we’ll confirm when your order is packed.
            </p>
            <h2>Island delivery</h2>
            <p>
              {STORE.deliveryNote} Free on orders over {money(STORE.freeDeliveryThreshold)}; otherwise a flat {money(STORE.deliveryFee)} delivery fee.
            </p>
            <h2>Payment</h2>
            <p>{STORE.payments.join(', ')}. Online checkout is coming soon — until then, order in store or by phone.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function FrequentlyBought({ p, fbt }: { p: Product; fbt: LiteProduct[] }) {
  const items = [{ slug: p.slug, name: p.name, brand: p.brand, aisle: p.aisle, v: p.variants.find((v) => v.stock > 0) ?? p.variants[0] }, ...fbt.map((q) => ({ slug: q.slug, name: q.name, brand: q.brand, aisle: q.aisle, v: q.v.find((v) => v.stock > 0) ?? q.v[0] }))];
  const [on, setOn] = useState(items.map(() => true));
  const sel = items.filter((_, i) => on[i] && items[i].v.stock > 0);
  const total = sel.reduce((n, x) => n + x.v.price, 0);
  if (!fbt.length) return null;
  return (
    <section className="mt-20 rounded-[28px] border border-line p-6 sm:p-8" aria-labelledby="fbt-title">
      <p className="eyebrow">
        <Icon name="sparkle" size={14} /> Pairs well
      </p>
      <h2 id="fbt-title" className="display h-sub mt-3">
        Frequently bought together
      </h2>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
        <ul>
          {items.map((x, i) => (
            <li key={x.slug} className="fbt-item">
              <input
                type="checkbox"
                className="h-[18px] w-[18px] accent-[var(--sun-2)]"
                checked={on[i]}
                disabled={x.v.stock <= 0}
                onChange={(e) => setOn((o) => o.map((b, k) => (k === i ? e.target.checked : b)))}
                aria-label={`Include ${x.name}`}
              />
              <img src={img(x.slug)} alt="" width={64} height={64} loading="lazy" />
              <div className="min-w-0">
                <p className="mono text-[10px] text-muted">{i === 0 ? 'This item' : x.brand}</p>
                {i === 0 ? (
                  <p className="truncate text-[14px] font-semibold">{titleWithSize(x.name, x.v.size)}</p>
                ) : (
                  <Link href={`/product/${x.slug}/`} className="block truncate text-[14px] font-semibold hover:text-sun-2">
                    {titleWithSize(x.name, x.v.size)}
                  </Link>
                )}
              </div>
              <span className="price text-[15px]">{money(x.v.price)}</span>
            </li>
          ))}
        </ul>
        <div>
          <p className="mono text-[11px] text-muted">Total for {sel.length} items</p>
          <p className="display mt-1 text-[44px]">{money(total)}</p>
          <button
            type="button"
            className="btn btn-primary btn-block mt-3"
            disabled={!sel.length}
            onClick={() => {
              sel.forEach((x) => useCart.getState().add({ slug: x.slug, name: x.name, brand: x.brand, aisle: x.aisle, variantId: x.v.id, size: x.v.size, price: x.v.price, max: x.v.stock }, 1));
              useUI.getState().set({ cartOpen: true, bump: useUI.getState().bump + 1 });
            }}
          >
            Add {sel.length} to cart <Icon name="bag" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function ProductView({ product: p, family, fbt, aisle }: Props) {
  const [vi, setVi] = useState(() => Math.max(0, p.variants.findIndex((v) => v.stock > 0)));
  const [qty, setQty] = useState(1);
  const [view, setView] = useState<1 | 2 | 3>(1);
  const [sticky, setSticky] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pickup, setPickup] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const atcRef = useRef<HTMLDivElement>(null);
  const wished = useWish((s) => s.slugs.includes(p.slug));
  const hydrated = useUI((s) => s.hydrated);
  const toggleWish = useWish((s) => s.toggle);
  const subtotal = useCart((s) => cartTotal(s.lines));
  const v = p.variants[vi];
  const st = stockState(v.stock);
  const off = pct(v.price, v.was);
  const title = titleWithSize(p.name, v.size);

  useEffect(() => {
    setUrl(window.location.href);
    const s = openStatus();
    const now = saipanNow();
    const today = hoursFor(now.day);
    const closesSoon = today.close ? now.minutes > Number(today.close.split(':')[0]) * 60 - 60 : true;
    if (s.open && !closesSoon) setPickup(`Ready for pickup today at ${STORE.address.line1}`);
    else {
      const next = hoursFor((now.day + 1) % 7);
      const beforeOpen = today.open && now.minutes < Number(today.open.split(':')[0]) * 60;
      setPickup(beforeOpen ? `Ready for pickup today at ${STORE.address.line1} from ${fmtTime(today.open!)}` : `Ready for pickup tomorrow at ${STORE.address.line1}${next.open ? ` from ${fmtTime(next.open)}` : ''}`);
    }
  }, []);

  // Sticky bar once the main Add to cart row has scrolled above the viewport
  // (a scroll check, so jumps / restored scroll positions are handled too).
  useEffect(() => {
    const el = atcRef.current;
    if (!el) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      setSticky(el.getBoundingClientRect().bottom < 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const add = () => addToCart(p, v, qty, { from: imgRef.current, mode: 'drawer' });
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {}
  };

  return (
    <>
      <div className="pdp__grid">
        <Gallery p={p} view={view} setView={setView} imgRef={imgRef} />

        <div>
          <p className="mono text-[11px] text-muted">
            <Link href={`/shop/?aisle=${aisle.slug}`} className="hover:text-cream">
              Aisle {String(aisle.num).padStart(2, '0')} · {aisle.name}
            </Link>
            {v.code ? ` · ${v.code}` : ''}
          </p>
          <h1 className="display pdp__title mt-4">{title}</h1>
          <p className="mt-4 text-[14px] text-cream/75">
            by{' '}
            <Link href={`/shop/?brand=${encodeURIComponent(p.brand)}`} className="font-semibold text-cream underline-offset-4 hover:text-sun-2 hover:underline">
              {p.brand}
            </Link>
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="pdp__price">{`USD ${v.price.toFixed(2)}`}</span>
            {off > 0 && (
              <>
                <span className="price-was text-[16px]">{money(v.was!)}</span>
                <span className="badge badge-sale">Sale −{off}%</span>
              </>
            )}
            {p.isNew && <span className="badge badge-new">New</span>}
          </div>
          <p className={`stock ${st} mt-4`}>
            <i aria-hidden="true" /> {stockLabel(v.stock)}
          </p>

          {family.length > 1 && (
            <div className="mt-8">
              <p className="mono mb-3 text-[10.5px] text-muted">
                Grade: <span className="text-cream">{p.grade}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {family.map((f) => (
                  <Link key={f.slug} href={`/product/${f.slug}/`} className="vbox" aria-current={f.slug === p.slug ? 'true' : undefined} replace scroll={false}>
                    {f.grade}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {family.length <= 1 && p.grade && (
            <div className="mt-8">
              <p className="mono mb-3 text-[10.5px] text-muted">Grade</p>
              <span className="vbox" aria-current="true">
                {p.grade}
              </span>
            </div>
          )}

          {v.size !== 'Each' && (
            <fieldset className="mt-6">
              <legend className="mono mb-3 text-[10.5px] text-muted">
                Size: <span className="text-cream">{v.size}</span>
              </legend>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
                {p.variants.map((x, i) => (
                  <button
                    key={x.id}
                    type="button"
                    role="radio"
                    aria-checked={i === vi}
                    className={`vbox ${x.stock <= 0 ? 'is-out' : ''}`}
                    onClick={() => {
                      setVi(i);
                      setQty(1);
                    }}
                  >
                    {x.size}
                    {x.code && <span className="text-[10px] text-muted">{x.code}</span>}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div ref={atcRef} className="mt-8 flex flex-wrap items-center gap-3">
            <div className="stepper stepper--lg" role="group" aria-label="Quantity">
              <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} disabled={qty <= 1} aria-label="Decrease quantity">
                <Icon name="minus" size={17} />
              </button>
              <output aria-live="polite">{qty}</output>
              <button type="button" onClick={() => setQty((n) => Math.min(Math.max(1, v.stock), n + 1))} disabled={qty >= v.stock} aria-label="Increase quantity">
                <Icon name="plus" size={17} />
              </button>
            </div>
            <button type="button" className="btn btn-cream min-w-[200px] flex-1" disabled={v.stock <= 0} onClick={add} data-magnetic>
              {v.stock <= 0 ? 'Out of stock' : `Add to cart · ${money(v.price * qty)}`} <Icon name="bag" size={18} />
            </button>
            <button
              type="button"
              className="icon-btn !h-[54px] !w-[54px] border border-line"
              aria-pressed={hydrated && wished}
              aria-label={hydrated && wished ? 'Remove from wishlist' : 'Save to wishlist'}
              onClick={() => toggleWish(p.slug)}
            >
              <Icon name={hydrated && wished ? 'heart-fill' : 'heart'} size={21} className={hydrated && wished ? 'text-tag-red' : ''} />
            </button>
          </div>

          <div className="mt-6 space-y-4 rounded-2xl border border-line bg-white/[0.02] p-5">
            <FreeDelivery subtotal={subtotal + (v.stock > 0 ? v.price * qty : 0)} />
            <p className="flex items-center gap-2 text-sm text-cream/85">
              <Icon name="store" size={17} className={v.stock > 0 ? 'text-green' : 'text-muted'} />
              {v.stock > 0 ? pickup ?? `Ready for pickup at ${STORE.address.line1}` : 'Out of stock — message us and we’ll tell you when it’s back.'}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
            <div className="flex items-center gap-4">
              {v.ean && <Barcode ean={v.ean} className="h-[60px] w-auto" />}
              <div className="mono text-[10.5px] leading-6 text-muted">
                <div>
                  SKU <span className="text-cream">{v.sku}</span>
                </div>
                {v.code && (
                  <div>
                    Code <span className="text-cream">{v.code}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1" aria-label="Share">
              <span className="mono mr-2 text-[10.5px] text-muted">Share</span>
              <button type="button" className="icon-btn border border-line" onClick={share} aria-label="Copy link or share">
                <Icon name={copied ? 'check' : 'link'} size={17} />
              </button>
              <a className="icon-btn border border-line" href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
                <Icon name="whatsapp" size={17} />
              </a>
              <a className="icon-btn border border-line" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
                <Icon name="facebook" size={17} />
              </a>
              <a className="icon-btn border border-line" href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`} aria-label="Share by email">
                <Icon name="mail" size={17} />
              </a>
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            {copied ? 'Link copied' : ''}
          </p>
        </div>
      </div>

      <Tabs p={p} aisle={aisle} vSku={v.sku} ean={v.ean} />
      <FrequentlyBought p={p} fbt={fbt} />

      <div className={`sticky-atc ${sticky ? 'is-on' : ''}`} inert={!sticky}>
        <div className="wrap flex items-center gap-3 py-3">
          <img src={img(p.slug)} alt="" width={48} height={48} className="h-12 w-12 flex-none rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold">{title}</p>
            <p className="mono text-[11px] text-sun-2">
              {money(v.price)} <span className="text-muted">· {stockLabel(v.stock)}</span>
            </p>
          </div>
          <button type="button" className="btn btn-cream btn-sm" disabled={v.stock <= 0} onClick={add}>
            <span className="hidden sm:inline">Add to cart</span>
            <span className="sm:hidden">Add</span> <Icon name="bag" size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
