import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, authCookie } from '@/lib/auth';
import { getSettings, type SmtpSettings } from '@/lib/settings';
import { sendTestEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!verifySessionToken(cookies().get(authCookie.name)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const to = String(body.to ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ ok: false, error: 'A valid recipient email is required' }, { status: 400 });
  }

  // Prefer the SMTP settings the admin is currently editing (sent in the body),
  // falling back to what is saved.
  const stored = await getSettings();
  const d = (body.smtp ?? {}) as Partial<SmtpSettings>;
  const smtp: SmtpSettings = { ...stored.smtp, ...d };

  const result = await sendTestEmail(smtp, to);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
