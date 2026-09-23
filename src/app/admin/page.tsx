import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifySessionToken, authCookie } from '@/lib/auth';
import { getLeads, summarize } from '@/lib/leads';
import { LogoMark } from '@/components/Logo';
import { LeadsTable } from './LeadsTable';
import { LogoutButton } from './LogoutButton';

export const dynamic = 'force-dynamic';

const statCards: { key: 'total' | 'new' | 'contacted' | 'qualified' | 'won'; label: string; accent: string }[] = [
  { key: 'total', label: 'Total leads', accent: 'text-ink-900' },
  { key: 'new', label: 'New', accent: 'text-blue-600' },
  { key: 'contacted', label: 'Contacted', accent: 'text-amber-600' },
  { key: 'qualified', label: 'Qualified', accent: 'text-violet-600' },
  { key: 'won', label: 'Won', accent: 'text-green-600' },
];

export default async function AdminDashboard() {
  const token = cookies().get(authCookie.name)?.value;
  if (!verifySessionToken(token)) redirect('/admin/login');

  const leads = await getLeads();
  const stats = summarize(leads);

  const values: Record<string, number> = {
    total: stats.total,
    new: stats.byStatus.new,
    contacted: stats.byStatus.contacted,
    qualified: stats.byStatus.qualified,
    won: stats.byStatus.won,
  };

  return (
    <div>
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <LogoMark className="h-9 w-9" />
            <div>
              <h1 className="text-lg font-bold leading-none">IBS Admin</h1>
              <p className="text-xs text-ink-400">Lead management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/leads/export"
              className="rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900"
            >
              Export CSV
            </a>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {statCards.map((card) => (
            <div key={card.key} className="rounded-xl border border-ink-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{card.label}</p>
              <p className={`mt-2 text-3xl font-bold ${card.accent}`}>{values[card.key]}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-ink-500">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          {stats.last7} new in the last 7 days
        </div>

        {/* Leads table */}
        <div className="mt-8">
          <LeadsTable initialLeads={leads} />
        </div>
      </main>
    </div>
  );
}
