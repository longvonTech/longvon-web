import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { GrowthRepository } from '../repositories/growth.repository';
import { IntelligenceService } from '../services/intelligence.service';
import { KeywordService } from '../services/keyword.service';
import { ContentStrategyService } from '../services/content-strategy.service';
import { ContentFactoryService } from '../services/content-factory.service';
import { ImagePromptService } from '../services/image-prompt.service';
import { PublishingService } from '../services/publishing.service';
import { SeoIntelligenceService } from '../services/seo-intelligence.service';
import { SeoOptimizerService } from '../services/seo-optimizer.service';
import { HealthMonitorService } from '../services/health-monitor.service';
import { ExecutiveBriefService } from '../services/executive-brief.service';

@Controller('growth')
export class GrowthController {
  constructor(
    private readonly repo: GrowthRepository,
    private readonly intelligence: IntelligenceService,
    private readonly keyword: KeywordService,
    private readonly contentStrategy: ContentStrategyService,
    private readonly contentFactory: ContentFactoryService,
    private readonly imagePrompt: ImagePromptService,
    private readonly publishing: PublishingService,
    private readonly seoIntelligence: SeoIntelligenceService,
    private readonly executiveBrief: ExecutiveBriefService,
    private readonly seoOptimizer: SeoOptimizerService,
    private readonly healthMonitor: HealthMonitorService,
  ) {}

  @Get('dashboard/stats')
  getDashboardStats() {
    return this.repo.getDashboardStats();
  }

  @Post('industry/events')
  createIndustryEvent(@Body() dto: any) {
    return this.repo.createIndustryEvent(dto);
  }

  @Get('industry/events')
  listIndustryEvents(
    @Query('topic') topic?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
  ) {
    return this.repo.listIndustryEvents({ topic, status, limit: limit ? parseInt(limit) : 50 });
  }

  @Put('industry/events/:id/status')
  updateIndustryEventStatus(@Param('id') id: string, @Body() body: any) {
    return this.repo.updateIndustryEventStatus(id, body.status, body.aiSummary);
  }

  @Get('industry/reports')
  listIndustryReports(@Query('type') type?: string, @Query('limit') limit?: string) {
    return this.repo.listIndustryReports(type, limit ? parseInt(limit) : 20);
  }

  @Put('industry/reports/:id/publish')
  publishIndustryReport(@Param('id') id: string) {
    return this.repo.publishIndustryReport(id);
  }

  @Post('competitor/events')
  createCompetitorEvent(@Body() dto: any) {
    return this.repo.createCompetitorEvent(dto);
  }

  @Get('competitor/events')
  listCompetitorEvents(
    @Query('competitor') competitor?: string,
    @Query('eventType') eventType?: string,
    @Query('limit') limit?: string,
  ) {
    return this.repo.listCompetitorEvents({
      competitor,
      eventType,
      limit: limit ? parseInt(limit) : 50,
    });
  }

  @Get('competitor/reports')
  listCompetitorReports(@Query('competitor') competitor?: string, @Query('limit') limit?: string) {
    return this.repo.listCompetitorReports(competitor, limit ? parseInt(limit) : 20);
  }

  @Post('research/papers')
  createResearchPaper(@Body() dto: any) {
    return this.repo.createResearchPaper(dto);
  }

  @Get('research/papers')
  listResearchPapers(
    @Query('topic') topic?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
  ) {
    return this.repo.listResearchPapers({ topic, status, limit: limit ? parseInt(limit) : 50 });
  }

  @Get('research/reports')
  listResearchReports(@Query('topic') topic?: string, @Query('limit') limit?: string) {
    return this.repo.listResearchReports(topic, limit ? parseInt(limit) : 20);
  }

  @Post('keywords/opportunities')
  createKeywordOpportunity(@Body() dto: any) {
    return this.repo.createKeywordOpportunity(dto);
  }

  @Get('keywords/opportunities')
  listKeywordOpportunities(
    @Query('priority') priority?: string,
    @Query('status') status?: string,
    @Query('cluster') cluster?: string,
    @Query('limit') limit?: string,
  ) {
    return this.repo.listKeywordOpportunities({
      priority,
      status,
      cluster,
      limit: limit ? parseInt(limit) : 100,
    });
  }

  @Post('content/briefs')
  createContentBrief(@Body() dto: any) {
    return this.repo.createContentBrief(dto);
  }

