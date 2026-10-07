import Image from 'next/image';

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  imageSrc = '/images/page-header-architecture.jpg',
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  imageSrc?: string;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 text-white sm:pt-40 lg:pb-20 lg:pt-44">
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-ink-950/78" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/55 to-transparent"
        aria-hidden="true"
      />
      <div className="container-tight relative">
        <div className="max-w-3xl">
          <span className="eyebrow text-steel-300">{eyebrow}</span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && <p className="mt-5 max-w-2xl text-lg text-white/70">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
