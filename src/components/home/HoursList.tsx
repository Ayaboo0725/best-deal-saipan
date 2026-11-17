'use client';
import { useEffect, useState } from 'react';
import { DAYS, hoursLabel, saipanNow } from '@/lib/hours';

/** Weekly hours with TODAY highlighted (Saipan time). */
export default function HoursList({ className = '' }: { className?: string }) {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(saipanNow().day), []);
  return (
    <ul className={`space-y-1 ${className}`} aria-label="Store hours (ChST)">
      {[1, 2, 3, 4, 5, 6, 0].map((d) => (
        <li key={d} className={`hours-row ${today === d ? 'is-today' : ''}`} aria-current={today === d ? 'date' : undefined}>
          <span>
            {DAYS[d]}
            {today === d && <span className="mono ml-2 text-[10px] text-sun-1">Today</span>}
          </span>
          <span>{hoursLabel(d)}</span>
        </li>
      ))}
    </ul>
  );
}
