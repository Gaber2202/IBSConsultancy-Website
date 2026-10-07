import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getToolsCopy } from '@/i18n/tools';
import { pathFor } from '@/lib/site';
import { Reveal } from '../Reveal';
import { IconArrow } from '../icons';

export function HomeTools({ locale }: { locale: Locale }) {
  const t = getToolsCopy(locale).homeTools;

  return (
    <section className="section pt-8">
      <div className="container-tight">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold text-ink-900 sm:text-4xl">{t.title}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((item, i) => (
            <Reveal key={item.href} delay={i * 70}>
              <Link
                href={pathFor(locale, item.href)}
                className="card card-hover group flex h-full flex-col p-6"
              >
                <span className="font-display text-sm font-semibold text-steel-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm text-ink-500">{item.body}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-steel-600">
                  <IconArrow width={14} height={14} className="rtl-flip" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
