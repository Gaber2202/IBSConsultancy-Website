import type { Dictionary } from '@/i18n/dictionaries';
import { Reveal } from './Reveal';

export function Stats({ dict }: { dict: Dictionary }) {
  const items = dict.stats?.items ?? [];

  return (
    <section className="relative -mt-8 pb-4 sm:-mt-12">
      <div className="container-tight">
        <Reveal>
          <div className="surface-panel grid grid-cols-2 gap-px overflow-hidden bg-ink-100/60 sm:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.label}
                className="bg-white px-5 py-8 text-center sm:px-6 sm:py-10"
              >
                <p className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
                  {item.value}
                  <span className="text-steel-500">{item.suffix}</span>
                </p>
                <p className="mt-2 text-xs font-medium leading-snug text-ink-500 sm:text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
