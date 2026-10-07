import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getToolsCopy } from '@/i18n/tools';
import { getDictionary } from '@/i18n/dictionaries';
import { absoluteUrl, alternatesFor } from '@/lib/site';
import { PageHeader } from '@/components/PageHeader';
import { CTASection } from '@/components/CTASection';
import { JsonLd } from '@/components/JsonLd';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const t = getToolsCopy(locale).faq;
  return {
    title: { absolute: t.metaTitle },
    description: t.metaDescription,
    alternates: alternatesFor(locale, 'faq'),
  };
}

export default async function FaqPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : 'en') as Locale;
  const t = getToolsCopy(locale).faq;
  const dict = await getDictionary(locale);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
    url: absoluteUrl(`${locale}/faq`),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <PageHeader eyebrow={t.eyebrow} title={t.title} />
      <section className="section">
        <div className="container-tight max-w-3xl space-y-4">
          {t.items.map((item) => (
            <details
              key={item.q}
              className="group surface-panel open:shadow-card"
            >
              <summary className="cursor-pointer list-none px-6 py-5 text-lg font-semibold text-ink-900 marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-steel-500 transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="border-t border-ink-100 px-6 py-5 text-ink-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
      <CTASection locale={locale} dict={dict} />
    </>
  );
}
