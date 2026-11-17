'use client';
import { useCart, useUI } from './store';
import { img } from './aisles';
import type { Variant } from './types';

type Addable = { slug: string; name: string; brand: string; aisle: string };

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Thumbnail flies from the product image to the cart pill (or tab-bar cart). */
export function flyToCart(from: Element | null | undefined, src: string) {
  if (!from || reduced()) return Promise.resolve();
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-cart-target]')).filter((el) => el.offsetParent !== null);
  const to = targets[0];
  if (!to) return Promise.resolve();
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const size = Math.min(96, Math.max(56, a.width * 0.5));
  const node = document.createElement('img');
  node.src = src;
  node.alt = '';
  node.className = 'fly-thumb';
  node.style.width = node.style.height = `${size}px`;
  node.style.left = `${a.left + a.width / 2 - size / 2}px`;
  node.style.top = `${a.top + a.height / 2 - size / 2}px`;
  document.body.appendChild(node);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = node.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 120}px) scale(0.7)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.18)`, opacity: 0.4 },
    ],
    { duration: 720, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  );
  return anim.finished.then(() => node.remove()).catch(() => node.remove());
}

/**
 * Add to cart.
 * mode "drawer": full "Add to cart" buttons — cart drawer slides in afterwards.
 * mode "quick":  "Quick add +" — stays on the page, shows a toast instead.
 */
export function addToCart(p: Addable, v: Variant, qty = 1, opts: { from?: Element | null; mode?: 'drawer' | 'quick' } = {}) {
  if (v.stock <= 0) return;
  useCart.getState().add({ slug: p.slug, name: p.name, brand: p.brand, aisle: p.aisle, variantId: v.id, size: v.size, price: v.price, max: v.stock }, qty);
  const ui = useUI.getState();
  const done = () => {
    useUI.getState().set({ bump: useUI.getState().bump + 1 });
    if (opts.mode === 'quick') {
      useUI.getState().set({ toast: { id: Date.now(), title: p.name, slug: p.slug } });
    } else {
      useUI.getState().set({ cartOpen: true, quickView: null });
    }
  };
  if (ui.quickView) ui.set({ quickView: null });
  flyToCart(opts.from, img(p.slug)).then(done);
}
