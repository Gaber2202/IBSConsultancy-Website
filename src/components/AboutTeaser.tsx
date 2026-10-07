import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { pathFor } from '@/lib/site';
import { IconArrow } from './icons';
import { Reveal } from './Reveal';

export function AboutTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { about, servicesPreview } = dict;
  return (
    <section className="section relative overflow-hidden">
      <div className="absolute inset-0 mesh-light opacity-70" aria-hidden="true" />
      <div className="container-tight relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <span className="eyebrow">{about.eyebrow}</span>
            <h2 className="mt-4 text-3xl font-semibold text-ink-900 sm:text-4xl lg:text-5xl">
              {about.title}
            </h2>
            <p className="mt-5 lead-text">{about.lead}</p>
            <p className="mt-4 text-ink-600">{about.body[0]}</p>
            <Link href={pathFor(locale, 'about')} className="link-gold mt-8">
              {servicesPreview.readMore}
              <IconArrow width={16} height={16} className="rtl-flip" />
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <div className="surface-panel relative overflow-hidden p-8 sm:p-10">
              <div
                className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-steel-500/15 blur-2xl"
                aria-hidden="true"
              />
              <p className="font-display text-4xl font-semibold text-ink-900 sm:text-5xl">IBS</p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-steel-600">
                {dict.hero.brandLine}
              </p>
              <p className="mt-6 text-ink-600">{about.mission}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
