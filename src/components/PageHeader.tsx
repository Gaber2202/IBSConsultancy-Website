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
    <section className="relative overflow-hidden bg-ink-950 pb-16 pt-36 text-white sm:pt-40 lg:pb-20 lg:pt-44">
      <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(201,162,39,0.5), transparent 45%)',
        }}
      />
      <div className="container-tight relative">
        <div className="max-w-3xl">
          <span className="eyebrow text-gold-400">{eyebrow}</span>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-5 max-w-2xl text-lg text-white/70">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
