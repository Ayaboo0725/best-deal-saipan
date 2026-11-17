import { STORE } from '@/config/store';
import { money } from '@/lib/format';
import Icon from './Icon';

/** "$X away from free delivery" + progress bar. */
export default function FreeDelivery({ subtotal, compact = false, className = '' }: { subtotal: number; compact?: boolean; className?: string }) {
  const goal = STORE.freeDeliveryThreshold;
  const left = Math.max(0, goal - subtotal);
  const pct = Math.min(1, subtotal / goal);
  const done = left <= 0;
  return (
    <div className={className}>
      <p className={`flex items-center gap-2 ${compact ? 'text-[12.5px]' : 'text-sm'} text-cream/85`} aria-live="polite">
        <Icon name="truck" size={compact ? 15 : 17} className={done ? 'text-green' : 'text-sun-1'} />
        {done ? (
          <span>
            <b className="text-green">Free island delivery</b> unlocked on this order.
          </span>
        ) : (
          <span>
            <b className="text-cream">{money(left)}</b> away from free delivery
          </span>
        )}
      </p>
      <div className={`fd mt-2.5 ${done ? 'is-done' : ''}`} role="progressbar" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(goal, Math.round(subtotal * 100) / 100)} aria-label="Progress to free delivery">
        <i style={{ transform: `scaleX(${pct})` }} />
      </div>
    </div>
  );
}
