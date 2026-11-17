// "It opens like a film. Sunrise, over the Marianas."
// Pure CSS timeline (starts at first paint, ≤2.9s desktop / ≤2s mobile).
// The inline boot script in layout.tsx decides whether it plays (once per
// session, never with reduced motion) and handles Skip / Esc — so the intro
// needs no React at all and is emitted as static HTML (never hydrated).
import { sceneInner } from '@/components/scene/SunsetScene';
import { STORE } from '@/config/store';
import { AISLES, TOTAL_PRODUCTS } from '@/lib/aisles';

// Hanging price tag (hole at the top — the string attaches there).
// TODO(client): swap for the official Best Deal tag artwork.
const TAG = `<svg viewBox="0 0 160 250" class="intro__tag" aria-hidden="true">
<defs><linearGradient id="ht-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2464d"/><stop offset=".55" stop-color="#d7262e"/><stop offset="1" stop-color="#a5171e"/></linearGradient>
<linearGradient id="ht-s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<path fill-rule="evenodd" fill="url(#ht-g)" d="M80 2 150 52a6 6 0 0 1 2.5 4.9V238a10 10 0 0 1-10 10H17.5a10 10 0 0 1-10-10V56.9A6 6 0 0 1 10 52L80 2Zm-9 34a9 9 0 1 0 18 0 9 9 0 1 0-18 0Z"/>
<path d="M20 70h120v164H20z" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.5" stroke-dasharray="4 4"/>
<path d="M8 60 80 10l72 50v30L80 40 8 90z" fill="url(#ht-s)" opacity=".5"/>
<circle cx="80" cy="36" r="12" fill="none" stroke="#f4ede1" stroke-opacity=".6" stroke-width="2.5"/>
<text x="80" y="132" text-anchor="middle" fill="#fff" font-weight="800" font-size="54" letter-spacing="1" style="font-family:var(--font-display)">BEST</text>
<text x="80" y="184" text-anchor="middle" fill="#fff" font-weight="800" font-size="54" letter-spacing="1" style="font-family:var(--font-display)">DEAL</text>
<text x="80" y="214" text-anchor="middle" fill="#fff" fill-opacity=".8" font-weight="500" font-size="9.5" letter-spacing="2.4" style="font-family:var(--font-mono)">SAIPAN · 2014</text>
</svg>`;

const HTML =
  `<div class="intro__scene" aria-hidden="true"><div class="scene" data-variant="intro">${sceneInner('intro')}</div></div>` +
  `<div class="intro__line" aria-hidden="true"></div>` +
  `<div class="intro__pend" aria-hidden="true"><div class="intro__swing"><div class="intro__string"></div>${TAG}</div></div>` +
  `<div class="intro__flash" aria-hidden="true"></div>` +
  `<p class="intro__strip" aria-hidden="true">Est. ${STORE.established} · ${TOTAL_PRODUCTS} products · ${AISLES.length} aisles</p>` +
  `<button type="button" class="intro__skip btn btn-glass btn-sm" data-intro-skip>Skip <span aria-hidden="true">→</span><span class="sr-only"> intro</span></button>`;

export default function Intro() {
  return <div className="intro" dangerouslySetInnerHTML={{ __html: HTML }} />;
}
