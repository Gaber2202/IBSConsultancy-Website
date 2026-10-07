import type { Dictionary } from '@/i18n/dictionaries';
import { Reveal } from './Reveal';

export function Process({ dict, withHeading = true }: { dict: Dictionary; withHeading?: boolean }) {
  const { process, services } = dict;
  return (
    <section className="section">
      <div className="container-tight">
        {withHeading && (
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <span className="eyebrow">{services.eyebrow}</span>
              <h2 className="mt-4 text-3xl font-semibold text-ink-900 sm:text-4xl">
                {services.processTitle}
              </h2>
              <p className="mt-4 lead-text">{services.processSubtitle}</p>
            </Reveal>
          </div>
        )}

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {process.items.map((item, i) => (
            <Reveal key={item.step} delay={i * 100}>
              <div className="surface-panel relative h-full p-7 text-center sm:p-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-950 font-display text-lg font-semibold text-steel-300">
                  {item.step}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
