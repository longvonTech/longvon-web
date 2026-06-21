import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GrowthRepository } from '../repositories/growth.repository';
import { QwenService } from './qwen.service';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ContentFactoryService {
  private readonly logger = new Logger(ContentFactoryService.name);

  constructor(
    private readonly repo: GrowthRepository,
    private readonly qwen: QwenService,
    private readonly prisma: PrismaService,
  ) {}

  // 每天11点自动处理待生成的内容简报
  @Cron('0 11 * * *')
  async runContentFactory() {
    this.logger.log('✍️ F7 AI内容工厂启动');
    const briefs = await this.repo.listContentBriefs({ status: 'pending', limit: 5 });
    this.logger.log(`待处理简报: ${briefs.length}条`);
    for (const brief of briefs) {
      await this.generateArticleFromBrief(brief);
      await this.sleep(5000);
    }
    this.logger.log('✅ F7 AI内容工厂完成');
  }

  async generateArticleFromBrief(brief: any): Promise<string | null> {
    try {
      // 更新状态为进行中
      await this.repo.updateContentBriefStatus(brief.id, 'in_progress');

      const outline = Array.isArray(brief.outline) ? brief.outline.join('\n') : '按逻辑组织内容';
      const secondaryKws = Array.isArray(brief.secondaryKeywords) ? brief.secondaryKeywords.join('、') : '';

      const systemPrompt = `你是MATEYOU AI健康平台的专业健康内容创作者。你的文章面向关注个人健康的中国用户，风格专业但易读，结合科学依据与实用建议。重要提示：所有健康相关内容必须在适当位置注明"以上内容仅供健康参考，不构成医学诊断或治疗建议"。`;

      const prompt = `请根据以下内容简报创作一篇完整的中文健康科普文章：

目标关键词：${brief.targetKeyword}
辅助关键词：${secondaryKws}
文章类型：${brief.contentType}
文章大纲：
${outline}

创作要求：
1. 字数：不少于2000字，这是硬性要求
2. 格式：Markdown格式，包含3-5个H2标题，每个H2下有2-3个H3
3. SEO优化：
   - 标题和正文自然融入目标关键词（密度3-5%）
   - 每个H2开头自然提及关键词
   - 结尾段落包含关键词的完整语句
4. 科学性：引用具体数据（如"研究显示X%"、"正常范围为X-Y"）
5. 实用性：每个章节包含至少1条读者可操作的建议
6. 用户意图：文章必须真正解答搜索"${brief.targetKeyword}"的用户疑问
7. MATEYOU软性植入：在文章2/3处自然提及Ring1C智能戒指与该健康指标的关联，不超过150字
8. 免责声明：文末注明"以上内容仅供健康参考，不构成医学诊断或治疗建议"
9. 禁止：不要写医院运营、医疗系统、行政管理等与用户健康无关的内容

请直接输出文章正文，不要输出标题。`;

      const content = await this.qwen.complete(prompt, systemPrompt, 4000);
      if (!content || content.length < 1200) {
        this.logger.warn(`文章生成内容过短(${content?.length}字): ${brief.title}，退回重试`);
        await this.repo.updateContentBriefStatus(brief.id, 'pending');
        return null;
      }

      // 生成SEO描述
      const seoDesc = await this.qwen.complete(
        `为以下文章生成一段SEO描述（100字以内，包含关键词"${brief.targetKeyword}"）：\n${content.slice(0, 500)}`,
      );

      // 生成语义化英文slug（让Qwen翻译）
      const slugPrompt = `将以下中文关键词翻译为SEO友好的英文slug（小写，单词间用连字符，5个单词以内，不要数字）：${brief.targetKeyword}\n只返回slug，不要其他内容。`;
      const slugRaw = await this.qwen.complete(slugPrompt);
      const slugBase = slugRaw.trim().toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60);
      const uniqueSuffix = Math.random().toString(36).slice(2, 6);
      const slug = `${slugBase || brief.targetKeyword.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().slice(0, 40)}-${uniqueSuffix}`;

      // 查找或创建默认作者
      let author = await this.prisma.author.findFirst({
        where: { name: 'MATEYOU健康编辑团队' },
      });
      if (!author) {
        author = await this.prisma.author.create({
          data: {
            name: 'MATEYOU健康编辑团队',
            bio: 'AI辅助创作，专业医学编辑审核',
            title: 'AI健康内容团队',
          } as any,
        });
      }

      // 保存到Article表
      const article = await this.prisma.article.create({
        data: {
          title: brief.title,
          slug,
          content,
          summary: seoDesc || brief.title,
          seoTitle: `${brief.title} | MATEYOU健康知识库`,
          seoDescription: seoDesc || undefined,
          status: 'draft',
          authorId: author.id,
        } as any,
      });

      // 更新ContentBrief状态
      // 自动发布
      await this.prisma.article.update({
        where: { id: article.id },
        data: { status: 'published', publishedAt: new Date() } as any,
      });
      await this.repo.updateContentBriefStatus(brief.id, 'draft_ready', {
        draftReadyAt: new Date(),
        publishedArticleId: article.id,
      });

      this.logger.log(`✅ 文章草稿生成: ${brief.title} (${content.length}字)`);
      return article.id;
    } catch (err: any) {
      this.logger.error(`文章生成失败: ${brief.title} - ${err.message}`);
      await this.repo.updateContentBriefStatus(brief.id, 'pending');
      return null;
    }
  }

  async listDrafts(limit = 20) {
    return this.prisma.article.findMany({
      where: { status: 'draft' },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { id: true, title: true, slug: true, createdAt: true, status: true },
    });
  }

  async triggerManual(briefId?: string) {
    if (briefId) {
      const brief = await this.repo.listContentBriefs({ status: 'pending', limit: 100 });
      const target = brief.find(b => b.id === briefId);
      if (target) return this.generateArticleFromBrief(target);
    }
    return this.runContentFactory();
  }

  private sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}
