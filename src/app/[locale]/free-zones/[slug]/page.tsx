import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, locales, type Locale } from '@/i18n/config';
import { getToolsCopy } from '@/i18n/tools';
import { getDictionary } from '@/i18n/dictionaries';
import { alternatesFor, pathFor } from '@/lib/site';
import { formatAed } from '@/lib/pricing';
import zones from '@/data/free-zones.json';
import { PageHeader } from '@/components/PageHeader';
import { CTASection } from '@/components/CTASection';
import { IconArrow } from '@/components/icons';

export function generateStaticParams() {
  return locales.flatMap((locale) => zones.map((z) => ({ locale, slug: z.id })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const zone = zones.find((z) => z.id === params.slug);
  if (!zone) return {};
  const best = locale === 'ar' ? zone.bestFor.ar : zone.bestFor.en;
  return {
    title: { absolute: `${zone.name} Company Setup | Free Zone Guide | IBS` },
    description: best ?? undefined,
    alternates: alternatesFor(locale, `free-zones/${zone.id}`),
  };
}

export default async function FreeZoneDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = (isLocale(params.locale) ? params.locale : 'en') as Locale;
  const zone = zones.find((z) => z.id === params.slug);
  if (!zone) notFound();
  const t = getToolsCopy(locale).freeZones;
  const dict = await getDictionary(locale);
  const best = locale === 'ar' ? zone.bestFor.ar : zone.bestFor.en;
  const visas = locale === 'ar' ? zone.visas.ar : zone.visas.en;

  return (
    <>
      <PageHeader eyebrow={`${zone.emirate} · Free zone`} title={zone.name} subtitle={best ?? undefined} />
      <section className="section">
        <div className="container-tight max-w-3xl">
          <Link href={pathFor(locale, 'free-zones')} className="link-gold">
            <IconArrow width={14} height={14} className="rotate-180 rtl-flip" />
            {t.back}
          </Link>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="surface-panel p-6">
              <p className="text-xs uppercase tracking-wider text-ink-400">{t.from}</p>
              <p className="mt-2 font-display text-3xl font-semibold text-ink-900">
                {zone.fromAED
                  ? formatAed(zone.fromAED, locale)
                  : locale === 'ar'
                    ? 'عند الطلب'
                    : 'On request'}
              </p>
            </div>
            <div className="surface-panel p-6">
              <p className="text-xs uppercase tracking-wider text-ink-400">{t.visas}</p>
              <p className="mt-2 text-lg font-semibold text-ink-900">{visas}</p>
            </div>
          </div>

          <div className="mt-6 surface-panel p-6">
            <p className="text-xs uppercase tracking-wider text-ink-400">{t.offices}</p>
            <p className="mt-2 text-ink-700">{zone.offices.join(' · ')}</p>
            <p className="mt-6 text-sm text-ink-500">{t.disclaimer}</p>
            <Link href={pathFor(locale, 'contact')} className="btn-primary mt-8">
              {t.request}
            </Link>
          </div>
        </div>
      </section>
      <CTASection locale={locale} dict={dict} />
    </>
  );
}
