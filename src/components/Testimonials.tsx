import type { Dictionary } from '@/i18n/dictionaries';
import { IconStar } from './icons';
import { Reveal } from './Reveal';

export function Testimonials({ dict }: { dict: Dictionary }) {
  const { testimonials } = dict;
  return (
    <section className="section bg-white">
      <div className="container-tight">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{testimonials.eyebrow}</span>
          <h2 className="mt-4 text-3xl font-semibold text-ink-900 sm:text-4xl lg:text-5xl">
            {testimonials.title}
          </h2>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-ink-100 bg-sand px-5 py-2.5">
            <div className="flex gap-0.5 text-steel-500">
              {[0, 1, 2, 3, 4].map((i) => (
                <IconStar key={i} width={16} height={16} />
              ))}
            </div>
            <span className="text-sm font-semibold text-ink-800">{testimonials.ratingValue}</span>
            <span className="text-sm text-ink-500">{testimonials.ratingLabel}</span>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 90}>
              <figure className="flex h-full flex-col rounded-3xl border border-ink-100 bg-sand/60 p-6 sm:p-7">
                <div className="flex gap-0.5 text-steel-500">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <IconStar key={s} width={14} height={14} />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-700">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-ink-100 pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-950 font-semibold text-steel-300">
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
    </section>
  );
}
