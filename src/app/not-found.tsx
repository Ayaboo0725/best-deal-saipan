import Link from '@/components/ui/Link';
import Icon from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <section className="page-hero min-h-[80vh]">
      <div className="wrap">
        <p className="eyebrow mt-10">
          <span className="dot" /> Error 404
        </p>
        <h1 className="display mt-4 text-[clamp(64px,12vw,180px)]">
          Off the <span className="grad-sun">map.</span>
        </h1>
        <p className="body-copy mt-6 max-w-xl text-[17px]">That page isn’t on any aisle. Try searching the catalog or head back to the counter.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Back home <Icon name="arrow-right" size={18} className="arrow" />
          </Link>
          <Link href="/shop/" className="btn btn-glass">
            Shop all aisles
          </Link>
        </div>
      </div>
    </section>
  );
}
