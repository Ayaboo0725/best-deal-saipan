// Small deterministic geometry helpers for the sunset scene (stars + sun rays).
// The palm silhouettes are generated at build time: scripts/svg/palms.mjs.

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function stars(count: number, seed = 7) {
  const r = rng(seed);
  return Array.from({ length: count }, () => ({ x: r() * 1600, y: r() * 520, s: 0.6 + r() * 1.6, o: 0.3 + r() * 0.7 }));
}

export function rays(n: number, r0: number, r1: number) {
  let d = '';
  const g = (v: number) => v.toFixed(1);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    d += `M${g(Math.cos(a) * r0)} ${g(Math.sin(a) * r0)}L${g(Math.cos(a) * r1)} ${g(Math.sin(a) * r1)}`;
  }
  return d;
}
