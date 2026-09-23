import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

// ---------------------------------------------------------------------------
// Admin-managed settings: contact info, contact-form services, and SMTP.
// Stored alongside leads (JSON file locally, Vercel KV in production).
// ---------------------------------------------------------------------------

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  x: string;
  youtube: string;
  tiktok: string;
}

export interface ContactSettings {
  phone: string;
  whatsapp: string; // digits only, e.g. 971506065440
  email: string;
  social: SocialLinks;
}

export interface ServiceOption {
  id: string;
  en: string;
  ar: string;
  active: boolean;
}

export interface SmtpSettings {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean; // true for 465, false for 587/STARTTLS
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  adminEmail: string;
  salesEmail: string;
  notifyClient: boolean; // send confirmation to the person who submitted
  notifyTeam: boolean; // send notification to admin + sales
}

export interface Settings {
  contact: ContactSettings;
  services: ServiceOption[];
  smtp: SmtpSettings;
}

function defaultContact(): ContactSettings {
  return {
    phone: process.env.NEXT_PUBLIC_PHONE || '+971 50 606 5440',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '971506065440',
    email: process.env.NEXT_PUBLIC_EMAIL || 'info@ibsconsultancy.ae',
    social: {
      facebook:
        'https://www.facebook.com/people/IBS-Business-Setup-Structuring-UAE/61585175923684/',
      instagram: 'https://www.instagram.com/ibsforinvestors/',
      linkedin: '',
      x: '',
      youtube: '',
      tiktok: '',
    },
  };
}

function defaultServices(): ServiceOption[] {
  const seed: [string, string][] = [
    ['Business Setup', 'تأسيس الأعمال'],
    ['Golden Visa Advisory', 'استشارات الإقامة الذهبية'],
    ['Government & PRO Services', 'الخدمات الحكومية وPRO'],
    ['Corporate Structuring', 'الهيكلة المؤسسية'],
    ['Not sure yet', 'لست متأكدًا بعد'],
  ];
  return seed.map(([en, ar]) => ({ id: crypto.randomUUID(), en, ar, active: true }));
}

function defaultSmtp(): SmtpSettings {
  return {
    enabled: Boolean(process.env.SMTP_HOST),
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromName: process.env.SMTP_FROM_NAME || 'IBS Consultancy',
    fromEmail: process.env.SMTP_FROM_EMAIL || process.env.NEXT_PUBLIC_EMAIL || '',
    adminEmail: process.env.LEAD_ADMIN_EMAIL || process.env.NEXT_PUBLIC_EMAIL || '',
    salesEmail: process.env.LEAD_SALES_EMAIL || '',
    notifyClient: true,
    notifyTeam: true,
  };
}

export function defaultSettings(): Settings {
  return { contact: defaultContact(), services: defaultServices(), smtp: defaultSmtp() };
}

// ---- Storage (mirrors src/lib/leads.ts) ----
const useKV = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const KV_KEY = 'ibs:settings';

function dataFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'settings.json');
  }
  return path.join(process.cwd(), 'data', 'settings.json');
}

/** Deep-merge stored partial settings over the current defaults so new fields
 *  always have a value even if the stored file predates them. */
function withDefaults(stored: Partial<Settings> | null): Settings {
  const d = defaultSettings();
  if (!stored) return d;
  const storedContact: Partial<ContactSettings> = stored.contact ?? {};
  return {
    contact: {
      ...d.contact,
      ...storedContact,
      social: { ...d.contact.social, ...(storedContact.social ?? {}) },
    },
    services:
      Array.isArray(stored.services) && stored.services.length ? stored.services : d.services,
    smtp: { ...d.smtp, ...(stored.smtp ?? {}) },
  };
}

async function readRaw(): Promise<Partial<Settings> | null> {
  if (useKV) {
    try {
      const res = await fetch(`${process.env.KV_REST_API_URL}/get/${KV_KEY}`, {
        headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
        cache: 'no-store',
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { result: string | null };
      return data.result ? (JSON.parse(data.result) as Partial<Settings>) : null;
    } catch {
      return null;
    }
  }
  try {
    const raw = await fs.readFile(dataFilePath(), 'utf-8');
    return JSON.parse(raw) as Partial<Settings>;
  } catch {
    return null;
  }
}

async function writeRaw(settings: Settings): Promise<void> {
  if (useKV) {
    await fetch(`${process.env.KV_REST_API_URL}/set/${KV_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(settings)),
    });
    return;
  }
  const file = dataFilePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(settings, null, 2), 'utf-8');
}

export async function getSettings(): Promise<Settings> {
  return withDefaults(await readRaw());
}

export async function saveContact(contact: ContactSettings): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = { ...current, contact };
  await writeRaw(next);
  return next;
}

export async function saveServices(services: ServiceOption[]): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = { ...current, services };
  await writeRaw(next);
  return next;
}

export async function saveSmtp(smtp: SmtpSettings): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = { ...current, smtp };
  await writeRaw(next);
  return next;
}

/** Active service labels for a locale — used to populate the contact form. */
export async function getActiveServiceLabels(locale: string): Promise<string[]> {
  const { services } = await getSettings();
  return services
    .filter((s) => s.active)
    .map((s) => (locale === 'ar' ? s.ar || s.en : s.en || s.ar))
    .filter(Boolean);
}
