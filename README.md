# Best Deal — Garapan, Saipan

The new Best Deal storefront: dark, cinematic, sunset-over-the-Marianas.
Built from *Best Deal Website Prompt (Enhanced)*.

**Stack:** Next.js 15 (App Router, static export) · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · Three.js (Pureguard shader only, code-split) · Zustand (persistent cart / wishlist).

## Run it

Requires Node.js 18.18+ (built and tested with Node 24 LTS — install it from nodejs.org; the copy used during the build was temporary).

```bash
npm install
npm run dev          # http://localhost:3000 (regenerates the catalog first)
npm run build        # static site in ./out (217 pages)
npm run serve        # serve ./out at http://localhost:4321
```

`out/` is plain HTML/CSS/JS — host it on any static host (Netlify, Vercel, Cloudflare Pages, S3…).

## Where things live

| Path | What |
|---|---|
| `data/products.mjs` | **Product catalog source** (202 sample rows — replace with real data) |
| `data/aisles.mjs` | 21 aisles: order, icons, stocked / popular flags, label colours |
| `scripts/build-catalog.mjs` | Builds `src/data/catalog*.json` + renders every product image as SVG (runs automatically before `dev` / `build`) |
| `src/config/store.ts` | Phone, WhatsApp, hours, delivery threshold & fee, socials, map links |
| `src/data/reviews.ts` | Paste **real** Google reviews here (empty = "Read/Write a review" band) |
| `src/data/blog.ts` | Blog articles (drafts) |
| `src/app/globals.css` | Design tokens + all component styles |
| `src/components/home/*` | Intro, hero, deals, spotlights, aisles, Pureguard stage, info sections |

## Content needed from the client (placeholders today)

Everything below is marked `TODO(client)` in the code.

1. **Product list** — real names, sizes, prices, stock and photos for all 202 SKUs (`data/products.mjs`). Current prices/stock/sale prices are placeholders.
   Real photos: save them as `public/products/<product-slug>.webp` (or `.avif` / `.jpg` / `.png`; optional `<product-slug>-2.webp` for the alternate angle) and rebuild — they replace the artwork automatically. Products without photos keep their generated spec label. The slug is the last part of the product URL.
2. **Logo** — official red price-tag logo files (`src/components/ui/TagLogo.tsx` is a stand-in).
3. **Brand assets** — authorized Mobil / DeWalt logos for the spotlights (currently typographic only, no logos redrawn).
4. **Store hours, phone, WhatsApp, Messenger page, email** — `src/config/store.ts`.
5. **Delivery** — zones, fee, free-delivery threshold (currently $10 fee, free over $75).
6. **Storefront photo** and **Google Business link** (map, reviews).
7. **Reviews** — real Google reviews only (`src/data/reviews.ts`).
8. **Unclear in the source video** — header subline text, hero eyebrow middle item, aisle #21 name (placeholder "Paint & Sundries"), which 4 aisles are unstocked, top-3 "Popular" aisles, spotlight #3 (built as a Lawn & Garden category spotlight).
9. **Checkout** — payments are not wired yet; checkout sends the order to the counter via WhatsApp. Newsletter signup has no backend yet (nothing is sent or stored).

## Performance notes

Measured with Lighthouse 12.8 (mobile preset, local build, Edge):

| Page | Mobile perf (plugged in) | Mobile perf (on battery) | Desktop | A11y / BP / SEO |
|---|---|---|---|---|
| Home | 89–94 | 62–79 | 98–99 | 100 / 100 / 100 |
| Product | 93 | 83 | — | 100 / 100 / 100 |
| About | 96 | — | — | 100 / 100 / 100 |
| Shop | 80–84 | 70–73 | — | 100 / 100 / 100 |

Simulated mobile LCP is 2.7–3.1 s (spec target: < 2.5 s); observed LCP on the local build is ~0.65 s.
Re-measure on the real host (PageSpeed Insights) once deployed.

How it stays fast:
- Scene art, intro and ticker are static HTML strings (never hydrated); palms are one cached SVG sprite.
- Below-the-fold home sections and the footer keep their server HTML and hydrate only near the viewport (`LazyHydrate`).
- GSAP, ScrollTrigger, Lenis and Three.js are loaded on demand after page load; the WebGL probe runs only near the Pureguard section.
- Cart/wishlist rehydrate from `localStorage` at idle; links prefetch on hover, not in the viewport; the map embed loads on approach.
- Off-screen sections use `content-visibility: auto`.

## Behaviour notes

- Intro plays once per browser session on the home page (≤2.9s desktop, ≤2s mobile), is skippable (button or Esc) and never plays with *reduced motion*.
- *Reduced motion* also disables scroll-scrub, the 3D card flight, Lenis smoothing and the WebGL shader (CSS gradient fallback).
- The Pureguard shader only loads on capable devices (≥4 cores, ≥4 GB, no Save-Data); others get the animated CSS fallback.
- Hero sky follows Saipan time (dawn / day / sunset / night); open/closed status uses ChST (UTC+10).
- Cart, wishlist and recent searches persist in `localStorage`.
