'use client';
import Link from '@/components/ui/Link';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import FreeDelivery from '@/components/ui/FreeDelivery';
import { useCart, useUI, useWish, cartTotal } from '@/lib/store';
import { img, loadLite, aisleName } from '@/lib/aisles';
import { addToCart } from '@/lib/cart-actions';
import { money, pct, stockLabel, stockState } from '@/lib/format';
import { useFocusTrap } from '@/lib/useFocusTrap';
import type { LiteProduct } from '@/lib/types';

export default function QuickView() {
  const slug = useUI((s) => s.quickView);
  const set = useUI((s) => s.set);
  const wish = useWish((s) => s.slugs);
  const toggleWish = useWish((s) => s.toggle);
  const subtotal = useCart((s) => cartTotal(s.lines));
  const [p, setP] = useState<LiteProduct | null>(null);
  const [vi, setVi] = useState(0);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState<1 | 2>(1);
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const open = !!slug;
  useFocusTrap(ref, open);

  useEffect(() => {
    if (!slug) return;
    loadLite().then((all) => {
      const found = all.find((x) => x.slug === slug) ?? null;
      setP(found);
      setVi(Math.max(0, found ? found.v.findIndex((v) => v.stock > 0) : 0));
      setQty(1);
      setView(1);
    });
  }, [slug]);

  const close = () => set({ quickView: null });
  const v = p?.v[vi];
  const st = v ? stockState(v.stock) : 'in';
  const off = v ? pct(v.price, v.was) : 0;

  return (
    <>
      <div className={`scrim ${open ? 'is-on' : ''}`} onClick={close} aria-hidden="true" />
      <div className={`modal ${open ? 'is-open' : ''}`} inert={!open}>
        <div ref={ref} className="modal__panel" role="dialog" aria-modal="true" aria-labelledby="qv-title" data-lenis-prevent>
          <button type="button" className="icon-btn absolute right-3 top-3 z-10 bg-black/40" onClick={close} aria-label="Close quick view">
            <Icon name="close" />
          </button>
          {p && v ? (
            <div className="grid md:grid-cols-2">
              <div className="p-4 md:p-5">
                <div className={`zoom ${p.photo ? '' : 'is-label'}`}>
                  <img ref={imgRef} src={img(p.slug, view)} alt={p.name} width={600} height={600} />
                </div>
                <div className="thumbs">
                  {([1, 2] as const).map((n) => (
                    <button key={n} type="button" className="thumb" aria-current={view === n} onClick={() => setView(n)} aria-label={n === 1 ? 'Front view' : 'Back view'}>
                      <img src={img(p.slug, n)} alt="" width={84} height={84} loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col p-6 pt-2 md:p-8 md:pl-3">
                <p className="mono text-[11px] text-muted">
                  {aisleName(p.aisle)} · {v.code ?? v.sku}
                </p>
                <h2 id="qv-title" className="display mt-3 text-[clamp(32px,3.4vw,46px)]">
                  {p.name}
                </h2>
                <p className="mono mt-2 text-[11px] text-cream/70">{p.brand}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <span className="pdp__price">USD {v.price.toFixed(2)}</span>
                  {off > 0 && (
                    <>
                      <span className="price-was text-[15px]">{money(v.was!)}</span>
                      <span className="badge badge-sale">Sale −{off}%</span>
                    </>
                  )}
                </div>
                <p className={`stock ${st} mt-4`}>
                  <i aria-hidden="true" /> {stockLabel(v.stock)}
                </p>
                {p.v.length > 1 || v.size !== 'Each' ? (
                  <fieldset className="mt-6">
                    <legend className="mono mb-3 text-[10.5px] text-muted">Size</legend>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
                      {p.v.map((x, i) => (
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
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ) : null}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <div className="stepper stepper--lg" role="group" aria-label="Quantity">
                    <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} disabled={qty <= 1} aria-label="Decrease quantity">
                      <Icon name="minus" size={16} />
                    </button>
                    <output aria-live="polite">{qty}</output>
                    <button type="button" onClick={() => setQty((n) => Math.min(v.stock, n + 1))} disabled={qty >= v.stock} aria-label="Increase quantity">
                      <Icon name="plus" size={16} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-cream flex-1"
                    disabled={v.stock <= 0}
                    onClick={() => addToCart(p, v, qty, { from: imgRef.current, mode: 'drawer' })}
                  >
                    {v.stock <= 0 ? 'Out of stock' : 'Add to cart'} <Icon name="bag" size={18} />
                  </button>
                  <button type="button" className="icon-btn border border-line" aria-pressed={wish.includes(p.slug)} aria-label="Save to wishlist" onClick={() => toggleWish(p.slug)}>
                    <Icon name={wish.includes(p.slug) ? 'heart-fill' : 'heart'} className={wish.includes(p.slug) ? 'text-tag-red' : ''} />
                  </button>
                </div>
                <FreeDelivery subtotal={subtotal + (v.stock > 0 ? v.price * qty : 0)} compact className="mt-6" />
                <Link href={`/product/${p.slug}/`} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-sun-1 hover:text-sun-2" onClick={close}>
                  View full details <Icon name="arrow-right" size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 p-6 md:grid-cols-2" aria-hidden="true">
              <div className="skel aspect-square rounded-3xl" />
              <div className="space-y-4">
                <div className="skel h-4 w-1/3" />
                <div className="skel h-12 w-full" />
                <div className="skel h-10 w-1/2" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
