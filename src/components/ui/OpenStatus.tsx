'use client';
import { useEffect, useState } from 'react';
import { clockLabel, openStatus, type OpenStatus as S } from '@/lib/hours';

/** Live Saipan clock + "Open now · until 7 PM". Renders a stable placeholder on the server. */
export function useSaipanClock(intervalMs = 15000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function OpenBadge({ className = '', showDetail = true, detailClassName = '' }: { className?: string; showDetail?: boolean; detailClassName?: string }) {
  const now = useSaipanClock();
  const s: S | null = now ? openStatus(now) : null;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <i className={`dot-live ${s ? (s.open ? 'is-open' : 'is-closed') : ''}`} aria-hidden="true" />
      <span>
        {s ? s.label : 'Store hours'}
        {s && showDetail && s.detail ? <span className={detailClassName}> · {s.detail}</span> : null}
      </span>
    </span>
  );
}

export function SaipanClock({ className = '' }: { className?: string }) {
  const now = useSaipanClock(10000);
  return (
    <time className={className} suppressHydrationWarning>
      {now ? clockLabel(now) : '--:--'}
    </time>
  );
}
