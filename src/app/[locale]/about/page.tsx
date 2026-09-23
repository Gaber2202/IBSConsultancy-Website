import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { absoluteUrl, pathFor, alternatesFor } from '@/lib/site';
import { breadcrumbSchema, organizationSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';
import { Process } from '@/components/Process';
import { WhyUs } from '@/components/WhyUs';
import { CTASection } from '@/components/CTASection';
import { Reveal } from '@/components/Reveal';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const dict = await getDictionary(locale);
  return {
    title: { absolute: dict.meta.about.title },
    description: dict.meta.about.description,
    alternates: alternatesFor(locale, 'about'),
  };
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : 'en') as Locale;
  const dict = await getDictionary(locale);
  const { about } = dict;

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(locale, dict),
          breadcrumbSchema([
            { name: dict.nav.home, url: absoluteUrl(locale) },
            { name: dict.nav.about, url: absoluteUrl(`${locale}/about`) },
          ]),
        ]}
      />
      <PageHeader eyebrow={about.eyebrow} title={about.title} subtitle={about.lead} />

      <section className="section">
        <div className="container-tight grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <Reveal>
            <div className="space-y-5 text-ink-600">
              {about.body.map((para, i) => (
                <p key={i} className={i === 0 ? 'text-lg leading-relaxed text-ink-800' : 'leading-relaxed'}>
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-2xl border border-gold-200 bg-gold-50 p-8">
              <h2 className="text-xl font-bold text-ink-900">{about.missionTitle}</h2>
              <p className="mt-4 leading-relaxed text-ink-700">{about.mission}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-sand">
        <div className="container-tight">
          <Reveal>
            <h2 className="text-center text-3xl font-bold text-ink-900 sm:text-4xl">{about.valuesTitle}</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((value, i) => (
              <Reveal key={value.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-950 font-display text-lg font-bold text-gold-400">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-ink-900">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhyUs dict={dict} />
      <Process dict={dict} />
      <CTASection locale={locale} dict={dict} />
    </>
  );
}
