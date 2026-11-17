'use client';
// GSAP + ScrollTrigger are loaded on demand (code-split) — nothing on the page
// needs them before load, so they stay out of the startup bundle.
import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as STType } from 'gsap/ScrollTrigger';

export type Gsap = typeof GsapType;
export type ScrollTriggerT = typeof STType;
export type GsapContext = ReturnType<Gsap['context']>;

let loaded: { gsap: Gsap; ScrollTrigger: ScrollTriggerT } | null = null;
let promise: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerT }> | null = null;

export function loadGsap() {
  promise ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    st.ScrollTrigger.config({ ignoreMobileResize: true });
    loaded = { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
    return loaded;
  });
  return promise;
}

/** Already-loaded instance (or null) — for cheap "refresh if present" calls. */
export const gsapIfLoaded = () => loaded;
