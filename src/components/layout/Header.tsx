'use client';
import Link from '@/components/ui/Link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { TagMark } from '@/components/ui/TagLogo';
import { NAV, STORE } from '@/config/store';
import { useCart, useUI, useWish, cartCount, cartTotal } from '@/lib/store';
import { money } from '@/lib/format';
import AislesMenu from './AislesMenu';
import MobileNav from './MobileNav';

function NavLinks() {
  const pathname = usePathname();
  const params = useSearchParams();
  const isPg = params.get('collection') === 'pureguard';
  const current = (href: string) => {
    const [path, q] = href.split('?');
    if (q) return pathname === path && isPg;
    if (path === '/shop/') return pathname === '/shop/' && !isPg;
    return pathname.startsWith(path);
  };
  return (
    <>
      {NAV.map((n) => (
        <Link key={n.href} href={n.href} className="nav-link" aria-current={current(n.href) ? 'page' : undefined}>
          {n.label}
        </Link>
      ))}
    </>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mac, setMac] = useState(true);
  const pillRef = useRef<HTMLButtonElement>(null);
  const aislesBtn = useRef<HTMLButtonElement>(null);
  const lines = useCart((s) => s.lines);
  const wish = useWish((s) => s.slugs.length);
  const hydrated = useUI((s) => s.hydrated);
  const aislesOpen = useUI((s) => s.aislesOpen);
  const menuOpen = useUI((s) => s.menuOpen);
  const bump = useUI((s) => s.bump);
  const set = useUI((s) => s.set);
  const count = hydrated ? cartCount(lines) : 0;
  const total = hydrated ? cartTotal(lines) : 0;

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!bump || !pillRef.current) return;
    const el = pillRef.current;
    el.classList.remove('is-bump');
    void el.offsetWidth;
    el.classList.add('is-bump');
  }, [bump]);

  return (
    <>
      <header className={`hdr ${scrolled || aislesOpen ? 'is-scrolled' : ''}`}>
        <div className="wrap hdr__inner">
          <Link href="/" className="brand">
            <TagMark className="brand__mark" />
            <span>
              <span className="brand__word">Best Deal</span>
              <span className="brand__sub hidden sm:block">{STORE.subline}</span>
            </span>
          </Link>

          <button
            ref={aislesBtn}
            type="button"
            className="aisles-pill hidden md:inline-flex"
            aria-expanded={aislesOpen}
            aria-controls="aisles-menu"
            onClick={() => set({ aislesOpen: !aislesOpen, menuOpen: false })}
          >
            <Icon name="grid" size={17} />
            Aisles
            <Icon name="chevron-down" size={15} className="chev" />
          </button>

          <nav className="nav" aria-label="Main">
            <Suspense fallback={NAV.map((n) => <Link key={n.href} href={n.href} className="nav-link">{n.label}</Link>)}>
              <NavLinks />
            </Suspense>
          </nav>

          <div className="hdr__right">
            <button type="button" className="search-pill hidden lg:inline-flex" onClick={() => set({ searchOpen: true, aislesOpen: false })} aria-label="Search products" aria-keyshortcuts={mac ? 'Meta+K' : 'Control+K'}>
              <Icon name="search" size={17} />
              <span className="hidden min-[1440px]:inline">Search</span>
              <kbd className="kbd">{mac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
            <button type="button" className="icon-btn hidden md:inline-grid lg:hidden" onClick={() => set({ searchOpen: true, aislesOpen: false, menuOpen: false })} aria-label="Search products">
              <Icon name="search" />
            </button>
            <Link href="/account/" className="icon-btn hidden md:inline-grid" aria-label="Account">
              <Icon name="user" />
            </Link>
            <Link href="/account/#orders" className="icon-btn hidden lg:inline-grid" aria-label="Orders">
              <Icon name="orders" />
            </Link>
            <Link href="/wishlist/" className="icon-btn hidden md:inline-grid" aria-label={`Wishlist${hydrated && wish ? `, ${wish} items` : ''}`}>
              <Icon name="heart" />
              {hydrated && wish > 0 && <span className="count">{wish}</span>}
            </Link>
            <button
              ref={pillRef}
              type="button"
              className="cart-pill"
              data-cart-target
              onClick={() => set({ cartOpen: true, aislesOpen: false, menuOpen: false })}
            >
              <span className="pill-dot" aria-hidden="true" />
              <span className="sr-only">Cart total</span>
              <span>{money(total)}</span>
              <span className="pill-count">{count}</span>
              <span className="sr-only">{count === 1 ? 'item' : 'items'}, open cart</span>
            </button>
            <button
              type="button"
              className="icon-btn xl:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => set({ menuOpen: !menuOpen, aislesOpen: false })}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
      </header>
      <AislesMenu anchor={aislesBtn} />
      <MobileNav />
    </>
  );
}
