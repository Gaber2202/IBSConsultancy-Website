import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateLeadStatus, deleteLead, type LeadStatus } from '@/lib/leads';
import { verifySessionToken, authCookie } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID: LeadStatus[] = ['new', 'contacted', 'qualified', 'won', 'lost'];

function authed(): boolean {
  const token = cookies().get(authCookie.name)?.value;
  return verifySessionToken(token);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!authed()) return NextResponse.json({ ok: false }, { status: 401 });
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
  const status = String(body.status ?? '') as LeadStatus;
  if (!VALID.includes(status)) {
    return NextResponse.json({ ok: false, error: 'Invalid status' }, { status: 400 });
  }
  const ok = await updateLeadStatus(params.id, status);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!authed()) return NextResponse.json({ ok: false }, { status: 401 });
  const ok = await deleteLead(params.id);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}
