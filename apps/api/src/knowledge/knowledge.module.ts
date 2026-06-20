import { Module } from '@nestjs/common';
import {
  CategoryRepository,
  TagRepository,
  AuthorRepository,
  MedicalReviewerRepository,
} from './repositories/reference-data.repository';
import { TopicRepository } from './repositories/topic.repository';
import { ArticleRepository } from './repositories/article.repository';
import { KnowledgeChunkRepository } from './repositories/knowledge-chunk.repository';
import {
  CategoryService,
  TagService,
  AuthorService,
  MedicalReviewerService,
} from './services/reference-data.service';
import { TopicService } from './services/topic.service';
import { ArticleService } from './services/article.service';
import {
  CategoryAdminController,
  TagAdminController,
  AuthorAdminController,
  MedicalReviewerAdminController,
} from './controllers/admin/reference-data-admin.controller';
import { TopicAdminController } from './controllers/admin/topic-admin.controller';
import { ArticleAdminController } from './controllers/admin/article-admin.controller';
import { KnowledgePublicController } from './controllers/public/knowledge-public.controller';

// 呼应TASK-102范围声明：本模块仅实现Knowledge Domain
// （Categories/Tags/Articles/Topics/Authors/MedicalReviewers/ArticleTags/TopicArticles/
// KnowledgeChunks），不依赖也不引用Assessment/AI Assistant/Membership/CRM/Partner
// 任何模块——Article.sourceAgentTaskId / reviewedAssessments等Prisma Schema里
// 已存在但跨域的字段/反向关系，本模块代码完全不触碰，避免范围蔓延。
@Module({
  controllers: [
    CategoryAdminController,
    TagAdminController,
    AuthorAdminController,
    MedicalReviewerAdminController,
    TopicAdminController,
    ArticleAdminController,
    KnowledgePublicController,
  ],
  providers: [
    CategoryRepository,
    TagRepository,
    AuthorRepository,
    MedicalReviewerRepository,
    TopicRepository,
    ArticleRepository,
    KnowledgeChunkRepository,
    CategoryService,
    TagService,
    AuthorService,
    MedicalReviewerService,
    TopicService,
    ArticleService,
  ],
  // 导出Repository（而非Service）供SeoModule复用：Internal Linking Engine与
  // Slug Validation需要的是"按slug/articleId查数据"这类纯数据访问能力，
  // 不需要ArticleService/TopicService里附带的状态机校验等业务规则，
  // 按需导出最小必要的依赖面，而不是把整个Knowledge模块的Service都暴露出去。
  exports: [ArticleRepository, TopicRepository, CategoryRepository, TagRepository],
})
export class KnowledgeModule {}
