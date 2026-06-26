import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service';
import { QwenService } from './qwen.service';
import { GrowthRepository } from '../repositories/growth.repository';

@Injectable()
export class SeoOptimizerService {
  private readonly logger = new Logger(SeoOptimizerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly qwen: QwenService,
    private readonly repo: GrowthRepository,
  ) {}

  // 每天凌晨2点自动优化所有已发布文章
  @Cron('0 2 * * *')
  async runSeoOptimization() {
    this.logger.log('🔧 SEO自动优化引擎启动');
    await this.insertInternalLinks();
    await this.optimizeArticleSeo();
    this.logger.log('✅ SEO自动优化完成');
  }

  // ── 内链自动插入 ────────────────────────────────────────
  async insertInternalLinks() {
    // 获取所有已发布文章
    const articles = await this.prisma.article.findMany({
      where: { status: 'published' },
      select: { id: true, title: true, slug: true, content: true, seoKeywords: true },
      orderBy: { publishedAt: 'desc' } as any,
      take: 50,
    });

    if (articles.length < 2) return;

    this.logger.log(`为 ${articles.length} 篇文章插入内链`);

    for (const article of articles) {
      try {
        const otherArticles = articles.filter((a) => a.id !== article.id);
        let content = article.content;
        let linkCount = 0;

        // 为每篇文章找最多3个相关内链
        for (const other of otherArticles.slice(0, 10)) {
          if (linkCount >= 3) break;
          const keyword = other.title.slice(0, 8);
          // 检查内容中是否有该关键词且尚未有链接
          const regex = new RegExp(`(?<!\\[)(?<![/"])${keyword}(?!\\])(?![/"])`, 'g');
          if (regex.test(content)) {
            const link = `[${keyword}](/knowledge/${other.slug})`;
            content = content.replace(
              new RegExp(`(?<!\\[)(?<![/"])${keyword}(?!\\])(?![/"])`, ''),
              link,
            );
            linkCount++;
          }
        }

        // 只有真正插入了内链才更新
        if (linkCount > 0 && content !== article.content) {
          await this.prisma.article.update({
            where: { id: article.id },
            data: { content, updatedAt: new Date() } as any,
          });
          this.logger.log(`${article.title.slice(0, 30)} → 插入 ${linkCount} 个内链`);
        }
        await this.sleep(500);
      } catch (err: any) {
        this.logger.warn(`内链插入失败: ${err.message}`);
      }
    }
  }

  // ── 文章SEO自动评分+优化 ────────────────────────────────
  async optimizeArticleSeo() {
    // 获取最近7天发布的文章进行SEO优化
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const articles = await this.prisma.article.findMany({
      where: {
        status: 'published',
        publishedAt: { gte: since7d } as any,
      },
      select: {
        id: true,
        title: true,
        content: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
      } as any,
      take: 10,
    });

    for (const article of articles) {
      try {
        await this.optimizeSingleArticle(article);
        await this.sleep(3000);
      } catch (err: any) {
        this.logger.warn(`SEO优化失败: ${err.message}`);
      }
    }
  }

  async optimizeSingleArticle(article: any) {
    // 生成优化的SEO字段
    const prompt = `分析以下文章，生成优化的SEO字段（JSON格式）：

文章标题：${article.title}
文章内容前500字：${article.content?.slice(0, 500)}

要求：
{
  "seoTitle": "优化后的SEO标题（30-60字符，包含核心关键词）",
  "seoDescription": "优化后的meta描述（120-160字符，自然包含关键词，有点击吸引力）",
  "seoKeywords": "关键词1,关键词2,关键词3,关键词4,关键词5",
  "score": 0-100的SEO评分
}

只返回JSON。`;

    const result = await this.qwen.complete(prompt, 'SEO专家', 800);
    const match = result.match(/\{[\s\S]*\}/);
    if (!match) return;

    const seoData = JSON.parse(match[0]);
    await this.prisma.article.update({
      where: { id: article.id },
      data: {
        seoTitle: seoData.seoTitle || article.seoTitle,
        seoDescription: seoData.seoDescription || article.seoDescription,
        seoKeywords: seoData.seoKeywords || article.seoKeywords,
        updatedAt: new Date(),
      } as any,
    });

    this.logger.log(`SEO优化: ${article.title.slice(0, 30)} → 评分${seoData.score}`);
  }

  // ── 图片alt自动生成 ─────────────────────────────────────
  async generateImageAlts() {
    // 找内容中有图片但没有alt的文章
    const articles = await this.prisma.article.findMany({
      where: {
        status: 'published',
        content: { contains: '![' } as any,
      },
      select: { id: true, title: true, content: true } as any,
      take: 20,
    });

    for (const article of articles) {
      try {
        // 找所有没有alt的图片标签 ![](...)
        const emptyAltRegex = /!\[\]\(([^)]+)\)/g;
        let content = String(article.content || '');
        let updated = false;

        const matches = [...content.matchAll(emptyAltRegex)];
        for (const match of matches) {
          const imgUrl = match[1];
          const filename = imgUrl.split('/').pop()?.split('.')[0] ?? '';
          // 根据文件名和文章标题生成alt
          const alt = `${article.title.slice(0, 20)}-${filename.replace(/-/g, ' ')}`;
          content = content.replace(`![](${imgUrl})`, `![${alt}](${imgUrl})`);
          updated = true;
        }

        if (updated) {
          await this.prisma.article.update({
            where: { id: String(article.id) },
            data: { content: String(content) } as any,
          });
        }
      } catch {}
    }
    this.logger.log('图片alt生成完成');
  }

  async triggerManual(type: 'all' | 'links' | 'seo' | 'alts' = 'all') {
    if (type === 'links' || type === 'all') await this.insertInternalLinks();
    if (type === 'seo' || type === 'all') await this.optimizeArticleSeo();
    if (type === 'alts' || type === 'all') await this.generateImageAlts();
    return { ok: true, type };
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
