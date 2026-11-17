import type { Metadata } from 'next';
import Link from '@/components/ui/Link';
import { notFound } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import Rail from '@/components/product/Rail';
import { POSTS, getPost } from '@/data/blog';
import { byAisle } from '@/lib/catalog';
import { aisleName, img } from '@/lib/aisles';

export const dynamicParams = false;
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <article className="pb-28">
      <header className="page-hero">
        <div className="wrap max-w-[920px]">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog/">Blog</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{post.tag}</li>
            </ol>
          </nav>
          <p className="mono mt-10 text-[11px] text-sun-1">
            {post.tag} · {fmt(post.date)} · {post.read} read
          </p>
          <h1 className="display mt-4 text-[clamp(46px,6.4vw,92px)]">{post.title}</h1>
          <p className="body-copy mt-5 text-[18px]">{post.excerpt}</p>
        </div>
      </header>
      <div className="wrap max-w-[920px]">
        <div className="aspect-[16/8] overflow-hidden rounded-[28px] bg-[#f1eee8]">
          <img src={img(post.cover)} alt="" width={800} height={800} className="h-full w-full object-cover" />
        </div>
        <div className="prose mx-auto mt-12 max-w-[680px]">
          {post.body.map((b, i) => (
            <div key={i}>
              {b.h && <h2>{b.h}</h2>}
              {b.p && <p>{b.p}</p>}
              {b.ul && (
                <ul>
                  {b.ul.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <p className="mt-10">
            <Link href={`/shop/?aisle=${post.aisle}`} className="btn btn-primary" data-magnetic>
              Shop {aisleName(post.aisle)} <Icon name="arrow-right" size={18} className="arrow" />
            </Link>
          </p>
        </div>
      </div>
      <div className="wrap">
        <Rail id="post-products" eyebrow="From the article" title={`${aisleName(post.aisle)} picks`} products={byAisle(post.aisle).slice(0, 10)} />
      </div>
    </article>
  );
}
