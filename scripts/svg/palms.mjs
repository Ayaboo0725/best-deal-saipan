// Procedural palm-tree silhouettes → public/scene/palms.svg (one cached sprite
// referenced by the intro and hero with <use>, instead of inlining ~90 KB of paths).
const quad = (a, b, c, t) => [
  (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * b[0] + t * t * c[0],
  (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * b[1] + t * t * c[1],
];
const quadTan = (a, b, c, t) => [2 * (1 - t) * (b[0] - a[0]) + 2 * t * (c[0] - b[0]), 2 * (1 - t) * (b[1] - a[1]) + 2 * t * (c[1] - b[1])];
const unit = (v) => {
  const l = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / l, v[1] / l];
};
const f = (n) => String(Math.round(n));
const path = (pts) => 'M' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join('L') + 'Z';

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function frond(C, deg, L, droop, r) {
  const a = (deg * Math.PI) / 180;
  const dir = [Math.cos(a), Math.sin(a)];
  const E = [C[0] + dir[0] * L, C[1] + dir[1] * L + droop * L];
  const M = [C[0] + dir[0] * L * 0.55, C[1] + dir[1] * L * 0.55 - L * 0.16];
  const n = 15;
  const up = [], low = [], spine = [];
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const S = quad(C, M, E, t);
    const T = unit(quadTan(C, M, E, t));
    const N = [T[1], -T[0]];
    const ll = L * 0.3 * Math.sin(Math.PI * Math.min(1, t * 1.08)) * (0.82 + 0.36 * r());
    const du = unit([N[0] * 0.78 + T[0] * 0.42, N[1] * 0.78 + T[1] * 0.42 + 0.28]);
    const dl = unit([-N[0] * 0.78 + T[0] * 0.42, -N[1] * 0.78 + T[1] * 0.42 + 0.5]);
    spine.push(S);
    up.push([S[0] + du[0] * ll, S[1] + du[1] * ll]);
    low.push([S[0] + dl[0] * ll * 0.95, S[1] + dl[1] * ll * 0.95]);
  }
  const outline = [C];
  for (let i = 0; i < spine.length; i++) outline.push(spine[i], up[i]);
  outline.push(E);
  for (let i = spine.length - 1; i >= 0; i--) outline.push(low[i], spine[i]);
  return { fill: path(outline), spine: `M${f(C[0])} ${f(C[1])}Q${f(M[0])} ${f(M[1])} ${f(E[0])} ${f(E[1])}` };
}

function palm({ x, y, h, lean, w0 = 30, w1 = 13, seed = 1, flen = 200 }) {
  const r = rng(seed);
  const B = [x, y];
  const C = [x + lean, y - h];
  const Q = [x + lean * 0.12 - Math.sign(lean || 1) * h * 0.06, y - h * 0.55];
  const left = [], right = [];
  const N = 30;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const P = quad(B, Q, C, t);
    const T = unit(quadTan(B, Q, C, t));
    const n = [-T[1], T[0]];
    const w = (w0 + (w1 - w0) * t) * (1 + 0.05 * Math.sin(t * 64));
    left.push([P[0] + (n[0] * w) / 2, P[1] + (n[1] * w) / 2]);
    right.push([P[0] - (n[0] * w) / 2, P[1] - (n[1] * w) / 2]);
  }
  const fronds = [], spines = [];
  for (const d of [-168, -146, -120, -96, -72, -48, -22, 4, 28, 186]) {
    const deg = d + (r() - 0.5) * 12;
    const side = Math.abs(Math.cos((deg * Math.PI) / 180));
    const L = flen * (0.78 + r() * 0.34) * (0.85 + side * 0.25);
    const droop = 0.1 + side * 0.42 + (deg > 0 && deg < 180 ? 0.25 : 0);
    const fr = frond(C, deg, L, droop, r);
    fronds.push(fr.fill);
    spines.push(fr.spine);
  }
  const nuts = [[C[0] - 8, C[1] + 10], [C[0] + 7, C[1] + 12], [C[0], C[1] + 20]]
    .map(([cx, cy]) => `M${Math.round(cx - 9)} ${Math.round(cy)}a9 9 0 1 0 18 0a9 9 0 1 0-18 0`)
    .join('');
  return { body: path([...left, ...right.reverse()]) + fronds.join('') + nuts, spines: spines.join('') };
}

const FILL = '#0b0710';
const draw = (p) => `<path fill="${FILL}" d="${p.body}"/><path fill="none" stroke="${FILL}" stroke-width="5" stroke-linecap="round" d="${p.spines}"/>`;

export function palmsSprite() {
  const L1 = palm({ x: 150, y: 1000, h: 830, lean: 190, seed: 3, flen: 240, w0: 34, w1: 14 });
  const L2 = palm({ x: 40, y: 1000, h: 560, lean: -30, seed: 11, flen: 175, w0: 26, w1: 11 });
  const R1 = palm({ x: 470, y: 1000, h: 720, lean: -170, seed: 5, flen: 225, w0: 32, w1: 13 });
  const R2 = palm({ x: 575, y: 1000, h: 470, lean: -20, seed: 19, flen: 150, w0: 22, w1: 10 });
  return (
    `<svg xmlns="http://www.w3.org/2000/svg">` +
    `<symbol id="pl" viewBox="0 0 720 1000">${draw(L2)}${draw(L1)}<path fill="#050307" d="M0 1000V925C120 896 260 912 360 936 450 958 520 978 600 1000Z"/></symbol>` +
    `<symbol id="pr" viewBox="0 0 640 1000">${draw(R2)}${draw(R1)}<path fill="#050307" d="M640 1000V915C520 900 420 922 330 955 270 976 230 990 190 1000Z"/></symbol>` +
    `</svg>`
  );
}
