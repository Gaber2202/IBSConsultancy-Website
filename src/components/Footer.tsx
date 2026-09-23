import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { pathFor, contact, whatsappLink } from '@/lib/site';
import { Logo } from './Logo';

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const { footer, nav, services } = dict;

  return (
    <footer className="bg-ink-950 text-white">
      <div className="container-tight py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo locale={locale} variant="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">{footer.tagline}</p>
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
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
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
