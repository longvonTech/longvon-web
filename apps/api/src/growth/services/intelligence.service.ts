import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GrowthRepository } from '../repositories/growth.repository';
import { QwenService } from './qwen.service';
import { CrawlerService } from './crawler.service';

@Injectable()
export class IntelligenceService {
  private readonly logger = new Logger(IntelligenceService.name);

  // F2: 行业监控关键词
  private readonly INDUSTRY_TOPICS = [
    { topic: 'smart_ring', keywords: ['智能戒指', 'smart ring', 'Ring1C'] },
    { topic: 'sleep_tech', keywords: ['睡眠科技', '睡眠监测', 'sleep technology'] },
    { topic: 'digital_health', keywords: ['数字健康', 'digital health', '健康管理'] },
    { topic: 'ai_health', keywords: ['AI健康', '人工智能医疗', 'AI health'] },
    { topic: 'chronic_disease', keywords: ['慢病管理', '慢性病', 'chronic disease'] },
    { topic: 'glp1', keywords: ['GLP-1', '司美格鲁肽', 'semaglutide'] },
    { topic: 'aging_health', keywords: ['老龄健康', '老年健康', 'aging health'] },
  ];

  // F3: 竞品监控对象
  private readonly COMPETITORS = ['oura', 'ringconn', 'ultrahuman', 'samsung_galaxy_ring'];

  // F4: 医学研究关键词
  private readonly RESEARCH_TOPICS = [
    { topic: 'sleep', keywords: ['sleep quality wearable', 'sleep monitoring ring'] },
    { topic: 'osa', keywords: ['sleep apnea screening', 'OSA detection wearable'] },
    { topic: 'hrv', keywords: ['heart rate variability wearable', 'HRV monitoring'] },
    { topic: 'spo2', keywords: ['blood oxygen monitoring', 'SpO2 wearable'] },
    { topic: 'heart_health', keywords: ['heart health wearable', 'cardiac monitoring ring'] },
    { topic: 'diabetes', keywords: ['diabetes monitoring wearable', 'glucose tracking'] },
    { topic: 'glp1', keywords: ['GLP-1 digital health', 'weight management wearable'] },
  ];

  constructor(
    private readonly repo: GrowthRepository,
    private readonly qwen: QwenService,
    private readonly crawler: CrawlerService,
  ) {}

  // ── F2: 行业情报采集（每天早上7点）─────────────────────
  @Cron('0 7 * * *')
  async runIndustryIntelligence() {
    this.logger.log('🚀 F2 行业情报引擎启动');
    for (const { topic, keywords } of this.INDUSTRY_TOPICS) {
      await this.crawlIndustryTopic(topic, keywords);
      await this.sleep(3000);
    }
    this.logger.log('✅ F2 行业情报采集完成');
  }

  async crawlIndustryTopic(topic: string, keywords: string[]) {
    const articles: any[] = [];
    // 从Bing新闻采集
    const news = await this.crawler.crawlIndustryNews(keywords);
    articles.push(...news);
    await this.sleep(2000);
    // 去重并处理
    const seen = new Set<string>();
    for (const article of articles) {
      if (seen.has(article.title)) continue;
      seen.add(article.title);
      try {
        const aiSummary = await this.qwen.summarizeArticle(
          article.title,
          article.summary ?? '',
          topic,
        );
        const relevance = await this.qwen.assessRelevance(article.title, aiSummary, keywords);
        await this.repo.createIndustryEvent({
          title: article.title,
          sourceUrl: article.url,
          sourceName: article.source,
          topic,
          relevance,
          rawContent: article.summary,
          aiSummary,
          status: 'processed',
        });
        await this.sleep(1000);
      } catch (err: any) {
        this.logger.warn(`处理行业事件失败: ${err.message}`);
      }
    }
  }

  // ── F3: 竞品情报采集（每天早上8点）─────────────────────
  @Cron('0 8 * * *')
  async runCompetitorIntelligence() {
    this.logger.log('🚀 F3 竞品情报引擎启动');
    for (const competitor of this.COMPETITORS) {
      await this.crawlCompetitor(competitor);
      await this.sleep(5000);
    }
    this.logger.log('✅ F3 竞品情报采集完成');
  }

  async crawlCompetitor(competitor: string) {
    const articles = await this.crawler.crawlCompetitorSite(competitor);
    const seen = new Set<string>();
    for (const article of articles) {
      if (seen.has(article.title)) continue;
      seen.add(article.title);
      try {
        const aiSummary = await this.qwen.summarizeArticle(
          article.title,
          article.summary ?? '',
          `竞品${competitor}`,
        );
        const eventType = this.classifyCompetitorEvent(article.title);
        await this.repo.createCompetitorEvent({
          competitor,
          eventType,
          title: article.title,
          sourceUrl: article.url,
          sourceName: article.source,
          rawContent: article.summary,
          aiSummary,
          impact: 'medium',
          status: 'processed',
        });
        await this.sleep(1500);
      } catch (err: any) {
        this.logger.warn(`处理竞品事件失败: ${err.message}`);
      }
    }
  }

