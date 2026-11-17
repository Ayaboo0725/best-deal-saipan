import Link from '@/components/ui/Link';

export default function PageHero({ eyebrow, title, accent, lead, crumb }: { eyebrow: string; title: string; accent?: string; lead?: string; crumb: string }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{crumb}</li>
          </ol>
        </nav>
        <p className="eyebrow mt-10">
          <span className="dot" /> {eyebrow}
        </p>
        <h1 className="display mt-4 text-[clamp(56px,9vw,132px)]">
          {title} {accent && <span className="grad-sun">{accent}</span>}
        </h1>
        {lead && <p className="body-copy mt-6 max-w-2xl text-[17px]">{lead}</p>}
      </div>
    </section>
  );
}
