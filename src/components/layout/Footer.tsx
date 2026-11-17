import Link from '@/components/ui/Link';
import Icon from '@/components/ui/Icon';
import { TagMark } from '@/components/ui/TagLogo';
import { OpenBadge } from '@/components/ui/OpenStatus';
import { AISLES } from '@/lib/aisles';
import { DAYS, hoursLabel } from '@/lib/hours';
import { NAV, STORE, whatsappLink } from '@/config/store';

export default function Footer() {
  const cols = [AISLES.slice(0, 7), AISLES.slice(7, 14), AISLES.slice(14)];
  const year = new Date().getFullYear();
  return (
    <footer className="footer cv-auto" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Best Deal store information
      </h2>
      <div className="wrap grid gap-12 pb-12 pt-20 lg:grid-cols-[1.1fr_2fr]">
        <div>
          <Link href="/" className="brand">
            <TagMark className="w-[64px]" />
            <span>
              <span className="brand__word text-[34px]">Best Deal</span>
              <span className="brand__sub">Est. {STORE.established}</span>
            </span>
          </Link>
          <p className="body-copy mt-6 max-w-sm">
            Island hardware, auto and home supply on {STORE.address.line1}, Garapan. The best deals in the Marianas — from the counter, since {STORE.since}.
          </p>
          <div className="mt-6 space-y-2 text-sm text-cream/85">
            <p className="flex items-start gap-3">
              <Icon name="pin" size={18} className="mt-0.5 text-sun-1" />
              <span>
                {STORE.address.line1}
                <br />
                {STORE.address.line2}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Icon name="phone" size={18} className="text-sun-1" />
              <a href={`tel:${STORE.phone.tel}`} className="hover:text-sun-2">
                {STORE.phone.display}
              </a>
            </p>
            <OpenBadge className="mono pt-1 text-[11px]" />
          </div>
          <div className="mt-6 flex gap-2">
            <a className="icon-btn border border-line" href={STORE.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Best Deal on Facebook">
              <Icon name="facebook" />
            </a>
            <a className="icon-btn border border-line" href={STORE.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Best Deal on Instagram">
              <Icon name="instagram" />
            </a>
            <a className="icon-btn border border-line" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Message Best Deal on WhatsApp">
              <Icon name="whatsapp" />
            </a>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr]">
          <div>
            <h3 className="f-head">Aisles</h3>
            <div className="grid grid-cols-2 gap-x-6 md:grid-cols-3">
              {cols.map((col, i) => (
                <ul key={i}>
                  {col.map((a) => (
                    <li key={a.slug}>
                      {a.stocked ? (
                        <Link className="f-link" href={`/shop/?aisle=${a.slug}`}>
                          {a.name}
                        </Link>
                      ) : (
                        <span className="block py-[5px] text-sm text-muted">
                          {a.name} <span className="mono text-[9px] text-sun-2">Soon</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <div>
            <h3 className="f-head">Store</h3>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link className="f-link" href={n.href}>
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="f-link" href="/wishlist/">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link className="f-link" href="/account/">
                  Account
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="f-head">Hours · ChST</h3>
            <ul className="space-y-1.5 text-sm text-cream/80">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                <li key={d} className="flex justify-between gap-4">
                  <span>{DAYS[d].slice(0, 3)}</span>
                  <span className="text-cream/65">{hoursLabel(d)}</span>
                </li>
              ))}
            </ul>
            <h3 className="f-head mt-8">We accept</h3>
            <div className="flex flex-wrap gap-2">
              {STORE.payments.map((p) => (
                <span key={p} className="pay-badge">
                  {p.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="wrap flex flex-col gap-3 border-t border-line py-6 text-[12.5px] text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {year} Best Deal, Garapan, Saipan. All rights reserved. Prices in USD.
        </p>
        <p>
          A website by{' '}
          <a href={STORE.credit.url} className="text-cream/85 underline-offset-4 hover:text-sun-2 hover:underline">
            {STORE.credit.label}
          </a>
        </p>
      </div>
      <div className="sunset-band" aria-hidden="true" />
    </footer>
  );
}
