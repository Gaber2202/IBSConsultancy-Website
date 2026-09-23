import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getLeads } from '@/lib/leads';
import { verifySessionToken, authCookie } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET() {
  const token = cookies().get(authCookie.name)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const leads = await getLeads();
  const header = ['Date', 'Name', 'Email', 'Phone', 'Service', 'Status', 'Locale', 'Message'];
  const rows = leads.map((l) =>
    [
      l.createdAt,
      l.name,
      l.email,
      l.phone,
      l.service,
      l.status,
      l.locale,
      l.message,
    ]
      .map((v) => csvEscape(String(v ?? '')))
      .join(','),
  );
  const csv = [header.join(','), ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ibs-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
