import type { Locale } from '@/i18n/config';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ibsconsultancy.ae').replace(
  /\/$/,
  '',
);

export const contact = {
  phone: process.env.NEXT_PUBLIC_PHONE || '+971 4 000 0000',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '971500000000',
  email: process.env.NEXT_PUBLIC_EMAIL || 'info@ibsconsultancy.ae',
};

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function pathFor(locale: Locale, path = ''): string {
  const clean = path.replace(/^\//, '');
  return `/${locale}${clean ? `/${clean}` : ''}`;
}

export function absoluteUrl(path = ''): string {
  const clean = path.replace(/^\//, '');
  return `${SITE_URL}/${clean}`;
}

/**
 * Full canonical + hreflang alternates for a page.
 * `subpath` is the path after the locale, e.g. 'about' or 'blog/slug' ('' for home).
 */
export function alternatesFor(locale: string, subpath = '') {
  const suffix = subpath ? `/${subpath}` : '';
  return {
    canonical: absoluteUrl(`${locale}${suffix}`),
    languages: {
      en: absoluteUrl(`en${suffix}`),
      ar: absoluteUrl(`ar${suffix}`),
      'x-default': absoluteUrl(`en${suffix}`),
    },
  };
}
