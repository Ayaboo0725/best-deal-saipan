'use client';
import Link from '@/components/ui/Link';
import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import ProductCard from '@/components/product/ProductCard';
import { loadLite } from '@/lib/aisles';
import { useUI, useWish } from '@/lib/store';
import type { LiteProduct } from '@/lib/types';

export default function WishlistView() {
  const slugs = useWish((s) => s.slugs);
  const hydrated = useUI((s) => s.hydrated);
  const [all, setAll] = useState<LiteProduct[] | null>(null);
  useEffect(() => {
    loadLite().then(setAll);
  }, []);
  const items = all ? (slugs.map((s) => all.find((p) => p.slug === s)).filter(Boolean) as LiteProduct[]) : [];

  if (!hydrated || !all) {
    return (
      <div className="pgrid pgrid--5" aria-busy="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skel aspect-square rounded-[20px]" />
        ))}
      </div>
    );
  }
  if (!items.length) {
    return (
      <div className="rounded-3xl border border-line p-10 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/5 text-tag-red">
          <Icon name="heart" size={28} />
        </span>
        <p className="display mt-5 text-[44px]">Nothing saved yet</p>
        <p className="body-copy mx-auto mt-2 max-w-md">Tap the heart on any product to keep it here. Your wishlist is saved on this device.</p>
        <Link href="/shop/" className="btn btn-primary mt-6">
          Browse products <Icon name="arrow-right" size={18} className="arrow" />
        </Link>
      </div>
    );
  }
  return (
    <>
      <p className="mono mb-6 text-[11px] text-muted">
        {items.length} saved {items.length === 1 ? 'item' : 'items'} · stored on this device
      </p>
      <div className="pgrid pgrid--5">
        {items.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} reveal={false} />
        ))}
      </div>
    </>
  );
}
