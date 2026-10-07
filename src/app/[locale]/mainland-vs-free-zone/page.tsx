import type { Metadata } from 'next';
import Link from 'next/link';
import { isLocale, type Locale } from '@/i18n/config';
import { getToolsCopy } from '@/i18n/tools';
import { getDictionary } from '@/i18n/dictionaries';
import { alternatesFor, pathFor } from '@/lib/site';
import { PageHeader } from '@/components/PageHeader';
import { CTASection } from '@/components/CTASection';
import { IconArrow } from '@/components/icons';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const t = getToolsCopy(locale).mainland;
  return {
    title: { absolute: t.metaTitle },
    description: t.metaDescription,
    alternates: alternatesFor(locale, 'mainland-vs-free-zone'),
  };
}

export default async function MainlandVsFreeZonePage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : 'en') as Locale;
  const t = getToolsCopy(locale).mainland;
  const dict = await getDictionary(locale);

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.intro} />
      <section className="section">
        <div className="container-tight overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse overflow-hidden rounded-3xl border border-ink-100 bg-white text-start">
            <thead>
              <tr className="bg-ink-950 text-white">
                <th className="px-5 py-4 text-sm font-semibold">{t.consideration}</th>
                <th className="px-5 py-4 text-sm font-semibold">{t.mainland}</th>
                <th className="px-5 py-4 text-sm font-semibold">{t.freeZone}</th>
              </tr>
            </thead>
            <tbody>
              {t.rows.map((row) => (
                <tr key={row.label} className="border-t border-ink-100 align-top">
                  <th className="px-5 py-5 text-sm font-semibold text-ink-900">{row.label}</th>
                  <td className="px-5 py-5 text-sm text-ink-600">{row.mainland}</td>
                  <td className="px-5 py-5 text-sm text-ink-600">{row.freeZone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-8">
            <Link href={pathFor(locale, 'contact')} className="btn-primary">
              {t.cta}
              <IconArrow width={16} height={16} className="rtl-flip" />
            </Link>
          </div>
        </div>
      </section>
      <CTASection locale={locale} dict={dict} />
    </>
  );
}
