import type { Dictionary } from '@/i18n/dictionaries';
import { Reveal } from './Reveal';

export function WhyUs({ dict }: { dict: Dictionary }) {
  const { whyUs } = dict;
  return (
    <section className="section bg-ink-950 text-white">
      <div className="container-tight">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <span className="eyebrow text-gold-400">{whyUs.eyebrow}</span>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{whyUs.title}</h2>
              <div className="mt-8 h-px w-full bg-white/10" />
              <div className="mt-8 flex items-center gap-4">
                <div className="font-display text-6xl font-bold text-gold-500">98%</div>
                <p className="max-w-[180px] text-sm text-white/60">
                  of our clients would recommend IBS to a fellow founder.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {whyUs.items.map((item, i) => (
              <Reveal key={item.number} delay={i * 80}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-gold-500/40 hover:bg-white/[0.06]">
                  <span className="font-display text-2xl font-bold text-gold-500">{item.number}</span>
                  <h3 className="mt-3 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
