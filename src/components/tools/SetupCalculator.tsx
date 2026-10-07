'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getToolsCopy } from '@/i18n/tools';
import { pathFor } from '@/lib/site';
import {
  estimateSetup,
  formatAed,
  PRICING_REVIEWED,
  type Jurisdiction,
  type OfficeType,
} from '@/lib/pricing';
import { OptionGrid } from './OptionGrid';
import { IconArrow } from '../icons';

type Answers = {
  activity?: string;
  where?: Jurisdiction;
  priority?: string;
  share?: string;
  visas?: string;
  office?: OfficeType;
  extras: string[];
};

export function SetupCalculator({ locale }: { locale: Locale }) {
  const t = getToolsCopy(locale).calculator;
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<Answers>({ extras: [] });

  const stepOptions = useMemo(() => {
    const map = [t.activity, t.where, t.priority, t.share, t.visas, t.office, t.extras];
    return map[step] ?? [];
  }, [step, t]);

  const keys: (keyof Answers)[] = [
    'activity',
    'where',
    'priority',
    'share',
    'visas',
    'office',
    'extras',
  ];

  function select(id: string) {
    const key = keys[step];
    if (key === 'extras') {
      setAnswers((prev) => {
        const next = prev.extras.includes(id)
          ? prev.extras.filter((x) => x !== id)
          : [...prev.extras, id];
        return { ...prev, extras: next };
      });
      return;
    }
    setAnswers((prev) => ({ ...prev, [key]: id }));
  }

  function currentValue() {
    const key = keys[step];
    return answers[key];
  }

  function canContinue() {
    if (keys[step] === 'extras') return true;
    return Boolean(currentValue());
  }

  function onNext() {
    if (step < t.steps.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    setDone(true);
  }

  const estimate = done
    ? estimateSetup({
        where: (answers.where ?? 'not-sure') as Jurisdiction,
        priority: answers.priority,
        visas: answers.visas ?? '0',
        office: (answers.office ?? 'unsure') as OfficeType,
      })
    : null;

  const activityLabel =
    t.activity.find(([id]) => id === answers.activity)?.[1] ?? answers.activity ?? '—';
  const officeLabel = t.office.find(([id]) => id === answers.office)?.[1] ?? '—';

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex gap-1" aria-hidden="true">
        {t.steps.map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= step || done ? 'bg-steel-500' : 'bg-ink-100'}`}
          />
        ))}
      </div>

      {!done ? (
        <div className="surface-panel p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel-600">
            {locale === 'ar' ? `الخطوة ${step + 1} من ${t.steps.length}` : `Step ${step + 1} of ${t.steps.length}`}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-ink-900 sm:text-3xl">{t.steps[step]}</h2>
          <div className="mt-8">
            <OptionGrid
              options={stepOptions}
              value={currentValue()}
              multi={keys[step] === 'extras'}
              onChange={select}
            />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {step > 0 && (
              <button type="button" className="btn-outline" onClick={() => setStep((s) => s - 1)}>
                {t.back}
              </button>
            )}
            <button type="button" className="btn-primary" disabled={!canContinue()} onClick={onNext}>
              {step === t.steps.length - 1 ? t.cta : t.next}
              <IconArrow width={16} height={16} className="rtl-flip" />
            </button>
          </div>
        </div>
      ) : (
        estimate && (
          <div className="surface-panel p-6 sm:p-10">
            <p className="eyebrow">{t.recommended}</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink-900 sm:text-5xl">
              {t.labels[estimate.jurisdiction]}
            </h2>
            <p className="mt-4 text-ink-500">{t.disclaimer}</p>

            <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 sm:grid-cols-2">
              {[
                [
                  t.pricing,
                  `${formatAed(estimate.min, locale)} – ${formatAed(estimate.max, locale)}`,
                ],
                [t.fee, t.feeValue],
                [
                  t.timeframe,
                  `${estimate.days[0]}–${estimate.days[1]} ${t.days}`,
                ],
                [t.visasIncluded, String(estimate.visaCount)],
                [t.activityLabel, activityLabel],
                [t.officeLabel, officeLabel],
              ].map(([label, value]) => (
                <div key={label} className="bg-white px-5 py-6">
                  <dt className="text-xs uppercase tracking-wider text-ink-400">{label}</dt>
                  <dd className="mt-2 font-display text-xl font-semibold text-ink-900 sm:text-2xl">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {answers.extras.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-steel-600">
                  {t.extrasLabel}
                </h3>
                <p className="mt-2 text-sm text-ink-600">
                  {answers.extras
                    .map((id) => t.extras.find(([x]) => x === id)?.[1] ?? id)
                    .join(' · ')}
                </p>
              </div>
            )}

            <p className="mt-6 text-xs text-ink-400">
              {t.disclaimer} ({PRICING_REVIEWED})
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={pathFor(locale, 'contact')} className="btn-primary">
                {t.cta}
                <IconArrow width={16} height={16} className="rtl-flip" />
              </Link>
              <button
                type="button"
                className="btn-outline"
                onClick={() => {
                  setDone(false);
                  setStep(0);
                  setAnswers({ extras: [] });
                }}
              >
                {t.restart}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
