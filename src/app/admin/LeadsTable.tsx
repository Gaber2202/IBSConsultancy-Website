'use client';

import { useMemo, useState } from 'react';
import type { Lead } from '@/lib/leads';
import { LEAD_STATUS_ORDER, LEAD_STATUS_META, type LeadStatus } from '@/lib/lead-status';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function LeadsTable({
  leads,
  changeStatus,
  remove,
}: {
  leads: Lead[];
  changeStatus: (id: string, status: LeadStatus, lostReason?: string) => void;
  remove: (id: string) => void;
}) {
  const [filter, setFilter] = useState<'all' | LeadStatus>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== 'all' && l.status !== filter) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.service.toLowerCase().includes(q)
      );
    });
  }, [leads, filter, query]);

  function onStatusSelect(lead: Lead, status: LeadStatus) {
    if (status === 'lost') {
      const reason = window.prompt('Reason for marking this lead as lost:', lead.lostReason ?? '');
      if (reason === null) return; // cancelled
      changeStatus(lead.id, status, reason.trim());
    } else {
      changeStatus(lead.id, status);
    }
  }

  return (
    <div className="rounded-xl border border-ink-200 bg-white">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-ink-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
            All ({leads.length})
          </FilterChip>
          {LEAD_STATUS_ORDER.map((s) => (
            <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
              {LEAD_STATUS_META[s].label} ({leads.filter((l) => l.status === s).length})
            </FilterChip>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search name, email, phone…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-500/30 sm:w-64"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-ink-400">No leads match your filter.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-ink-50 align-top hover:bg-ink-50/50">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-ink-900">{lead.name}</div>
                    <a href={`mailto:${lead.email}`} className="block text-ink-500 hover:text-steel-700" dir="ltr">
                      {lead.email}
                    </a>
                    <a href={`tel:${lead.phone}`} className="block text-ink-500 hover:text-steel-700" dir="ltr">
                      {lead.phone}
                    </a>
                    {lead.message && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-xs text-steel-700">Message</summary>
                        <p className="mt-1 max-w-xs whitespace-pre-wrap text-ink-600">{lead.message}</p>
                      </details>
                    )}
                    {lead.status === 'lost' && lead.lostReason && (
                      <p className="mt-1 max-w-xs text-xs text-rose-600">
                        <span className="font-medium">Lost reason:</span> {lead.lostReason}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-ink-700">
                    {lead.service || '—'}
                    <span className="mt-1 block text-xs uppercase text-ink-300">{lead.locale}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink-500">{formatDate(lead.createdAt)}</td>
                  <td className="px-4 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => onStatusSelect(lead, e.target.value as LeadStatus)}
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium outline-none ${LEAD_STATUS_META[lead.status].chip}`}
                    >
                      {LEAD_STATUS_ORDER.map((s) => (
                        <option key={s} value={s} className="bg-white text-ink-900">
                          {LEAD_STATUS_META[s].label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => remove(lead.id)}
                      className="text-xs font-medium text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-ink-600 hover:border-ink-400'
      }`}
    >
      {children}
    </button>
  );
}
