'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type Lenis from 'lenis';
import { gsapIfLoaded, loadGsap } from '@/lib/gsap';
import { useCart, useWish, useRecent, useUI, anyOverlayOpen } from '@/lib/store';
import { setLenis, getLenis, prefersReduced, afterLoad, onIdle } from '@/lib/motion';
import Cursor from './Cursor';

function shouldLock(s: ReturnType<typeof useUI.getState>) {
  if (s.cartOpen || s.searchOpen || s.menuOpen || s.quickView) return true;
  return s.aislesOpen && window.innerWidth < 1024;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Persisted stores rehydrate once React has finished hydrating the page.
  // (A store update during hydration would force every pending Suspense
  // section to hydrate synchronously in one long task.)
  useEffect(
    () =>
      onIdle(() => {
        Promise.all([useCart.persist.rehydrate(), useWish.persist.rehydrate(), useRecent.persist.rehydrate()]).finally(() =>
          useUI.getState().set({ hydrated: true }),
        );
      }, 1200),
    [],
  );

  // Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    if (prefersReduced()) return;
    let lenis: Lenis | null = null;
    let dead = false;
    const tick = (t: number) => lenis?.raf(t * 1000);
    const onIntro = () => {
      if (lenis && !shouldLock(useUI.getState())) lenis.start();
      gsapIfLoaded()?.ScrollTrigger.refresh();
    };
    window.addEventListener('bd:intro-done', onIntro);
    // Smooth scrolling is an enhancement — load and start it once the page is idle.
    const cancel = afterLoad(() => {
      Promise.all([import('lenis'), loadGsap()]).then(([{ default: LenisCtor }, { gsap, ScrollTrigger }]) => {
        if (dead) return;
        lenis = new LenisCtor({ lerp: 0.11, smoothWheel: true, syncTouch: false });
        setLenis(lenis);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        if (document.documentElement.dataset.intro === 'play' || shouldLock(useUI.getState())) lenis.stop();
      });
    });
    return () => {
      dead = true;
      cancel();
      window.removeEventListener('bd:intro-done', onIntro);
      gsapIfLoaded()?.gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  // After load, LazyHydrate sections render immediately (client-side navigations).
  useEffect(
    () =>
      afterLoad(() => {
        window.__bdLoaded = true;
      }),
    [],
  );

  // Lock page scroll while a drawer / overlay is open; Esc closes everything.
  useEffect(() => {
    const apply = () => {
      const lock = shouldLock(useUI.getState());
      document.documentElement.classList.toggle('is-locked', lock);
      const l = getLenis();
      if (l) {
        if (lock) l.stop();
        else if (document.documentElement.dataset.intro !== 'play') l.start();
      }
    };
    const unsub = useUI.subscribe(apply);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && anyOverlayOpen(useUI.getState())) useUI.getState().closeAll();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', apply);
    return () => {
      unsub();
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', apply);
    };
  }, []);

  // Route change: close overlays, recompute scroll positions.
  useEffect(() => {
    useUI.getState().closeAll();
    const id = window.setTimeout(() => {
      getLenis()?.resize();
      gsapIfLoaded()?.ScrollTrigger.refresh();
    }, 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  // Scroll reveals: 24px rise + fade, staggered by --i.
  useEffect(() => {
    if (prefersReduced()) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    const scan = () => document.querySelectorAll('[data-reveal]:not(.is-in):not([data-ro])').forEach((el) => {
      el.setAttribute('data-ro', '');
      io.observe(el);
    });
    scan();
    let t = 0;
    const mo = new MutationObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(scan, 60);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <>
      {children}
      <Cursor />
    </>
  );
}
