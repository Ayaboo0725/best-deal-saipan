'use client';
import { useRef } from 'react';
import Icon from '@/components/ui/Icon';
import ProductCard from './ProductCard';
import type { LiteProduct } from '@/lib/types';

/** Horizontal product carousel with snap + keyboard-accessible arrows. */
export default function Rail({ title, eyebrow, products, id }: { title: string; eyebrow?: string; products: LiteProduct[]; id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const by = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  if (!products.length) return null;
  return (
    <section className="mt-24" aria-labelledby={id}>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 id={id} className="display h-sub mt-3">
            {title}
          </h2>
        </div>
        <div className="flex gap-2">
          <button type="button" className="icon-btn border border-line" onClick={() => by(-1)} aria-label={`Scroll ${title} left`}>
            <Icon name="chevron-left" />
          </button>
          <button type="button" className="icon-btn border border-line" onClick={() => by(1)} aria-label={`Scroll ${title} right`}>
            <Icon name="chevron-right" />
          </button>
        </div>
      </div>
      <div ref={ref} className="rail" data-lenis-prevent-horizontal>
        {products.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} reveal={false} />
        ))}
      </div>
    </section>
  );
}
