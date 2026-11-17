'use client';
import Link from '@/components/ui/Link';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import FreeDelivery from '@/components/ui/FreeDelivery';
import { useCart, useUI, cartTotal } from '@/lib/store';
import { img } from '@/lib/aisles';
import { money, titleWithSize } from '@/lib/format';
import { STORE, whatsappLink } from '@/config/store';

/** Order summary. Online payment is wired later — for now the order is sent to the counter via WhatsApp. */
export default function CheckoutView() {
  const lines = useCart((s) => s.lines);
  const hydrated = useUI((s) => s.hydrated);
  const [mode, setMode] = useState<'pickup' | 'delivery'>('pickup');
  const subtotal = cartTotal(lines);
  const fee = mode === 'delivery' && subtotal < STORE.freeDeliveryThreshold ? STORE.deliveryFee : 0;
  const total = subtotal + fee;

  if (!hydrated) return <div className="skel h-80 rounded-3xl" aria-busy="true" />;
  if (!lines.length) {
    return (
      <div className="rounded-3xl border border-line p-10 text-center">
        <p className="display text-[44px]">Your cart is empty</p>
        <Link href="/shop/" className="btn btn-primary mt-6">
          Shop all aisles <Icon name="arrow-right" size={18} className="arrow" />
        </Link>
      </div>
    );
  }

  const message = [
    'Hi Best Deal! I’d like to order:',
    ...lines.map((l) => `• ${l.qty} × ${titleWithSize(l.name, l.size)} (${l.variantId}) — ${money(l.price * l.qty)}`),
    `Subtotal: ${money(subtotal)}`,
    mode === 'delivery' ? `Delivery: ${fee ? money(fee) : 'free'}` : 'In-store pickup',
    `Total: ${money(total)}`,
  ].join('\n');

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="glass p-6 sm:p-8">
        <h2 className="display text-[34px]">Order summary</h2>
        <ul className="mt-4">
          {lines.map((l) => (
            <li key={l.key} className="line-item">
              <img src={img(l.slug)} alt="" width={76} height={76} />
              <div className="min-w-0">
                <Link href={`/product/${l.slug}/`} className="line-clamp-2 text-[14.5px] font-semibold hover:text-sun-2">
                  {titleWithSize(l.name, l.size)}
                </Link>
                <p className="mono mt-1 text-[10.5px] text-muted">
                  {l.variantId} · Qty {l.qty}
                </p>
              </div>
              <span className="price text-[15px]">{money(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
      </div>
      <aside className="glass h-max p-6 sm:p-8">
        <fieldset>
          <legend className="mono mb-3 text-[11px] text-muted">How would you like it?</legend>
          <div className="grid grid-cols-2 gap-2" role="radiogroup">
            {(['pickup', 'delivery'] as const).map((m) => (
              <button key={m} type="button" role="radio" aria-checked={mode === m} className="vbox !h-auto flex-col !items-start !py-3 text-left" onClick={() => setMode(m)}>
                <span className="flex items-center gap-2 text-[13px] text-cream">
                  <Icon name={m === 'pickup' ? 'store' : 'truck'} size={16} /> {m === 'pickup' ? 'Pickup' : 'Delivery'}
                </span>
                <span className="text-[10.5px] normal-case tracking-normal text-muted">{m === 'pickup' ? `Free · ${STORE.address.line1}` : subtotal >= STORE.freeDeliveryThreshold ? 'Free on this order' : `${money(STORE.deliveryFee)} · Saipan`}</span>
              </button>
            ))}
          </div>
        </fieldset>
        {mode === 'delivery' && <FreeDelivery subtotal={subtotal} compact className="mt-5" />}
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{money(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{mode === 'pickup' ? 'Pickup' : 'Delivery'}</dt>
            <dd>{fee ? money(fee) : 'Free'}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-3">
            <dt className="mono text-[11px] text-muted">Total</dt>
            <dd className="display text-[38px]">{money(total)}</dd>
          </div>
        </dl>
        <div className="mt-5 rounded-2xl border border-sun-2/30 bg-sun-2/10 p-4 text-[13px] text-cream/85">
          Online payment is coming soon. Send this order to the counter and we’ll confirm stock, total and pickup time.
        </div>
        <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block mt-5" data-magnetic>
          <Icon name="whatsapp" size={18} /> Send order via WhatsApp
        </a>
        <a href={`tel:${STORE.phone.tel}`} className="btn btn-glass btn-block mt-3">
          <Icon name="phone" size={17} /> Call {STORE.phone.display}
        </a>
      </aside>
    </div>
  );
}
