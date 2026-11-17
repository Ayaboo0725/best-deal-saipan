'use client';
import Link from '@/components/ui/Link';
import { useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { useUI, useWish } from '@/lib/store';
import { img, aisleName } from '@/lib/aisles';
import { addToCart } from '@/lib/cart-actions';
import { money, pct, stockState } from '@/lib/format';
import type { LiteProduct } from '@/lib/types';

export function Badges({ p, className = 'pcard__badges' }: { p: LiteProduct; className?: string }) {
  const off = pct(p.price, p.was);
  const st = stockState(p.stock);
  if (!off && !p.isNew && st === 'in') return null;
  return (
    <div className={className}>
      {off > 0 && <span className="badge badge-sale">Sale −{off}%</span>}
      {p.isNew && <span className="badge badge-new">New</span>}
      {st === 'low' && <span className="badge badge-low">Low stock</span>}
      {st === 'out' && <span className="badge badge-out">Sold out</span>}
    </div>
  );
}

export default function ProductCard({ p, layout = 'grid', priority = false, index = 0, reveal = true }: { p: LiteProduct; layout?: 'grid' | 'list'; priority?: boolean; index?: number; reveal?: boolean }) {
  const hydrated = useUI((s) => s.hydrated);
  const inWish = useWish((s) => s.slugs.includes(p.slug));
  const toggle = useWish((s) => s.toggle);
  const set = useUI((s) => s.set);
  const [alt, setAlt] = useState(false);
  const mediaRef = useRef<HTMLAnchorElement>(null);
  const v = p.v.find((x) => x.stock > 0) ?? p.v[0];
  const href = `/product/${p.slug}/`;
  const sizes = p.v.length > 1 ? `${p.v.length} sizes · from` : p.v[0].size !== 'Each' ? p.v[0].size : '';
  const wished = hydrated && inWish;

  return (
    <article
      className={`pcard ${p.photo ? '' : 'pcard--label'} ${layout === 'list' ? 'pcard--list' : ''}`}
      {...(reveal ? { 'data-reveal': '' } : {})}
      style={{ ['--i' as string]: index % 5 }}
      onPointerEnter={() => setAlt(true)}
    >
      <div className="relative">
        <Link ref={mediaRef} href={href} className="pcard__media" data-cursor="view" tabIndex={-1} aria-hidden="true">
          <img className="pcard__main" src={img(p.slug, 1)} alt="" width={400} height={400} loading={priority ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : undefined} />
          {alt && <img className="pcard__alt" src={img(p.slug, 2)} alt="" width={400} height={400} decoding="async" />}
        </Link>
        {layout === 'grid' && <Badges p={p} />}
        <button
          type="button"
          className="pcard__wish"
          aria-pressed={wished}
          aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
          onClick={() => toggle(p.slug)}
        >
          <Icon name={wished ? 'heart-fill' : 'heart'} size={17} />
        </button>
        {layout === 'grid' && (
          <button type="button" className="pcard__qv" onClick={() => set({ quickView: p.slug })} aria-label={`Quick view: ${p.name}`}>
            <Icon name="eye" size={16} /> Quick view
          </button>
        )}
      </div>
      <div className="min-w-0">
        <p className="pcard__cat">{aisleName(p.aisle)}</p>
        <h3 className="pcard__name">
          <Link href={href} data-cursor="view">
            {p.name}
          </Link>
        </h3>
        {layout === 'list' && <Badges p={p} className="mt-2 flex flex-wrap gap-1.5" />}
      </div>
      <div className="pcard__row">
        <div className="min-w-0">
          {sizes && <span className="price-note">{sizes}</span>}
          <span className="price">{money(v.price)}</span>
          {v.was && v.was > v.price && <span className="price-was">{money(v.was)}</span>}
        </div>
        <button
          type="button"
          className="add-btn"
          disabled={v.stock <= 0}
          aria-label={v.stock <= 0 ? `${p.name} is sold out` : `Add ${p.name}${v.size !== 'Each' ? ` ${v.size}` : ''} to cart`}
          onClick={() => addToCart(p, v, 1, { from: mediaRef.current, mode: 'quick' })}
        >
          <Icon name="plus" size={18} strokeWidth={2} />
        </button>
      </div>
    </article>
  );
}
