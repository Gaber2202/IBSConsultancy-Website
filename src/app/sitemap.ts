import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['', 'about', 'services', 'blog', 'contact'];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      const url = `${SITE_URL}/${locale}${path ? `/${path}` : ''}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${SITE_URL}/en${path ? `/${path}` : ''}`,
            ar: `${SITE_URL}/ar${path ? `/${path}` : ''}`,
          },
        },
      });
    }

    // Blog posts
    const dict = await getDictionary(locale);
    for (const post of dict.blog.posts) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'yearly',
        priority: 0.6,
        alternates: {
          languages: {
            en: `${SITE_URL}/en/blog/${post.slug}`,
            ar: `${SITE_URL}/ar/blog/${post.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
