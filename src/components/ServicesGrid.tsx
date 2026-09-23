import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { pathFor } from '@/lib/site';
import { serviceIcons, IconArrow, IconCheck } from './icons';
import { Reveal } from './Reveal';

/** Compact grid used on the homepage. */
export function ServicesPreview({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { servicesPreview, services } = dict;
  return (
    <section className="section">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow">{servicesPreview.eyebrow}</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">{servicesPreview.title}</h2>
            <p className="mt-4 lead-text">{servicesPreview.subtitle}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.items.map((service, i) => {
            const Icon = serviceIcons[service.id];
            return (
              <Reveal key={service.id} delay={i * 80}>
                <Link
                  href={`${pathFor(locale, 'services')}#${service.id}`}
                  className="card card-hover group flex h-full flex-col p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-ink-950">
                    {Icon && <Icon width={24} height={24} />}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-ink-900">{service.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{service.short}</p>
                  <span className="link-gold mt-5 text-sm">
                    {servicesPreview.learnMore}
                    <IconArrow width={16} height={16} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Detailed alternating rows used on the Services page. */
export function ServicesDetailed({ dict }: { dict: Dictionary }) {
  const { services } = dict;
  return (
    <section className="section">
      <div className="container-tight space-y-16 lg:space-y-24">
        {services.items.map((service, i) => {
          const Icon = serviceIcons[service.id];
          const reverse = i % 2 === 1;
          return (
            <Reveal key={service.id}>
              <div id={service.id} className="scroll-mt-28 grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <div className={reverse ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-950 text-gold-400">
                      {Icon && <Icon width={28} height={28} />}
                    </div>
                    <span className="font-display text-5xl font-bold text-ink-100">{service.number}</span>
                  </div>
                  <h2 className="mt-6 text-3xl font-bold text-ink-900">{service.title}</h2>
                  <p className="mt-4 leading-relaxed text-ink-600">{service.description}</p>
                </div>

                <div className={reverse ? 'lg:order-1' : ''}>
                  <div className="rounded-2xl border border-ink-100 bg-sand p-8">
                    <ul className="space-y-4">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500 text-ink-950">
                            <IconCheck width={15} height={15} strokeWidth={2.4} />
                          </span>
                          <span className="text-ink-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
