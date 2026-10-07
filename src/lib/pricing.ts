/** Indicative UAE setup pricing — market reference reviewed Sep 2026 (aligned with live IBS calculator). */

export type Jurisdiction = 'dubai-mainland' | 'other-mainland' | 'free-zone' | 'not-sure';
export type OfficeType = 'flexi' | 'shared' | 'physical' | 'warehouse' | 'unsure';

export const PRICING_REVIEWED = 'September 2026';

export const JURISDICTION_RANGES: Record<
  Exclude<Jurisdiction, 'not-sure'>,
  { min: number; max: number; days: [number, number] }
> = {
  'dubai-mainland': { min: 16_000, max: 28_000, days: [7, 15] },
  'other-mainland': { min: 12_000, max: 22_000, days: [7, 15] },
  'free-zone': { min: 5_750, max: 15_500, days: [3, 7] },
};

export const OFFICE_ADDONS: Record<OfficeType, number> = {
  flexi: 0,
  shared: 8_000,
  physical: 25_000,
  warehouse: 60_000,
  unsure: 0,
};

/** Indicative per-visa band used in estimates. */
export const VISA_BAND = { min: 4_500, max: 7_500 };

export function parseVisaCount(value: string): number {
  if (value === 'unsure' || value === '0') return 0;
  if (value === '4') return 4;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function resolveJurisdiction(where: Jurisdiction, priority?: string): Exclude<Jurisdiction, 'not-sure'> {
  if (where !== 'not-sure') return where;
  if (priority === 'cost') return 'free-zone';
  if (priority === 'dubai') return 'dubai-mainland';
  return 'free-zone';
}

export function estimateSetup(input: {
  where: Jurisdiction;
  priority?: string;
  visas: string;
  office: OfficeType;
}): {
  jurisdiction: Exclude<Jurisdiction, 'not-sure'>;
  min: number;
  max: number;
  days: [number, number];
  visaCount: number;
  officeAddon: number;
} {
  const jurisdiction = resolveJurisdiction(input.where, input.priority);
  const base = JURISDICTION_RANGES[jurisdiction];
  const visaCount = parseVisaCount(input.visas);
  const officeAddon = OFFICE_ADDONS[input.office] ?? 0;
  const visaMin = visaCount * VISA_BAND.min;
  const visaMax = visaCount * VISA_BAND.max;
  return {
    jurisdiction,
    min: base.min + officeAddon + visaMin,
    max: base.max + officeAddon + visaMax,
    days: base.days,
    visaCount,
    officeAddon,
  };
}

export function formatAed(n: number, locale: 'en' | 'ar' = 'en'): string {
  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : 'en-AE').format(n);
  return locale === 'ar' ? `${formatted} درهم` : `AED ${formatted}`;
}
