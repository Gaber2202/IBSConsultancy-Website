import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { pathFor } from '@/lib/site';
import { IconArrow, IconStar } from './icons';

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { hero } = dict;
  const stats = dict.stats?.items ?? [];

  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-900 to-[#0d2748]" />
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 22%, rgba(47,111,208,0.55), transparent 45%), radial-gradient(circle at 88% 12%, rgba(150,170,200,0.28), transparent 42%)',
          }}
        />
        <div className="absolute -right-32 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-steel-500/15 blur-3xl" />
      </div>

      <div className="container-tight relative grid items-center gap-14 pb-20 pt-32 sm:pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-28 lg:pt-40">
        {/* Copy */}
        <div className="max-w-2xl">
          <span className="eyebrow animate-fade-in text-steel-300">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-steel-400" />
            {hero.eyebrow}
          </span>

          <h1 className="mt-6 animate-fade-up text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
            {hero.title}
          </h1>

          <p
            className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-white/70 sm:text-xl"
            style={{ animationDelay: '80ms' }}
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
            <Link href={pathFor(locale, 'services')} className="btn-ghost-light text-base">
              {hero.ctaSecondary}
            </Link>
          </div>

          <div
            className="mt-11 flex animate-fade-up flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60"
            style={{ animationDelay: '240ms' }}
          >
            <div className="flex items-center gap-1 text-steel-300">
              {[0, 1, 2, 3, 4].map((i) => (
                <IconStar key={i} width={16} height={16} />
              ))}
            </div>
            <span>{hero.trust}</span>
          </div>
        </div>

        {/* Visual */}
        <div className="relative animate-fade-up lg:justify-self-end" style={{ animationDelay: '120ms' }}>
          <HeroVisual />

          {/* Floating glass stat cards */}
          {stats[1] && (
            <div className="absolute -left-3 top-6 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-card backdrop-blur-md sm:-left-6">
              <span className="font-display text-2xl font-bold text-white">
                {stats[1].value}
                <span className="text-steel-300">{stats[1].suffix}</span>
              </span>
              <span className="max-w-[7.5rem] text-xs leading-snug text-white/70">{stats[1].label}</span>
            </div>
          )}
          {stats[2] && (
            <div className="absolute -right-2 bottom-8 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-card backdrop-blur-md sm:-right-5">
              <span className="font-display text-2xl font-bold text-white">
                {stats[2].value}
                <span className="text-steel-300">{stats[2].suffix}</span>
              </span>
              <span className="max-w-[7rem] text-xs leading-snug text-white/70">{stats[2].label}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** On-brand architectural skyline — navy + brushed silver, language-neutral. */
function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[460px] rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-3 shadow-card backdrop-blur-sm">
      <svg viewBox="0 0 460 400" className="h-auto w-full" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of a modern UAE skyline">
        <defs>
          <linearGradient id="hv-silver" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F3F5F8" />
            <stop offset="50%" stopColor="#C3CAD3" />
            <stop offset="100%" stopColor="#7C8794" />
          </linearGradient>
          <linearGradient id="hv-navy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#26467a" />
            <stop offset="100%" stopColor="#0c1c30" />
          </linearGradient>
          <radialGradient id="hv-glow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#2F6FD0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2F6FD0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hv-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f223b" />
            <stop offset="100%" stopColor="#0a1524" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* glow */}
        <circle cx="250" cy="120" r="150" fill="url(#hv-glow)" />

        {/* back towers (silver) */}
        <rect x="70" y="150" width="46" height="180" rx="3" fill="url(#hv-silver)" opacity="0.85" />
        <rect x="348" y="128" width="42" height="202" rx="3" fill="url(#hv-silver)" opacity="0.85" />

        {/* mid towers (navy) */}
        <rect x="120" y="112" width="58" height="218" rx="4" fill="url(#hv-navy)" />
        <rect x="300" y="96" width="52" height="234" rx="4" fill="url(#hv-navy)" />

        {/* hero tower — echoes the logo mark (angled silver crown) */}
        <path d="M196 330 V96 L236 76 V330 Z" fill="url(#hv-navy)" />
        <path d="M236 330 V76 L280 96 V330 Z" fill="url(#hv-navy)" />
        <path d="M196 96 L236 76 V120 L196 132 Z" fill="url(#hv-silver)" />
        <rect x="234" y="52" width="4" height="30" rx="2" fill="url(#hv-silver)" />

        {/* window rows */}
        <g fill="#8fb4e6" opacity="0.55">
          {[0, 1, 2, 3, 4, 5, 6].map((r) => (
            <g key={r}>
              <rect x="206" y={120 + r * 28} width="8" height="10" rx="1" />
              <rect x="222" y={120 + r * 28} width="8" height="10" rx="1" />
              <rect x="244" y={120 + r * 28} width="8" height="10" rx="1" />
              <rect x="260" y={120 + r * 28} width="8" height="10" rx="1" />
            </g>
          ))}
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <g key={`m${r}`}>
              <rect x="132" y={130 + r * 30} width="9" height="11" rx="1" />
              <rect x="152" y={130 + r * 30} width="9" height="11" rx="1" />
              <rect x="312" y={116 + r * 32} width="9" height="11" rx="1" />
              <rect x="332" y={116 + r * 32} width="9" height="11" rx="1" />
            </g>
          ))}
        </g>

        {/* ground + reflection */}
        <rect x="40" y="330" width="380" height="3" rx="1.5" fill="#2F6FD0" opacity="0.7" />
        <rect x="40" y="333" width="380" height="46" fill="url(#hv-floor)" opacity="0.5" />
      </svg>
    </div>
  );
}
