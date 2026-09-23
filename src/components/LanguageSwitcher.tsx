'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';

export function LanguageSwitcher({
  locale,
  label,
  variant = 'dark',
}: {
  locale: Locale;
  label: string;
  variant?: 'dark' | 'light';
}) {
  const pathname = usePathname() || `/${locale}`;
  const target: Locale = locale === 'en' ? 'ar' : 'en';

  // Swap the leading locale segment, preserving the rest of the path.
  const segments = pathname.split('/');
  segments[1] = target;
  const href = segments.join('/') || `/${target}`;

  const styles =
    variant === 'light'
      ? 'border-white/30 text-white hover:bg-white/10'
      : 'border-ink-200 text-ink-700 hover:border-ink-900 hover:text-ink-900';

  return (
    <Link
      href={href}
      hrefLang={target}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${styles}`}
      aria-label={`Switch language to ${label}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
      {label}
    </Link>
  );
}
