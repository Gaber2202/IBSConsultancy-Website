import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { pathFor } from '@/lib/site';
import { IconArrow } from './icons';
import { Reveal } from './Reveal';

export function AboutTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { about, servicesPreview, stats } = dict;
  return (
    <section className="section bg-sand">
      <div className="container-tight">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="eyebrow">{about.eyebrow}</span>
            <h2 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">{about.title}</h2>
            <p className="mt-5 lead-text">{about.lead}</p>
            <p className="mt-4 text-ink-600">{about.body[0]}</p>
            <Link href={pathFor(locale, 'about')} className="link-gold mt-7">
              {servicesPreview.readMore}
              <IconArrow width={16} height={16} />
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {stats.items.slice(0, 4).map((item, i) => (
                  <div
                    key={item.label}
                    className={`rounded-2xl border border-ink-100 bg-white p-6 shadow-soft ${
                      i % 2 === 1 ? 'sm:mt-6' : ''
                    }`}
                  >
                    <div className="font-display text-3xl font-bold text-ink-900">
                      {item.value}
                      <span className="text-gold-500">{item.suffix}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-ink-500">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute -bottom-6 start-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-gold-500/20 blur-2xl" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