  @Get('content/briefs')
  listContentBriefs(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('contentType') contentType?: string,
    @Query('limit') limit?: string,
  ) {
    return this.repo.listContentBriefs({
      status,
      priority,
      contentType,
      limit: limit ? parseInt(limit) : 50,
    });
  }

  @Put('content/briefs/:id/status')
  updateContentBriefStatus(@Param('id') id: string, @Body() body: any) {
    return this.repo.updateContentBriefStatus(id, body.status);
  }

  @Get('executive/reports')
  listExecutiveReports(@Query('type') type?: string, @Query('limit') limit?: string) {
    return this.repo.listExecutiveReports(type, limit ? parseInt(limit) : 30);
  }

  @Get('executive/reports/latest/:type')
  getLatestExecutiveReport(@Param('type') type: string) {
    return this.repo.getLatestExecutiveReport(type);
  }

  // ── 手动触发情报引擎 ───────────────────────────────────
  @Post('intelligence/trigger/:engine')
  triggerIntelligence(@Param('engine') engine: any) {
    return this.intelligence.triggerManual(engine).then(() => ({ ok: true, engine }));
  }

  // ── F5 关键词发现 ──────────────────────────────────────
  @Post('keywords/discover')
  discoverKeywords() {
    return this.keyword.triggerManual().then(() => ({ ok: true }));
  }

  // ── F6 内容策略 ────────────────────────────────────────
  @Post('content/strategy/run')
  runContentStrategy() {
    return this.contentStrategy.triggerManual().then(() => ({ ok: true }));
  }

  // ── F7 AI内容工厂 ─────────────────────────────────────
  @Post('content/factory/run')
  runContentFactory() {
    return this.contentFactory.triggerManual().then(() => ({ ok: true }));
  }

  @Post('content/factory/brief/:id')
  generateFromBrief(@Param('id') id: string) {
    return this.contentFactory.triggerManual(id).then((articleId) => ({ ok: true, articleId }));
  }

  @Get('content/drafts')
  listDrafts(@Query('limit') limit?: string) {
    return this.contentFactory.listDrafts(limit ? parseInt(limit) : 20);
  }

  // ── F8 图片Prompt工厂 ─────────────────────────────────
  @Post('content/image-prompts/:articleId')
  generateImagePrompts(@Param('articleId') articleId: string) {
    return this.imagePrompt.generatePromptsForArticle(articleId);
  }

  @Post('content/image-prompts/batch/run')
  generateImagePromptsBatch() {
    return this.imagePrompt.generatePromptsForDrafts();
  }

  // ── F9 发布中心 ────────────────────────────────────────
  @Get('publishing/queue')
  getPublishingQueue() {
    return this.publishing.getPublishingQueue();
  }

  @Get('publishing/stats')
  getPublishingStats() {
    return this.publishing.getPublishingStats();
  }

  @Post('publishing/publish/:articleId')
  publishArticle(@Param('articleId') articleId: string) {
    return this.publishing.publishArticle(articleId);
  }

  @Post('publishing/batch')
  batchPublish(@Body() body: { articleIds: string[] }) {
    return this.publishing.batchPublish(body.articleIds);
  }

  @Post('publishing/unpublish/:articleId')
  unpublishArticle(@Param('articleId') articleId: string) {
    return this.publishing.unpublishArticle(articleId);
  }

  // ── F10 SEO智能分析 ───────────────────────────────────
  @Post('seo/report/run')
  runSeoReport() {
    return this.seoIntelligence.triggerManual().then(() => ({ ok: true }));
  }

  @Post('seo/optimize/:articleId')
  optimizeArticle(@Param('articleId') articleId: string) {
    return this.seoIntelligence.generateSeoOptimizationReport(articleId);
  }

  // ── F11 CEO日报 + WeCom推送 ───────────────────────────
  @Post('executive/brief/run')
  runExecutiveBrief() {
    return this.executiveBrief.triggerManual();
  }

  @Get('executive/briefs/recent')
  getRecentBriefs(@Query('limit') limit?: string) {
    return this.executiveBrief.getRecentBriefs(limit ? parseInt(limit) : 7);
  }

  // ── SEO自动优化 ────────────────────────────────────────
  @Post('seo/optimizer/run')
  runSeoOptimizer(@Query('type') type?: string) {
    return this.seoOptimizer.triggerManual((type as any) || 'all');
  }

  // ── 系统健康监控 ──────────────────────────────────────
  @Post('system/health/check')
  runHealthCheck() {
    return this.healthMonitor.triggerManual().then(() => ({ ok: true }));
  }
}
