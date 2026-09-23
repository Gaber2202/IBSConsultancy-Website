'use client';

import { useState } from 'react';
import type { SmtpSettings } from '@/lib/settings';

const inputClass =
  'w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-500/30';

export function SmtpSettingsForm({ initial }: { initial: SmtpSettings }) {
  const [form, setForm] = useState<SmtpSettings>(initial);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [testMsg, setTestMsg] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  function set<K extends keyof SmtpSettings>(key: K, value: SmtpSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setState('idle');
  }

  async function save() {
    setState('saving');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'smtp', data: form }),
      });
      if (!res.ok) throw new Error();
      setState('saved');
    } catch {
      setState('error');
    }
  }

  async function sendTest() {
    const to = window.prompt('Send a test email to:', form.adminEmail || '');
    if (!to) return;
    setTesting(true);
    setTestMsg(null);
    try {
      const res = await fetch('/api/admin/smtp-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, smtp: form }),
      });
      const data = await res.json();
      setTestMsg(data.ok ? `✓ Test email sent to ${to}` : `✗ ${data.error || 'Failed to send'}`);
    } catch {
      setTestMsg('✗ Request failed');
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="max-w-2xl rounded-xl border border-ink-200 bg-white p-6">
      <h2 className="text-lg font-bold text-ink-900">Email notifications (SMTP)</h2>
      <p className="mt-1 text-sm text-ink-500">
        Used to email a confirmation to the client on submission, and to notify your admin & sales
        inboxes when a new lead arrives.
      </p>

      <label className="mt-5 flex items-center gap-3 rounded-lg border border-ink-200 bg-ink-50/50 px-4 py-3">
        <input type="checkbox" checked={form.enabled} onChange={(e) => set('enabled', e.target.checked)} className="h-4 w-4 accent-steel-600" />
        <span className="text-sm font-medium text-ink-800">Enable email notifications</span>
      </label>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="SMTP host" full>
          <input className={inputClass} dir="ltr" value={form.host} onChange={(e) => set('host', e.target.value)} placeholder="smtp.gmail.com" />
        </Field>
        <Field label="Port">
          <input className={inputClass} dir="ltr" inputMode="numeric" value={form.port} onChange={(e) => set('port', Number(e.target.value) || 0)} placeholder="587" />
        </Field>
        <Field label="Encryption">
          <select className={inputClass} value={form.secure ? 'ssl' : 'starttls'} onChange={(e) => set('secure', e.target.value === 'ssl')}>
            <option value="starttls">STARTTLS (587)</option>
            <option value="ssl">SSL/TLS (465)</option>
          </select>
        </Field>
        <Field label="SMTP username">
          <input className={inputClass} dir="ltr" autoComplete="off" value={form.user} onChange={(e) => set('user', e.target.value)} />
        </Field>
        <Field label="SMTP password">
          <input className={inputClass} dir="ltr" type="password" autoComplete="new-password" value={form.pass} onChange={(e) => set('pass', e.target.value)} />
        </Field>
        <Field label="From name">
          <input className={inputClass} value={form.fromName} onChange={(e) => set('fromName', e.target.value)} placeholder="IBS Consultancy" />
        </Field>
        <Field label="From email">
          <input className={inputClass} dir="ltr" type="email" value={form.fromEmail} onChange={(e) => set('fromEmail', e.target.value)} placeholder="no-reply@ibsconsultancy.ae" />
        </Field>
        <Field label="Admin inbox (new-lead alerts)">
          <input className={inputClass} dir="ltr" type="email" value={form.adminEmail} onChange={(e) => set('adminEmail', e.target.value)} />
        </Field>
        <Field label="Sales inbox (new-lead alerts)">
          <input className={inputClass} dir="ltr" type="email" value={form.salesEmail} onChange={(e) => set('salesEmail', e.target.value)} />
        </Field>
      </div>

      <div className="mt-4 space-y-2">
        <label className="flex items-center gap-3 text-sm text-ink-700">
          <input type="checkbox" checked={form.notifyClient} onChange={(e) => set('notifyClient', e.target.checked)} className="h-4 w-4 accent-steel-600" />
          Send a confirmation email to the client on submission
        </label>
        <label className="flex items-center gap-3 text-sm text-ink-700">
          <input type="checkbox" checked={form.notifyTeam} onChange={(e) => set('notifyTeam', e.target.checked)} className="h-4 w-4 accent-steel-600" />
          Notify admin &amp; sales inboxes on a new lead
        </label>
      </div>

      <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        ⚠️ Security: the SMTP password is stored on the server in <code>data/settings.json</code> (git-ignored).
        For production, prefer environment variables / a secrets manager and use a dedicated app password.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={save}
          disabled={state === 'saving'}
          className="rounded-lg bg-steel-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-steel-600 disabled:opacity-60"
        >
          {state === 'saving' ? 'Saving…' : 'Save SMTP settings'}
        </button>
        <button
          onClick={sendTest}
          disabled={testing}
          className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm font-medium text-ink-700 hover:border-ink-900 disabled:opacity-60"
        >
          {testing ? 'Sending…' : 'Send test email'}
        </button>
        {state === 'saved' && <span className="text-sm font-medium text-green-600">✓ Saved</span>}
        {state === 'error' && <span className="text-sm font-medium text-red-600">Save failed</span>}
        {testMsg && (
          <span className={`text-sm font-medium ${testMsg.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>{testMsg}</span>
        )}
      </div>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="mb-1.5 block text-sm font-medium text-ink-700">{label}</label>
      {children}
    </div>
  );
}
