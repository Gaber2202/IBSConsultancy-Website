'use client';

import { useState } from 'react';
import type { Lead } from '@/lib/leads';
import type { LeadStatus } from '@/lib/lead-status';
import type { Settings } from '@/lib/settings';
import { LeadsTable } from './LeadsTable';
import { LeadsKanban } from './LeadsKanban';
import { ServicesManager } from './ServicesManager';
import { ContactSettingsForm } from './ContactSettingsForm';
import { SmtpSettingsForm } from './SmtpSettingsForm';

type Tab = 'kanban' | 'leads' | 'services' | 'contact' | 'smtp';

const TABS: { key: Tab; label: string }[] = [
  { key: 'kanban', label: 'Pipeline' },
  { key: 'leads', label: 'Leads table' },
  { key: 'services', label: 'Services' },
  { key: 'contact', label: 'Contact info' },
  { key: 'smtp', label: 'Email / SMTP' },
];

export function AdminApp({
  initialLeads,
  settings,
}: {
  initialLeads: Lead[];
  settings: Settings;
}) {
  const [tab, setTab] = useState<Tab>('kanban');
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  async function changeStatus(id: string, status: LeadStatus, lostReason?: string) {
    const prev = leads;
    setLeads((ls) =>
      ls.map((l) =>
        l.id === id
          ? { ...l, status, lostReason: status === 'lost' ? lostReason ?? l.lostReason ?? '' : undefined }
          : l,
      ),
    );
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, lostReason }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setLeads(prev); // rollback
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this lead permanently?')) return;
    const prev = leads;
    setLeads((ls) => ls.filter((l) => l.id !== id));
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
    } catch {
      setLeads(prev);
    }
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-ink-200 bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-ink-900 text-white'
                : 'text-ink-600 hover:bg-ink-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'kanban' && (
        <LeadsKanban leads={leads} changeStatus={changeStatus} remove={remove} />
      )}
      {tab === 'leads' && (
        <LeadsTable leads={leads} changeStatus={changeStatus} remove={remove} />
      )}
      {tab === 'services' && <ServicesManager initial={settings.services} />}
      {tab === 'contact' && <ContactSettingsForm initial={settings.contact} />}
      {tab === 'smtp' && <SmtpSettingsForm initial={settings.smtp} />}
    </div>
  );
}
