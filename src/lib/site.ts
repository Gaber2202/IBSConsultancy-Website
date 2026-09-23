import type { Locale } from '@/i18n/config';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ibsconsultancy.ae').replace(
  /\/$/,
  '',
);

export type SiteSocial = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  x?: string;
  youtube?: string;
  tiktok?: string;
};

export type SiteContact = {
  phone: string;
  whatsapp: string;
  email: string;
  social?: SiteSocial;
};

export const contact: SiteContact = {
  phone: process.env.NEXT_PUBLIC_PHONE || '+971 50 606 5440',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '971506065440',
  email: process.env.NEXT_PUBLIC_EMAIL || 'info@ibsconsultancy.ae',
  social: {
    facebook:
      'https://www.facebook.com/people/IBS-Business-Setup-Structuring-UAE/61585175923684/',
    instagram: 'https://www.instagram.com/ibsforinvestors/',
  },
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
