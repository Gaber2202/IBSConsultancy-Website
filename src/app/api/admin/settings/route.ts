import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { verifySessionToken, authCookie } from '@/lib/auth';
import {
  getSettings,
  saveContact,
  saveServices,
  saveSmtp,
  type ContactSettings,
  type ServiceOption,
  type SmtpSettings,
} from '@/lib/settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authed(): boolean {
  return verifySessionToken(cookies().get(authCookie.name)?.value);
}

export async function GET() {
  if (!authed()) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, settings: await getSettings() });
}

export async function PUT(request: NextRequest) {
  if (!authed()) return NextResponse.json({ ok: false }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const section = String(body.section ?? '');

  try {
    if (section === 'contact') {
      const d = (body.data ?? {}) as Partial<ContactSettings>;
      const s = (d.social ?? {}) as Partial<ContactSettings['social']>;
      const url = (v: unknown) => String(v ?? '').trim();
      const contact: ContactSettings = {
        phone: String(d.phone ?? '').trim(),
        whatsapp: String(d.whatsapp ?? '').replace(/[^\d]/g, ''),
        email: String(d.email ?? '').trim(),
        social: {
          facebook: url(s.facebook),
          instagram: url(s.instagram),
          linkedin: url(s.linkedin),
          x: url(s.x),
          youtube: url(s.youtube),
          tiktok: url(s.tiktok),
        },
      };
      const settings = await saveContact(contact);
      return NextResponse.json({ ok: true, settings });
    }

    if (section === 'services') {
      const raw = Array.isArray(body.services) ? body.services : [];
      const services: ServiceOption[] = raw
        .map((s: any) => ({
          id: String(s?.id ?? '') || crypto.randomUUID(),
          en: String(s?.en ?? '').trim(),
          ar: String(s?.ar ?? '').trim(),
          active: s?.active !== false,
        }))
        .filter((s: ServiceOption) => s.en || s.ar);
      const settings = await saveServices(services);
      return NextResponse.json({ ok: true, settings });
    }

    if (section === 'smtp') {
      const d = (body.data ?? {}) as Partial<SmtpSettings>;
      const smtp: SmtpSettings = {
        enabled: Boolean(d.enabled),
        host: String(d.host ?? '').trim(),
        port: Number(d.port ?? 587) || 587,
        secure: Boolean(d.secure),
        user: String(d.user ?? '').trim(),
        pass: String(d.pass ?? ''),
        fromName: String(d.fromName ?? '').trim(),
        fromEmail: String(d.fromEmail ?? '').trim(),
        adminEmail: String(d.adminEmail ?? '').trim(),
        salesEmail: String(d.salesEmail ?? '').trim(),
        notifyClient: d.notifyClient !== false,
        notifyTeam: d.notifyTeam !== false,
      };
      const settings = await saveSmtp(smtp);
      return NextResponse.json({ ok: true, settings });
    }

    return NextResponse.json({ ok: false, error: 'Unknown section' }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Save failed' },
      { status: 500 },
    );
  }
}
