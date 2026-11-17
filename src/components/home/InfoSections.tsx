import Icon from '@/components/ui/Icon';
import { OpenBadge } from '@/components/ui/OpenStatus';
import { STORE } from '@/config/store';
import { REVIEWS } from '@/data/reviews';
import HoursList from './HoursList';
import MapEmbed from './MapEmbed';
import Storefront from './Storefront';

const WHY = [
  { icon: 'calendar', title: 'Since 2014', body: `Serving Saipan from ${STORE.address.line1} since ${STORE.established} — and adding aisles as the island asks for them.` },
  { icon: 'truck', title: 'Island delivery', body: `Order online and we bring it to you on Saipan — free over $${STORE.freeDeliveryThreshold}. Or pick up at the counter.` },
  { icon: 'wrench', title: 'Expert counter advice', body: 'Not sure which oil grade, breaker or trimmer line fits? Bring the old part — we’ll match it.' },
  { icon: 'tag', title: 'Fair island prices', body: 'Shelf prices that make sense for the Marianas, plus a new Deal of the Week every week.' },
];

export function WhyBestDeal() {
  return (
    <section className="section vignette cv-auto" aria-labelledby="why-title">
      <div className="wrap">
        <div className="mb-12 max-w-3xl" data-reveal>
          <p className="eyebrow">
            <Icon name="star" size={14} /> Why Best Deal
          </p>
          <h2 id="why-title" className="display h-section mt-4">
            The island’s <span className="grad-sun">counter.</span>
          </h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <li key={w.title} className="why-tile" data-reveal style={{ ['--i' as string]: i }}>
              <span className="why-tile__icon">
                <Icon name={w.icon} size={24} />
              </span>
              <h3>{w.title}</h3>
              <p className="body-copy mt-3 text-[15px]">{w.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function StoreVisit() {
  return (
    <section className="section cv-auto !pt-10" id="visit" aria-labelledby="visit-title">
      <div className="wrap grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div data-reveal>
          <MapEmbed />
        </div>
        <div className="glass flex flex-col p-6 sm:p-8" data-reveal style={{ ['--i' as string]: 1 }}>
          <p className="eyebrow">
            <Icon name="pin" size={14} /> Visit the store
          </p>
          <h2 id="visit-title" className="display h-sub mt-4">
            {STORE.address.line1},
            <br />
            <span className="grad-sun">Garapan</span>
          </h2>
          <p className="mt-3 text-cream/80">{STORE.address.line2}</p>
          <OpenBadge className="mono mt-5 text-[11.5px]" />
          <HoursList className="mt-5" />
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={STORE.maps.directions} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" data-magnetic>
              <Icon name="pin" size={16} /> Get directions
            </a>
            <a href={`tel:${STORE.phone.tel}`} className="btn btn-glass btn-sm">
              <Icon name="phone" size={16} /> {STORE.phone.display}
            </a>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-line">
            <Storefront />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Real reviews only. Paste genuine Google reviews into src/data/reviews.ts — never invented. */
export function Reviews() {
  return (
    <section className="section !pt-6" aria-labelledby="reviews-title">
      <div className="wrap">
        <div className="flex flex-col gap-8 rounded-[32px] border border-line bg-white/[0.02] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between" data-reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">
              <Icon name="star" size={14} /> Customer reviews
            </p>
            <h2 id="reviews-title" className="display h-sub mt-4">
              {REVIEWS.length ? 'What the island says' : 'Shopped Beach Road? Tell the island.'}
            </h2>
            {!REVIEWS.length && <p className="body-copy mt-4">Read what other shoppers say about Best Deal on Google, or leave a review of your own — it helps neighbours find the right counter.</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={STORE.maps.reviews} target="_blank" rel="noopener noreferrer" className="btn btn-cream">
              Read Google reviews <Icon name="arrow-up-right" size={17} />
            </a>
            <a href={STORE.maps.reviews} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
              Write a review
            </a>
          </div>
        </div>
        {REVIEWS.length > 0 && (
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <li key={i} className="why-tile" data-reveal style={{ ['--i' as string]: i }}>
                <p className="flex gap-1 text-sun-1" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, k) => (
                    <Icon key={k} name="star" size={16} className={k < r.rating ? 'fill-current' : 'opacity-30'} />
                  ))}
                </p>
                <blockquote className="mt-4 text-[15.5px] leading-relaxed text-cream/85">“{r.text}”</blockquote>
                <p className="mono mt-5 text-[10.5px] text-muted">
                  {r.author} · {r.source}
                  {r.date ? ` · ${r.date}` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
