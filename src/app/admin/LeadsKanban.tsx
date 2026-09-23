'use client';

import { useMemo, useState } from 'react';
import type { Lead } from '@/lib/leads';
import { LEAD_STATUS_ORDER, LEAD_STATUS_META, type LeadStatus } from '@/lib/lead-status';

function shortDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(new Date(iso));
}

export function LeadsKanban({
  leads,
  changeStatus,
  remove,
}: {
  leads: Lead[];
  changeStatus: (id: string, status: LeadStatus, lostReason?: string) => void;
  remove: (id: string) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<LeadStatus | null>(null);

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(LEAD_STATUS_ORDER.map((s) => [s, [] as Lead[]])) as Record<
      LeadStatus,
      Lead[]
    >;
    for (const l of leads) (map[l.status] ??= []).push(l);
    return map;
  }, [leads]);

  function handleDrop(status: LeadStatus) {
    setOverCol(null);
    const id = dragId;
    setDragId(null);
    if (!id) return;
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.status === status) return;
    if (status === 'lost') {
      const reason = window.prompt('Reason for marking this lead as lost:', lead.lostReason ?? '');
      if (reason === null) return;
      changeStatus(id, status, reason.trim());
    } else {
      changeStatus(id, status);
    }
  }

  return (
    <div className="flex snap-x gap-4 overflow-x-auto pb-4">
      {LEAD_STATUS_ORDER.map((status) => {
        const meta = LEAD_STATUS_META[status];
        const items = byStatus[status];
        const isOver = overCol === status;
        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              if (overCol !== status) setOverCol(status);
            }}
            onDragLeave={(e) => {
              // only clear if leaving the column, not entering a child
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverCol((c) => (c === status ? null : c));
            }}
            onDrop={() => handleDrop(status)}
            className={`flex w-72 shrink-0 snap-start flex-col rounded-xl border bg-ink-50/60 transition-colors ${
              isOver ? 'border-steel-400 bg-steel-50' : 'border-ink-200'
            }`}
          >
            <div className={`flex items-center justify-between border-b-2 px-3 py-2.5 ${meta.column}`}>
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className={`inline-block h-2 w-2 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-ink-500">
                {items.length}
              </span>
            </div>

            <div className="flex min-h-[120px] flex-1 flex-col gap-2 p-2">
              {items.length === 0 ? (
                <p className="px-2 py-6 text-center text-xs text-ink-300">Drop leads here</p>
              ) : (
                items.map((lead) => (
                  <article
                    key={lead.id}
                    draggable
                    onDragStart={() => setDragId(lead.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverCol(null);
                    }}
                    className={`group cursor-grab rounded-lg border border-ink-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing ${
                      dragId === lead.id ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-ink-900">{lead.name}</h4>
                      <button
                        onClick={() => remove(lead.id)}
                        className="text-ink-300 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                        aria-label="Delete lead"
                        title="Delete"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                    {lead.service && <p className="mt-0.5 text-xs text-steel-700">{lead.service}</p>}
                    <a href={`mailto:${lead.email}`} className="mt-1.5 block truncate text-xs text-ink-500 hover:text-steel-700" dir="ltr">
                      {lead.email}
                    </a>
                    <a href={`tel:${lead.phone}`} className="block truncate text-xs text-ink-500 hover:text-steel-700" dir="ltr">
                      {lead.phone}
                    </a>
                    {lead.status === 'lost' && lead.lostReason && (
                      <p className="mt-1.5 rounded bg-rose-50 px-2 py-1 text-[11px] text-rose-600">
                        {lead.lostReason}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between text-[11px] text-ink-400">
                      <span className="uppercase">{lead.locale}</span>
                      <span>{shortDate(lead.createdAt)}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
