import type { Metadata } from 'next';
import Link from '@/components/ui/Link';
import PageHero from '@/components/layout/PageHero';
import Icon from '@/components/ui/Icon';
import { STORE } from '@/config/store';
import { AISLES, STOCKED_AISLES, TOTAL_PRODUCTS } from '@/lib/aisles';
import { StoreVisit } from '@/components/home/InfoSections';

export const metadata: Metadata = { title: 'About us', description: `Best Deal has kept Saipan moving since ${STORE.established} — island hardware, auto and home supply on Beach Road, Garapan.` };

export default function AboutPage() {
  const stats = [
    { n: String(STORE.since), l: 'Since — opened October 2014' },
    { n: String(TOTAL_PRODUCTS), l: 'Products on the shelves' },
    { n: String(AISLES.length), l: 'Aisles under one roof' },
    { n: String(STOCKED_AISLES), l: 'Aisles stocked today' },
  ];
  return (
    <>
      <PageHero
        crumb="About us"
        eyebrow={`Est. ${STORE.established}`}
        title="Keeping the islands"
        accent="moving."
        lead={`Since ${STORE.since}, Best Deal has been the counter on ${STORE.address.line1} for engine oil, power tools, lighting, lawn & garden, pool and island home supplies.`}
      />
      <section className="wrap pb-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <li key={s.l} className="why-tile" data-reveal style={{ ['--i' as string]: i }}>
              <p className="display grad-sun text-[clamp(64px,7vw,96px)]">{s.n}</p>
              <p className="mono mt-3 text-[11px] text-muted">{s.l}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="wrap grid gap-12 py-20 lg:grid-cols-[1fr_1.2fr]">
        <h2 className="display h-sub" data-reveal>
          One counter.
          <br />
          <span className="text-muted">Everything the island runs on.</span>
        </h2>
        <div className="prose" data-reveal style={{ ['--i' as string]: 1 }}>
          <p>
            Best Deal opened in {STORE.established} on {STORE.address.line1} in Garapan as an island hardware, auto and home supply store — the counter for the things Saipan runs on: oil for cars, scooters and boats, butane for the kitchen, lights and batteries for typhoon season.
          </p>
          <p>
            Today that means {TOTAL_PRODUCTS} products across {STOCKED_AISLES} stocked aisles, from Mobil and Pureguard lubricants to DeWalt power tools, trimmer line, pool chemicals and rice cookers — with {AISLES.length - STOCKED_AISLES} more aisles on the way.
          </p>
          <p>
            The new website brings the whole counter online: search every product, check what’s in stock, build a cart for pickup or island delivery, and message us when you need a second opinion on a part.
          </p>
          <div className="not-prose mt-8 flex flex-wrap gap-3">
            <Link href="/shop/" className="btn btn-primary" data-magnetic>
              Shop all aisles <Icon name="arrow-right" size={18} className="arrow" />
            </Link>
            <Link href="/contact/" className="btn btn-glass">
              Contact us
            </Link>
          </div>
        </div>
      </section>
      <StoreVisit />
    </>
  );
}
