'use client';

import { useState, type FormEvent } from 'react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { IconCheck } from './icons';

type FormDict = Dictionary['contact']['form'];

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'consent', string>>;

export function LeadForm({
  locale,
  dict,
  defaultService,
  services,
}: {
  locale: Locale;
  dict: FormDict;
  defaultService?: string;
  /** Admin-managed service options; falls back to dictionary defaults. */
  services?: string[];
}) {
  const serviceOptions = services && services.length ? services : dict.serviceOptions;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Errors>({});

  function validate(form: HTMLFormElement): Errors {
    const next: Errors = {};
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();
    const consent = (form.elements.namedItem('consent') as HTMLInputElement).checked;
    if (!name) next.name = dict.required;
    if (!email) next.email = dict.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = dict.invalidEmail;
    if (!phone) next.phone = dict.required;
    if (!consent) next.consent = dict.consentRequired;
    return next;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('submitting');
    const data = new FormData(form);
    // Honeypot: bots fill this hidden field
    if ((data.get('company_website') as string)?.length) {
      setStatus('success');
      form.reset();
      return;
    }

    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone'),
      service: data.get('service'),
      message: data.get('message'),
      locale,
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-gold-200 bg-gold-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-ink-950">
          <IconCheck width={28} height={28} strokeWidth={2.2} />
        </div>
        <h3 className="mt-5 text-xl font-bold text-ink-900">{dict.successTitle}</h3>
        <p className="mt-2 text-ink-600">{dict.successBody}</p>
      </div>
    );
  }

  const errClass = 'mt-1.5 text-sm text-red-600';
  const inputClass =
    'w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30 transition';

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {status === 'error' && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong className="font-semibold">{dict.errorTitle}</strong> {dict.errorBody}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-700">
            {dict.name} <span className="text-red-500">*</span>
          </label>
          <input id="name" name="name" type="text" className={inputClass} placeholder={dict.namePlaceholder} autoComplete="name" />
          {errors.name && <p className={errClass}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink-700">
            {dict.phone} <span className="text-red-500">*</span>
          </label>
          <input id="phone" name="phone" type="tel" dir="ltr" className={inputClass} placeholder={dict.phonePlaceholder} autoComplete="tel" />
          {errors.phone && <p className={errClass}>{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-700">
          {dict.email} <span className="text-red-500">*</span>
        </label>
        <input id="email" name="email" type="email" dir="ltr" className={inputClass} placeholder={dict.emailPlaceholder} autoComplete="email" />
        {errors.email && <p className={errClass}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-ink-700">
          {dict.service}
        </label>
        <select id="service" name="service" defaultValue={defaultService ?? ''} className={inputClass}>
          <option value="" disabled>
            {dict.servicePlaceholder}
          </option>
          {serviceOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-700">
          {dict.message}
        </label>
        <textarea id="message" name="message" rows={4} className={inputClass} placeholder={dict.messagePlaceholder} />
      </div>

      {/* Honeypot field (hidden from users) */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-3 text-sm text-ink-600">
        <input name="consent" type="checkbox" className="mt-1 h-4 w-4 rounded border-ink-300 text-gold-500 focus:ring-gold-500" />
        <span>{dict.consent}</span>
      </label>
      {errors.consent && <p className={errClass}>{errors.consent}</p>}

      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full disabled:opacity-60">
        {status === 'submitting' ? dict.submitting : dict.submit}
      </button>
    </form>
  );
}
