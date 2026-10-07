import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { pathFor } from '@/lib/site';
import { Reveal } from './Reveal';
import { IconArrow } from './icons';

export function ServicesPreview({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { servicesPreview, services } = dict;

  return (
    <section className="section">
      <div className="container-tight">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{servicesPreview.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold text-ink-900 sm:text-4xl lg:text-5xl">
            {servicesPreview.title}
          </h2>
          <p className="mt-4 lead-text">{servicesPreview.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {services.items.map((service, i) => (
            <Reveal key={service.id} delay={i * 80}>
              <Link
                href={`${pathFor(locale, 'services')}#${service.id}`}
                className="group card card-hover flex h-full flex-col p-7 sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-sm font-semibold text-steel-500">
                    {service.number}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-ink-700 transition-colors group-hover:bg-steel-500 group-hover:text-white">
                    <IconArrow width={16} height={16} className="rtl-flip" />
                  </span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-ink-900">{service.title}</h3>
                <p className="mt-3 flex-1 text-ink-500">{service.short}</p>
                <span className="link-gold mt-6">
                  {servicesPreview.learnMore}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesDetailed({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { services } = dict;

  return (
    <section className="section">
      <div className="container-tight space-y-10">
        {services.items.map((service, i) => (
          <Reveal key={service.id} delay={i * 60}>
            <article
              id={service.id}
              className="scroll-mt-28 surface-panel grid gap-8 p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12"
            >
              <div>
                <span className="eyebrow">{service.number}</span>
                <h2 className="mt-3 text-3xl font-semibold text-ink-900">{service.title}</h2>
                <p className="mt-4 text-ink-500">{service.description}</p>
                <Link href={pathFor(locale, 'contact')} className="btn-primary mt-8">
                  {dict.cta.button}
                </Link>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-2xl border border-ink-100 bg-sand/70 px-4 py-4 text-sm font-medium text-ink-700"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
