import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { addLead, getLeads } from '@/lib/leads';
import { verifySessionToken, authCookie } from '@/lib/auth';
import { getSettings } from '@/lib/settings';
import { sendLeadEmails } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Public: submit a new lead from the website form.
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const service = String(body.service ?? '').trim();
  const message = String(body.message ?? '').trim();
  const locale = String(body.locale ?? 'en').trim();

  if (!name || !email || !phone) {
    return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
  }
  if (name.length > 120 || message.length > 4000) {
    return NextResponse.json({ ok: false, error: 'Field too long' }, { status: 400 });
  }

  const lead = await addLead({ name, email, phone, service, message, locale });

  // Send notification emails (client confirmation + admin/sales alert) via the
  // SMTP settings configured in the admin dashboard. Non-fatal.
  try {
    const { smtp } = await getSettings();
    await sendLeadEmails(lead, smtp);
  } catch {
    // never block the submission on email failure
  }

  // Optional: forward to a CRM / email / Slack webhook.
  if (process.env.LEAD_WEBHOOK_URL) {
    try {
      await fetch(process.env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
    } catch {
      // non-fatal
    }
  }

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}

// Protected: list leads (used by the admin dashboard as a fallback / API).
export async function GET() {
  const token = cookies().get(authCookie.name)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const leads = await getLeads();
  return NextResponse.json({ ok: true, leads });
}
