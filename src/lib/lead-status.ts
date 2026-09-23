// Shared, framework-agnostic lead pipeline definition.
// Safe to import from BOTH server and client components (no server-only deps).

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'quotation_sent'
  | 'won'
  | 'lost';

/** Pipeline order used for the kanban columns and the status dropdown. */
export const LEAD_STATUS_ORDER: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'quotation_sent',
  'won',
  'lost',
];

export interface StatusMeta {
  label: string;
  /** Tailwind classes for a pill/badge. */
  chip: string;
  /** Tailwind classes for the kanban column header accent. */
  column: string;
  /** Solid dot color. */
  dot: string;
}

export const LEAD_STATUS_META: Record<LeadStatus, StatusMeta> = {
  new: {
    label: 'New',
    chip: 'bg-blue-50 text-blue-700 border-blue-200',
    column: 'border-blue-300 text-blue-700',
    dot: 'bg-blue-500',
  },
  contacted: {
    label: 'Contacted',
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    column: 'border-amber-300 text-amber-700',
    dot: 'bg-amber-500',
  },
  qualified: {
    label: 'Qualified',
    chip: 'bg-violet-50 text-violet-700 border-violet-200',
    column: 'border-violet-300 text-violet-700',
    dot: 'bg-violet-500',
  },
  quotation_sent: {
    label: 'Quotation Sent',
    chip: 'bg-sky-50 text-sky-700 border-sky-200',
    column: 'border-sky-300 text-sky-700',
    dot: 'bg-sky-500',
  },
  won: {
    label: 'Won',
    chip: 'bg-green-50 text-green-700 border-green-200',
    column: 'border-green-300 text-green-700',
    dot: 'bg-green-500',
  },
  lost: {
    label: 'Lost',
    chip: 'bg-rose-50 text-rose-700 border-rose-200',
    column: 'border-rose-300 text-rose-600',
    dot: 'bg-rose-500',
  },
};

export function isLeadStatus(v: unknown): v is LeadStatus {
  return typeof v === 'string' && (LEAD_STATUS_ORDER as string[]).includes(v);
}

export function statusLabel(status: LeadStatus): string {
  return LEAD_STATUS_META[status]?.label ?? status;
}
