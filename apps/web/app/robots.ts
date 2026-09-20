import type { MetadataRoute } from 'next';
import { getSiteUrl } from '../lib/site';

/**
 * robots.txt — allow major search/AI crawlers on public content.
 * Block only admin/API/internal routes. Do not block Google for GEO.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const allow = [
    '/',
    '/products',
    '/knowledge',
    '/topics',
    '/authors',
    '/partner',
    '/assessment',
    '/membership',
    '/about',
    '/news',
    '/metrics',
    '/company/longvon',
    '/smart-ring-manufacturer',
    '/smart-ring-oem-odm',
    '/smart-ring-technology',
    '/smart-ring-sleep-monitoring',
    '/smart-ring-sleep-respiratory',
    '/smart-ring-osa',
  ];
  const disallow = ['/api/', '/admin/', '/dashboard', '/_next/'];

  return {
    rules: [
      {
        userAgent: 'Baiduspider',
        allow,
        disallow,
        crawlDelay: 1,
      },
      {
        userAgent: 'GPTBot',
        allow,
        disallow,
      },
      {
        userAgent: 'Google-Extended',
        allow,
        disallow,
      },
      {
        userAgent: 'PerplexityBot',
        allow,
        disallow,
      },
      {
        userAgent: '*',
        allow,
        disallow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
