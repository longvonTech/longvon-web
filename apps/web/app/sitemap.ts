import type { MetadataRoute } from 'next';
import { listArticles } from '../lib/knowledge-api';
import { apiFetch } from '../lib/api-client';
import { getSiteUrl } from '../lib/site';
import { getAllHealthMetricSlugs } from '../lib/health-metrics';

const MAX_PAGES = 20;
const PAGE_SIZE = 50;
const PARTNER_SLUGS = ['hospital', 'pharmacy', 'oem', 'distributor', 'enterprise'];
const ASSESSMENT_TYPES = ['osa', 'sleep', 'stress', 'weight_loss', 'diabetes', 'altitude'];

interface TopicListItem { id: string; slug: string }

/**
 * Sitemap——Sprint 8百度SEO正式上线，覆盖全部可索引页面。
 * changeFrequency与priority遵循百度Search Resource Platform推荐：
 * 首页priority=1.0，核心功能页0.8-0.9，内容页0.6-0.7。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const GEO_PAGES = [
    'company/longvon',
    'smart-ring-manufacturer',
    'smart-ring-oem-odm',
    'smart-ring-technology',
    'smart-ring-sleep-monitoring',
    'smart-ring-sleep-respiratory',
    'smart-ring-osa',
  ];

  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/products/ring1c`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/news`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/metrics`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/assessment`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/membership`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/knowledge`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/partner`, changeFrequency: 'monthly', priority: 0.8 },
  ];

  for (const slug of GEO_PAGES) {
    entries.push({ url: `${siteUrl}/${slug}`, changeFrequency: 'monthly', priority: 0.95 });
  }

  for (const slug of PARTNER_SLUGS) {
    entries.push({ url: `${siteUrl}/partner/${slug}`, changeFrequency: 'monthly', priority: 0.7 });
  }

  for (const type of ASSESSMENT_TYPES) {
    const path = type === 'weight_loss' ? 'weight-loss' : type;
    entries.push({ url: `${siteUrl}/assessment/${path}`, changeFrequency: 'monthly', priority: 0.7 });
  }

  for (const slug of getAllHealthMetricSlugs()) {
    entries.push({ url: `${siteUrl}/metrics/${slug}`, changeFrequency: 'monthly', priority: 0.7 });
  }

  // 知识库文章（动态）
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const { items, total } = await listArticles({ page });
      for (const article of items) {
        entries.push({
          url: `${siteUrl}/knowledge/${article.slug}`,
          lastModified: article.publishedAt ? new Date(article.publishedAt) : undefined,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
      if (page * PAGE_SIZE >= total) break;
    }
  } catch { /* 数据库不可用时跳过，不阻断整个sitemap */ }

  // 专题Hub页（动态）
  try {
    const topics = await apiFetch<TopicListItem[]>('/knowledge/topics').catch(() => []);
    for (const topic of topics) {
      entries.push({ url: `${siteUrl}/topics/${topic.slug}`, changeFrequency: 'weekly', priority: 0.7 });
    }
  } catch { /* 同上 */ }

  return entries;
}
