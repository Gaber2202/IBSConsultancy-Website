/** Client-safe helper for lead conversion events (GTM dataLayer). */
export function pushLeadEvent(detail?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: 'generate_lead', ...detail });
}
