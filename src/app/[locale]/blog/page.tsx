import type { Metadata } from 'next';
import Link from 'next/link';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { absoluteUrl, pathFor, alternatesFor } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';
import { CTASection } from '@/components/CTASection';
import { IconArrow } from '@/components/icons';
import { Reveal } from '@/components/Reveal';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const dict = await getDictionary(locale);
  return {
    title: { absolute: dict.meta.blog.title },
    description: dict.meta.blog.description,
    alternates: alternatesFor(locale, 'blog'),
  };
}

function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-AE' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export default async function BlogPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : 'en') as Locale;
  const dict = await getDictionary(locale);
  const { blog } = dict;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: dict.nav.home, url: absoluteUrl(locale) },
          { name: dict.nav.blog, url: absoluteUrl(`${locale}/blog`) },
        ])}
      />
      <PageHeader eyebrow={blog.eyebrow} title={blog.title} subtitle={blog.subtitle} />

      <section className="section">
        <div className="container-tight">
          {blog.posts.length === 0 ? (
            <p className="text-center text-ink-500">{blog.empty}</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blog.posts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 80}>
                  <Link
                    href={pathFor(locale, `blog/${post.slug}`)}
                    className="card card-hover group flex h-full flex-col overflow-hidden"
                  >
                    <div className="relative flex h-40 items-center justify-center overflow-hidden bg-ink-950">
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          backgroundImage:
                            'radial-gradient(circle at 30% 30%, rgba(201,162,39,0.6), transparent 45%)',
                        }}
                      />
                      <span className="relative rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-300">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-2 text-xs text-ink-400">
                        <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                        <span>·</span>
                        <span>
                          {post.readingTime} {blog.minRead}
                        </span>
                      </div>
                      <h2 className="mt-3 text-lg font-bold leading-snug text-ink-900 group-hover:text-gold-700">
                        {post.title}
                      </h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{post.excerpt}</p>
                      <span className="link-gold mt-5 text-sm">
                        {blog.readArticle}
                        <IconArrow width={16} height={16} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection locale={locale} dict={dict} />
    </>
  );
}
