import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GrowthController } from './controllers/growth.controller';
import { GrowthRepository } from './repositories/growth.repository';
import { QwenService } from './services/qwen.service';
import { CrawlerService } from './services/crawler.service';
import { IntelligenceService } from './services/intelligence.service';
import { KeywordService } from './services/keyword.service';
import { ContentStrategyService } from './services/content-strategy.service';
import { ContentFactoryService } from './services/content-factory.service';
import { ImagePromptService } from './services/image-prompt.service';
import { PublishingService } from './services/publishing.service';
import { SeoIntelligenceService } from './services/seo-intelligence.service';
import { ExecutiveBriefService } from './services/executive-brief.service';
import { SeoOptimizerService } from './services/seo-optimizer.service';
import { HealthMonitorService } from './services/health-monitor.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [GrowthController],
  providers: [
    GrowthRepository,
    QwenService,
    CrawlerService,
    IntelligenceService,
    KeywordService,
    ContentStrategyService,
    ContentFactoryService,
    ImagePromptService,
    PublishingService,
    SeoIntelligenceService,
    ExecutiveBriefService,
    SeoOptimizerService,
    HealthMonitorService,
  ],
  exports: [
    GrowthRepository,
    QwenService,
    ContentFactoryService,
    PublishingService,
    ExecutiveBriefService,
    SeoOptimizerService,
    HealthMonitorService,
  ],
})
export class GrowthModule {}
