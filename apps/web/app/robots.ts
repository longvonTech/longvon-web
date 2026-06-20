import type { MetadataRoute } from 'next';
import { getSiteUrl } from '../lib/site';

/**
 * robots.txt——Sprint 8百度SEO正式上线。
 * 中国市场策略：
 * ①明确允许百度蜘蛛(Baiduspider)抓取核心内容页
 * ②不设置Google/Bing类爬虫规则（不接入Google生态，但也不主动屏蔽，避免误阻境外合法访问）
 * ③禁止抓取API/Admin/内部路由
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      {
        // 百度蜘蛛——明确允许，优先级最高
        userAgent: 'Baiduspider',
        allow: ['/', '/products', '/knowledge', '/topics', '/authors', '/partner', '/assessment', '/membership'],
        disallow: ['/api/', '/admin/', '/dashboard', '/_next/'],
        crawlDelay: 1,
      },
      {
        // 其他爬虫通用规则
        userAgent: '*',
        allow: ['/', '/products', '/knowledge', '/topics', '/authors', '/partner', '/assessment'],
        disallow: ['/api/', '/admin/', '/dashboard'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
