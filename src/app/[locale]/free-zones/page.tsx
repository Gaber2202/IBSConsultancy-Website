import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getToolsCopy } from '@/i18n/tools';
import { getDictionary } from '@/i18n/dictionaries';
import { alternatesFor } from '@/lib/site';
import { PageHeader } from '@/components/PageHeader';
import { FreeZoneExplorer } from '@/components/tools/FreeZoneExplorer';
import { CTASection } from '@/components/CTASection';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const t = getToolsCopy(locale).freeZones;
  return {
    title: { absolute: t.metaTitle },
    description: t.metaDescription,
    alternates: alternatesFor(locale, 'free-zones'),
  };
}

export default async function FreeZonesPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : 'en') as Locale;
  const t = getToolsCopy(locale).freeZones;
  const dict = await getDictionary(locale);

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.intro} />
      <section className="section">
        <div className="container-tight">
          <FreeZoneExplorer locale={locale} />
        </div>
      </section>
      <CTASection locale={locale} dict={dict} />
    </>
  );
}
