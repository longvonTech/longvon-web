import { Module } from '@nestjs/common';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { KeywordClusterRepository, SEOKeywordRepository } from './repositories/keyword.repository';
import { KeywordClusterService, SeoKeywordService } from './services/keyword.service';
import { InternalLinkingService } from './services/internal-linking.service';
import { SlugValidationService } from './services/slug-validation.service';
import { BaiduPushService } from './services/baidu-push.service';
import { KeywordClusterAdminController, SeoKeywordAdminController } from './controllers/admin/keyword-admin.controller';
import { SeoToolsAdminController } from './controllers/admin/seo-tools-admin.controller';
import { SeoPublicController } from './controllers/public/seo-public.controller';

// 呼应TASK-103验收标准："Knowledge Domain 与 SEO Domain 打通"——
// 本模块通过import KnowledgeModule直接复用其导出的ArticleRepository/TopicRepository/
// CategoryRepository/TagRepository，不是把Knowledge的数据再复制一份到SEO模块自己的表里，
// 这是"打通"在代码架构层面最直接的体现：两个Domain共享同一套Article/Topic数据源，
// SEO模块只新增KeywordCluster/SEOKeyword这两个SEO专属实体的访问层。
@Module({
  imports: [KnowledgeModule],
  controllers: [
    KeywordClusterAdminController,
    SeoKeywordAdminController,
    SeoToolsAdminController,
    SeoPublicController,
  ],
  providers: [
    KeywordClusterRepository,
    SEOKeywordRepository,
    KeywordClusterService,
    SeoKeywordService,
    InternalLinkingService,
    SlugValidationService,
    BaiduPushService,
  ],
  exports: [InternalLinkingService, BaiduPushService],
})
export class SeoModule {}
