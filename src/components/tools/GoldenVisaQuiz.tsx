'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getToolsCopy } from '@/i18n/tools';
import { pathFor } from '@/lib/site';
import { OptionGrid } from './OptionGrid';
import { IconArrow } from '../icons';

type Answers = Record<string, string>;

export function GoldenVisaQuiz({ locale }: { locale: Locale }) {
  const copy = getToolsCopy(locale).goldenVisa;
  const ar = locale === 'ar';

  type Opt = [string, string];

  const categories: Opt[] = ar
    ? [
        ['property', 'مستثمر عقاري'],
        ['investor', 'مستثمر أعمال'],
        ['entrepreneur', 'رائد أعمال'],
        ['professional', 'مهني'],
        ['other', 'أخرى'],
      ]
    : [
        ['property', 'Property investor'],
        ['investor', 'Business investor'],
        ['entrepreneur', 'Entrepreneur'],
        ['professional', 'Professional'],
        ['other', 'Other'],
      ];

  const yesNo: Opt[] = ar
    ? [
        ['yes', 'نعم'],
        ['no', 'لا'],
      ]
    : [
        ['yes', 'Yes'],
        ['no', 'No'],
      ];

  const detailByCat: Record<string, { q: string; o: Opt[] }> = {
    property: {
      q: ar ? 'القيمة التقريبية للعقار؟' : 'Approximate property value?',
      o: ar
        ? [
            ['lt2', 'أقل من 2 مليون درهم'],
            ['gte2', '2 مليون درهم أو أكثر'],
            ['plan', 'أخطط للشراء'],
          ]
        : [
            ['lt2', 'Below AED 2M'],
            ['gte2', 'AED 2M or more'],
            ['plan', 'Planning to buy'],
          ],
    },
    investor: {
      q: ar ? 'هل تملك حصة في شركة إماراتية؟' : 'Do you hold shares in a UAE company?',
      o: yesNo,
    },
    entrepreneur: {
      q: ar
        ? 'هل لديك مشروع قائم أو معتمد من حاضنة؟'
        : 'Do you have an existing or incubator-approved project?',
      o: yesNo,
    },
    professional: {
      q: ar ? 'هل راتبك الشهري 30,000 درهم أو أكثر؟' : 'Is your monthly salary AED 30,000 or more?',
      o: yesNo,
    },
    other: {
      q: ar
        ? 'هل تنتمي لفئة مثل المواهب أو العلماء أو الطلاب المتفوقين؟'
        : 'Are you in a category such as talent, scientists or outstanding students?',
      o: yesNo,
    },
  };

  const [answers, setAnswers] = useState<Answers>({});

  const steps: { k: string; q: string; o: Opt[] }[] = (() => {
    const cat = answers.cat ?? 'other';
    const family: Opt[] = ar
      ? [
          ['yes', 'نعم'],
          ['no', 'لا'],
          ['maybe', 'ربما'],
        ]
      : [
          ['yes', 'Yes'],
          ['no', 'No'],
          ['maybe', 'Maybe'],
        ];
    return [
      {
        k: 'cat',
        q: ar ? 'ما الذي يصفك بشكل أفضل؟' : 'What best describes you?',
        o: categories,
      },
      { k: 'detail', q: detailByCat[cat].q, o: detailByCat[cat].o },
      {
        k: 'inside',
        q: ar ? 'هل أنت حاليًا داخل الإمارات؟' : 'Are you currently inside the UAE?',
        o: yesNo,
      },
      {
        k: 'resident',
        q: ar ? 'هل تحمل إقامة إماراتية حاليًا؟' : 'Do you currently hold UAE residency?',
        o: yesNo,
      },
      {
        k: 'family',
        q: ar ? 'هل ترغب في كفالة أفراد أسرتك؟' : 'Would you like to sponsor family members?',
        o: family,
      },
    ];
  })();

  const index = steps.findIndex((s) => !answers[s.k]);
  const done = index === -1;
  const current = done ? null : steps[index];
  const positive = answers.detail === 'gte2' || answers.detail === 'yes';

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex gap-1" aria-hidden="true">
        {steps.map((s, i) => (
          <span
            key={s.k}
            className={`h-1 flex-1 rounded-full ${
              answers[s.k] || done ? 'bg-steel-500' : i === index ? 'bg-steel-300' : 'bg-ink-100'
            }`}
          />
        ))}
      </div>

      {!done && current ? (
        <div className="surface-panel p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel-600">
            {ar ? `سؤال ${index + 1} من ${steps.length}` : `Question ${index + 1} of ${steps.length}`}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-ink-900 sm:text-3xl">{current.q}</h2>
          <div className="mt-8">
            <OptionGrid
              options={current.o}
              value={answers[current.k]}
              onChange={(id) => {
                setAnswers((prev) => {
                  const next = { ...prev, [current.k]: id };
                  if (current.k === 'cat') delete next.detail;
                  return next;
                });
              }}
            />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {index > 0 && (
              <button
                type="button"
                className="btn-outline"
                onClick={() => {
                  const prevKey = steps[index - 1].k;
                  setAnswers((a) => {
                    const next = { ...a };
                    delete next[current.k];
                    delete next[prevKey];
                    return next;
                  });
                }}
              >
                {copy.back}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="surface-panel p-6 sm:p-10">
          <p className="eyebrow">{positive ? copy.resultPositive : copy.resultNeutral}</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink-900">
            {positive ? copy.resultPositive : copy.resultNeutral}
          </h2>
          <p className="mt-4 text-ink-600">
            {positive ? copy.resultBodyPositive : copy.resultBodyNeutral}
          </p>
          <p className="mt-4 text-xs text-ink-400">{copy.disclaimer}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={pathFor(locale, 'contact')} className="btn-primary">
              {copy.cta}
              <IconArrow width={16} height={16} className="rtl-flip" />
            </Link>
            <button type="button" className="btn-outline" onClick={() => setAnswers({})}>
              {copy.restart}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
