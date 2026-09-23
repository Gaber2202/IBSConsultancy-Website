import type { Dictionary } from '@/i18n/dictionaries';
import { IconStar } from './icons';
import { Reveal } from './Reveal';

export function Testimonials({ dict }: { dict: Dictionary }) {
  const { testimonials } = dict;
  return (
    <section className="section">
      <div className="container-tight">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal>
            <span className="eyebrow">{testimonials.eyebrow}</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">{testimonials.title}</h2>
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
              <div className="font-display text-5xl font-bold text-ink-900">{testimonials.ratingValue}</div>
              <div>
                <div className="flex gap-0.5 text-gold-500">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <IconStar key={i} width={18} height={18} />
                  ))}
                </div>
                <p className="mt-1 text-sm text-ink-500">{testimonials.ratingSummary}</p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {testimonials.items.map((item, i) => (
              <Reveal
                key={item.name}
                delay={i * 90}
                className={i === 0 ? 'sm:col-span-2' : ''}
              >
                <figure className="flex h-full flex-col rounded-2xl border border-ink-100 bg-sand p-6">
                  <div className="flex gap-0.5 text-gold-500">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <IconStar key={s} width={15} height={15} />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-ink-700">“{item.quote}”</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-950 font-semibold text-gold-400">
                      {item.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink-900">{item.name}</span>
                      <span className="block text-xs text-ink-500">{item.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
