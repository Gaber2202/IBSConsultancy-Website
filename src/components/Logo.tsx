import { pathFor } from '@/lib/site';
import type { Locale } from '@/i18n/config';
import Link from 'next/link';

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1.5" y="1.5" width="53" height="53" rx="15" fill="#0B1B2B" />
      <rect x="1.5" y="1.5" width="53" height="53" rx="15" stroke="#C9A227" strokeWidth="1.5" />
      <text
        x="28"
        y="37"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="22"
        fontWeight="700"
        fill="#FFFFFF"
        letterSpacing="0.5"
      >
        IBS
      </text>
      <rect x="16" y="43" width="24" height="2.5" rx="1.25" fill="#C9A227" />
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
  const textColor = variant === 'light' ? 'text-white' : 'text-ink-900';
  const subColor = variant === 'light' ? 'text-white/60' : 'text-ink-400';
  return (
    <Link
      href={pathFor(locale)}
      className="inline-flex items-center gap-3 transition-opacity hover:opacity-90"
      aria-label="IBS Consultancy — Home"
    >
      <LogoMark className="h-11 w-11 shrink-0" />
      {showText && (
        <span className="flex flex-col leading-none">
          <span className={`font-display text-xl font-bold tracking-tight ${textColor}`}>
            IBS Consultancy
          </span>
          <span className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${subColor}`}>
            Business Setup · UAE
          </span>
        </span>
      )}
    </Link>
  );
}
