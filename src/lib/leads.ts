import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  locale: string;
  status: LeadStatus;
  createdAt: string;
  source?: string;
}

export interface NewLeadInput {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  locale: string;
  source?: string;
}

/**
 * Storage abstraction.
 * - If Vercel KV env vars are present, uses KV (durable, recommended for prod).
 * - Otherwise falls back to a JSON file: ./data/leads.json in dev,
 *   /tmp/leads.json on serverless (ephemeral but functional for demos).
 *
 * Swap `fileStore` for a database adapter (Postgres, Supabase, etc.)
 * to make lead storage durable in production.
 */

const useKV = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const KV_KEY = 'ibs:leads';

function dataFilePath(): string {
  // Vercel/serverless: only /tmp is writable.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'leads.json');
  }
  return path.join(process.cwd(), 'data', 'leads.json');
}

async function readFileLeads(): Promise<Lead[]> {
  const file = dataFilePath();
  try {
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw) as Lead[];
  } catch {
    return [];
  }
}

async function writeFileLeads(leads: Lead[]): Promise<void> {
  const file = dataFilePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(leads, null, 2), 'utf-8');
}

// ---- Vercel KV via REST (no extra dependency required) ----
async function kvGet(): Promise<Lead[]> {
  const res = await fetch(`${process.env.KV_REST_API_URL}/get/${KV_KEY}`, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { result: string | null };
  if (!data.result) return [];
  try {
    return JSON.parse(data.result) as Lead[];
  } catch {
    return [];
  }
}

async function kvSet(leads: Lead[]): Promise<void> {
  await fetch(`${process.env.KV_REST_API_URL}/set/${KV_KEY}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(JSON.stringify(leads)),
  });
}

export async function getLeads(): Promise<Lead[]> {
  const leads = useKV ? await kvGet() : await readFileLeads();
  return leads.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function addLead(input: NewLeadInput): Promise<Lead> {
  const lead: Lead = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    service: input.service.trim(),
    message: input.message.trim(),
    locale: input.locale,
    status: 'new',
    source: input.source ?? 'website',
    createdAt: new Date().toISOString(),
  };

  const leads = useKV ? await kvGet() : await readFileLeads();
  leads.push(lead);
  if (useKV) await kvSet(leads);
  else await writeFileLeads(leads);

  return lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  const leads = useKV ? await kvGet() : await readFileLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return false;
  leads[idx].status = status;
  if (useKV) await kvSet(leads);
  else await writeFileLeads(leads);
  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  const leads = useKV ? await kvGet() : await readFileLeads();
  const next = leads.filter((l) => l.id !== id);
  if (next.length === leads.length) return false;
  if (useKV) await kvSet(next);
  else await writeFileLeads(next);
  return true;
}

export function summarize(leads: Lead[]) {
  const byStatus: Record<LeadStatus, number> = {
    new: 0,
    contacted: 0,
    qualified: 0,
    won: 0,
    lost: 0,
  };
  for (const l of leads) byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;

  const now = new Date();
  const last7 = leads.filter((l) => {
    const d = new Date(l.createdAt);
    return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  return { total: leads.length, byStatus, last7 };
}
