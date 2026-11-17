// Illustrated sunset over the Marianas: sky · sun with rotating dashed rays ·
// far hills · sea with reflection · palm silhouettes. Layers carry data-depth
// for the parallax in HeroFX.
// The markup is a static string (dangerouslySetInnerHTML) so React never
// hydrates the decorative nodes; the palm paths live in one cached sprite
// (public/generated/scene/palms.svg, built by scripts/build-catalog.mjs).
import { rays, stars } from './palms';

const SPRITE = '/generated/scene/palms.svg';

const STARS = (() => {
  const s = stars(46);
  const bucket = (lo: number, hi: number, op: number, w: number) =>
    `<path stroke="#fff" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round" d="${s
      .filter((x) => x.s >= lo && x.s < hi)
      .map((x) => `M${Math.round(x.x)} ${Math.round(x.y)}h0`)
      .join('')}"/>`;
  return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">${bucket(0, 1.1, 0.5, 1.6)}${bucket(1.1, 1.7, 0.75, 2.4)}${bucket(1.7, 9, 0.95, 3.4)}</svg>`;
})();

const RAYS =
  `<svg class="r1" viewBox="-100 -100 200 200"><g fill="none" stroke="currentColor"><path d="${rays(72, 58, 96)}" stroke-width="0.6" stroke-dasharray="2 3.4" opacity="0.5"/><circle r="61" stroke-width="0.5" stroke-dasharray="1 3" opacity="0.55"/></g></svg>` +
  `<svg class="r2" viewBox="-100 -100 200 200"><g fill="none" stroke="currentColor"><path d="${rays(36, 66, 100)}" stroke-width="0.4" stroke-dasharray="1.2 4" opacity="0.3"/><circle r="88" stroke-width="0.35" stroke-dasharray="0.6 4.2" opacity="0.4"/></g></svg>`;

const HILLS = `<svg viewBox="0 0 1600 200" preserveAspectRatio="none"><path fill="#3a1d3f" opacity="0.85" d="M0 200V150C120 122 220 140 340 118 470 95 560 132 690 126 820 120 900 90 1010 104 1120 118 1200 140 1320 128 1430 118 1520 132 1600 122V200Z"/><path fill="#1d0f22" d="M0 200V178C200 170 320 176 420 168 470 150 520 150 560 166 640 176 900 182 1100 176 1180 160 1230 156 1270 170 1360 182 1500 178 1600 180V200Z"/></svg>`;

const PALMS =
  `<div class="palms palms--l"><svg viewBox="0 0 720 1000" preserveAspectRatio="xMinYMax meet"><use href="${SPRITE}#pl" width="720" height="1000"/></svg></div>` +
  `<div class="palms palms--r"><svg viewBox="0 0 640 1000" preserveAspectRatio="xMaxYMax meet"><use href="${SPRITE}#pr" width="640" height="1000"/></svg></div>`;

const SEA_LINES = Array.from({ length: 16 }, (_, i) => {
  const yf = Math.pow((i + 1) / 17, 1.5);
  const w = Math.round(10 + yf * 60 + ((i * 37) % 23));
  const x = 50 + (((i * 53) % 40) - 20) * (0.3 + yf);
  return `<span class="sea__line" style="top:${(yf * 92).toFixed(1)}%;left:${x.toFixed(1)}%;width:${w}px;margin-left:${-w / 2}px;animation-delay:${((i * 0.37) % 2.6).toFixed(2)}s;opacity:${(0.6 - yf * 0.3).toFixed(2)}"></span>`;
}).join('');

const CACHE: Record<string, string> = {};

/** Full scene markup as a static string (shared by the intro and the hero). */
export function sceneInner(variant: 'hero' | 'intro') {
  if (CACHE[variant]) return CACHE[variant];
  const shimmer = variant === 'hero' ? '<canvas class="sea__canvas" data-water></canvas>' : SEA_LINES;
  CACHE[variant] =
    `<div class="scene__layer sky" data-depth="0"></div>` +
    `<div class="scene__layer stars" data-depth="0.04">${STARS}</div>` +
    `<div class="scene__layer" data-depth="0.12"><div class="sun"><div class="sun__glow"></div><div class="sun__rays">${RAYS}</div><div class="sun__disc"></div></div></div>` +
    `<div class="scene__layer" data-depth="0.25"><div class="hills">${HILLS}</div></div>` +
    `<div class="scene__layer" data-depth="0.4"><div class="sea"><div class="sea__reflect"></div><div class="sea__shimmer">${shimmer}</div></div></div>` +
    `<div class="scene__layer" data-depth="1">${PALMS}</div>`;
  return CACHE[variant];
}

export default function SunsetScene({ variant }: { variant: 'hero' | 'intro' }) {
  return <div className="scene" data-variant={variant} aria-hidden="true" dangerouslySetInnerHTML={{ __html: sceneInner(variant) }} />;
}
