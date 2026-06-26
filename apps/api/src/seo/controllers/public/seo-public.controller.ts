import { Controller, Get, Param } from '@nestjs/common';
import { InternalLinkingService } from '../../services/internal-linking.service';
import { ArticleRepository } from '../../../knowledge/repositories/article.repository';

/**
 * 公开端点，不挂JwtAuthGuard——内链建议是渲染在公开文章页面上的内容，
 * 与knowledge-public.controller.ts的访客可见性原则一致。
 */
@Controller('seo')
export class SeoPublicController {
  constructor(
    private readonly internalLinking: InternalLinkingService,
    private readonly articleRepo: ArticleRepository,
  ) {}

  @Get('internal-links/by-slug/:slug')
  async getInternalLinksBySlug(@Param('slug') slug: string) {
    const article = await this.articleRepo.findPublishedBySlug(slug);
    if (!article) {
      // 与knowledge-public.controller.ts一致的"不存在/未发布"语义，
      // 不单独区分"slug不存在"与"slug存在但未发布"两种情况，
      // 避免向未鉴权的公开端点泄露"这个slug其实存在，只是还没发布"这类信息
      return {
        articleId: null,
        derivedFrom: { clusterRootKeyword: null, topicSlug: null },
        links: [],
        compliance: null,
      };
    }
    return this.internalLinking.getSuggestionsForArticle(article.id);
  }
}
