import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GrowthRepository } from '../repositories/growth.repository';
import { QwenService } from './qwen.service';

@Injectable()
export class ContentStrategyService {
  private readonly logger = new Logger(ContentStrategyService.name);

  constructor(
    private readonly repo: GrowthRepository,
    private readonly qwen: QwenService,
  ) {}

  // ── F6: 每周二早上10点生成内容策略 ──────────────────────
  @Cron('0 10 * * 2')
  async runContentStrategy() {
    this.logger.log('📋 F6 内容策略引擎启动');
    await this.generateContentBriefs();
    this.logger.log('✅ F6 内容策略完成');
  }

  async generateContentBriefs() {
    // 获取高优先级关键词机会
    const keywords = await this.repo.listKeywordOpportunities({
      status: 'analyzed', priority: 'high', limit: 10,
    });

    // 获取最新行业事件
    const industryEvents = await this.repo.listIndustryEvents({ status: 'processed', limit: 10 });

    // 获取最新医学研究
    const papers = await this.repo.listResearchPapers({ status: 'summarized', limit: 5 });

    this.logger.log(`生成内容简报：${keywords.length}个关键词 + ${industryEvents.length}个行业事件 + ${papers.length}篇论文`);

    // 基于关键词生成内容简报
    for (const kw of keywords.slice(0, 5)) {
      await this.createBriefFromKeyword(kw);
      await this.sleep(3000);
    }

    // 基于行业热点生成内容简报
    for (const event of industryEvents.slice(0, 3)) {
      await this.createBriefFromEvent(event);
      await this.sleep(3000);
    }

    // 基于医学研究生成内容简报
    for (const paper of papers.slice(0, 2)) {
      await this.createBriefFromPaper(paper);
      await this.sleep(3000);
    }
  }

  private async createBriefFromKeyword(kw: any) {
    const prompt = `你是MATEYOU健康平台的内容策略师。请为以下关键词生成一篇文章的详细创作简报：

目标关键词：${kw.keyword}
关键词聚类：${kw.cluster}
内容主题：${kw.topic}

请生成JSON格式的内容简报：
{
  "title": "文章标题（包含关键词，吸引用户点击）",
  "contentType": "health_encyclopedia或disease_science或symptom或sleep_topic或osa_topic或hrv_topic或spo2_topic",
  "outline": ["章节1", "章节2", "章节3", "章节4", "章节5"],
  "angle": "文章切入角度",
  "targetAudience": "目标读者群体",
  "wordCount": 目标字数数字
}

只返回JSON，不要其他内容。`;

    try {
      const result = await this.qwen.complete(prompt);
      const match = result.match(/\{[\s\S]*\}/);
      if (!match) return;

      const brief = JSON.parse(match[0]);
      await this.repo.createContentBrief({
        title: brief.title || `${kw.keyword}：完整指南`,
        targetKeyword: kw.keyword,
        contentType: brief.contentType || 'health_encyclopedia',
        outline: brief.outline,
        wordCountTarget: brief.wordCount || 1500,
        source: 'keyword_opportunity',
        keywordOpportunityId: kw.id,
        priority: kw.priority || 'medium',
        notes: `角度：${brief.angle || ''} | 目标读者：${brief.targetAudience || ''}`,
      });

      // 更新关键词状态
      await this.repo.updateKeywordOpportunityStatus(kw.id, 'assigned');
      this.logger.log(`创建内容简报: ${brief.title}`);
    } catch (err: any) {
      this.logger.warn(`创建关键词简报失败: ${err.message}`);
    }
  }

  private async createBriefFromEvent(event: any) {
    // 过滤与Ring1C用户不相关的内容（医院管理、行政、财务等）
    const irrelevantKeywords = ['医院财务', '行政', '采购', '招聘', '股价', '融资', '医保政策', 'NHS', '保险'];
    const isIrrelevant = irrelevantKeywords.some(kw => 
      (event.title + (event.aiSummary || '')).includes(kw)
    );
    if (isIrrelevant) {
      this.logger.log(`跳过不相关行业事件: ${event.title.slice(0,40)}`);
      return;
    }

    const prompt = `基于以下行业动态，为MATEYOU智能健康戒指用户生成一篇健康科普文章的创作简报（JSON格式）：

行业动态：${event.title}
摘要：${event.aiSummary || event.summary || ''}
主题：${event.topic}

要求：文章必须与以下用户群体直接相关：
- 关注睡眠质量的上班族
- 有OSA/打鼾困扰的中年人
- 关注心脏健康的健康管理人群
- GLP-1减重用户

JSON格式：
{
  "title": "文章标题（直接解决用户痛点，包含核心关键词）",
  "contentType": "health_encyclopedia或disease_science或symptom或sleep_topic或osa_topic或hrv_topic或spo2_topic或glp1_topic",
  "targetKeyword": "核心关键词（用户会搜索的词）",
  "outline": ["章节1","章节2","章节3","章节4"],
  "priority": "high或medium",
  "userIntent": "用户搜索这个词想要解决什么问题"
}

只返回JSON。`;

    try {
      const result = await this.qwen.complete(prompt);
      const match = result.match(/\{[\s\S]*\}/);
      if (!match) return;

      const brief = JSON.parse(match[0]);
      await this.repo.createContentBrief({
        title: brief.title || event.title,
        targetKeyword: brief.targetKeyword || event.topic,
        contentType: brief.contentType || 'health_encyclopedia',
        outline: brief.outline,
        source: 'industry_event',
        sourceId: event.id,
        priority: brief.priority || 'medium',
      });
    } catch (err: any) {
      this.logger.warn(`创建事件简报失败: ${err.message}`);
    }
  }

  private async createBriefFromPaper(paper: any) {
    const prompt = `基于以下医学研究论文，生成一篇面向普通读者的健康科普文章创作简报（JSON格式）：

论文标题：${paper.title}
摘要：${paper.aiSummary || paper.abstract || ''}
研究主题：${paper.topic}

JSON格式：
{
  "title": "中文科普文章标题",
  "contentType": "disease_science",
  "targetKeyword": "核心关键词",
  "outline": ["章节1","章节2","章节3","章节4"],
  "angle": "从医学研究到生活应用的转化角度"
}

只返回JSON。`;

    try {
      const result = await this.qwen.complete(prompt);
      const match = result.match(/\{[\s\S]*\}/);
      if (!match) return;

      const brief = JSON.parse(match[0]);
      await this.repo.createContentBrief({
        title: brief.title || paper.title,
        targetKeyword: brief.targetKeyword || paper.topic,
        contentType: brief.contentType || 'disease_science',
        outline: brief.outline,
        source: 'research_paper',
        sourceId: paper.id,
        priority: 'medium',
        notes: brief.angle || '',
      });
    } catch (err: any) {
      this.logger.warn(`创建论文简报失败: ${err.message}`);
    }
  }

  async triggerManual() {
    return this.generateContentBriefs();
  }

  private sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}
