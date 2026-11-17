import Intro from '@/components/home/Intro';
import Hero from '@/components/home/Hero';
import DealsStrip from '@/components/home/DealsStrip';
import Spotlights, { type Spot } from '@/components/home/Spotlights';
import AislesDirectory from '@/components/home/AislesDirectory';
import PureguardStage from '@/components/home/PureguardStage';
import { Reviews, StoreVisit, WhyBestDeal } from '@/components/home/InfoSections';
import Newsletter from '@/components/home/Newsletter';
import LazyHydrate from '@/components/fx/LazyHydrate';
import { byAisle, deals, pureguard, spotlight } from '@/lib/catalog';
import { money, titleWithSize } from '@/lib/format';
import type { LiteProduct } from '@/lib/types';

const skuLabel = (p: LiteProduct) => titleWithSize(p.name, p.v[0].size).toUpperCase().replace(/ (\d)/, ' $1');
const from = (list: LiteProduct[]) => money(Math.min(...list.map((p) => p.price)));

export default function HomePage() {
  const mobil = spotlight('mobil');
  const dewalt = spotlight('dewalt');
  const garden = byAisle('lawn-garden');
  const gardenCards = garden.filter((p) => p.spot === 'garden');

  const spots: Spot[] = [
    {
      key: 'mobil',
      label: 'Mobil',
      category: 'Engine oil',
      title1: 'Mobil',
      title2: 'Products',
      desc: 'Full synthetic, high mileage and heavy-duty diesel oil — the Mobil 1, Mobil Super and Delvac range, stocked for island heat and stop-and-go Beach Road traffic.',
      href: '/shop/?brand=Mobil',
      cta: 'Shop now',
      seeAll: `See all ${mobil.length} Mobil · from ${from(mobil)}`,
      wm: 'Mobil',
      accent: '#8fb8ff',
      bg: 'radial-gradient(ellipse 70% 80% at 72% 50%, rgba(45,90,200,0.55), transparent 70%), linear-gradient(160deg, #0b1838 0%, #050b1c 55%, #030409 100%)',
      products: mobil,
      skus: mobil.map((p) => ({ slug: p.slug, label: skuLabel(p) })),
    },
    {
      key: 'dewalt',
      label: 'DeWalt',
      category: 'Power tools',
      title1: 'DeWalt',
      title2: 'Power tools',
      desc: '20V MAX drills, impact drivers, saws and grinders — plus the batteries and bits that keep a job site moving.',
      href: '/shop/?brand=DeWalt',
      cta: 'Shop now',
      seeAll: `See all ${dewalt.length} DeWalt · from ${from(dewalt)}`,
      wm: 'DeWalt',
      accent: '#ffd21f',
      bg: 'radial-gradient(ellipse 60% 70% at 75% 45%, rgba(255,210,31,0.22), transparent 70%), linear-gradient(160deg, #141414 0%, #0a0a0a 60%, #050505 100%)',
      products: dewalt,
      skus: dewalt.map((p) => ({ slug: p.slug, label: skuLabel(p) })),
    },
    {
      key: 'garden',
      label: 'Garden',
      category: 'Lawn & garden',
      title1: 'Lawn &',
      title2: 'Garden',
      desc: 'Trimmer line, plant food, potting mix, insect control and the hand tools island yards actually need — machetes included.',
      href: '/shop/?aisle=lawn-garden',
      cta: 'Shop now',
      seeAll: `See all ${garden.length} · from ${from(garden)}`,
      wm: 'Garden',
      accent: '#9be36a',
      bg: 'radial-gradient(ellipse 65% 75% at 72% 50%, rgba(60,160,80,0.4), transparent 70%), linear-gradient(160deg, #0b2414 0%, #06140b 55%, #030805 100%)',
      products: gardenCards,
      skus: garden.slice(0, 12).map((p) => ({ slug: p.slug, label: skuLabel(p) })),
    },
  ];

  // Each Suspense boundary hydrates as its own unit, so React can yield to the
  // browser between sections instead of hydrating the whole page in one task.
  // Below the fold, sections keep their server HTML and hydrate only when they
  // approach the viewport (LazyHydrate).
  return (
    <>
      <Intro />
      <Hero />
      <LazyHydrate rootMargin="200px 0px">
        <DealsStrip products={deals()} />
      </LazyHydrate>
      <LazyHydrate>
        <Spotlights spots={spots} />
      </LazyHydrate>
      <LazyHydrate>
        <AislesDirectory />
      </LazyHydrate>
      <LazyHydrate rootMargin="600px 0px">
        <PureguardStage products={pureguard()} />
      </LazyHydrate>
      <LazyHydrate>
        <WhyBestDeal />
        <StoreVisit />
        <Reviews />
      </LazyHydrate>
      <LazyHydrate>
        <Newsletter />
      </LazyHydrate>
    </>
  );
}
