'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getToolsCopy } from '@/i18n/tools';
import { pathFor } from '@/lib/site';
import { formatAed } from '@/lib/pricing';
import zones from '@/data/free-zones.json';
import { IconArrow } from '../icons';

const ACTIVITY_FILTERS: [string, string, string][] = [
  ['all', 'All activities', 'كل الأنشطة'],
  ['consultancy', 'Consultancy', 'استشارات'],
  ['trading', 'Trading', 'تجارة'],
  ['ecommerce', 'E-commerce', 'تجارة إلكترونية'],
  ['professional', 'Professional services', 'خدمات مهنية'],
  ['technology', 'Technology', 'تقنية'],
  ['marketing', 'Marketing / Media', 'تسويق / إعلام'],
  ['general-trading', 'General trading', 'تجارة عامة'],
];

export function FreeZoneExplorer({ locale }: { locale: Locale }) {
  const t = getToolsCopy(locale).freeZones;
  const [emirate, setEmirate] = useState('all');
  const [activity, setActivity] = useState('all');

  const emirates = useMemo(() => {
    const set = new Set(zones.map((z) => z.emirate).filter(Boolean) as string[]);
    return ['all', ...Array.from(set)];
  }, []);

  const filtered = zones.filter((z) => {
    if (emirate !== 'all' && z.emirate !== emirate) return false;
    if (activity !== 'all' && !z.categories.includes(activity)) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {emirates.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setEmirate(e)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              emirate === e
                ? 'bg-ink-900 text-white'
                : 'border border-ink-100 bg-white text-ink-600 hover:border-ink-300'
            }`}
          >
            {e === 'all' ? t.allEmirates : e}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {ACTIVITY_FILTERS.map(([id, en, ar]) => (
          <button
            key={id}
            type="button"
            onClick={() => setActivity(id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activity === id
                ? 'bg-steel-500 text-white'
                : 'border border-ink-100 bg-white text-ink-600 hover:border-ink-300'
            }`}
          >
            {id === 'all' ? t.allActivities : locale === 'ar' ? ar : en}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {filtered.map((z) => (
          <Link
            key={z.id}
            href={pathFor(locale, `free-zones/${z.id}`)}
            className="card card-hover group flex flex-col p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-steel-600">
                  {z.emirate}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-ink-900">{z.name}</h3>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-ink-700 transition group-hover:bg-steel-500 group-hover:text-white">
                <IconArrow width={16} height={16} className="rtl-flip" />
              </span>
            </div>
            <p className="mt-3 flex-1 text-sm text-ink-500">
              {locale === 'ar' ? z.bestFor.ar : z.bestFor.en}
            </p>
            <p className="mt-5 text-sm font-semibold text-ink-800">
              {z.fromAED
                ? `${t.from} ${formatAed(z.fromAED, locale)}`
                : locale === 'ar'
                  ? 'السعر عند الطلب'
                  : 'Price on request'}
            </p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-500">{t.empty}</p>
      )}

      <p className="mt-8 text-xs text-ink-400">{t.disclaimer}</p>
    </div>
  );
}
