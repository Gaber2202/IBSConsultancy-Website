'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { pathFor, type SiteContact } from '@/lib/site';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavDict {
  home: string;
  about: string;
  services: string;
  tools: string;
  calculator: string;
  freeZones: string;
  faq: string;
  blog: string;
  contact: string;
  cta: string;
  langLabel: string;
}

export function Header({ locale, nav, contact }: { locale: Locale; nav: NavDict; contact: SiteContact }) {
  const whatsappHref = `https://wa.me/${(contact.whatsapp || '').replace(/[^\d]/g, '')}`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { href: pathFor(locale), label: nav.home, exact: true },
    { href: pathFor(locale, 'services'), label: nav.services },
    { href: pathFor(locale, 'free-zones'), label: nav.freeZones },
    { href: pathFor(locale, 'calculator'), label: nav.calculator },
    { href: pathFor(locale, 'faq'), label: nav.faq },
    { href: pathFor(locale, 'blog'), label: nav.blog },
    { href: pathFor(locale, 'about'), label: nav.about },
    { href: pathFor(locale, 'contact'), label: nav.contact },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const onDark = !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'bg-white/90 shadow-soft backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-tight flex h-20 items-center justify-between gap-4">
        <Logo locale={locale} variant={onDark ? 'light' : 'dark'} />

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href, link.exact)
                  ? onDark
                    ? 'text-steel-300'
                    : 'text-steel-600'
                  : onDark
                    ? 'text-white/75 hover:text-white'
                    : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <LanguageSwitcher locale={locale} label={nav.langLabel} variant={onDark ? 'light' : 'dark'} />
          <Link href={pathFor(locale, 'contact')} className="btn-primary">
            {nav.cta}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border xl:hidden ${
            onDark ? 'border-white/30 text-white' : 'border-ink-200 text-ink-900'
          }`}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-ink-100 bg-white transition-[max-height] duration-300 xl:hidden ${
          open ? 'max-h-[640px]' : 'max-h-0'
        }`}
      >
        <div className="container-tight flex flex-col gap-1 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-4 py-3 text-base font-medium ${
                isActive(link.href, link.exact)
                  ? 'bg-sand text-steel-700'
                  : 'text-ink-700 hover:bg-sand'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex items-center gap-3">
            <LanguageSwitcher locale={locale} label={nav.langLabel} variant="dark" />
            <a href={whatsappHref} className="btn-outline flex-1" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
          <Link href={pathFor(locale, 'contact')} className="btn-primary mt-3 w-full">
            {nav.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}
