import { pathFor } from '@/lib/site';
import type { Locale } from '@/i18n/config';
import Link from 'next/link';

/**
 * IBS mark — a two-tone skyscraper (navy + brushed silver) echoing the
 * "Intelligent Business Solutions" identity. Rendered as crisp, scalable SVG
 * so it stays sharp from favicon size up to hero size, on any background.
 */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ibs-silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F3F5F8" />
          <stop offset="45%" stopColor="#C3CAD3" />
          <stop offset="100%" stopColor="#7C8794" />
        </linearGradient>
        <linearGradient id="ibs-navy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E3A63" />
          <stop offset="100%" stopColor="#0B1B2B" />
        </linearGradient>
      </defs>

      {/* Brushed-silver front facet of the tower */}
      <path d="M12 44 V20 L20 15 V44 Z" fill="url(#ibs-silver)" />
      {/* Navy tower body with a slanted crown */}
      <path d="M20 44 V15 L32 9 V44 Z" fill="url(#ibs-navy)" />
      {/* Thin silver seam that catches the light */}
      <path d="M20 44 V15 L21.4 14.3 V44 Z" fill="#DCE0E6" opacity="0.7" />
      {/* Vertical accent rule (the divider from the wordmark) */}
      <rect x="35.4" y="9" width="1.7" height="35" rx="0.85" fill="url(#ibs-silver)" />
      {/* Ground line */}
      <rect x="9" y="44" width="30" height="1.8" rx="0.9" fill="#0B1B2B" />
    </svg>
  );
}

export function Logo({
  locale,
  variant = 'dark',
  showText = true,
}: {
  locale: Locale;
  variant?: 'dark' | 'light';
  showText?: boolean;
}) {
  const wordColor = variant === 'light' ? 'text-white' : 'text-ink-900';
  const subColor = variant === 'light' ? 'text-white/55' : 'text-ink-400';
  return (
    <Link
      href={pathFor(locale)}
      className="group inline-flex items-center gap-3 transition-opacity hover:opacity-90"
      aria-label="IBS — Intelligent Business Solutions — Home"
    >
      <LogoMark className="h-10 w-10 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" />
      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display text-[1.6rem] font-bold leading-none tracking-tight ${wordColor}`}
          >
            IBS
          </span>
          <span
            className={`mt-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] ${subColor}`}
          >
            Intelligent Business Solutions
          </span>
        </span>
      )}
    </Link>
  );
}
