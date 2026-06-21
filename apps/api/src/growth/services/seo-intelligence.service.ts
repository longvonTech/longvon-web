import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GrowthRepository } from '../repositories/growth.repository';
import { QwenService } from './qwen.service';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SeoIntelligenceService {
  private readonly logger = new Logger(SeoIntelligenceService.name);

  constructor(
    private readonly repo: GrowthRepository,
    private readonly qwen: QwenService,
    private readonly prisma: PrismaService,
  ) {}

  // 每天早上6点生成SEO日报
  @Cron('0 6 * * *')
  async generateSeoReport() {
    this.logger.log('📊 F10 SEO智能分析启动');
    const report = await this.analyzeSeoStatus();
    await this.saveSeoReport(report, 'daily');
    this.logger.log('✅ F10 SEO分析完成');
  }

  async analyzeSeoStatus() {
    // 获取已发布文章统计
    const [publishedCount, draftCount, totalKeywords, highPriorityKws] = await Promise.all([
      this.prisma.article.count({ where: { status: 'published' } }),
      this.prisma.article.count({ where: { status: 'draft' } }),
      this.repo.countKeywordOpportunities(),
      this.repo.listKeywordOpportunities({ priority: 'high', status: 'discovered', limit: 20 }),
    ]);

    // 获取最新发布文章
    const recentArticles = await this.prisma.article.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' } as any,
      take: 10,
      select: { id: true, title: true, slug: true, publishedAt: true } as any,
    });

    // 获取内容缺口
    const contentGaps = await this.repo.listKeywordOpportunities({
      status: 'discovered', limit: 10,
    });

    return {
      publishedCount, draftCount, totalKeywords,
      recentArticles, highPriorityKws, contentGaps,
    };
  }

  async generateSeoOptimizationReport(articleId: string) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      select: { title: true, content: true, seoTitle: true, seoDescription: true } as any,
    });
    if (!article) return null;

    const prompt = `作为SEO专家，分析以下文章并提供优化建议：

文章标题：${article.title}
SEO标题：${article.seoTitle || '未设置'}
SEO描述：${article.seoDescription || '未设置'}
内容前500字：${article.content?.slice(0, 500)}

请从以下维度分析（JSON格式）：
{
  "titleScore": 0-100分,
  "titleSuggestion": "标题优化建议",
  "descriptionScore": 0-100分,
  "descriptionSuggestion": "描述优化建议",
  "contentScore": 0-100分,
  "contentSuggestions": ["建议1","建议2","建议3"],
  "internalLinkSuggestions": ["内链建议1","建议2"],
  "overallScore": 0-100分,
  "priority": "urgent/high/medium/low"
}

只返回JSON。`;

    try {
      const result = await this.qwen.complete(prompt, 'SEO优化专家', 1500);
      const match = result.match(/\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : null;
    } catch { return null; }
  }

  private async saveSeoReport(data: any, reportType: string) {
    const now = new Date();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const prompt = `基于以下SEO数据生成SEO日报（Markdown格式）：

已发布文章：${data.publishedCount}篇
草稿文章：${data.draftCount}篇
关键词库：${data.totalKeywords}个
高优先级未覆盖关键词：${data.highPriorityKws.slice(0,5).map((k: any) => k.keyword).join('、')}
最新发布：${data.recentArticles.slice(0,3).map((a: any) => a.title).join('、')}

请生成包含：数据摘要、内容缺口分析、本周SEO重点建议的报告。`;

    const content = await this.qwen.complete(prompt, 'SEO分析师', 2000);

    await this.repo.createKeywordReport({
      reportType, periodStart: yesterday, periodEnd: now,
      title: `SEO智能日报 ${now.toLocaleDateString('zh-CN')}`,
      content,
      newKeywords: data.totalKeywords,
      opportunities: data.highPriorityKws.slice(0, 10).map((k: any) => ({
        keyword: k.keyword, cluster: k.cluster,
      })),
      trends: { publishedCount: data.publishedCount, draftCount: data.draftCount },
    });
  }

  async triggerManual() {
    return this.generateSeoReport();
  }
}
