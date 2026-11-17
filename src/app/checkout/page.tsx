import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import CheckoutView from '@/components/cart/CheckoutView';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <PageHero crumb="Checkout" eyebrow="Checkout" title="Almost" accent="there." />
      <section className="wrap pb-28">
        <CheckoutView />
      </section>
    </>
  );
}
