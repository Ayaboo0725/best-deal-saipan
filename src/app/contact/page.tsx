import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import Icon from '@/components/ui/Icon';
import { OpenBadge } from '@/components/ui/OpenStatus';
import HoursList from '@/components/home/HoursList';
import ContactForm from '@/components/layout/ContactForm';
import { STORE, messengerLink, whatsappLink } from '@/config/store';

export const metadata: Metadata = { title: 'Contact us', description: `Call, WhatsApp, Messenger or visit Best Deal on ${STORE.address.short}, Saipan.` };

export default function ContactPage() {
  const cards = [
    { icon: 'phone', title: 'Call the counter', body: STORE.phone.display, href: `tel:${STORE.phone.tel}`, cta: 'Call now' },
    { icon: 'whatsapp', title: 'WhatsApp', body: 'Photos of parts welcome', href: whatsappLink('Hi Best Deal!'), cta: 'Open WhatsApp', ext: true },
    { icon: 'messenger', title: 'Messenger', body: 'Message us on Facebook', href: messengerLink(), cta: 'Open Messenger', ext: true },
    { icon: 'pin', title: 'Visit', body: `${STORE.address.line1}, ${STORE.address.line2}`, href: STORE.maps.directions, cta: 'Get directions', ext: true },
  ];
  return (
    <>
      <PageHero crumb="Contact us" eyebrow="Contact" title="Talk to" accent="the counter." lead="Questions about a part, an order or stock? Reach us the way that suits you — or come by the store." />
      <section className="wrap pb-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <li key={c.title} data-reveal style={{ ['--i' as string]: i }}>
              <a href={c.href} target={c.ext ? '_blank' : undefined} rel={c.ext ? 'noopener noreferrer' : undefined} className="why-tile group flex h-full flex-col">
                <span className="why-tile__icon">
                  <Icon name={c.icon} size={24} />
                </span>
                <h2 className="font-display text-[28px] font-extrabold uppercase leading-none">{c.title}</h2>
                <p className="body-copy mt-2 text-[15px]">{c.body}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-sun-1 group-hover:text-sun-2">
                  {c.cta} <Icon name="arrow-right" size={16} />
                </span>
              </a>
            </li>
          ))}
        </ul>
        {STORE.email && (
          <p className="mt-6 text-sm text-muted">
            Email: <a className="text-cream hover:text-sun-2" href={`mailto:${STORE.email}`}>{STORE.email}</a>
          </p>
        )}
      </section>
      <section className="wrap grid gap-6 pb-28 pt-10 lg:grid-cols-[1.2fr_1fr]">
        <ContactForm />
        <div className="glass p-6 sm:p-8">
          <p className="eyebrow">
            <Icon name="clock" size={14} /> Store hours · ChST
          </p>
          <OpenBadge className="mono mt-4 text-[11.5px]" />
          <HoursList className="mt-4" />
        </div>
      </section>
    </>
  );
}
