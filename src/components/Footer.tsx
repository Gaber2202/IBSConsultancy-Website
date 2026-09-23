import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { pathFor, contact as defaultContact, type SiteContact } from '@/lib/site';
import { Logo } from './Logo';
import { IconFacebook, IconInstagram, IconLinkedIn, IconX, IconYouTube, IconTikTok } from './icons';

export function Footer({
  locale,
  dict,
  contact = defaultContact,
}: {
  locale: Locale;
  dict: Dictionary;
  contact?: SiteContact;
}) {
  const year = new Date().getFullYear();
  const { footer, nav, services } = dict;
  const whatsappHref = `https://wa.me/${(contact.whatsapp || '').replace(/[^\d]/g, '')}`;

  const s = contact.social ?? {};
  const socials = [
    { key: 'facebook', href: s.facebook, label: 'Facebook', Icon: IconFacebook },
    { key: 'instagram', href: s.instagram, label: 'Instagram', Icon: IconInstagram },
    { key: 'linkedin', href: s.linkedin, label: 'LinkedIn', Icon: IconLinkedIn },
    { key: 'x', href: s.x, label: 'X', Icon: IconX },
    { key: 'youtube', href: s.youtube, label: 'YouTube', Icon: IconYouTube },
    { key: 'tiktok', href: s.tiktok, label: 'TikTok', Icon: IconTikTok },
  ].filter((item): item is { key: string; href: string; label: string; Icon: typeof IconFacebook } =>
    Boolean(item.href),
  );

  return (
    <footer className="bg-ink-950 text-white">
      <div className="container-tight py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo locale={locale} variant="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">{footer.tagline}</p>
            {socials.length > 0 && (
              <ul className="mt-6 flex items-center gap-2.5">
                {socials.map(({ key, href, label, Icon }) => (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-steel-400 hover:bg-white/5 hover:text-white"
                    >
                      <Icon width={17} height={17} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
              {footer.quickLinks}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li><Link href={pathFor(locale)} className="hover:text-white">{nav.home}</Link></li>
              <li><Link href={pathFor(locale, 'about')} className="hover:text-white">{nav.about}</Link></li>
              <li><Link href={pathFor(locale, 'services')} className="hover:text-white">{nav.services}</Link></li>
              <li><Link href={pathFor(locale, 'blog')} className="hover:text-white">{nav.blog}</Link></li>
              <li><Link href={pathFor(locale, 'contact')} className="hover:text-white">{nav.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
              {footer.servicesLinks}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {services.items.map((s) => (
                <li key={s.id}>
                  <Link href={`${pathFor(locale, 'services')}#${s.id}`} className="hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
              {footer.contactLinks}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-white" dir="ltr">
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a>
              </li>
              <li>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  WhatsApp
                </a>
              </li>
              <li className="text-white/50">{dict.contact.addressValue}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-xs text-white/50 sm:flex-row sm:text-start">
          <p>© {year} IBS Consultancy. {footer.rights}</p>
          <p>{footer.builtNote}</p>
        </div>
      </div>
    </footer>
  );
}
