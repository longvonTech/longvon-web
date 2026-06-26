import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class GrowthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createIndustryEvent(data: any) {
    return this.prisma.industryEvent.create({ data });
  }
  async listIndustryEvents(f: any) {
    return this.prisma.industryEvent.findMany({
      where: { ...(f.topic && { topic: f.topic }), ...(f.status && { status: f.status }) },
      orderBy: { crawledAt: 'desc' },
      take: f.limit ?? 50,
    });
  }
  async updateIndustryEventStatus(id: string, status: string, aiSummary?: string) {
    return this.prisma.industryEvent.update({
      where: { id },
      data: { status, ...(aiSummary && { aiSummary }) },
    });
  }
  async countIndustryEvents(since: Date, topic?: string) {
    return this.prisma.industryEvent.count({
      where: { crawledAt: { gte: since }, ...(topic && { topic }), status: { not: 'excluded' } },
    });
  }
  async createIndustryReport(data: any) {
    return this.prisma.industryReport.create({ data });
  }
  async listIndustryReports(reportType?: string, limit = 20) {
    return this.prisma.industryReport.findMany({
      where: { ...(reportType && { reportType }) },
      orderBy: { generatedAt: 'desc' },
      take: limit,
    });
  }
  async publishIndustryReport(id: string) {
    return this.prisma.industryReport.update({
      where: { id },
      data: { status: 'published', publishedAt: new Date() },
    });
  }
  async createCompetitorEvent(data: any) {
    return this.prisma.competitorEvent.create({ data });
  }
  async listCompetitorEvents(f: any) {
    return this.prisma.competitorEvent.findMany({
      where: {
        ...(f.competitor && { competitor: f.competitor }),
        ...(f.eventType && { eventType: f.eventType }),
        status: { not: 'excluded' },
      },
      orderBy: { crawledAt: 'desc' },
      take: f.limit ?? 50,
    });
  }
  async countCompetitorEvents(since: Date, competitor?: string) {
    return this.prisma.competitorEvent.count({
      where: {
        crawledAt: { gte: since },
        ...(competitor && { competitor }),
        status: { not: 'excluded' },
      },
    });
  }
  async createCompetitorReport(data: any) {
    return this.prisma.competitorReport.create({ data });
  }
  async listCompetitorReports(competitor?: string, limit = 20) {
    return this.prisma.competitorReport.findMany({
      where: { ...(competitor && { competitor }) },
      orderBy: { generatedAt: 'desc' },
      take: limit,
    });
  }
  async createResearchPaper(data: any) {
    return this.prisma.researchPaper.create({ data });
  }
  async listResearchPapers(f: any) {
    return this.prisma.researchPaper.findMany({
      where: { ...(f.topic && { topic: f.topic }), ...(f.status && { status: f.status }) },
      orderBy: { crawledAt: 'desc' },
      take: f.limit ?? 50,
    });
  }
  async countResearchPapers(since: Date, topic?: string) {
    return this.prisma.researchPaper.count({
      where: { crawledAt: { gte: since }, ...(topic && { topic }), status: { not: 'excluded' } },
    });
  }
  async createResearchReport(data: any) {
    return this.prisma.researchReport.create({ data });
  }
  async listResearchReports(topic?: string, limit = 20) {
    return this.prisma.researchReport.findMany({
      where: { ...(topic && { topic }) },
      orderBy: { generatedAt: 'desc' },
      take: limit,
    });
  }
  async createKeywordOpportunity(data: any) {
    return this.prisma.keywordOpportunity.create({ data });
  }
  async listKeywordOpportunities(f: any) {
    return this.prisma.keywordOpportunity.findMany({
      where: {
        ...(f.priority && { priority: f.priority }),
        ...(f.status && { status: f.status }),
        ...(f.cluster && { cluster: f.cluster }),
      },
      orderBy: [{ priority: 'asc' }, { discoveredAt: 'desc' }],
      take: f.limit ?? 100,
      include: { contentBriefs: { select: { id: true, status: true } } },
    });
  }
  async countKeywordOpportunities(status?: string) {
    return this.prisma.keywordOpportunity.count({ where: { ...(status && { status }) } });
  }
  async createKeywordReport(data: any) {
    return this.prisma.keywordReport.create({ data });
  }
  async createContentBrief(data: any) {
    return this.prisma.contentBrief.create({ data });
  }
  async listContentBriefs(f: any) {
    return this.prisma.contentBrief.findMany({
      where: {
        ...(f.status && { status: f.status }),
        ...(f.priority && { priority: f.priority }),
        ...(f.contentType && { contentType: f.contentType }),
      },
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
      take: f.limit ?? 50,
      include: { keywordOpportunity: { select: { keyword: true, searchVolume: true } } },
    });
  }
  async updateContentBriefStatus(id: string, status: string, extra?: any) {
    return this.prisma.contentBrief.update({
      where: { id },
      data: { status, updatedAt: new Date(), ...extra },
    });
  }
  async countContentBriefs(status?: string) {
    return this.prisma.contentBrief.count({ where: { ...(status && { status }) } });
  }
  async createExecutiveReport(data: any) {
    return this.prisma.executiveReport.create({ data });
  }
  async listExecutiveReports(reportType?: string, limit = 30) {
    return this.prisma.executiveReport.findMany({
      where: { ...(reportType && { reportType }) },
      orderBy: { reportDate: 'desc' },
      take: limit,
    });
  }
  async getLatestExecutiveReport(reportType: string) {
    return this.prisma.executiveReport.findFirst({
      where: { reportType },
      orderBy: { reportDate: 'desc' },
    });
  }
  async markExecutiveReportWecomPushed(id: string, msgId?: string) {
    return this.prisma.executiveReport.update({
      where: { id },
      data: { wecomPushed: true, wecomPushedAt: new Date(), ...(msgId && { wecomMsgId: msgId }) },
    });
  }
  async getDashboardStats() {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [
      industryEventsToday,
      competitorEventsToday,
      researchPapersWeek,
      keywordTotal,
      contentPending,
      contentDraftReady,
    ] = await Promise.all([
      this.countIndustryEvents(since24h),
      this.countCompetitorEvents(since24h),
      this.countResearchPapers(since7d),
      this.countKeywordOpportunities(),
      this.countContentBriefs('pending'),
      this.countContentBriefs('draft_ready'),
    ]);
    return {
      industryEventsToday,
      competitorEventsToday,
      researchPapersWeek,
      keywordTotal,
      contentPending,
      contentDraftReady,
    };
  }

  async updateKeywordOpportunityStatus(id: string, status: string) {
    return this.prisma.keywordOpportunity.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
  }
}