  private classifyCompetitorEvent(title: string): string {
    const t = title.toLowerCase();
    if (
      t.includes('new') ||
      t.includes('launch') ||
      t.includes('introduce') ||
      t.includes('新品') ||
      t.includes('发布')
    )
      return 'product_update';
    if (
      t.includes('research') ||
      t.includes('study') ||
      t.includes('tech') ||
      t.includes('算法') ||
      t.includes('技术')
    )
      return 'tech_upgrade';
    if (t.includes('hire') || t.includes('job') || t.includes('招聘') || t.includes('团队'))
      return 'hiring';
    if (t.includes('price') || t.includes('pricing') || t.includes('价格') || t.includes('折扣'))
      return 'pricing';
    if (
      t.includes('review') ||
      t.includes('report') ||
      t.includes('media') ||
      t.includes('媒体') ||
      t.includes('报道')
    )
      return 'media_coverage';
    return 'other';
  }

  // ── F4: 医学研究采集（每天早上9点）─────────────────────
  @Cron('0 9 * * *')
  async runResearchIntelligence() {
    this.logger.log('🚀 F4 医学研究引擎启动');
    for (const { topic, keywords } of this.RESEARCH_TOPICS) {
      for (const kw of keywords.slice(0, 1)) {
        const papers = await this.crawler.crawlPubMed(kw);
        for (const paper of papers.slice(0, 4)) {
          try {
            const aiSummary = await this.qwen.summarizeArticle(
              paper.title,
              paper.summary ?? '',
              `${topic}医学研究`,
            );
            await this.repo.createResearchPaper({
              title: paper.title,
              abstract: paper.summary,
              sourceUrl: paper.url,
              topic,
              aiSummary,
              relevance: 'medium',
              status: 'summarized',
            });
            await this.sleep(1500);
          } catch {}
        }
      }
      await this.sleep(3000);
    }
    this.logger.log('✅ F4 医学研究采集完成');
  }

  // ── 生成日报（每天下午6点）──────────────────────────────
  @Cron('0 18 * * *')
  async generateDailyReports() {
    this.logger.log('📊 生成每日情报报告');
    const today = new Date();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 行业日报
    const industryEvents = await this.repo.listIndustryEvents({ status: 'processed', limit: 30 });
    if (industryEvents.length > 0) {
      const { title, content, highlights } = await this.qwen.generateReport(
        '行业',
        industryEvents,
        '今日',
      );
      await this.repo.createIndustryReport({
        reportType: 'daily',
        periodStart: yesterday,
        periodEnd: today,
        title,
        content,
        highlights,
        eventCount: industryEvents.length,
      });
    }

    // 竞品日报
    const competitorEvents = await this.repo.listCompetitorEvents({ limit: 20 });
    if (competitorEvents.length > 0) {
      const { title, content, insights } = await this.generateCompetitorReport(competitorEvents);
      await this.repo.createCompetitorReport({
        competitor: 'all',
        reportType: 'daily',
        periodStart: yesterday,
        periodEnd: today,
        title,
        content,
        insights,
        eventCount: competitorEvents.length,
      });
    }

    this.logger.log('✅ 每日情报报告生成完成');
  }

  private async generateCompetitorReport(events: any[]) {
    const eventList = events
      .map(
        (e, i) => `${i + 1}. [${e.competitor}] ${e.title}${e.aiSummary ? '：' + e.aiSummary : ''}`,
      )
      .join('\n');
    const prompt = `基于以下竞品动态，生成竞品情报分析报告（Markdown格式，分竞品逐一分析，最后给出对MATEYOU的战略建议）：\n\n${eventList}`;
    const content = await this.qwen.complete(prompt, '你是MATEYOU的竞品分析专家。', 3000);
    const title = `竞品情报日报 ${new Date().toLocaleDateString('zh-CN')}`;

    let insights: string[] = [];
    try {
      const h = await this.qwen.complete(
        `从以下竞品报告中提取3条最重要的竞品洞察，JSON数组格式：\n${content.slice(0, 800)}`,
      );
      const match = h.match(/\[.*\]/s);
      if (match) insights = JSON.parse(match[0]);
    } catch {}

    return { title, content, insights };
  }

  // ── 手动触发（用于测试）────────────────────────────────
  async triggerManual(engine: 'industry' | 'competitor' | 'research' | 'report') {
    switch (engine) {
      case 'industry':
        return this.runIndustryIntelligence();
      case 'competitor':
        return this.runCompetitorIntelligence();
      case 'research':
        return this.runResearchIntelligence();
      case 'report':
        return this.generateDailyReports();
    }
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
