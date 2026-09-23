'use client';

import { useState } from 'react';
import type { ServiceOption } from '@/lib/settings';

const inputClass =
  'w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-500/30';

function uid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `svc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ServicesManager({ initial }: { initial: ServiceOption[] }) {
  const [rows, setRows] = useState<ServiceOption[]>(initial);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  function update(id: string, patch: Partial<ServiceOption>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setState('idle');
  }
  function addRow() {
    setRows((rs) => [...rs, { id: uid(), en: '', ar: '', active: true }]);
    setState('idle');
  }
  function removeRow(id: string) {
    setRows((rs) => rs.filter((r) => r.id !== id));
    setState('idle');
  }
  function move(id: string, dir: -1 | 1) {
    setRows((rs) => {
      const i = rs.findIndex((r) => r.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= rs.length) return rs;
      const next = [...rs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setState('idle');
  }

  async function save() {
    setState('saving');
    try {
      const services = rows.filter((r) => r.en.trim() || r.ar.trim());
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'services', services }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.settings?.services) setRows(data.settings.services);
      setState('saved');
    } catch {
      setState('error');
    }
  }

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink-900">Contact-form services</h2>
          <p className="mt-1 text-sm text-ink-500">
            These options appear in the “Service of interest” dropdown on the contact form. Provide
            English + Arabic labels. Inactive services are hidden from the form.
          </p>
        </div>
        <button
          onClick={addRow}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm font-medium text-ink-700 hover:border-ink-900"
        >
          + Add service
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-ink-400">
              <th className="pb-2 pr-3 font-medium">Order</th>
              <th className="pb-2 pr-3 font-medium">English</th>
              <th className="pb-2 pr-3 font-medium">Arabic</th>
              <th className="pb-2 pr-3 font-medium">Active</th>
              <th className="pb-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-ink-400">
                  No services yet. Click “Add service”.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={r.id} className="border-t border-ink-100">
                  <td className="py-2 pr-3">
                    <div className="flex flex-col">
                      <button onClick={() => move(r.id, -1)} disabled={i === 0} className="text-ink-400 hover:text-ink-900 disabled:opacity-30" aria-label="Move up">▲</button>
                      <button onClick={() => move(r.id, 1)} disabled={i === rows.length - 1} className="text-ink-400 hover:text-ink-900 disabled:opacity-30" aria-label="Move down">▼</button>
                    </div>
                  </td>
                  <td className="py-2 pr-3">
                    <input className={inputClass} value={r.en} onChange={(e) => update(r.id, { en: e.target.value })} placeholder="Business Setup" />
                  </td>
                  <td className="py-2 pr-3">
                    <input className={inputClass} dir="rtl" value={r.ar} onChange={(e) => update(r.id, { ar: e.target.value })} placeholder="تأسيس الأعمال" />
                  </td>
                  <td className="py-2 pr-3 text-center">
                    <input type="checkbox" checked={r.active} onChange={(e) => update(r.id, { active: e.target.checked })} className="h-4 w-4 accent-steel-600" />
                  </td>
                  <td className="py-2 text-right">
                    <button onClick={() => removeRow(r.id)} className="text-xs font-medium text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={save}
          disabled={state === 'saving'}
          className="rounded-lg bg-steel-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-steel-600 disabled:opacity-60"
        >
          {state === 'saving' ? 'Saving…' : 'Save services'}
        </button>
        {state === 'saved' && <span className="text-sm font-medium text-green-600">✓ Saved</span>}
        {state === 'error' && <span className="text-sm font-medium text-red-600">Save failed</span>}
      </div>
    </div>
  );
}
