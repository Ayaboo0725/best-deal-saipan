export const money = (n: number) => `$${n.toFixed(2)}`;
export const usd = (n: number) => `USD ${n.toFixed(2)}`;
export const pct = (price: number, was?: number) => (was && was > price ? Math.round((1 - price / was) * 100) : 0);
export const pad2 = (n: number) => String(n).padStart(2, '0');

/** Display title with size, e.g. "Mobil 1 0W-20 … 32oz" (no size for "Each"). */
export const titleWithSize = (name: string, size: string) => (size === 'Each' ? name : `${name} ${size}`);

export type StockState = 'in' | 'low' | 'out';
export const stockState = (n: number): StockState => (n <= 0 ? 'out' : n <= 4 ? 'low' : 'in');
export const stockLabel = (n: number) => (n <= 0 ? 'Out of stock' : n <= 4 ? `Low stock · ${n} left` : 'In stock');
