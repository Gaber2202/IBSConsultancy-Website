'use client';

import { useState } from 'react';
import type { ContactSettings } from '@/lib/settings';

const inputClass =
  'w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-500/30';

export function ContactSettingsForm({ initial }: { initial: ContactSettings }) {
  const [form, setForm] = useState<ContactSettings>(initial);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  function set<K extends keyof ContactSettings>(key: K, value: ContactSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setState('idle');
  }

  function setSocial(key: keyof ContactSettings['social'], value: string) {
    setForm((f) => ({ ...f, social: { ...f.social, [key]: value } }));
    setState('idle');
  }

  const socialFields: { key: keyof ContactSettings['social']; label: string; placeholder: string }[] = [
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/…' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/…' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/…' },
    { key: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/…' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@…' },
    { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@…' },
  ];

  async function save() {
    setState('saving');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'contact', data: form }),
      });
      if (!res.ok) throw new Error();
      setState('saved');
    } catch {
      setState('error');
    }
  }

  return (
    <div className="max-w-xl rounded-xl border border-ink-200 bg-white p-6">
      <h2 className="text-lg font-bold text-ink-900">Contact information</h2>
      <p className="mt-1 text-sm text-ink-500">
        Shown in the header, footer, contact page and WhatsApp button across the site.
      </p>

      <div className="mt-6 space-y-4">
        <Field label="Phone number" hint="Displayed as-is (e.g. +971 50 606 5440)">
          <input className={inputClass} dir="ltr" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
        <Field label="WhatsApp number" hint="Digits only, with country code — no +, spaces or dashes">
          <input
            className={inputClass}
            dir="ltr"
            inputMode="numeric"
            value={form.whatsapp}
            onChange={(e) => set('whatsapp', e.target.value.replace(/[^\d]/g, ''))}
            placeholder="971506065440"
          />
          <p className="mt-1 text-xs text-ink-400">Link preview: https://wa.me/{form.whatsapp || '…'}</p>
        </Field>
        <Field label="Email address">
          <input className={inputClass} dir="ltr" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-ink-900">Social media links</h3>
        <p className="mt-1 text-xs text-ink-400">Shown as icons in the footer. Leave blank to hide.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {socialFields.map((f) => (
            <div key={f.key}>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">{f.label}</label>
              <input
                className={inputClass}
                dir="ltr"
                type="url"
                value={form.social?.[f.key] ?? ''}
                onChange={(e) => setSocial(f.key, e.target.value)}
                placeholder={f.placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={save}
          disabled={state === 'saving'}
          className="rounded-lg bg-steel-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-steel-600 disabled:opacity-60"
        >
          {state === 'saving' ? 'Saving…' : 'Save changes'}
        </button>
        {state === 'saved' && <span className="text-sm font-medium text-green-600">✓ Saved</span>}
        {state === 'error' && <span className="text-sm font-medium text-red-600">Save failed</span>}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-700">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
