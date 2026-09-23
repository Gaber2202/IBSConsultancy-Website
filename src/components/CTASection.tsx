import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { pathFor, whatsappLink } from '@/lib/site';
import { IconArrow, IconChat } from './icons';
import { Reveal } from './Reveal';

export function CTASection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { cta } = dict;
  return (
    <section className="section">
      <div className="container-tight">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-16 text-center text-white sm:px-12 lg:py-20">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 15% 30%, rgba(201,162,39,0.5), transparent 40%), radial-gradient(circle at 85% 70%, rgba(201,162,39,0.35), transparent 40%)',
              }}
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">{cta.title}</h2>
              <p className="mt-4 text-lg text-white/70">{cta.subtitle}</p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href={pathFor(locale, 'contact')} className="btn-primary text-base">
                  {cta.button}
                  <IconArrow width={18} height={18} />
                </Link>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-ghost-light text-base">
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
