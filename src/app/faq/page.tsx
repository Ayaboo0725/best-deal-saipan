import type { Metadata } from 'next';
import Link from '@/components/ui/Link';
import PageHero from '@/components/layout/PageHero';
import Icon from '@/components/ui/Icon';
import { STORE, whatsappLink } from '@/config/store';
import { AISLES } from '@/lib/aisles';
import { DAYS, hoursLabel } from '@/lib/hours';

export const metadata: Metadata = { title: 'FAQ', description: 'Delivery, pickup, payment, hours and product questions — answered by the Best Deal counter.' };

// TODO(client): confirm every answer (delivery area/fees, returns policy) before launch.
const soon = AISLES.filter((a) => !a.stocked).map((a) => a.name);
const FAQ: { q: string; a: string }[] = [
  { q: 'Do you deliver?', a: `Yes — island delivery on Saipan. Delivery is free on orders over $${STORE.freeDeliveryThreshold}; smaller orders have a flat $${STORE.deliveryFee} fee. ${STORE.deliveryNote}` },
  { q: 'Can I pick up in store?', a: `Yes, pickup is free. Collect your order at the counter on ${STORE.address.short} during store hours — in-stock items are usually ready the same day.` },
  { q: 'Can I order online?', a: 'You can build a cart today. Online payment is being set up — until it goes live, send your cart to us by WhatsApp from the checkout page or call the store and we’ll have it ready.' },
  { q: 'Which payment methods do you take?', a: `${STORE.payments.join(', ')}.` },
  { q: 'What are your store hours?', a: [1, 2, 3, 4, 5, 6, 0].map((d) => `${DAYS[d]}: ${hoursLabel(d)}`).join(' · ') + ' (Chamorro Standard Time).' },
  { q: 'Can you help me find the right oil or part?', a: 'That’s what the counter is for. Bring the old part, the bottle or a photo — or message us your make, model and year — and we’ll match it.' },
  { q: 'Do you carry Pureguard?', a: 'Yes — the full Pureguard line: 2-cycle and marine TC-W3 oil, gear oil, hydraulic oil and ATF, 30 codes in sizes from 2.6oz to 5-gallon pails.' },
  { q: 'What about returns?', a: 'Bring the item and your receipt to the counter and we’ll sort it out. Some items (opened chemicals, cut wire, electrical parts) may not be returnable — ask us first if you’re unsure.' },
  { q: 'What’s coming next?', a: `${soon.join(', ')} — these aisles are on the way. Sign up for the deals list to hear first.` },
];

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero crumb="FAQ" eyebrow="Questions" title="Ask the" accent="counter." lead="Quick answers about delivery, pickup, payment and products. Can’t find yours? Message us — we usually reply during store hours." />
      <section className="wrap grid gap-12 pb-28 lg:grid-cols-[1fr_340px]">
        <div>
          {FAQ.map((f, i) => (
            <details key={f.q} className="faq-item" open={i === 0}>
              <summary>
                {f.q}
                <Icon name="plus" size={22} />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <aside className="glass h-max p-6">
          <p className="display text-[34px]">Still stuck?</p>
          <p className="body-copy mt-2 text-sm">Send a photo of the part or a quick question.</p>
          <div className="mt-5 flex flex-col gap-2">
            <a className="btn btn-primary btn-sm" href={whatsappLink('Hi Best Deal! I have a question:')} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={16} /> WhatsApp us
            </a>
            <a className="btn btn-glass btn-sm" href={`tel:${STORE.phone.tel}`}>
              <Icon name="phone" size={16} /> {STORE.phone.display}
            </a>
            <Link className="btn btn-glass btn-sm" href="/contact/">
              All contact options
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
