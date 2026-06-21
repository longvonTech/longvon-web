import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GrowthRepository } from '../repositories/growth.repository';
import { QwenService } from './qwen.service';
import { PrismaService } from '../../database/prisma.service';
import axios from 'axios';

@Injectable()
export class ExecutiveBriefService {
  private readonly logger = new Logger(ExecutiveBriefService.name);
  private readonly wecomWebhook = process.env.WECOM_WEBHOOK_URL ?? '';

  constructor(
    private readonly repo: GrowthRepository,
    private readonly qwen: QwenService,
    private readonly prisma: PrismaService,
  ) {}

  // 每天晚上8点生成并推送CEO日报
  @Cron('0 20 * * *')
  async generateAndPushDailyBrief() {
    this.logger.log('📋 F11 CEO日报生成启动');
    const report = await this.generateDailyBrief();
    if (report) {
      await this.pushToWecom(report);
      this.logger.log('✅ CEO日报已推送到企业微信');
    }
  }

  async generateDailyBrief(): Promise<any> {
    const today = new Date();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 收集各模块数据
    const [
      industryEvents, competitorEvents, researchPapers,
      publishedArticles, contentBriefs, keywordCount,
    ] = await Promise.all([
      this.repo.listIndustryEvents({ status: 'processed', limit: 5 }),
      this.repo.listCompetitorEvents({ limit: 5 }),
      this.repo.listResearchPapers({ status: 'summarized', limit: 3 }),
      this.prisma.article.count({ where: { status: 'published' } }),
      this.repo.countContentBriefs('pending'),
      this.repo.countKeywordOpportunities(),
    ]);

    // 用Qwen生成各板块
    const [industrySection, competitorSection, researchSection, contentSection] = await Promise.all([
      this.generateSection('行业动态', industryEvents.map(e => `• ${e.title}${e.aiSummary ? '：' + e.aiSummary.slice(0, 80) : ''}`).join('\n')),
      this.generateSection('竞品动态', competitorEvents.map(e => `• [${e.competitor}] ${e.title}`).join('\n')),
      this.generateSection('医学研究', researchPapers.map(p => `• ${p.title}${p.aiSummary ? '：' + p.aiSummary.slice(0, 60) : ''}`).join('\n')),
      this.generateSection('内容产出', `已发布文章：${publishedArticles}篇\n待处理简报：${contentBriefs}条\n关键词库：${keywordCount}个`),
    ]);

    // 生成执行摘要
    const highlightsPrompt = `基于以下MATEYOU平台今日数据，生成3条最重要的CEO关注点（每条50字以内）：
行业：${industryEvents.slice(0,2).map(e => e.title).join('；')}
竞品：${competitorEvents.slice(0,2).map(e => `${e.competitor}: ${e.title}`).join('；')}
内容：已发布${publishedArticles}篇文章
JSON数组格式返回。`;

    let highlights: string[] = [];
    try {
      const h = await this.qwen.complete(highlightsPrompt);
      const match = h.match(/\[[\s\S]*\]/);
      if (match) highlights = JSON.parse(match[0]);
    } catch {}

    // 保存到数据库
    const report = await this.repo.createExecutiveReport({
      reportType: 'daily',
      reportDate: today,
      title: `MATEYOU CEO日报 ${today.toLocaleDateString('zh-CN')}`,
      industrySection,
      competitorSection,
      researchSection,
      contentSection,
      highlights,
    });

    return { ...report, highlights, industrySection, competitorSection, researchSection, contentSection };
  }

  private async generateSection(title: string, data: string): Promise<string> {
    if (!data.trim()) return `${title}：今日暂无数据`;
    const prompt = `将以下${title}数据整理为简洁的中文摘要（150字以内，要点突出）：\n${data}`;
    const result = await this.qwen.complete(prompt);
    return result || data;
  }

  async pushToWecom(report: any): Promise<boolean> {
    if (!this.wecomWebhook) {
      this.logger.warn('WeCom Webhook未配置，跳过推送');
      return false;
    }

    const today = new Date().toLocaleDateString('zh-CN');
    const highlights = Array.isArray(report.highlights)
      ? report.highlights.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n')
      : '';

    const markdown = `# 📊 MATEYOU CEO日报 ${today}

## 🔑 今日要点
${highlights || '无重大事项'}

## 📰 行业动态
${report.industrySection || '暂无数据'}

## 🔍 竞品动态
${report.competitorSection || '暂无数据'}

## 🔬 医学研究
${report.researchSection || '暂无数据'}

## ✍️ 内容产出
${report.contentSection || '暂无数据'}

---
> 由 MATEYOU AI增长中台自动生成 · ${new Date().toLocaleTimeString('zh-CN')}`;

    try {
      await axios.post(this.wecomWebhook, {
        msgtype: 'markdown',
        markdown: { content: markdown },
      }, { timeout: 10000 });

      // 标记已推送
      if (report.id) {
        await this.repo.markExecutiveReportWecomPushed(report.id);
      }
      return true;
    } catch (err: any) {
      this.logger.error(`WeCom推送失败: ${err.message}`);
      return false;
    }
  }

  async triggerManual() {
    const report = await this.generateDailyBrief();
    const pushed = await this.pushToWecom(report);
    return { ok: true, pushed, reportId: report?.id };
  }

  async getRecentBriefs(limit = 7) {
    return this.repo.listExecutiveReports('daily', limit);
  }
}
