import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/fx/Providers';
import LazyHydrate from '@/components/fx/LazyHydrate';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Overlays from '@/components/layout/Overlays';
import { STORE } from '@/config/store';

// Barlow Condensed is static (2 weights); Manrope and JetBrains Mono load as single variable files.
const display = Barlow_Condensed({ subsets: ['latin'], weight: ['700', '800'], variable: '--nf-display', display: 'swap' });
const body = Manrope({ subsets: ['latin'], variable: '--nf-body', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--nf-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://bestdeal.example'),
  title: { default: 'Best Deal — The best deals in the Marianas', template: '%s · Best Deal Saipan' },
  description:
    'Island hardware, auto and home supply on Beach Road, Garapan, Saipan. Lubricants, power tools, lighting, lawn & garden, pool and home supplies — 202 products across 17 stocked aisles.',
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'website', siteName: 'Best Deal Saipan', locale: 'en_US' },
};

export const viewport: Viewport = {
  themeColor: '#0B0B0C',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Runs before first paint: decides whether the intro plays (once per session,
// home page only, never with reduced motion), sets the hero sky by Saipan time,
// and wires Skip without waiting for React.
const BOOT = `(function(){var d=document.documentElement;d.classList.add('js');try{
if(location.search&&location.pathname.indexOf('/shop')===0)d.classList.add('qs');
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
var seen=false;try{seen=sessionStorage.getItem('bd-intro')==='1'}catch(e){}
var home=location.pathname==='/'||location.pathname==='/index.html';
var play=home&&!seen&&!rm;
d.dataset.intro=play?'play':'skip';
var h=new Date(Date.now()+36e6).getUTCHours();d.dataset.sky=h>=5&&h<8?'dawn':h>=8&&h<17?'day':h>=17&&h<20?'sunset':'night';
if(play){try{sessionStorage.setItem('bd-intro','1')}catch(e){}
var mob=matchMedia('(max-width: 767px)').matches;var T=mob?1950:2850;
var end=function(){if(d.dataset.intro==='play'||d.dataset.intro==='skipped'){var was=d.dataset.intro;if(was==='play')d.dataset.intro='done';window.dispatchEvent(new Event('bd:intro-done'))}};
var t=setTimeout(end,T);
document.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('[data-intro-skip]');if(b&&d.dataset.intro==='play'){clearTimeout(t);d.dataset.intro='skipped';setTimeout(end,460)}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&d.dataset.intro==='play'){clearTimeout(t);d.dataset.intro='skipped';setTimeout(end,460)}});
}}catch(e){d.dataset.intro='skip'}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HardwareStore',
    name: STORE.name,
    address: { '@type': 'PostalAddress', streetAddress: STORE.address.line1, addressLocality: 'Garapan', addressRegion: 'Saipan, MP', addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: STORE.coords.lat, longitude: STORE.coords.lng },
    foundingDate: '2014-10',
  };
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning data-intro="skip" data-sky="sunset">
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <LazyHydrate>
            <Footer />
          </LazyHydrate>
          <Overlays />
        </Providers>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
