import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { absoluteUrl, alternatesFor } from '@/lib/site';
import { organizationSchema, servicesSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Hero } from '@/components/Hero';
import { Stats } from '@/components/Stats';
import { ServicesPreview } from '@/components/ServicesGrid';
import { AboutTeaser } from '@/components/AboutTeaser';
import { WhyUs } from '@/components/WhyUs';
import { Process } from '@/components/Process';
import { Testimonials } from '@/components/Testimonials';
import { CTASection } from '@/components/CTASection';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    alternates: alternatesFor(locale),
  };
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : 'en') as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <JsonLd data={[organizationSchema(locale, dict), servicesSchema(locale, dict)]} />
      <Hero locale={locale} dict={dict} />
      <Stats dict={dict} />
      <ServicesPreview locale={locale} dict={dict} />
      <AboutTeaser locale={locale} dict={dict} />
      <WhyUs dict={dict} />
      <Process dict={dict} />
      <Testimonials dict={dict} />
      <CTASection locale={locale} dict={dict} />
    </>
  );
}
