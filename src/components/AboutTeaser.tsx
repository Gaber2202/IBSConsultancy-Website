import Image from 'next/image';
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
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
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
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-card">
              <Image
                src="/images/about-office.jpg"
                alt={locale === 'ar' ? 'مكتب استشارات IBS' : 'IBS consultancy office'}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 to-transparent p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-steel-300">
                  {dict.hero.brandLine}
                </p>
                <p className="mt-2 text-sm text-white/80 line-clamp-2">{about.mission}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
