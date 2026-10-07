import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { pathFor } from '@/lib/site';
import { IconArrow } from './icons';

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { hero } = dict;

  return (
    <section className="relative min-h-[100svh] overflow-hidden text-white">
      {/* Full-bleed photographic hero */}
      <Image
        src="/images/hero-dubai-skyline.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center animate-ken-burns"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink-950/92 via-ink-950/78 to-ink-900/45"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-ink-950/35"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-sand to-transparent"
        aria-hidden="true"
      />

      <div className="container-tight relative flex min-h-[100svh] flex-col justify-end pb-16 pt-32 sm:pb-20 sm:pt-36 lg:justify-center lg:pb-28 lg:pt-28">
        <div className="max-w-3xl">
          <p className="animate-fade-in text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            IBS
            <span className="mt-2 block text-lg font-medium tracking-[0.18em] text-steel-300 sm:text-xl">
              {hero.brandLine}
            </span>
          </p>

          <h1 className="mt-8 max-w-2xl animate-fade-up text-3xl font-semibold leading-[1.12] text-white/95 sm:text-4xl lg:text-[2.75rem]">
            {hero.title}
          </h1>

          <p
            className="mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-white/75 sm:text-lg"
            style={{ animationDelay: '90ms' }}
          >
            {hero.subtitle}
          </p>

          <div
            className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: '160ms' }}
          >
            <Link href={pathFor(locale, 'contact')} className="btn-primary text-base">
              {hero.ctaPrimary}
              <IconArrow width={18} height={18} className="rtl-flip" />
            </Link>
            <Link href={pathFor(locale, 'calculator')} className="btn-ghost-light text-base">
              {hero.ctaSecondary}
            </Link>
          </div>

          <p
            className="mt-8 max-w-md animate-fade-up text-sm text-white/55"
            style={{ animationDelay: '220ms' }}
          >
            {hero.trust}
          </p>
        </div>
      </div>
    </section>
  );
}
