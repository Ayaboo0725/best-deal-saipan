import Link from '@/components/ui/Link';
import Icon from '@/components/ui/Icon';
import ProductCard from '@/components/product/ProductCard';
import Countdown from './Countdown';
import type { LiteProduct } from '@/lib/types';

const TICKER = ['Deal of the week', 'In-store pickup', 'Island delivery', 'Best deals in the Marianas', 'Since 2014', 'Beach Road, Garapan'];
const SPARK = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5 13.8 10l6.7 2-6.7 2L12 20.5 10.2 14l-6.7-2 6.7-2z"/></svg>';
const ROW = [...TICKER, ...TICKER].map((t) => `<span class="marquee__item">${t} ${SPARK}</span>`).join('');
// Static ticker markup — decorative, so it skips hydration entirely.
const MARQUEE = `<div class="marquee__track"><div class="flex">${ROW}</div><div class="flex">${ROW}</div></div>`;

/** ✦ Deal of the week: countdown + 4 discounted products. */
export default function DealsStrip({ products }: { products: LiteProduct[] }) {
  return (
    <>
      <div className="marquee" aria-hidden="true" dangerouslySetInnerHTML={{ __html: MARQUEE }} />
      <section className="deals section !pt-20" aria-labelledby="deals-title">
        <div className="wrap">
          <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div data-reveal>
              <p className="eyebrow">
                <Icon name="tag" size={14} /> This week only
              </p>
              <h2 id="deals-title" className="display h-section mt-4">
                Deal of <span className="grad-sun">the week</span>
              </h2>
              <p className="body-copy mt-4 max-w-xl">Four markdowns from the counter this week. When the clock hits zero, prices go back.</p>
            </div>
            <div data-reveal style={{ ['--i' as string]: 1 }} className="flex flex-col gap-4 lg:items-end">
              <p className="mono text-[11px] text-muted">Ends Sunday 11:59 PM ChST</p>
              <Countdown />
            </div>
          </div>
          <div className="pgrid">
            {products.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/shop/?sort=sale" className="btn btn-glass">
              See every markdown <Icon name="arrow-right" size={18} className="arrow" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
