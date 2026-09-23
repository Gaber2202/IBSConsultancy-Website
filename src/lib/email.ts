import 'server-only';
import nodemailer from 'nodemailer';
import type { SmtpSettings } from './settings';
import type { Lead } from './leads';

export function smtpConfigured(smtp: SmtpSettings): boolean {
  return Boolean(smtp.enabled && smtp.host && smtp.fromEmail);
}

function buildTransport(smtp: SmtpSettings) {
  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
  });
}

function from(smtp: SmtpSettings): string {
  return `"${smtp.fromName || 'IBS Consultancy'}" <${smtp.fromEmail}>`;
}

const wrap = (inner: string) => `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#0B1B2B">
    <div style="background:#0B1B2B;padding:20px 24px;border-radius:12px 12px 0 0">
      <span style="color:#fff;font-size:20px;font-weight:700;letter-spacing:1px">IBS</span>
      <span style="color:#9FB0C4;font-size:11px;letter-spacing:2px;margin-left:8px">INTELLIGENT BUSINESS SOLUTIONS</span>
    </div>
    <div style="border:1px solid #E1E8EF;border-top:none;border-radius:0 0 12px 12px;padding:24px">
      ${inner}
    </div>
  </div>`;

function clientEmail(lead: Lead) {
  const ar = lead.locale === 'ar';
  const subject = ar ? 'شكرًا لتواصلك مع IBS' : 'Thank you for contacting IBS';
  const body = ar
    ? `<h2 style="margin:0 0 12px">مرحبًا ${esc(lead.name)}،</h2>
       <p style="line-height:1.6">شكرًا لتواصلك مع IBS. لقد استلمنا طلبك${lead.service ? ` بخصوص «${esc(lead.service)}»` : ''} وسيتواصل معك أحد مستشارينا قريبًا.</p>
       <p style="line-height:1.6;color:#5E7A96">مع تحيات فريق IBS</p>`
    : `<h2 style="margin:0 0 12px">Hi ${esc(lead.name)},</h2>
       <p style="line-height:1.6">Thank you for reaching out to IBS. We've received your enquiry${lead.service ? ` about <strong>${esc(lead.service)}</strong>` : ''} and one of our consultants will get back to you shortly.</p>
       <p style="line-height:1.6;color:#5E7A96">Warm regards,<br/>The IBS team</p>`;
  return { subject, html: wrap(body) };
}

function teamEmail(lead: Lead) {
  const rows: [string, string][] = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Service', lead.service || '—'],
    ['Locale', lead.locale],
    ['Source', lead.source || 'website'],
    ['Message', lead.message || '—'],
  ];
  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 10px;color:#5E7A96;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 10px;font-weight:600">${esc(
          v,
        )}</td></tr>`,
    )
    .join('');
  const body = `<h2 style="margin:0 0 12px">🔔 New lead received</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${table}</table>`;
  return { subject: `New lead: ${lead.name}${lead.service ? ` — ${lead.service}` : ''}`, html: wrap(body) };
}

function esc(s: string): string {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

/**
 * Send lead notification emails. Never throws — failures are returned so the
 * lead submission itself is not blocked by mail problems.
 */
export async function sendLeadEmails(
  lead: Lead,
  smtp: SmtpSettings,
): Promise<{ client: boolean; team: boolean; error?: string }> {
  if (!smtpConfigured(smtp)) return { client: false, team: false, error: 'SMTP not configured' };
  const result = { client: false, team: false as boolean, error: undefined as string | undefined };
  try {
    const transport = buildTransport(smtp);

    if (smtp.notifyClient && lead.email) {
      const { subject, html } = clientEmail(lead);
      await transport.sendMail({ from: from(smtp), to: lead.email, subject, html });
      result.client = true;
    }

    if (smtp.notifyTeam) {
      const to = [smtp.adminEmail, smtp.salesEmail].filter(Boolean).join(', ');
      if (to) {
        const { subject, html } = teamEmail(lead);
        await transport.sendMail({ from: from(smtp), to, replyTo: lead.email, subject, html });
        result.team = true;
      }
    }
  } catch (e) {
    result.error = e instanceof Error ? e.message : 'Failed to send email';
  }
  return result;
}

/** Send a one-off test email to verify SMTP credentials from the admin UI. */
export async function sendTestEmail(smtp: SmtpSettings, to: string): Promise<{ ok: boolean; error?: string }> {
  if (!smtp.host || !smtp.fromEmail) return { ok: false, error: 'Host and From address are required' };
  try {
    const transport = buildTransport(smtp);
    await transport.sendMail({
      from: from(smtp),
      to,
      subject: 'IBS — SMTP test email',
      html: wrap('<p style="line-height:1.6">✅ Your SMTP configuration works. This is a test email from the IBS admin dashboard.</p>'),
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to send' };
  }
}
