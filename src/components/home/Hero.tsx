import Link from '@/components/ui/Link';
import SunsetScene from '@/components/scene/SunsetScene';
import Icon from '@/components/ui/Icon';
import { OpenBadge, SaipanClock } from '@/components/ui/OpenStatus';
import { STORE } from '@/config/store';
import { STOCKED_AISLES, TOTAL_PRODUCTS } from '@/lib/aisles';
import HeroFX, { SearchCTA } from './HeroFX';

/** Letter-stagger spans (0.04s per char via --i). Screen readers get the h1 label. */
function chars(text: string, offset = 0) {
  let i = offset;
  const words = text.split(' ');
  return words.map((w, wi) => (
    <span key={wi}>
      <span className="inline-block whitespace-nowrap">
        {w.split('').map((c, ci) => (
          <span key={ci} className="char" style={{ ['--i' as string]: i++ }}>
            {c}
          </span>
        ))}
      </span>
      {wi < words.length - 1 ? ' ' : null}
    </span>
  ));
}

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__scene">
        <SunsetScene variant="hero" />
      </div>
      <div className="hero__shade" aria-hidden="true" />
      <div className="wrap hero__content">
        <div className="hero__copy">
          <p className="eyebrow h-in" style={{ ['--d' as string]: 0 }}>
            <span className="dot" /> Beach Road, Saipan · Garapan · Since {STORE.since}
          </p>
          <h1 id="hero-title" aria-label="The best deals in the Marianas">
            <span className="display h1-a" aria-hidden="true">
              {chars('The best deals')}
            </span>
            <span className="display h1-b" aria-hidden="true">
              {chars('In the', 14)}
            </span>
            <span className="display h1-c grad-sun sweep" aria-hidden="true">
              Marianas
            </span>
          </h1>
          <p className="body-copy h-in max-w-[560px] !text-cream/80" style={{ ['--d' as string]: 2 }}>
            Lubricants, power tools, lighting, lawn &amp; garden, pool and island home supplies: {TOTAL_PRODUCTS} products across {STOCKED_AISLES} stocked aisles, from the counter on {STORE.address.line1}.
          </p>
          <div className="h-in mt-8 flex flex-wrap gap-3" style={{ ['--d' as string]: 3 }}>
            <Link href="/shop/" className="btn btn-primary" data-magnetic>
              Shop all aisles <Icon name="arrow-right" size={18} className="arrow" />
            </Link>
            <SearchCTA />
          </div>
          <ul className="trust h-in" style={{ ['--d' as string]: 4 }} aria-label="Why shop with us">
            <li>
              <Icon name="store" size={16} /> In-store pickup
            </li>
            <li>
              <Icon name="truck" size={16} /> Island delivery
            </li>
            <li>
              <Icon name="card" size={16} /> Visa / Mastercard
            </li>
            <li>
              <Icon name="calendar" size={16} /> Since {STORE.since}
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap hero__bar h-in" style={{ ['--d' as string]: 5 }}>
        <span>{STORE.coords.label}</span>
        <span className="scroll-cue" aria-hidden="true">
          <i />
          Scroll to explore
        </span>
        <span className="flex h-[3em] flex-col items-end justify-center gap-1 whitespace-nowrap md:h-auto md:flex-row md:items-center md:gap-3">
          <span>
            Saipan · <SaipanClock /> ChST
          </span>
          <OpenBadge detailClassName="hidden lg:inline" />
        </span>
      </div>
      <HeroFX />
    </section>
  );
}
