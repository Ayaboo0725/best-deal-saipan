import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import WishlistView from '@/components/layout/WishlistView';

export const metadata: Metadata = { title: 'Wishlist', robots: { index: false } };

export default function WishlistPage() {
  return (
    <>
      <PageHero crumb="Wishlist" eyebrow="Saved" title="Your" accent="wishlist." />
      <section className="wrap pb-28">
        <h2 className="sr-only">Saved products</h2>
        <WishlistView />
      </section>
    </>
  );
}
