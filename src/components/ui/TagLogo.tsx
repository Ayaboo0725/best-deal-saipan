// Best Deal red price tag. TODO(client): swap for the official logo files.

/** Horizontal tag mark for the header / footer. */
export function TagMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 36" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="tm-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ef3b42" />
          <stop offset="1" stopColor="#b81d24" />
        </linearGradient>
      </defs>
      <path
        fillRule="evenodd"
        fill="url(#tm-g)"
        d="M15 2h43a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H15a3 3 0 0 1-2.2-1L2.6 20a3 3 0 0 1 0-4L12.8 3a3 3 0 0 1 2.2-1Zm-2 16a3 3 0 1 0 6 0 3 3 0 1 0-6 0Z"
      />
      <rect x="22.5" y="7" width="35" height="22" rx="2" fill="none" stroke="#fff" strokeOpacity=".55" strokeDasharray="2 2.2" strokeWidth="1" />
      <text x="40" y="22.6" textAnchor="middle" fill="#fff" fontFamily="var(--font-display)" fontWeight="800" fontSize="15" letterSpacing=".5">
        BD
      </text>
    </svg>
  );
}

/** Vertical hanging tag for the intro (hole at the top, string attaches there). */
export function HangingTag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 250" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ht-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2464d" />
          <stop offset=".55" stopColor="#d7262e" />
          <stop offset="1" stopColor="#a5171e" />
        </linearGradient>
        <linearGradient id="ht-s" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        fillRule="evenodd"
        fill="url(#ht-g)"
        d="M80 2 150 52a6 6 0 0 1 2.5 4.9V238a10 10 0 0 1-10 10H17.5a10 10 0 0 1-10-10V56.9A6 6 0 0 1 10 52L80 2Zm-9 34a9 9 0 1 0 18 0 9 9 0 1 0-18 0Z"
      />
      <path d="M20 70h120v164H20z" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.5" strokeDasharray="4 4" />
      <path d="M8 60 80 10l72 50v30L80 40 8 90z" fill="url(#ht-s)" opacity=".5" />
      <circle cx="80" cy="36" r="12" fill="none" stroke="#f4ede1" strokeOpacity=".6" strokeWidth="2.5" />
      <text x="80" y="132" textAnchor="middle" fill="#fff" fontFamily="var(--font-display)" fontWeight="800" fontSize="54" letterSpacing="1">
        BEST
      </text>
      <text x="80" y="184" textAnchor="middle" fill="#fff" fontFamily="var(--font-display)" fontWeight="800" fontSize="54" letterSpacing="1">
        DEAL
      </text>
      <text x="80" y="214" textAnchor="middle" fill="#fff" fillOpacity=".8" fontFamily="var(--font-mono)" fontWeight="500" fontSize="9.5" letterSpacing="2.4">
        SAIPAN · 2014
      </text>
    </svg>
  );
}
