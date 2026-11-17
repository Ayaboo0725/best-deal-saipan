'use client';
import Link from '@/components/ui/Link';
import { useRef } from 'react';
import Icon from '@/components/ui/Icon';
import FreeDelivery from '@/components/ui/FreeDelivery';
import { useCart, useUI, cartCount, cartTotal } from '@/lib/store';
import { img, aisleName } from '@/lib/aisles';
import { money, titleWithSize } from '@/lib/format';
import { useFocusTrap } from '@/lib/useFocusTrap';

export default function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const set = useUI((s) => s.set);
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useFocusTrap(ref, open, closeRef);
  const count = cartCount(lines);
  const subtotal = cartTotal(lines);
  const close = () => set({ cartOpen: false });

  return (
    <>
      <div className={`scrim ${open ? 'is-on' : ''}`} onClick={close} aria-hidden="true" />
      <aside ref={ref} className={`drawer ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="cart-title" inert={!open}>
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 id="cart-title" className="display text-[34px]">
            Your cart <span className="mono ml-1 align-middle text-[12px] text-muted">({count})</span>
          </h2>
          <button ref={closeRef} type="button" className="icon-btn" onClick={close} aria-label="Close cart">
            <Icon name="close" />
          </button>
        </div>

        <div className="border-b border-line px-6 py-4">
          <FreeDelivery subtotal={subtotal} />
        </div>

        <div className="flex-1 overflow-y-auto px-6" data-lenis-prevent>
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-white/5 text-sun-1">
                <Icon name="bag" size={28} />
              </span>
              <p className="display text-[30px]">Your cart is empty</p>
              <p className="body-copy max-w-[260px] text-sm">202 products across 17 stocked aisles — find something good.</p>
              <Link href="/shop/" className="btn btn-primary btn-sm" onClick={close}>
                Shop all aisles <Icon name="arrow-right" size={16} className="arrow" />
              </Link>
            </div>
          ) : (
            <ul>
              {lines.map((l) => (
                <li key={l.key} className="line-item">
                  <Link href={`/product/${l.slug}/`} onClick={close}>
                    <img src={img(l.slug)} alt="" width={76} height={76} loading="lazy" decoding="async" />
                  </Link>
                  <div className="min-w-0">
                    <p className="mono text-[10px] text-muted">{aisleName(l.aisle)}</p>
                    <Link href={`/product/${l.slug}/`} onClick={close} className="mt-1 line-clamp-2 block text-[14px] font-semibold leading-snug hover:text-sun-2">
                      {titleWithSize(l.name, l.size)}
                    </Link>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="stepper" role="group" aria-label={`Quantity for ${l.name}`}>
                        <button type="button" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease quantity">
                          <Icon name="minus" size={15} />
                        </button>
                        <output aria-live="polite">{l.qty}</output>
                        <button type="button" onClick={() => setQty(l.key, l.qty + 1)} disabled={l.qty >= l.max} aria-label="Increase quantity">
                          <Icon name="plus" size={15} />
                        </button>
                      </div>
                      <button type="button" className="text-[12px] text-muted underline-offset-4 hover:text-cream hover:underline" onClick={() => remove(l.key)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="price text-[15px]">{money(l.price * l.qty)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-line px-6 pb-6 pt-5">
            <div className="flex items-baseline justify-between">
              <span className="mono text-[11px] text-muted">Subtotal</span>
              <span className="display text-[34px]">{money(subtotal)}</span>
            </div>
            <p className="mt-1 text-[12.5px] text-muted">Delivery and any fees are confirmed at checkout. In-store pickup is free.</p>
            <Link href="/checkout/" className="btn btn-primary btn-block mt-4" onClick={close} data-magnetic>
              Checkout · {money(subtotal)} <Icon name="arrow-right" size={18} className="arrow" />
            </Link>
            <button type="button" className="mt-3 w-full text-center text-[13px] text-muted hover:text-cream" onClick={close}>
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
