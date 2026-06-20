import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArticleService } from '../../services/article.service';
import { TopicService } from '../../services/topic.service';
import { AuthorService, CategoryService, TagService } from '../../services/reference-data.service';

/**
 * 公开端点，不挂JwtAuthGuard——呼应homepage-information-architecture-v1.md /
 * seo-content-ux-v1.md，知识库内容本身是面向匿名访客的SEO获客入口，不能要求登录才能看。
 * 本Controller是Public API与Admin API边界的唯一交汇点：所有方法只能调用
 * Service里"只返回已发布内容"的方法，不接受status等参数，从入口处就排除了
 * 把草稿内容暴露给公开页面的可能性。
 */
@Controller('knowledge')
export class KnowledgePublicController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly topicService: TopicService,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
    private readonly authorService: AuthorService,
  ) {}

  @Get('categories')
  listCategories() {
    return this.categoryService.findAll();
  }

  @Get('tags')
  listTags() {
    return this.tagService.findAll();
  }

  @Get('articles')
  listArticles(
    @Query('categoryId') categoryId?: string,
    @Query('tagId') tagId?: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.articleService.findPublishedList({
      categoryId,
      tagId,
      page: parseInt(page, 10) || 1,
      pageSize: Math.min(parseInt(pageSize, 10) || 20, 50),
    });
  }

  @Get('articles/:slug')
  getArticle(@Param('slug') slug: string) {
    return this.articleService.findPublishedBySlug(slug);
  }

  @Get('topics')
  listTopics() {
    return this.topicService.findAll();
  }

  @Get('topics/:slug')
  getTopic(@Param('slug') slug: string) {
    return this.topicService.getHubBySlug(slug);
  }

  @Get('authors/:id')
  getAuthor(@Param('id') id: string) {
    return this.authorService.findById(id);
  }
}
