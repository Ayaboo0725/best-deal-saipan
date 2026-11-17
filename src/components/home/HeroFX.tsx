'use client';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { TOTAL_PRODUCTS } from '@/lib/aisles';
import { useUI } from '@/lib/store';
import { loadGsap, type GsapContext } from '@/lib/gsap';
import { afterLoad, finePointer, prefersReduced } from '@/lib/motion';

export function SearchCTA() {
  const set = useUI((s) => s.set);
  const [mac, setMac] = useState(true);
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)), []);
  return (
    <button type="button" className="btn btn-glass" onClick={() => set({ searchOpen: true })}>
      <Icon name="search" size={18} /> Search {TOTAL_PRODUCTS} products <kbd className="kbd ml-1 hidden sm:inline-flex">{mac ? '⌘K' : 'Ctrl K'}</kbd>
    </button>
  );
}

/** Layered parallax (mouse / gyro), animated water shimmer, scroll-scrubbed zoom-through. */
export default function HeroFX() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hero = ref.current?.closest('.hero') as HTMLElement | null;
    if (!hero) return;
    let teardown: (() => void) | null = null;
    // Decorative motion starts after load so it never competes with hydration.
    const cancel = afterLoad(() => {
      teardown = setup(hero);
    });
    return () => {
      cancel();
      teardown?.();
    };
  }, []);

  return <span ref={ref} hidden />;
}

function setup(hero: HTMLElement) {
  {
    const reduce = prefersReduced();
    const layers = Array.from(hero.querySelectorAll<HTMLElement>('.hero__scene [data-depth]')).map((el) => ({ el, d: Number(el.dataset.depth || 0) }));
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(hero);

    // ── parallax ────────────────────────────────────────────────────────
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 25));
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
    };
    if (!reduce) {
      if (finePointer()) window.addEventListener('pointermove', onMove, { passive: true });
      else window.addEventListener('deviceorientation', onTilt, { passive: true });
    }

    // ── water shimmer (canvas) ─────────────────────────────────────────
    const canvas = hero.querySelector<HTMLCanvasElement>('canvas[data-water]');
    const ctx = canvas?.getContext('2d') ?? null;
    const lines = Array.from({ length: 70 }, (_, i) => {
      const yf = Math.pow((i + Math.random()) / 70, 1.5);
      return { yf, x: (Math.random() * 2 - 1) * (0.25 + yf * 0.75), len: 8 + yf * 70 * (0.4 + Math.random() * 0.6), th: 1 + yf * 1.6, sp: 0.8 + Math.random() * 1.8, ph: Math.random() * 6.28, warm: Math.random() > 0.35 };
    });
    let cw = 0, ch = 0, dpr = 1;
    const size = () => {
      if (!canvas || !ctx) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cw = canvas.clientWidth;
      ch = canvas.clientHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const drawWater = (t: number) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, cw, ch);
      for (const l of lines) {
        const a = 0.15 + 0.55 * (0.5 + 0.5 * Math.sin(t * l.sp + l.ph));
        const x = cw / 2 + l.x * cw * 0.5 + Math.sin(t * 0.6 + l.ph) * 6 * l.yf;
        const len = l.len * (0.65 + 0.35 * Math.sin(t * l.sp * 0.7 + l.ph));
        ctx.globalAlpha = a * (1 - l.yf * 0.55);
        ctx.fillStyle = l.warm ? '#ffdca6' : '#ff9a4a';
        ctx.fillRect(x - len / 2, l.yf * ch, len, l.th);
      }
    };
    if (reduce) drawWater(1.2);

    let lastWater = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const nx = cx + (tx - cx) * 0.06;
      const ny = cy + (ty - cy) * 0.06;
      // Only touch the DOM while the parallax is actually moving.
      if (Math.abs(nx - cx) > 0.0005 || Math.abs(ny - cy) > 0.0005) {
        cx = nx;
        cy = ny;
        for (const { el, d } of layers) {
          if (!d) continue;
          el.style.transform = `translate3d(${(-cx * d * 26).toFixed(2)}px, ${(-cy * d * 14).toFixed(2)}px, 0)`;
        }
      }
      // Water shimmer at ~30fps is indistinguishable and halves the cost.
      if (now - lastWater > 32) {
        lastWater = now;
        drawWater(now / 1000);
      }
    };
    if (!reduce) raf = requestAnimationFrame(loop);
    window.addEventListener('resize', size);

    // ── scroll-scrubbed zoom-through into the page ─────────────────────
    let ctxG: GsapContext | null = null;
    let dead = false;
    if (!reduce) {
      loadGsap().then(({ gsap }) => {
        if (dead) return;
        ctxG = gsap.context(() => {
          const scene = hero.querySelector('.hero__scene .scene');
          const copy = hero.querySelector('.hero__copy');
          const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } });
          if (scene) tl.to(scene, { scale: 1.28, yPercent: 6, ease: 'none' }, 0);
          if (copy) tl.to(copy, { yPercent: -18, opacity: 0.15, ease: 'none' }, 0);
        }, hero);
      });
    }

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('deviceorientation', onTilt);
      window.removeEventListener('resize', size);
      ctxG?.revert();
    };
  }
}
