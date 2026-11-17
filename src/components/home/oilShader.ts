// Iridescent "living oil surface" for the Pureguard stage.
// Three.js is code-split: this module (and three) only loads when the
// section approaches the viewport on a capable device.
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from 'three';

const vert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const frag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uStir;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
  const float K1 = 0.366025404; const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
  return dot(n, vec3(70.0));
}
float fbm(vec2 p) {
  float f = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { f += a * noise(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p; a *= 0.5; }
  return f;
}
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float d = length(p - m);
  // ripple + gentle pull toward the cursor
  float ripple = sin(d * 30.0 - uTime * 4.0) * exp(-d * 3.5) * uStir;
  p += normalize(p - m + 1e-4) * ripple * 0.025;
  p += (m - p) * exp(-d * 2.5) * 0.06 * uStir;

  float t = uTime * 0.06;
  vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p * 1.8 + 3.0 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p * 1.8 + 3.0 * q + vec2(8.3, 2.8) - t));
  float film = fbm(p * 1.2 + 2.6 * r) + ripple * 0.25;

  // thin-film interference palette: purple · green · orange sheen
  vec3 iri = 0.5 + 0.5 * cos(6.28318 * (film * 2.2 + vec3(0.0, 0.33, 0.67)) + uTime * 0.12);
  iri = pow(iri, vec3(1.25)) * vec3(1.0, 1.08, 1.0);
  float bands = 0.55 + 0.45 * sin(film * 9.0 + length(q) * 4.0 - uTime * 0.3);
  float mask = smoothstep(-0.25, 0.55, film + 0.4 * length(r)) * bands;
  vec3 col = mix(vec3(0.01, 0.008, 0.016), iri * 1.05, clamp(mask, 0.0, 1.0) * 0.92);
  // specular streaks
  float spec = pow(max(0.0, film - 0.3), 2.2) * 2.6;
  col += spec * vec3(1.0, 0.9, 0.75);
  // vignette
  vec2 uv = gl_FragCoord.xy / uRes;
  col *= 1.0 - 0.6 * pow(length(uv - 0.5) * 1.25, 1.6);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function mountOil(container: HTMLElement) {
  const renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'low-power' });
  const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
  renderer.setPixelRatio(dpr * 0.6); // render at reduced resolution — it is a soft gradient
  container.appendChild(renderer.domElement);
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new Vector2(1, 1) },
    uMouse: { value: new Vector2(0.65, 0.5) },
    uStir: { value: 0.3 },
  };
  const mat = new ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms });
  const mesh = new Mesh(new PlaneGeometry(2, 2), mat);
  scene.add(mesh);

  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    const size = new Vector2();
    renderer.getDrawingBufferSize(size);
    uniforms.uRes.value.copy(size);
  };
  resize();

  const target = new Vector2(0.65, 0.5);
  let stir = 0.3;
  const onMove = (e: PointerEvent) => {
    const r = container.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = 1 - (e.clientY - r.top) / r.height;
    const dist = Math.hypot(nx - target.x, ny - target.y);
    target.set(nx, ny);
    stir = Math.min(1.4, stir + dist * 6);
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('resize', resize);

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '100px' });
  io.observe(container);

  let raf = 0;
  const start = performance.now();
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    uniforms.uTime.value = (now - start) / 1000;
    uniforms.uMouse.value.lerp(target, 0.06);
    stir += (0.25 - stir) * 0.02;
    uniforms.uStir.value = stir;
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('resize', resize);
    mat.dispose();
    mesh.geometry.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
