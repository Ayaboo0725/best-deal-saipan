import type { Metadata } from 'next';
import Link from '@/components/ui/Link';
import PageHero from '@/components/layout/PageHero';
import Icon from '@/components/ui/Icon';
import { POSTS } from '@/data/blog';
import { img } from '@/lib/aisles';

export const metadata: Metadata = { title: 'Blog', description: 'Guides from the Best Deal counter — engine oil, typhoon prep, pool care and more.' };

const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default function BlogPage() {
  const [first, ...rest] = POSTS;
  return (
    <>
      <PageHero crumb="Blog" eyebrow="From the counter" title="Island" accent="know-how." lead="Practical guides for the things Saipan runs on — written for island conditions." />
      <section className="wrap pb-28">
        <Link href={`/blog/${first.slug}/`} className="group grid overflow-hidden rounded-[28px] border border-line bg-white/[0.02] md:grid-cols-2" data-cursor="view" data-reveal>
          <div className="relative aspect-[4/3] overflow-hidden bg-[#f1eee8] md:aspect-auto">
            <img src={img(first.cover)} alt="" width={800} height={800} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="mono text-[11px] text-sun-1">
              {first.tag} · {fmt(first.date)} · {first.read}
            </p>
            <h2 className="display mt-4 text-[clamp(38px,4vw,60px)] transition-colors group-hover:text-sun-2">{first.title}</h2>
            <p className="body-copy mt-4">{first.excerpt}</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sun-1">
              Read the guide <Icon name="arrow-right" size={16} />
            </span>
          </div>
        </Link>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((p, i) => (
            <li key={p.slug} data-reveal style={{ ['--i' as string]: i + 1 }}>
              <Link href={`/blog/${p.slug}/`} className="group block overflow-hidden rounded-[28px] border border-line bg-white/[0.02]" data-cursor="view">
                <div className="aspect-[16/9] overflow-hidden bg-[#f1eee8]">
                  <img src={img(p.cover)} alt="" width={800} height={800} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-7">
                  <p className="mono text-[11px] text-sun-1">
                    {p.tag} · {fmt(p.date)} · {p.read}
                  </p>
                  <h2 className="display mt-3 text-[36px] transition-colors group-hover:text-sun-2">{p.title}</h2>
                  <p className="body-copy mt-3 text-[15px]">{p.excerpt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
