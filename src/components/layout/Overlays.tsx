'use client';
import Link from '@/components/ui/Link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import CartDrawer from '@/components/cart/CartDrawer';
import { useCart, useUI, useWish, cartCount, cartTotal } from '@/lib/store';
import { img } from '@/lib/aisles';
import { money } from '@/lib/format';
import { STORE, messengerLink, whatsappLink } from '@/config/store';
import { afterLoad } from '@/lib/motion';

const SearchOverlay = dynamic(() => import('@/components/search/SearchOverlay'), { ssr: false });
const QuickView = dynamic(() => import('@/components/product/QuickView'), { ssr: false });

function Toast() {
  const toast = useUI((s) => s.toast);
  const set = useUI((s) => s.set);
  const subtotal = useCart((s) => cartTotal(s.lines));
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!toast) return;
    setOn(true);
    const id = window.setTimeout(() => setOn(false), 3400);
    return () => window.clearTimeout(id);
  }, [toast]);
  const left = Math.max(0, STORE.freeDeliveryThreshold - subtotal);
  return (
    <div className={`toast ${on ? 'is-on' : ''}`} role="status" aria-live="polite">
      {toast && (
        <div className="glass flex items-center gap-3 !rounded-2xl p-3 pr-4">
          <img src={img(toast.slug)} alt="" width={52} height={52} className="h-[52px] w-[52px] rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="mono flex items-center gap-1.5 text-[10px] text-green">
              <Icon name="check" size={13} /> Added to cart
            </p>
            <p className="truncate text-[13.5px] font-semibold">{toast.title}</p>
            <p className="text-[11.5px] text-muted">{left > 0 ? `${money(left)} away from free delivery` : 'Free island delivery unlocked'}</p>
          </div>
          <button
            type="button"
            className="btn btn-cream btn-sm !h-9 !px-4 text-[13px]"
            onClick={() => {
              setOn(false);
              set({ cartOpen: true });
            }}
          >
            View cart
          </button>
        </div>
      )}
    </div>
  );
}

function TabBar() {
  const pathname = usePathname();
  const lines = useCart((s) => s.lines);
  const hydrated = useUI((s) => s.hydrated);
  const wish = useWish((s) => s.slugs.length);
  const s = useUI();
  const count = hydrated ? cartCount(lines) : 0;
  return (
    <nav className="tabbar" aria-label="Quick navigation">
      <Link href="/" className={pathname === '/' && !s.aislesOpen && !s.searchOpen && !s.cartOpen ? 'is-active' : ''} aria-current={pathname === '/' ? 'page' : undefined}>
        <Icon name="home" size={21} />
        Home
      </Link>
      <button type="button" className={s.aislesOpen ? 'is-active' : ''} aria-expanded={s.aislesOpen} onClick={() => s.set({ aislesOpen: !s.aislesOpen, searchOpen: false, cartOpen: false, menuOpen: false })}>
        <Icon name="grid" size={21} />
        Aisles
      </button>
      <button type="button" className={s.searchOpen ? 'is-active' : ''} onClick={() => s.set({ searchOpen: !s.searchOpen, aislesOpen: false, cartOpen: false, menuOpen: false })}>
        <Icon name="search" size={21} />
        Search
      </button>
      <Link href="/wishlist/" className={pathname.startsWith('/wishlist') ? 'is-active' : ''}>
        <Icon name="heart" size={21} />
        Wishlist
        {hydrated && wish > 0 && <span className="t-badge">{wish}</span>}
      </Link>
      <button type="button" data-cart-target className={s.cartOpen ? 'is-active' : ''} onClick={() => s.set({ cartOpen: !s.cartOpen, aislesOpen: false, searchOpen: false, menuOpen: false })} aria-label={`Cart, ${count} items`}>
        <Icon name="bag" size={21} />
        Cart
        {count > 0 && <span className="t-badge">{count}</span>}
      </button>
    </nav>
  );
}

/** WhatsApp / Messenger — appears once the visitor has been scrolling for 10s. */
function ChatButton() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let timer = 0;
    const onScroll = () => {
      if (timer) return;
      timer = window.setTimeout(() => setVisible(true), 10000);
      window.removeEventListener('scroll', onScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
    };
  }, []);
  return (
    <div className={`chat ${visible ? 'is-visible' : ''}`} inert={!visible}>
      {open && (
        <div className="chat__menu" id="chat-menu">
          <a className="chat__opt" href={whatsappLink('Hi Best Deal! I have a question.')} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={20} className="text-green" /> WhatsApp
          </a>
          <a className="chat__opt" href={messengerLink()} target="_blank" rel="noopener noreferrer">
            <Icon name="messenger" size={20} className="text-[#7aa7ff]" /> Messenger
          </a>
        </div>
      )}
      <button type="button" className="chat__btn" aria-expanded={open} aria-controls="chat-menu" aria-label={open ? 'Close chat options' : 'Chat with Best Deal'} onClick={() => setOpen((o) => !o)}>
        <Icon name={open ? 'close' : 'chat'} size={24} strokeWidth={1.9} />
      </button>
    </div>
  );
}

export default function Overlays() {
  const searchOpen = useUI((s) => s.searchOpen);
  const quick = useUI((s) => s.quickView);
  const [mountSearch, setMountSearch] = useState(false);
  useEffect(() => {
    if (searchOpen) setMountSearch(true);
  }, [searchOpen]);
  useEffect(() => {
    // Mount search once the page is idle so ⌘K opens instantly later.
    const cancelIdle = afterLoad(() => setMountSearch(true));
    // Global shortcuts: ⌘K / Ctrl+K toggles search, "/" opens it.
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const s = useUI.getState();
        s.set({ searchOpen: !s.searchOpen, cartOpen: false, aislesOpen: false, menuOpen: false, quickView: null });
      } else if (e.key === '/' && !typing && !useUI.getState().searchOpen) {
        e.preventDefault();
        useUI.getState().set({ searchOpen: true });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelIdle();
      window.removeEventListener('keydown', onKey);
    };
  }, []);
  return (
    <>
      <CartDrawer />
      {mountSearch && <SearchOverlay />}
      {quick !== null || mountSearch ? <QuickView /> : null}
      <Toast />
      <TabBar />
      <ChatButton />
    </>
  );
}
