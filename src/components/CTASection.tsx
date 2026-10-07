import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { pathFor } from '@/lib/site';
import { getSettings } from '@/lib/settings';
import { IconArrow, IconChat } from './icons';
import { Reveal } from './Reveal';

export async function CTASection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { cta } = dict;
  const { contact } = await getSettings();
  const whatsappHref = `https://wa.me/${(contact.whatsapp || '').replace(/[^\d]/g, '')}`;
  return (
    <section className="section pt-8">
      <div className="container-tight">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-ink-950 px-6 py-16 text-center text-white sm:px-12 lg:py-20">
            <div className="absolute inset-0 hero-atmosphere opacity-90" aria-hidden="true" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">{cta.title}</h2>
              <p className="mt-4 text-lg text-white/70">{cta.subtitle}</p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href={pathFor(locale, 'contact')} className="btn-primary text-base">
                  {cta.button}
                  <IconArrow width={18} height={18} className="rtl-flip" />
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-light text-base"
                >
                  <IconChat width={18} height={18} />
                  {cta.secondary}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
