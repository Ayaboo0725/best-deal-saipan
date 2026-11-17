import { STORE } from '@/config/store';

export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Saipan is UTC+10 all year (ChST, no daylight saving). */
export function saipanNow(date = new Date()) {
  const t = new Date(date.getTime() + 10 * 3600 * 1000);
  const day = t.getUTCDay();
  const h = t.getUTCHours();
  const m = t.getUTCMinutes();
  const s = t.getUTCSeconds();
  return { day, h, m, s, minutes: h * 60 + m, date: t };
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export function fmtTime(hhmm: string | number) {
  const mins = typeof hhmm === 'number' ? hhmm : toMin(hhmm);
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'AM' : 'PM'}`;
}

export function clockLabel(date = new Date()) {
  const { h, m } = saipanNow(date);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

export function hoursFor(day: number) {
  return STORE.hours.find((x) => x.day === day) ?? { day, open: null, close: null };
}

export function hoursLabel(day: number) {
  const d = hoursFor(day);
  return d.open && d.close ? `${fmtTime(d.open)} – ${fmtTime(d.close)}` : 'Closed';
}

export type OpenStatus = { open: boolean; label: string; detail: string };

export function openStatus(date = new Date()): OpenStatus {
  const now = saipanNow(date);
  const today = hoursFor(now.day);
  if (today.open && today.close) {
    const o = toMin(today.open);
    const c = toMin(today.close);
    if (now.minutes >= o && now.minutes < c) {
      const left = c - now.minutes;
      return { open: true, label: left <= 60 ? 'Closing soon' : 'Open now', detail: `until ${fmtTime(today.close)}` };
    }
    if (now.minutes < o) return { open: false, label: 'Closed', detail: `opens ${fmtTime(today.open)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (now.day + i) % 7;
    const h = hoursFor(d);
    if (h.open) return { open: false, label: 'Closed', detail: `opens ${i === 1 ? 'tomorrow' : SHORT[d]} ${fmtTime(h.open)}` };
  }
  return { open: false, label: 'Closed', detail: '' };
}

/** Time-of-day bucket for the hero sky. */
export function skyPhase(date = new Date()) {
  const { h } = saipanNow(date);
  if (h >= 5 && h < 8) return 'dawn';
  if (h >= 8 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'sunset';
  return 'night';
}

/** Next Sunday 23:59:59 ChST — "Deal of the week" ends then. */
export function dealEnds(date = new Date()) {
  const now = saipanNow(date);
  const daysLeft = (7 - now.day) % 7;
  const secondsToday = now.h * 3600 + now.m * 60 + now.s;
  const total = daysLeft * 86400 + (86399 - secondsToday);
  return date.getTime() + total * 1000;
}
