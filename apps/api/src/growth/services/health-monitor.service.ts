import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GrowthRepository } from '../repositories/growth.repository';
import { PrismaService } from '../../database/prisma.service';
import axios from 'axios';

@Injectable()
export class HealthMonitorService {
  private readonly logger = new Logger(HealthMonitorService.name);
  private readonly wecomWebhook = process.env.WECOM_WEBHOOK_URL ?? '';

  constructor(
    private readonly repo: GrowthRepository,
    private readonly prisma: PrismaService,
  ) {}

  // 每天早上9:30检查系统健康状态
  @Cron('30 9 * * *')
  async runHealthCheck() {
    this.logger.log('🏥 系统健康检查启动');
    const alerts: string[] = [];
    const now = new Date();
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const since48h = new Date(Date.now() - 48 * 60 * 60 * 1000);

    // 检查1: 行业情报是否正常采集
    const eventsToday = await this.repo.countIndustryEvents(since24h);
    if (eventsToday === 0) {
      alerts.push('🔴 【严重】行业情报引擎停止：今日0条新事件，请检查爬虫服务');
    } else if (eventsToday < 10) {
      alerts.push(`🟡 【警告】行业情报偏少：今日仅${eventsToday}条，可能爬虫部分失败`);
    }

    // 检查2: 文章是否正常发布
    const publishedToday = await this.prisma.article.count({
      where: { status: 'published', publishedAt: { gte: since24h } } as any,
    });
    const publishedYesterday = await this.prisma.article.count({
      where: { status: 'published', publishedAt: { gte: since48h, lt: since24h } } as any,
    });
    if (publishedToday === 0 && publishedYesterday === 0) {
      alerts.push('🔴 【严重】内容工厂停止：连续48小时无新文章发布');
    } else if (publishedToday === 0) {
      alerts.push('🟡 【警告】今日尚无新文章发布，请关注11点内容工厂运行情况');
    }

    // 检查3: 简报积压
    const pendingBriefs = await this.repo.countContentBriefs('pending');
    if (pendingBriefs > 20) {
      alerts.push(`🟡 【警告】内容简报积压${pendingBriefs}条，内容工厂消化速度不足`);
    }

    // 检查4: 关键词库是否在增长
    const totalKeywords = await this.repo.countKeywordOpportunities();
    if (totalKeywords < 100) {
      alerts.push(`🟡 【警告】关键词库仅${totalKeywords}个，建议每周触发关键词发现`);
    }

    // 检查5: API健康
    try {
      const apiHealth = await axios.get('http://localhost:4000/growth/dashboard/stats', {
        timeout: 5000,
      });
      if (apiHealth.status !== 200) alerts.push('🔴 【严重】Growth API响应异常');
    } catch {
      alerts.push('🔴 【严重】Growth API无响应，请立即检查mateyou-api进程');
    }

    // 发送告警
    if (alerts.length > 0) {
      await this.sendAlert(alerts);
    } else {
      this.logger.log('✅ 系统健康检查通过，无异常');
      // 每周一发送健康报告
      if (now.getDay() === 1) {
        await this.sendWeeklyHealthReport();
      }
    }
  }

  private async sendAlert(alerts: string[]) {
    const msg = `## ⚠️ MATEYOU运营系统健康预警\n\n${alerts.map((a) => `- ${a}`).join('\n')}\n\n> ${new Date().toLocaleString('zh-CN')} 自动检测`;
    this.logger.warn(`健康预警: ${alerts.join('; ')}`);
    if (this.wecomWebhook) {
      await axios
        .post(
          this.wecomWebhook,
          {
            msgtype: 'markdown',
            markdown: { content: msg },
          },
          { timeout: 10000 },
        )
        .catch((e) => this.logger.error(`WeCom推送失败: ${e.message}`));
    }
  }

  private async sendWeeklyHealthReport() {
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [published, keywords, events] = await Promise.all([
      this.prisma.article.count({
        where: { status: 'published', publishedAt: { gte: since7d } } as any,
      }),
      this.repo.countKeywordOpportunities(),
      this.repo.countIndustryEvents(since7d),
    ]);

    const msg = `## 📊 MATEYOU运营周报\n\n- 本周新发布文章：**${published}篇**\n- 关键词库总量：**${keywords}个**\n- 本周情报采集：**${events}条**\n\n> 系统运行正常 ✅`;
    if (this.wecomWebhook) {
      await axios
        .post(
          this.wecomWebhook,
          {
            msgtype: 'markdown',
            markdown: { content: msg },
          },
          { timeout: 10000 },
        )
        .catch(() => {});
    }
  }

  async triggerManual() {
    return this.runHealthCheck();
  }
}
