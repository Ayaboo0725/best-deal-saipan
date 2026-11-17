import type { Metadata } from 'next';
import Link from '@/components/ui/Link';
import { notFound } from 'next/navigation';
import ProductView from '@/components/product/ProductView';
import Rail from '@/components/product/Rail';
import { PRODUCTS, byAisle, family, getAisle, getLite, getProduct } from '@/lib/catalog';
import { img } from '@/lib/aisles';
import { STORE } from '@/config/store';
import type { LiteProduct } from '@/lib/types';

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name}${p.variants[0].size !== 'Each' ? ` ${p.variants[0].size}` : ''}`,
    description: `${p.name} — USD ${p.price.toFixed(2)} at Best Deal, ${STORE.address.short}, Saipan. ${p.aisleName} aisle. In-store pickup or island delivery.`,
    openGraph: { images: [img(p.slug)] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  const aisle = p && getAisle(p.aisle);
  if (!p || !aisle) notFound();

  const fbt = p.fbt.map(getLite).filter(Boolean) as LiteProduct[];
  const more = byAisle(p.aisle).filter((q) => q.slug !== p.slug).slice(0, 10);
  const v = p.variants[0];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: v.sku,
    gtin13: v.ean,
    brand: { '@type': 'Brand', name: p.brand },
    category: p.aisleName,
    image: img(p.slug),
    description: p.description,
    offers: p.variants.map((x) => ({
      '@type': 'Offer',
      sku: x.sku,
      price: x.price.toFixed(2),
      priceCurrency: 'USD',
      availability: x.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    })),
  };

  return (
    <div className="pdp wrap pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="crumbs">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop/">Shop</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/shop/?aisle=${aisle.slug}`}>{aisle.name}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="max-w-[40ch] truncate">
            {p.name}
          </li>
        </ol>
      </nav>
      <ProductView product={p} family={family(p)} fbt={fbt} aisle={aisle} />
      <Rail id="more-aisle" eyebrow={`Aisle ${String(aisle.num).padStart(2, '0')}`} title={`More from ${aisle.name}`} products={more} />
    </div>
  );
}
