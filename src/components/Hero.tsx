import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { pathFor } from '@/lib/site';
import { IconArrow, IconStar } from './icons';

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { hero } = dict;
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(201,162,39,0.5), transparent 45%), radial-gradient(circle at 85% 15%, rgba(201,162,39,0.25), transparent 40%)',
          }}
        />
        <div className="absolute -right-40 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl" />
      </div>

      <div className="container-tight relative pb-20 pt-36 sm:pt-40 lg:pb-28 lg:pt-44">
        <div className="max-w-3xl">
          <span className="eyebrow animate-fade-in text-gold-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold-400" />
            {hero.eyebrow}
          </span>

          <h1 className="mt-6 animate-fade-up text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>

          <p className="mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-white/70 sm:text-xl" style={{ animationDelay: '80ms' }}>
            {hero.subtitle}
          </p>

          <div className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: '160ms' }}>
            <Link href={pathFor(locale, 'contact')} className="btn-primary text-base">
              {hero.ctaPrimary}
              <IconArrow width={18} height={18} />
            </Link>
            <Link href={pathFor(locale, 'services')} className="btn-ghost-light text-base">
              {hero.ctaSecondary}
            </Link>
          </div>

          <div className="mt-12 flex animate-fade-up flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60" style={{ animationDelay: '240ms' }}>
            <div className="flex items-center gap-1 text-gold-400">
              {[0, 1, 2, 3, 4].map((i) => (
                <IconStar key={i} width={16} height={16} />
              ))}
            </div>
            <span>{hero.trust}</span>
          </div>
        </div>
      </div>

      {/* Bottom fade to page */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/0 to-transparent" />
    </section>
  );
}
