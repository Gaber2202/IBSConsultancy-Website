import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { absoluteUrl, alternatesFor } from '@/lib/site';
import { getSettings, getActiveServiceLabels } from '@/lib/settings';
import { breadcrumbSchema, organizationSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';
import { LeadForm } from '@/components/LeadForm';
import { IconPhone, IconMail, IconChat, IconPin, IconClock } from '@/components/icons';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const dict = await getDictionary(locale);
  return {
    title: { absolute: dict.meta.contact.title },
    description: dict.meta.contact.description,
    alternates: alternatesFor(locale, 'contact'),
  };
}

export default async function ContactPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : 'en') as Locale;
  const dict = await getDictionary(locale);
  const c = dict.contact;

  const settings = await getSettings();
  const contact = settings.contact;
  const services = await getActiveServiceLabels(locale);
  const whatsappHref = `https://wa.me/${contact.whatsapp}`;

  const infoItems = [
    { icon: IconPhone, label: c.phoneLabel, value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}`, ltr: true },
    { icon: IconMail, label: c.emailLabel, value: contact.email, href: `mailto:${contact.email}`, ltr: true },
    { icon: IconChat, label: c.whatsappLabel, value: 'wa.me', href: whatsappHref, ltr: true, external: true },
    { icon: IconPin, label: c.addressLabel, value: c.addressValue, href: undefined, ltr: false },
    { icon: IconClock, label: c.hoursLabel, value: c.hoursValue, href: undefined, ltr: false },
  ];

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(locale, dict),
          breadcrumbSchema([
            { name: dict.nav.home, url: absoluteUrl(locale) },
            { name: dict.nav.contact, url: absoluteUrl(`${locale}/contact`) },
          ]),
        ]}
      />
      <PageHeader eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />

      <section className="section">
        <div className="container-tight grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-bold text-ink-900">{c.infoTitle}</h2>
            <ul className="mt-8 space-y-5">
              {infoItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-gold-400">
                      <Icon width={20} height={20} />
                    </span>
                    <span>
                      <span className="block text-sm text-ink-400">{item.label}</span>
                      <span
                        className="block font-medium text-ink-900"
                        dir={item.ltr ? 'ltr' : undefined}
                      >
                        {item.value}
                      </span>
                    </span>
                  </div>
                );
                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="block rounded-xl p-2 transition-colors hover:bg-sand"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="p-2">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 overflow-hidden rounded-2xl border border-ink-100">
              <iframe
                title="IBS Consultancy — Business Bay, Dubai"
                src="https://www.google.com/maps?q=Business%20Bay%2C%20Dubai&output=embed"
                width="100%"
                height="240"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>

          {/* Lead form */}
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-2xl font-bold text-ink-900">{c.form.title}</h2>
            <p className="mt-2 text-sm text-ink-500">{c.subtitle}</p>
            <div className="mt-6">
              <LeadForm locale={locale} dict={c.form} services={services} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
