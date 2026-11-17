'use client';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { STORE } from '@/config/store';

/** Google Maps embed that only loads when it scrolls near the viewport (≈600 KB of map scripts). */
export default function MapEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="map-frame">
      {load ? (
        <iframe title="Map: Best Deal on Beach Road, Garapan, Saipan" src={STORE.maps.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <a href={STORE.maps.directions} target="_blank" rel="noopener noreferrer" className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_45%,#2a1a26,#0e0d10_70%)] text-cream/80">
          <span className="flex flex-col items-center gap-3">
            <Icon name="pin" size={34} className="text-sun-2" />
            <span className="mono text-[11px]">Beach Road · Garapan · Saipan</span>
          </span>
        </a>
      )}
    </div>
  );
}
