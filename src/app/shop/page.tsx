import type { Metadata } from 'next';
import { ShopView } from '@/components/shop/ShopView';

export const metadata: Metadata = {
  title: 'Shop all products',
  description: '202 products across 17 stocked aisles — engine oil, lighting, power tools, lawn & garden, pool, butane and more. Filter by aisle, brand, price and stock.',
};

export default function ShopPage() {
  return <ShopView />;
}
