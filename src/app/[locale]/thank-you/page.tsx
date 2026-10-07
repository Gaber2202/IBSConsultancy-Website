import type { Metadata } from 'next';
import Link from 'next/link';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { alternatesFor, pathFor } from '@/lib/site';
import { getSettings } from '@/lib/settings';
import { IconArrow, IconChat, IconCheck } from '@/components/icons';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const dict = await getDictionary(locale);
  return {
    title: { absolute: dict.thankYou.metaTitle },
    description: dict.thankYou.metaDescription,
    alternates: alternatesFor(locale, 'thank-you'),
    robots: { index: false, follow: false },
  };
}

export default async function ThankYouPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : 'en') as Locale;
  const dict = await getDictionary(locale);
  const { contact } = await getSettings();
  const whatsappHref = `https://wa.me/${(contact.whatsapp || '').replace(/[^\d]/g, '')}`;
  const t = dict.thankYou;

  return (
    <section className="relative overflow-hidden pb-24 pt-36 sm:pt-40 lg:pt-44">
      <div className="absolute inset-0 hero-atmosphere opacity-95" aria-hidden="true" />
      <div className="container-tight relative">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-white/95 p-8 text-center shadow-card backdrop-blur sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-steel-500 text-white shadow-steel">
            <IconCheck width={30} height={30} strokeWidth={2.2} />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-ink-900 sm:text-4xl">{t.title}</h1>
          <p className="mt-4 text-ink-600">{t.body}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={pathFor(locale)} className="btn-dark">
              {t.backHome}
              <IconArrow width={16} height={16} className="rtl-flip" />
            </Link>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <IconChat width={16} height={16} />
              {t.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
