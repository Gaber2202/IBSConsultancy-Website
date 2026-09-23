import type { Dictionary } from '@/i18n/dictionaries';
import { Reveal } from './Reveal';

export function Process({ dict, withHeading = true }: { dict: Dictionary; withHeading?: boolean }) {
  const { process, services } = dict;
  return (
    <section className="section bg-sand">
      <div className="container-tight">
        {withHeading && (
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <span className="eyebrow">{services.eyebrow}</span>
              <h2 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">{services.processTitle}</h2>
              <p className="mt-4 lead-text">{services.processSubtitle}</p>
            </Reveal>
          </div>
        )}

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {process.items.map((item, i) => (
            <Reveal key={item.step} delay={i * 100}>
              <div className="relative">
                {i < process.items.length - 1 && (
                  <div className="absolute top-8 hidden h-px w-full bg-ink-200 ltr:left-1/2 rtl:right-1/2 md:block" />
                )}
                <div className="relative flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-500 bg-white font-display text-xl font-bold text-ink-900 shadow-soft">
                    {item.step}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-ink-900">{item.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-500">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
