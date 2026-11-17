'use client';
import Link from '@/components/ui/Link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { loadGsap, type Gsap, type ScrollTriggerT } from '@/lib/gsap';
import { afterLoad, scrollToY } from '@/lib/motion';
import { img } from '@/lib/aisles';
import { addToCart } from '@/lib/cart-actions';
import { money } from '@/lib/format';
import type { LiteProduct } from '@/lib/types';

export type Spot = {
  key: string;
  label: string;
  category: string;
  title1: string;
  title2: string;
  desc: string;
  href: string;
  cta: string;
  seeAll: string;
  wm: string;
  accent: string;
  bg: string;
  products: LiteProduct[];
  skus: { slug: string; label: string }[];
};

// Resting positions of the floating cards (fractions of the cloud box) and depth.
const SLOTS = [
  { x: -0.28, y: -0.27, z: -140, w: 196 },
  { x: 0.18, y: -0.33, z: -420, w: 168 },
  { x: 0.3, y: 0.05, z: -60, w: 212 },
  { x: -0.05, y: 0.06, z: 110, w: 236 },
  { x: -0.34, y: 0.31, z: -300, w: 172 },
  { x: 0.2, y: 0.35, z: -180, w: 190 },
  { x: 0.04, y: -0.04, z: -720, w: 150 },
];

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function FloatCard({ p, slot }: { p: LiteProduct; slot: (typeof SLOTS)[number] }) {
  const inner = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const v = p.v.find((x) => x.stock > 0) ?? p.v[0];
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !inner.current) return;
    const r = inner.current.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    inner.current.style.transform = `rotateY(${dx * 22}deg) rotateX(${-dy * 22}deg) translateZ(40px) scale(1.04)`;
  };
  const onLeave = () => {
    if (inner.current) inner.current.style.transform = '';
  };
  return (
    <div className="fcard" style={{ ['--sw' as string]: `${slot.w}px` }}>
      <div ref={inner} className="fcard__inner" onPointerMove={onMove} onPointerLeave={onLeave}>
        <Link href={`/product/${p.slug}/`} data-cursor="view">
          <img ref={imgRef} className="fcard__img" src={img(p.slug)} alt="" width={260} height={260} loading="lazy" decoding="async" />
          <div className="fcard__meta">
            <p className="fcard__name">{p.name}</p>
            <p className="fcard__price">{money(v.price)}</p>
          </div>
        </Link>
        <button type="button" className="fcard__add" disabled={v.stock <= 0} onClick={() => addToCart(p, v, 1, { from: imgRef.current, mode: 'quick' })} aria-label={`Quick add ${p.name} to cart`}>
          Quick add +
        </button>
      </div>
    </div>
  );
}

