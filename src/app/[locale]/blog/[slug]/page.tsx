import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locales, isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { absoluteUrl, pathFor, alternatesFor } from '@/lib/site';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { CTASection } from '@/components/CTASection';
import { IconArrow } from '@/components/icons';

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const dict = await getDictionary(locale);
    for (const post of dict.blog.posts) {
      params.push({ locale, slug: post.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const dict = await getDictionary(locale);
  const post = dict.blog.posts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: alternatesFor(locale, `blog/${post.slug}`),
    openGraph: { type: 'article', title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-AE' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export default async function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = (isLocale(params.locale) ? params.locale : 'en') as Locale;
  const dict = await getDictionary(locale);
  const post = dict.blog.posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.excerpt,
            url: absoluteUrl(`${locale}/blog/${post.slug}`),
            datePublished: post.date,
            locale,
          }),
          breadcrumbSchema([
            { name: dict.nav.home, url: absoluteUrl(locale) },
            { name: dict.nav.blog, url: absoluteUrl(`${locale}/blog`) },
            { name: post.title, url: absoluteUrl(`${locale}/blog/${post.slug}`) },
          ]),
        ]}
      />

      <article className="pb-8 pt-36 sm:pt-40">
        <div className="container-tight max-w-3xl">
          <Link href={pathFor(locale, 'blog')} className="link-gold text-sm">
            <IconArrow width={16} height={16} className="rotate-180" />
            {dict.blog.backToBlog}
          </Link>

          <span className="mt-6 inline-block rounded-full bg-sand px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-700">
            {post.category}
          </span>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-ink-900 sm:text-4xl">{post.title}</h1>

          <div className="mt-4 flex items-center gap-2 text-sm text-ink-400">
            <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
            <span>·</span>
            <span>
              {post.readingTime} {dict.blog.minRead}
            </span>
          </div>

          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-700">
            {post.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </article>

      <CTASection locale={locale} dict={dict} />
    </>
  );
}
