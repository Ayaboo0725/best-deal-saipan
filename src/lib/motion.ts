'use client';
import { useEffect, useState } from 'react';
import type Lenis from 'lenis';

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function useMediaQuery(q: string, initial = false) {
  const [match, setMatch] = useState(initial);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [q]);
  return match;
}

// ── Scheduling: keep non-critical setup off the hydration path ──────────
type IdleWin = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };

export function onIdle(cb: () => void, timeout = 1500) {
  const w = window as IdleWin;
  if (w.requestIdleCallback && w.cancelIdleCallback) {
    const id = w.requestIdleCallback(cb, { timeout });
    return () => w.cancelIdleCallback!(id);
  }
  const id = window.setTimeout(cb, 250);
  return () => window.clearTimeout(id);
}

/** Runs once the page has fully loaded and the main thread is idle. */
export function afterLoad(cb: () => void) {
  let cancel = () => {};
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    cb();
  };
  if (document.readyState === 'complete') cancel = onIdle(run);
  else {
    const on = () => (cancel = onIdle(run));
    window.addEventListener('load', on, { once: true });
    const prev = cancel;
    cancel = () => {
      window.removeEventListener('load', on);
      prev();
    };
  }
  return () => {
    done = true;
    cancel();
  };
}

// ── Shared Lenis instance ──────────────────────────────────────────────
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => (lenis = l);
export const getLenis = () => lenis;

export function scrollToY(y: number, immediate = false) {
  if (lenis) lenis.scrollTo(y, { immediate, duration: 1.2 });
  else window.scrollTo({ top: y, behavior: immediate || prefersReduced() ? 'auto' : 'smooth' });
}

export function scrollToEl(el: Element | null, offset = -80) {
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY + offset;
  scrollToY(y);
}

/** True when the device can afford the WebGL oil shader. */
export function canRunShader() {
  if (typeof window === 'undefined' || prefersReduced()) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if ((nav.deviceMemory ?? 8) < 4) return false;
  if ((nav.hardwareConcurrency ?? 8) < 4) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
