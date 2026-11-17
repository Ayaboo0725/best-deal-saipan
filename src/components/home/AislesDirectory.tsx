'use client';
import Link from '@/components/ui/Link';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { AISLES, STOCKED_AISLES, TOTAL_PRODUCTS, img } from '@/lib/aisles';
import { loadGsap, type GsapContext } from '@/lib/gsap';
import { afterLoad, finePointer, prefersReduced } from '@/lib/motion';
import type { Aisle } from '@/lib/types';

/** "21 AISLES. ONE COUNTER." — rows with a cursor-following product preview. */
export default function AislesDirectory() {
  const section = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Aisle | null>(null);

  // Cursor-follow preview (desktop).
  useEffect(() => {
    const el = section.current;
    const pv = preview.current;
    if (!el || !pv || !finePointer()) return;
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0, running = false;
    const loop = () => {
      cx += (x - cx) * 0.16;
      cy += (y - cy) * 0.16;
      pv.style.left = `${cx}px`;
      pv.style.top = `${cy}px`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left + 28;
      y = e.clientY - r.top - 120;
      if (!running) {
        cx = x;
        cy = y;
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    const leave = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Rows animate in with a stagger as the list enters the viewport.
  useEffect(() => {
    const el = section.current;
    if (!el || prefersReduced()) return;
    let ctx: GsapContext | null = null;
    let dead = false;
    const cancel = afterLoad(() => {
      loadGsap().then(({ gsap, ScrollTrigger }) => {
        // Skip if the list is already on screen (e.g. deep link to #aisles).
        if (dead || el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
        ctx = gsap.context(() => {
          const rows = gsap.utils.toArray<HTMLElement>('.aisle-row');
          gsap.set(rows, { opacity: 0, y: 24 });
          ScrollTrigger.batch(rows, {
            start: 'top 92%',
            once: true,
            onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.06, overwrite: true }),
          });
        }, el);
      });
    });
    return () => {
      dead = true;
      cancel();
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={section} id="aisles" className="section relative" aria-labelledby="aisles-title" onPointerLeave={() => setHover(null)}>
      <div className="wrap">
        <div className="mb-14 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div data-reveal>
            <p className="eyebrow">
              <Icon name="grid" size={14} /> · The aisles
            </p>
            <h2 id="aisles-title" className="display h-section mt-4">
              {AISLES.length} aisles.
              <br />
              <span className="grad-sun">One counter.</span>
            </h2>
          </div>
          <p className="body-copy max-w-md lg:justify-self-end" data-reveal style={{ ['--i' as string]: 1 }}>
            From engine oil and brake fluid to trimmer line, bulbs and butane: {TOTAL_PRODUCTS} products in {STOCKED_AISLES} stocked aisles, with more arriving.
          </p>
        </div>

        <ul className="aisle-list">
          {AISLES.map((a) => {
            const inner = (
              <>
                <span className="aisle-row__num">{String(a.num).padStart(2, '0')}</span>
                <Icon name={a.icon} size={22} className="aisle-row__icon" />
                <span className="aisle-row__name">{a.name}</span>
                <span className="aisle-row__count">
                  {a.popular && (
                    <span className="badge badge-hot">
                      <Icon name="flame" size={11} /> Popular
                    </span>
                  )}
                  {a.stocked ? `${a.count} products` : <span className="badge badge-soon">Coming soon</span>}
                </span>
                <Icon name="arrow-right" size={18} className="aisle-row__arrow" />
                {a.featured ? <img className="aisle-row__thumb" src={img(a.featured.slug)} alt="" width={56} height={56} loading="lazy" decoding="async" /> : <span className="aisle-row__thumb hidden" />}
              </>
            );
            return (
              <li key={a.slug}>
                {a.stocked ? (
                  <Link
                    href={`/shop/?aisle=${a.slug}`}
                    className="aisle-row"
                    data-cursor="view"
                    onPointerEnter={() => setHover(a)}
                    onFocus={() => setHover(null)}
                    aria-label={`Aisle ${a.num}: ${a.name}, ${a.count} products${a.popular ? ', popular' : ''}`}
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="aisle-row is-soon" onPointerEnter={() => setHover(null)} aria-disabled="true">
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div ref={preview} className={`aisle-preview hidden md:block ${hover?.featured ? 'is-on' : ''}`} aria-hidden="true">
        {hover?.featured && (
          <div className="aisle-preview__card">
            <img src={img(hover.featured.slug)} alt="" width={230} height={230} />
            <p>
              <span className="mono mb-1 block text-[9.5px] text-sun-1">
                Aisle {String(hover.num).padStart(2, '0')} · {hover.name}
              </span>
              {hover.featured.name}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
