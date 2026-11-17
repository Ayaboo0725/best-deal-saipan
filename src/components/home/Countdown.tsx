'use client';
import { useEffect, useState } from 'react';
import { dealEnds } from '@/lib/hours';
import { pad2 } from '@/lib/format';

/** Counts down to Sunday 23:59:59 ChST. */
export default function Countdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = dealEnds();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  const s = left == null ? null : Math.floor(left / 1000);
  const parts = s == null ? ['--', '--', '--', '--'] : [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60].map(pad2);
  const labels = ['Days', 'Hrs', 'Min', 'Sec'];
  return (
    <div className="countdown" role="timer" aria-label="Time left on this week's deals">
      {parts.map((v, i) => (
        <div key={labels[i]}>
          <b suppressHydrationWarning>{v}</b>
          <span>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