/** "Your headline products don't sit in a slideshow anymore. They fly." */
export default function Spotlights({ spots }: { spots: Spot[] }) {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<{ start: number; end: number } | null>(null);
  const libRef = useRef<{ gsap: Gsap; ScrollTrigger: ScrollTriggerT } | null>(null);
  const [stage, setStage] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const on = () => setStage(mq.matches);
    let dead = false;
    // Pinning measures the whole page — load GSAP and set it up once the page
    // is idle (the section sits below the fold).
    const cancel = afterLoad(() => {
      loadGsap().then((lib) => {
        if (dead) return;
        libRef.current = lib;
        on();
        mq.addEventListener('change', on);
      });
    });
    return () => {
      dead = true;
      cancel();
      mq.removeEventListener('change', on);
    };
  }, []);

  useIso(() => {
    const el = root.current;
    const lib = libRef.current;
    if (!stage || !el || !lib) return;
    const { gsap, ScrollTrigger } = lib;
    const panels = Array.from(el.querySelectorAll<HTMLElement>('.spot'));
    const cards = panels.map((p) => Array.from(p.querySelectorAll<HTMLElement>('.fcard')));
    const texts = panels.map((p) => p.querySelector<HTMLElement>('.spot__text'));
    const clouds = panels.map((p) => p.querySelector<HTMLElement>('.spot__cloud'));
    const segs = Array.from(el.querySelectorAll<HTMLElement>('.rail-seg i'));
    const n = panels.length;
    let pre = 0;
    let prog = 0;
    let last = -1;
    let dims = clouds.map((c) => ({ w: c?.clientWidth || 600, h: c?.clientHeight || 560 }));

    const render = () => {
      const P = prog * n;
      panels.forEach((panel, i) => {
        const u = i === 0 ? pre * 0.45 + Math.min(1, P) * 0.55 : P - i;
        const on = i === 0 ? P < 1 : i === n - 1 ? P >= i : P >= i && P < i + 1;
        panel.classList.toggle('is-active', on);
        if (!on) return;
        const t = texts[i];
        if (t) {
          let o = 1;
          let y = 0;
          if (i > 0 && u < 0.14) {
            o = clamp(u / 0.14);
            y = (1 - o) * 40;
          }
          if (i < n - 1 && u > 0.86) {
            o = clamp(1 - (u - 0.86) / 0.14);
            y = -(1 - o) * 40;
          }
          t.style.opacity = o.toFixed(3);
          t.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
        }
        const { w, h } = dims[i];
        cards[i].forEach((c, k) => {
          const s = SLOTS[k % SLOTS.length];
          const a = clamp(u / 0.45);
          const e = 1 - Math.pow(1 - a, 3);
          const drift = Math.max(0, u - 0.45);
          const z = lerp(-2600, s.z, e) + drift * 620;
          const spread = 0.5 + 0.5 * e + drift * 0.28;
          const x = s.x * w * spread;
          const y = s.y * h * spread;
          const ry = (1 - e) * s.x * -55;
          const rx = (1 - e) * s.y * 45;
          let o = clamp(a / 0.35);
          if (i < n - 1 && u > 0.8) o *= clamp(1 - (u - 0.8) / 0.16);
          c.style.opacity = o.toFixed(3);
          c.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`;
          c.style.zIndex = String(Math.round(z + 3000));
          c.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
        });
      });
      segs.forEach((s, i) => (s.style.transform = `scaleY(${clamp(P - i).toFixed(3)})`));
      const cur = Math.min(n - 1, Math.floor(P));
      if (cur !== last) {
        last = cur;
        setActive(cur);
      }
    };

    const ctx = gsap.context(() => {
      pinRef.current = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: () => `+=${window.innerHeight * n}`,
        pin: true,
        anticipatePin: 1,
        onUpdate: (s) => {
          prog = s.progress;
          render();
        },
        onRefresh: (s) => {
          dims = clouds.map((c) => ({ w: c?.clientWidth || 600, h: c?.clientHeight || 560 }));
          prog = s.progress;
          render();
        },
      });
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'top top',
        onUpdate: (s) => {
          pre = s.progress;
          render();
        },
      });
    }, el);
    render();
    ScrollTrigger.refresh();
    return () => {
      ctx.revert();
      pinRef.current = null;
      el.querySelectorAll<HTMLElement>('.fcard, .spot__text').forEach((c) => {
        ['opacity', 'transform', 'z-index', 'pointer-events'].forEach((prop) => c.style.removeProperty(prop));
      });
      panels.forEach((p) => p.classList.remove('is-active'));
    };
  }, [stage, spots.length]);

  const jump = (i: number) => {
    const st = pinRef.current;
    if (!st) {
      document.getElementById(`spot-${spots[i].key}`)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    scrollToY(st.start + ((st.end - st.start) * (i + 0.42)) / spots.length);
  };

  return (
    <section ref={root} className={`spots ${stage ? 'spots--stage' : ''}`} aria-label="Brand spotlights">
      {spots.map((s, i) => (
        <article key={s.key} id={`spot-${s.key}`} className={`spot ${!stage || i === 0 ? 'is-active' : ''}`} style={{ ['--accent' as string]: s.accent }} aria-labelledby={`spot-title-${s.key}`}>
          <div className="spot__bg" style={{ background: s.bg }} aria-hidden="true" />
          <div className="spot__wm" aria-hidden="true">
            {s.wm}
          </div>
          <div className="wrap spot__grid">
            <div className="spot__text">
              <p className="eyebrow !text-cream/70">
                {String(i + 1).padStart(2, '0')} / {String(spots.length).padStart(2, '0')} · Now showing · {s.category}
              </p>
              <h2 id={`spot-title-${s.key}`} className="display spot__title mt-5">
                {s.title1}
                <span className="l2">{s.title2}</span>
              </h2>
              <p className="body-copy mt-6 max-w-[440px] !text-cream/75">{s.desc}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link href={s.href} className="btn btn-primary" data-magnetic>
                  {s.cta} <Icon name="arrow-right" size={18} className="arrow" />
                </Link>
                <Link href={s.href} className="mono text-[11px] text-cream/70 underline-offset-4 hover:text-cream hover:underline">
                  {s.seeAll}
                </Link>
              </div>
            </div>
            <div className="spot__cloud" role="list" aria-label={`${s.title1} ${s.title2}`}>
              {s.products.slice(0, SLOTS.length).map((p, k) => (
                <div role="listitem" key={p.id} className="contents">
                  <FloatCard p={p} slot={SLOTS[k]} />
                </div>
              ))}
            </div>
            <ul className="spot__skus hidden xl:block" aria-label="SKUs">
              {s.skus.map((k) => (
                <li key={k.slug}>
                  <Link href={`/product/${k.slug}/`}>{k.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
      <div className="spot-rail" role="tablist" aria-label="Jump to spotlight">
        {spots.map((s, i) => (
          <button key={s.key} type="button" role="tab" aria-selected={active === i} className={`rail-item ${active === i ? 'is-active' : ''}`} onClick={() => jump(i)}>
            <span className="rail-seg">
              <i />
            </span>
            <span className="rail-label">
              {String(i + 1).padStart(2, '0')}
              <b>{s.label}</b>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
