'use client';
import { useEffect, useRef } from 'react';
import { finePointer, prefersReduced } from '@/lib/motion';

/** Orange dot that becomes a cream "VIEW" circle over products and aisle rows.
 *  Desktop (fine pointer) only. Also drives magnetic primary buttons. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!finePointer()) return;
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    root.classList.add('has-cursor');
    let x = -200, y = -200, cx = x, cy = y, raf = 0, shown = false;
    let mag: HTMLElement | null = null;
    const reduce = prefersReduced();

    const resetMag = () => {
      if (mag) mag.style.transform = '';
      mag = null;
    };
    const evaluate = (t: Element | null) => {
      const view = t?.closest?.('[data-cursor="view"]');
      const link = !view && t?.closest?.('a,button,[role="button"],label,select,summary');
      el.classList.toggle('is-view', !!view);
      el.classList.toggle('is-link', !!link);
    };
    // Content moves under a still pointer while scrolling — re-check what's below it.
    let scrollRaf = 0;
    const onScroll = () => {
      if (!shown || scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        evaluate(document.elementFromPoint(x, y));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const move = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        cx = x;
        cy = y;
        shown = true;
        el.classList.remove('is-hidden');
      }
      const t = e.target as Element | null;
      if (t?.tagName === 'IFRAME') {
        el.classList.add('is-hidden');
        shown = false;
        return;
      }
      evaluate(t);

      if (reduce) return;
      const m = t?.closest?.('[data-magnetic]') as HTMLElement | null;
      if (m !== mag) resetMag();
      if (m) {
        mag = m;
        const r = m.getBoundingClientRect();
        const dx = (x - (r.left + r.width / 2)) * 0.22;
        const dy = (y - (r.top + r.height / 2)) * 0.35;
        m.style.transform = `translate(${Math.max(-10, Math.min(10, dx))}px, ${Math.max(-8, Math.min(8, dy))}px)`;
      }
    };
    const loop = () => {
      cx += (x - cx) * 0.24;
      cy += (y - cy) * 0.24;
      el.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const leave = () => {
      el.classList.add('is-hidden');
      shown = false;
      resetMag();
    };
    const down = () => el.classList.add('is-down');
    const up = () => el.classList.remove('is-down');

    raf = requestAnimationFrame(loop);
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerdown', down, { passive: true });
    document.addEventListener('pointerup', up, { passive: true });
    root.addEventListener('mouseleave', leave);
    window.addEventListener('blur', leave);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('pointerup', up);
      root.removeEventListener('mouseleave', leave);
      window.removeEventListener('blur', leave);
      root.classList.remove('has-cursor');
      resetMag();
    };
  }, []);

  return (
    <div ref={ref} className="cursor is-hidden" aria-hidden="true">
      <div className="cursor__ball">
        <span>VIEW</span>
      </div>
    </div>
  );
}
