import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateLeadStatus, deleteLead } from '@/lib/leads';
import { isLeadStatus } from '@/lib/lead-status';
import { verifySessionToken, authCookie } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
  const status = String(body.status ?? '');
  if (!isLeadStatus(status)) {
    return NextResponse.json({ ok: false, error: 'Invalid status' }, { status: 400 });
  }
  const lostReason = body.lostReason != null ? String(body.lostReason).slice(0, 500) : undefined;
  const ok = await updateLeadStatus(params.id, status, lostReason);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!authed()) return NextResponse.json({ ok: false }, { status: 401 });
  const ok = await deleteLead(params.id);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}
