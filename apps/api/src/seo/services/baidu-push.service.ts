import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/**
 * 百度主动推送 Service（Sprint 8）。
 *
 * 百度搜索资源平台提供三种收录方式，本平台采用「主动推送」（效果最好）：
 *   1. 普通收录：Baiduspider 自然爬取（依赖 robots.txt + sitemap）
 *   2. 快速收录：通过 API 推送 URL，24小时内处理
 *   3. 主动推送（IndexNow 百度版）：实时推送，收录速度最快
 *
 * 百度主动推送 API 文档：https://ziyuan.baidu.com/linksubmit/index
 * 每日推送配额：普通站点默认 500 条/天
 *
 * 注意：本 Service 需要 BAIDU_PUSH_TOKEN 环境变量（在百度搜索资源平台获取）。
 * 未配置时，方法调用会记录警告日志并静默跳过，不抛异常——
 * 不影响核心业务功能（推送失败不影响文章发布流程）。
 */
@Injectable()
export class BaiduPushService {
  private readonly logger = new Logger(BaiduPushService.name);
  private readonly token = process.env.BAIDU_PUSH_TOKEN;
  private readonly siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.longvon.com';

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 推送单个 URL（文章发布时立即推送）。
   * @param url 完整 URL，如 https://www.longvon.com/knowledge/sleep-tips
   */
  async pushUrl(url: string): Promise<{ success: boolean; message: string }> {
    return this.pushUrls([url]);
  }

  /**
   * 批量推送（sitemap 全量推送或批量发布时使用）。
   * 百度 API 每次最多推送 2000 个 URL，超出需要分批调用。
   */
  async pushUrls(urls: string[]): Promise<{ success: boolean; message: string }> {
    if (!this.token) {
      this.logger.warn('BAIDU_PUSH_TOKEN 未配置，跳过百度主动推送（不影响核心功能）');
      return { success: false, message: 'token_not_configured' };
    }

    const apiUrl = `http://data.zz.baidu.com/urls?site=${encodeURIComponent(this.siteUrl)}&token=${this.token}`;
    const body = urls.join('\n');

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body,
        signal: AbortSignal.timeout(10000), // 10秒超时
      });

      const result = (await response.json()) as Record<string, unknown>;

      if (response.ok && result['success']) {
        this.logger.log(`百度推送成功：${urls.length} 个URL，成功=${result['success']}`);
        return { success: true, message: `已推送 ${result['success']} 个URL` };
      } else {
        this.logger.warn(`百度推送返回错误：${JSON.stringify(result)}`);
        return { success: false, message: JSON.stringify(result) };
      }
    } catch (err) {
      this.logger.error(`百度推送请求失败：${(err as Error).message}`);
      return { success: false, message: (err as Error).message };
    }
  }

  /**
   * 推送全站已发布文章（用于新站点首次提交或批量重新提交）。
   * 注意：有每日配额限制（500条/天），建议仅在需要时调用，不要设置为定时频繁推送。
   */
  async pushAllPublishedArticles(): Promise<{ pushed: number; skipped: number }> {
    const articles = await this.prisma.article.findMany({
      where: { status: 'published', deletedAt: null },
      select: { slug: true },
    });

    const urls = articles.map((a) => `${this.siteUrl}/knowledge/${a.slug}`);

    // 百度 API 每次最多 2000 个，分批处理
    const batchSize = 2000;
    let pushed = 0;
    let skipped = 0;

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const result = await this.pushUrls(batch);
      if (result.success) {
        pushed += batch.length;
      } else {
        skipped += batch.length;
      }
    }

    return { pushed, skipped };
  }
}
