import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { locales, localeConfig, isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { SITE_URL, absoluteUrl } from '@/lib/site';
import { getSettings } from '@/lib/settings';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const GOOGLE_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.home.title,
      template: `%s | ${dict.meta.siteName}`,
    },
    description: dict.meta.home.description,
    alternates: {
      canonical: absoluteUrl(locale),
      languages: {
        en: absoluteUrl('en'),
        ar: absoluteUrl('ar'),
        'x-default': absoluteUrl('en'),
      },
    },
    openGraph: {
      type: 'website',
      siteName: dict.meta.siteName,
      locale: locale === 'ar' ? 'ar_AE' : 'en_US',
      url: absoluteUrl(locale),
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
    // Favicon comes from the app/icon.svg file convention; this adds the
    // app-icon for iOS home-screen installs.
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
      apple: [{ url: '/icon-maskable.svg' }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const { dir, htmlLang } = localeConfig[locale];
  const dict = await getDictionary(locale);
  const { contact } = await getSettings();

  return (
    <html lang={htmlLang} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
        <meta name="theme-color" content="#0B1B2B" />
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:m-2 focus:rounded focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-white">
          {dict.common.skipToContent}
        </a>
        <Header locale={locale} nav={dict.nav} contact={contact} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} dict={dict} contact={contact} />
        <WhatsAppButton label={dict.cta.secondary} whatsapp={contact.whatsapp} />
      </body>
    </html>
  );
}
