import type { Metadata } from 'next';
import Link from '@/components/ui/Link';
import PageHero from '@/components/layout/PageHero';
import Icon from '@/components/ui/Icon';
import { STORE, whatsappLink } from '@/config/store';

export const metadata: Metadata = { title: 'Account', robots: { index: false } };

export default function AccountPage() {
  return (
    <>
      <PageHero
        crumb="Account"
        eyebrow="Account"
        title="Your"
        accent="account."
        lead="Customer accounts arrive with online checkout. Until then your cart and wishlist are saved on this device — no sign-in needed."
      />
      <section className="wrap grid gap-6 pb-28 lg:grid-cols-3">
        <div className="why-tile">
          <span className="why-tile__icon">
            <Icon name="bag" size={24} />
          </span>
          <h2 className="font-display text-[30px] font-extrabold uppercase leading-none">Cart</h2>
          <p className="body-copy mt-2 text-[15px]">Saved automatically. Send it to the counter from checkout for pickup or delivery.</p>
          <Link href="/checkout/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sun-1 hover:text-sun-2">
            Go to checkout <Icon name="arrow-right" size={16} />
          </Link>
        </div>
        <div className="why-tile">
          <span className="why-tile__icon">
            <Icon name="heart" size={24} />
          </span>
          <h2 className="font-display text-[30px] font-extrabold uppercase leading-none">Wishlist</h2>
          <p className="body-copy mt-2 text-[15px]">Everything you’ve hearted, in one place.</p>
          <Link href="/wishlist/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sun-1 hover:text-sun-2">
            View wishlist <Icon name="arrow-right" size={16} />
          </Link>
        </div>
        <div id="orders" className="why-tile scroll-mt-32">
          <span className="why-tile__icon">
            <Icon name="orders" size={24} />
          </span>
          <h2 className="font-display text-[30px] font-extrabold uppercase leading-none">Orders</h2>
          <p className="body-copy mt-2 text-[15px]">Order history will appear here once online checkout is live. For an existing order, message the counter.</p>
          <a href={whatsappLink('Hi Best Deal! Checking on my order:')} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sun-1 hover:text-sun-2">
            Ask about an order <Icon name="arrow-right" size={16} />
          </a>
          <p className="mono mt-4 text-[10.5px] text-muted">Or call {STORE.phone.display}</p>
        </div>
      </section>
    </>
  );
}
