import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PublishingService {
  private readonly logger = new Logger(PublishingService.name);

  constructor(private readonly prisma: PrismaService) {}

  // 立即发布文章
  async publishArticle(articleId: string): Promise<{ ok: boolean; slug?: string; message: string }> {
    try {
      const article = await this.prisma.article.findUnique({
        where: { id: articleId },
        select: { id: true, title: true, slug: true, status: true },
      });
      if (!article) return { ok: false, message: '文章不存在' };
      if (article.status === 'published') return { ok: false, message: '文章已发布' };

      await this.prisma.article.update({
        where: { id: articleId },
        data: { status: 'published', publishedAt: new Date() } as any,
      });

      this.logger.log(`✅ 文章已发布: ${article.title}`);
      return { ok: true, slug: article.slug, message: `文章"${article.title}"已发布` };
    } catch (err: any) {
      return { ok: false, message: err.message };
    }
  }

  // 批量发布
  async batchPublish(articleIds: string[]) {
    const results = [];
    for (const id of articleIds) {
      const result = await this.publishArticle(id);
      results.push({ id, ...result });
    }
    return results;
  }

  // 定时发布（设置publishedAt为未来时间，由cron检查）
  async schedulePublish(articleId: string, publishAt: Date) {
    await this.prisma.article.update({
      where: { id: articleId },
      data: { publishedAt: publishAt } as any,
    });
    return { ok: true, message: `已设置定时发布: ${publishAt.toLocaleString('zh-CN')}` };
  }

  // 获取发布队列
  async getPublishingQueue() {
    const [drafts, scheduled, recentPublished] = await Promise.all([
      this.prisma.article.findMany({
        where: { status: 'draft' },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { id: true, title: true, slug: true, createdAt: true },
      }),
      this.prisma.article.findMany({
        where: { status: 'draft', publishedAt: { gt: new Date() } } as any,
        orderBy: { publishedAt: 'asc' } as any,
        take: 10,
        select: { id: true, title: true, slug: true } as any,
      }),
      this.prisma.article.findMany({
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' } as any,
        take: 10,
        select: { id: true, title: true, slug: true, publishedAt: true } as any,
      }),
    ]);
    return { drafts, scheduled, recentPublished };
  }

  // 撤回文章
  async unpublishArticle(articleId: string) {
    await this.prisma.article.update({
      where: { id: articleId },
      data: { status: 'archived' } as any,
    });
    return { ok: true, message: '文章已撤回' };
  }

  // 获取发布统计
  async getPublishingStats() {
    const [draft, published, archived] = await Promise.all([
      this.prisma.article.count({ where: { status: 'draft' } }),
      this.prisma.article.count({ where: { status: 'published' } }),
      this.prisma.article.count({ where: { status: 'archived' } }),
    ]);
    return { draft, published, archived, total: draft + published + archived };
  }
}
