import type { Dictionary } from '@/i18n/dictionaries';
import { Reveal } from './Reveal';

export function WhyUs({ dict }: { dict: Dictionary }) {
  const { whyUs } = dict;
  return (
    <section className="section relative overflow-hidden bg-ink-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 50% 40% at 10% 20%, rgba(47,111,208,0.35), transparent 55%), radial-gradient(ellipse 40% 30% at 90% 80%, rgba(174,184,196,0.12), transparent 50%)',
        }}
      />
      <div className="container-tight relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-steel-300">{whyUs.eyebrow}</span>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">{whyUs.title}</h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {whyUs.items.map((item, i) => (
            <Reveal key={item.number} delay={i * 80}>
              <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-colors hover:border-steel-400/40 hover:bg-white/[0.07]">
                <span className="font-display text-2xl font-semibold text-steel-300">{item.number}</span>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
