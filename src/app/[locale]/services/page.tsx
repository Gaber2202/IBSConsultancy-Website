import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { absoluteUrl, alternatesFor } from '@/lib/site';
import { breadcrumbSchema, organizationSchema, servicesSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';
import { ServicesDetailed } from '@/components/ServicesGrid';
import { Process } from '@/components/Process';
import { CTASection } from '@/components/CTASection';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const dict = await getDictionary(locale);
  return {
    title: { absolute: dict.meta.services.title },
    description: dict.meta.services.description,
    alternates: alternatesFor(locale, 'services'),
  };
}

export default async function ServicesPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : 'en') as Locale;
  const dict = await getDictionary(locale);
  const { services } = dict;

  return (
    <>
      <JsonLd
        data={[
          servicesSchema(locale, dict),
          organizationSchema(locale, dict),
          breadcrumbSchema([
            { name: dict.nav.home, url: absoluteUrl(locale) },
            { name: dict.nav.services, url: absoluteUrl(`${locale}/services`) },
          ]),
        ]}
      />
      <PageHeader eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle} />
      <ServicesDetailed dict={dict} />
      <Process dict={dict} />
      <CTASection locale={locale} dict={dict} />
    </>
  );
}
