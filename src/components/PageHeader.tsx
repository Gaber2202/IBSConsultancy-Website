export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 text-white sm:pt-40 lg:pb-20 lg:pt-44">
      <div className="absolute inset-0 hero-atmosphere" />
      <div
        className="absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-18deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 16px)',
        }}
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
