'use client';
import Link from '@/components/ui/Link';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { OpenBadge } from '@/components/ui/OpenStatus';
import { NAV, STORE, whatsappLink } from '@/config/store';
import { useUI } from '@/lib/store';
import { useFocusTrap } from '@/lib/useFocusTrap';

export default function MobileNav() {
  const open = useUI((s) => s.menuOpen);
  const set = useUI((s) => s.set);
  const ref = useRef<HTMLDivElement>(null);
  const [ever, setEver] = useState(false);
  useFocusTrap(ref, open);
  useEffect(() => {
    if (open) setEver(true);
  }, [open]);
  const close = () => set({ menuOpen: false });

  return (
    <div id="mobile-nav" ref={ref} className={`mnav ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu" inert={!open} data-lenis-prevent>
      {(open || ever) && (
      <>
      <button type="button" className="icon-btn absolute right-[var(--gutter)] top-3" onClick={close} aria-label="Close menu">
        <Icon name="close" />
      </button>
      <nav aria-label="Mobile">
        <button type="button" className="mnav-link flex w-full items-center justify-between border-b border-line py-[14px] text-left font-display text-[clamp(34px,9vw,52px)] font-extrabold uppercase leading-none" onClick={() => set({ menuOpen: false, aislesOpen: true })}>
          Aisles <Icon name="grid" size={26} className="text-sun-2" />
        </button>
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="mnav-link" onClick={close}>
            {n.label}
            <Icon name="arrow-up-right" size={26} className="text-muted" />
          </Link>
        ))}
      </nav>
      <div className="mt-8 space-y-3 text-sm text-cream/80">
        <OpenBadge className="mono text-[11px]" />
        <p>
          {STORE.address.line1}, {STORE.address.line2}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <a className="btn btn-glass btn-sm" href={`tel:${STORE.phone.tel}`}>
            <Icon name="phone" size={16} /> Call
          </a>
          <a className="btn btn-glass btn-sm" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={16} /> WhatsApp
          </a>
          <Link className="btn btn-glass btn-sm" href="/account/" onClick={close}>
            <Icon name="user" size={16} /> Account
          </Link>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
