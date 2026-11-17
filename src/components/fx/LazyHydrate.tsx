'use client';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    __bdLoaded?: boolean;
  }
}

/**
 * Below-the-fold sections keep their server-rendered HTML but only hydrate
 * when they come within `rootMargin` of the viewport.
 * During the initial hydration the client renders an empty
 * dangerouslySetInnerHTML placeholder, which React leaves untouched — so the
 * server markup stays on screen at zero hydration cost. After the page has
 * loaded (e.g. client-side navigation back to home) children render directly.
 */
export default function LazyHydrate({ children, rootMargin = '400px 0px', className }: { children: React.ReactNode; rootMargin?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(() => typeof window === 'undefined' || window.__bdLoaded === true);

  useEffect(() => {
    if (ready) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          setReady(true);
        }
      },
      { rootMargin },
    );
    io.observe(el);
    // Hash links (/#aisles) and in-page jumps also need it hydrated.
    const onHash = () => setReady(true);
    window.addEventListener('hashchange', onHash);
    return () => {
      io.disconnect();
      window.removeEventListener('hashchange', onHash);
    };
  }, [ready, rootMargin]);

  if (ready) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
  return <div ref={ref} className={className} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: '' }} />;
}
