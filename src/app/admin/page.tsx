import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifySessionToken, authCookie } from '@/lib/auth';
import { getLeads, summarize } from '@/lib/leads';
import { getSettings } from '@/lib/settings';
import { LEAD_STATUS_ORDER, LEAD_STATUS_META } from '@/lib/lead-status';
import { LogoMark } from '@/components/Logo';
import { AdminApp } from './AdminApp';
import { LogoutButton } from './LogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const token = cookies().get(authCookie.name)?.value;
  if (!verifySessionToken(token)) redirect('/admin/login');

  const [leads, settings] = await Promise.all([getLeads(), getSettings()]);
  const stats = summarize(leads);

  const cards = [
    { key: 'total', label: 'Total', value: stats.total, dot: 'bg-ink-900' },
    ...LEAD_STATUS_ORDER.map((s) => ({
      key: s,
      label: LEAD_STATUS_META[s].label,
      value: stats.byStatus[s],
      dot: LEAD_STATUS_META[s].dot,
    })),
  ];

  return (
    <div>
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
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

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {cards.map((card) => (
            <div key={card.key} className="rounded-xl border border-ink-200 bg-white p-4">
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-400">
                <span className={`inline-block h-2 w-2 rounded-full ${card.dot}`} />
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-ink-900">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-ink-500">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          {stats.last7} new in the last 7 days
        </div>

        <div className="mt-8">
          <AdminApp initialLeads={leads} settings={settings} />
        </div>
      </main>
    </div>
  );
}
