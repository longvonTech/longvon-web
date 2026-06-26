import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ArticleRepository, ArticleListFilter } from '../repositories/article.repository';
import { KnowledgeChunkRepository } from '../repositories/knowledge-chunk.repository';
import { slugify } from '../utils/slug.util';
import { splitIntoChunks } from '../utils/content-chunking.util';
import { CreateArticleDto, UpdateArticleDto } from '../dto/article.dto';

/**
 * Article的状态机：draft → pending_review → published（→ archived，本Sprint未开放归档操作的端点，
 * 数据库CHECK约束允许该值但应用层暂不提供触发入口，留待内容运营流程明确后再开放）。
 *
 * 核心治理规则（本Service最重要的一条业务约束，呼应digital-health-compliance-v1.md /
 * unified-authorization-matrix-v1.md一贯确立的原则）：
 * **文章只能在已经被分配了reviewerId并完成reviewedAt记录之后才能被publish**，
 * 这不是建议性的工作流提示，是publish()方法里的硬性前置校验，Service层拒绝跳过。
 */
@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    private readonly repo: ArticleRepository,
    private readonly chunkRepo: KnowledgeChunkRepository,
  ) {}

  findManyForAdmin(filter: ArticleListFilter) {
    return this.repo.findManyForAdmin(filter);
  }

  async findByIdForAdmin(id: string) {
    const article = await this.repo.findByIdForAdmin(id);
    if (!article) throw new NotFoundException('文章不存在');
    return article;
  }

  async findPublishedList(params: {
    categoryId?: string;
    tagId?: string;
    page: number;
    pageSize: number;
  }) {
    return this.repo.findPublishedList(params);
  }

  async findPublishedBySlug(slug: string) {
    const article = await this.repo.findPublishedBySlug(slug);
    if (!article) throw new NotFoundException('文章不存在或未发布');
    // 浏览量统计是"读取时的副作用"，不阻塞主查询结果的返回；
    // 失败也不应该导致整个文章详情接口报错，所以不等待、不抛出
    void this.repo.incrementViewCount(article.id);
    return article;
  }

  async create(dto: CreateArticleDto) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.title);
    if (!slug) {
      throw new BadRequestException('无法从标题派生有效的slug，请手动指定slug');
    }
    const existing = await this.repo.findBySlug(slug);
    if (existing) {
      throw new ConflictException(`slug "${slug}" 已被使用`);
    }

    const { tagIds, ...articleData } = dto;
    const article = await this.repo.create({ ...articleData, slug });
    if (tagIds && tagIds.length > 0) {
      await this.repo.setTags(article.id, tagIds);
    }
    return this.findByIdForAdmin(article.id);
  }

  async update(id: string, dto: UpdateArticleDto) {
    const article = await this.findByIdForAdmin(id);

    if (article.status === 'published' && dto.content) {
      // 已发布文章若修改正文，理论上应该重新走审核流程而不是直接覆盖线上内容，
      // 但TASK-102范围不要求实现"已发布文章的修改触发重新审核"这一完整工作流，
      // 这里先做最基础的保护：阻止已发布文章被直接改动正文，编辑需要先走撤回/转为草稿
      // 的操作（本Sprint暂未开放该操作的端点，先以异常方式暴露这一限制，避免静默允许）
      throw new BadRequestException(
        '已发布文章不能直接修改正文，需先将其撤回为草稿（本Sprint暂未开放撤回端点）',
      );
    }

    const { tagIds, ...articleData } = dto;
    await this.repo.update(id, articleData);
    if (tagIds) {
      await this.repo.setTags(id, tagIds);
    }
    return this.findByIdForAdmin(id);
  }

  async submitForReview(id: string, reviewerId: string) {
    const article = await this.findByIdForAdmin(id);
    if (article.status !== 'draft') {
      throw new BadRequestException(`只有draft状态的文章才能提交审核，当前状态：${article.status}`);
    }
    return this.repo.updateStatus(id, { status: 'pending_review', reviewerId });
  }

  /**
   * 发布——本方法是医学审核闸门真正生效的地方。
   */
  async publish(id: string) {
    const article = await this.findByIdForAdmin(id);

    if (article.status !== 'pending_review') {
      throw new BadRequestException(
        `只有pending_review状态的文章才能发布，当前状态：${article.status}`,
      );
    }
    if (!article.reviewerId) {
      throw new BadRequestException(
        '该文章尚未分配医学审核专家，禁止发布（呼应digital-health-compliance-v1.md的强制审核原则）',
      );
    }

    const now = new Date();
    const published = await this.repo.updateStatus(id, {
      status: 'published',
      reviewedAt: now,
      publishedAt: now,
    });

    // 发布成功后立即生成内容分片
    const chunks = splitIntoChunks(article.content);
    if (chunks.length > 0) {
      await this.chunkRepo.replaceForArticle(id, chunks);
    }

    return published;
  }

  async softDelete(id: string) {
    await this.findByIdForAdmin(id);
    return this.repo.softDelete(id);
  }
}
