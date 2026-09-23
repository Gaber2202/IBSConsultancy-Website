import type { Dictionary } from '@/i18n/dictionaries';
import { Reveal } from './Reveal';

export function Stats({ dict }: { dict: Dictionary }) {
  const { stats } = dict;
  return (
    <section className="relative z-10 -mt-12 pb-4">
      <div className="container-tight">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink-100 shadow-card lg:grid-cols-4">
          {stats.items.map((item, i) => (
            <Reveal
              key={item.label}
              delay={i * 80}
              className="bg-white p-6 text-center sm:p-8"
            >
              <div className="font-display text-4xl font-bold text-ink-900 sm:text-5xl">
                {item.value}
                <span className="text-gold-500">{item.suffix}</span>
              </div>
              <p className="mt-2 text-sm text-ink-500">{item.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
