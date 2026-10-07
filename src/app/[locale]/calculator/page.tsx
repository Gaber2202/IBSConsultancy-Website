import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getToolsCopy } from '@/i18n/tools';
import { alternatesFor } from '@/lib/site';
import { PageHeader } from '@/components/PageHeader';
import { SetupCalculator } from '@/components/tools/SetupCalculator';
import { CTASection } from '@/components/CTASection';
import { getDictionary } from '@/i18n/dictionaries';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const t = getToolsCopy(locale).calculator;
  return {
    title: { absolute: t.metaTitle },
    description: t.metaDescription,
    alternates: alternatesFor(locale, 'calculator'),
  };
}

export default async function CalculatorPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : 'en') as Locale;
  const t = getToolsCopy(locale).calculator;
  const dict = await getDictionary(locale);

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.intro} />
      <section className="section">
        <div className="container-tight">
          <SetupCalculator locale={locale} />
        </div>
      </section>
      <CTASection locale={locale} dict={dict} />
    </>
  );
}
