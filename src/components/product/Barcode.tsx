// EAN-13 barcode rendered as SVG bars (same encoding as the build-time labels).
const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
const R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
const PARITY = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

function bits(ean: string) {
  const d = ean.split('').map(Number);
  const par = PARITY[d[0]];
  let b = '101';
  for (let i = 1; i <= 6; i++) b += (par[i - 1] === 'L' ? L : G)[d[i]];
  b += '01010';
  for (let i = 7; i <= 12; i++) b += R[d[i]];
  return b + '101';
}

export default function Barcode({ ean, className = '' }: { ean: string; className?: string }) {
  if (!/^\d{13}$/.test(ean)) return null;
  const b = bits(ean);
  const guard = new Set([0, 1, 2, 45, 46, 47, 48, 49, 92, 93, 94]);
  const rects: React.ReactNode[] = [];
  let i = 0;
  while (i < 95) {
    if (b[i] === '1') {
      let j = i;
      while (j < 95 && b[j] === '1') j++;
      rects.push(<rect key={i} x={i + 7} y={0} width={j - i} height={guard.has(i) ? 46 : 40} />);
      i = j;
    } else i++;
  }
  return (
    <svg viewBox="0 0 109 56" className={className} role="img" aria-label={`Barcode ${ean}`}>
      <rect width="109" height="56" fill="#F4EDE1" rx="3" />
      <g fill="#0B0B0C" transform="translate(0 4)">{rects}</g>
      <g fill="#0B0B0C" fontFamily="var(--font-mono)" fontSize="6.4" textAnchor="middle">
        <text x="3.5" y="51">
          {ean[0]}
        </text>
        <text x="31" y="51.5">
          {ean.slice(1, 7)}
        </text>
        <text x="77" y="51.5">
          {ean.slice(7)}
        </text>
      </g>
    </svg>
  );
}
