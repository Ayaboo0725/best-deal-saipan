'use client';
import Link from '@/components/ui/Link';
import { useEffect, useRef, useState, type RefObject } from 'react';
import Icon from '@/components/ui/Icon';
import { AISLES, TOTAL_PRODUCTS, STOCKED_AISLES, img } from '@/lib/aisles';
import { useUI } from '@/lib/store';
import { useFocusTrap } from '@/lib/useFocusTrap';

const PROMO_SLUG = 'pureguard-2-cycle-engine-oil-synthetic-blend';

/** Full-width aisles mega-menu: 21 aisles in 3 columns + promo tile. */
export default function AislesMenu({ anchor }: { anchor?: RefObject<HTMLButtonElement | null> }) {
  const open = useUI((s) => s.aislesOpen);
  const set = useUI((s) => s.set);
  const ref = useRef<HTMLDivElement>(null);
  const [ever, setEver] = useState(false);
  useFocusTrap(ref, open);
  // Mount the menu contents on first open (keeps them out of initial hydration).
  useEffect(() => {
    if (open) setEver(true);
  }, [open]);
  const show = open || ever;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || anchor?.current?.contains(t)) return;
      if ((t as Element).closest?.('.tabbar')) return;
      set({ aislesOpen: false });
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, set, anchor]);

  const close = () => set({ aislesOpen: false });

  return (
    <div
      id="aisles-menu"
      ref={ref}
      className={`mega ${open ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="false"
      aria-label="Shop by aisle"
      aria-hidden={!open}
      data-lenis-prevent
      inert={!open}
    >
      {show && (
      <div className="wrap mega__grid">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="eyebrow">
              <Icon name="grid" size={14} /> {AISLES.length} aisles · {TOTAL_PRODUCTS} products · {STOCKED_AISLES} stocked
            </p>
            <button type="button" className="icon-btn" onClick={close} aria-label="Close aisles menu">
              <Icon name="close" />
            </button>
          </div>
          <ul className="mega__cols">
            {AISLES.map((a) => (
              <li key={a.slug}>
                {a.stocked ? (
                  <Link href={`/shop/?aisle=${a.slug}`} className="mega-item" onClick={close}>
                    <span className="mega-item__icon">
                      <Icon name={a.icon} size={19} />
                    </span>
                    <span className="mega-item__name">{a.name}</span>
                    <span className="mega-item__count">
                      {a.popular && <Icon name="flame" size={12} className="mr-1 inline text-sun-2" />}
                      {a.count}
                    </span>
                  </Link>
                ) : (
                  <span className="mega-item is-soon" aria-disabled="true">
                    <span className="mega-item__icon">
                      <Icon name={a.icon} size={19} />
                    </span>
                    <span className="mega-item__name">{a.name}</span>
                    <span className="badge badge-soon">Soon</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <Link href="/shop/?collection=pureguard" className="mega-promo hidden lg:flex" onClick={close}>
          <img src={img(PROMO_SLUG)} alt="" width={200} height={200} loading="lazy" decoding="async" />
          <span className="mono text-[11px] text-cream/80">Featured collection</span>
          <span className="display mt-2 text-[54px] text-cream">Pureguard</span>
          <span className="mt-1 text-sm text-cream/85">30 codes — two-stroke to hydraulic pails.</span>
          <span className="btn btn-cream btn-sm mt-4 w-max">
            Shop Pureguard <Icon name="arrow-right" size={16} className="arrow" />
          </span>
        </Link>
      </div>
      )}
    </div>
  );
}
