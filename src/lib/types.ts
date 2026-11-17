export type Variant = {
  id: string;
  size: string;
  price: number;
  was?: number;
  stock: number;
  sku: string;
  code?: string;
  ean?: string;
};

/** Slim product used on the client (grid, search, quick view, cart). */
export type LiteProduct = {
  id: number;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  spec: string;
  aisle: string;
  col: 'pureguard' | 'shop' | 'home-garden';
  photo: boolean;
  price: number;
  was?: number;
  stock: number;
  rank: number;
  v: Variant[];
  isNew?: boolean;
  deal?: boolean;
  pop?: number;
  spot?: string;
  pg?: string;
  pgName?: string;
};

/** Full product used by server-rendered pages. */
export type Product = {
  id: number;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  spec: string;
  photo: boolean;
  realPhoto: boolean;
  aisle: string;
  aisleNum: number;
  aisleName: string;
  collection: LiteProduct['col'];
  variants: Variant[];
  price: number;
  was?: number;
  stock: number;
  isNew: boolean;
  deal: boolean;
  pop: number;
  spot: string | null;
  family: string | null;
  grade: string | null;
  pg: string | null;
  pgName: string | null;
  description: string;
  compat: string;
  rank: number;
  fbt: string[];
};

export type Aisle = {
  num: number;
  slug: string;
  name: string;
  icon: string;
  stocked: boolean;
  popular: boolean;
  collection: string;
  count: number;
  blurb: string;
  label: [string, string, string];
  featured: { slug: string; name: string; price: number } | null;
};

export type CartLine = {
  key: string;
  slug: string;
  name: string;
  brand: string;
  aisle: string;
  variantId: string;
  size: string;
  price: number;
  qty: number;
  max: number;
};
