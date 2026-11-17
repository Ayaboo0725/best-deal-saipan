// Illustrated storefront placeholder. TODO(client): replace with a real storefront photo
// (e.g. <img src="/storefront.webp" …>) — keep the 16:7 frame.
export default function Storefront() {
  return (
    <svg viewBox="0 0 640 280" className="block h-auto w-full" role="img" aria-label="Illustration of the Best Deal storefront on Beach Road (photo coming soon)">
      <defs>
        <linearGradient id="sf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1a3d" />
          <stop offset=".6" stopColor="#7a2f3e" />
          <stop offset="1" stopColor="#e0704a" />
        </linearGradient>
        <linearGradient id="sf-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2ece2" />
          <stop offset="1" stopColor="#cfc6b8" />
        </linearGradient>
      </defs>
      <rect width="640" height="280" fill="url(#sf-sky)" />
      <circle cx="520" cy="150" r="46" fill="#ffb347" opacity=".9" />
      <rect x="80" y="92" width="480" height="160" fill="url(#sf-wall)" />
      <rect x="80" y="78" width="480" height="22" fill="#2a1a20" />
      <rect x="230" y="40" width="180" height="50" rx="6" fill="#d7262e" />
      <text x="320" y="75" textAnchor="middle" fill="#fff" fontFamily="var(--font-display)" fontWeight="800" fontSize="34">
        BEST DEAL
      </text>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path key={i} d={`M${80 + i * 60} 100h60l-6 26h-48z`} fill={i % 2 ? '#f4ede1' : '#d7262e'} />
      ))}
      <rect x="110" y="140" width="130" height="90" fill="#1b2433" />
      <rect x="400" y="140" width="130" height="90" fill="#1b2433" />
      <rect x="270" y="140" width="100" height="112" fill="#0f1520" />
      <rect x="110" y="140" width="130" height="90" fill="#ffd45e" opacity=".12" />
      <rect x="400" y="140" width="130" height="90" fill="#ffd45e" opacity=".12" />
      <rect x="0" y="252" width="640" height="28" fill="#141018" />
      <path d="M30 252c4-60 10-110 30-150M60 102c-20-6-42 4-54 18M60 102c-8-18-30-24-46-20M60 102c14-14 38-14 50-4M60 102c20 0 36 14 40 30" stroke="#0b0710" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M610 252c-4-50-8-90-24-124M586 128c18-6 38 2 48 14M586 128c8-16 26-20 40-16M586 128c-14-12-34-12-46-2" stroke="#0b0710" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
