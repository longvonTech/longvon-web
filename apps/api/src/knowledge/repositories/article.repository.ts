import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface ArticleListFilter {
  status?: string;
  categoryId?: string;
  tagId?: string;
  page: number;
  pageSize: number;
}

@Injectable()
export class ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 后台用：可按任意status筛选，不限制只看已发布。
   */
  async findManyForAdmin(filter: ArticleListFilter) {
    const where: Record<string, unknown> = { deletedAt: null };
    if (filter.status) where.status = filter.status;
    if (filter.categoryId) where.categoryId = filter.categoryId;
    if (filter.tagId) {
      where.articleTags = { some: { tagId: filter.tagId } };
    }

    const [items, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (filter.page - 1) * filter.pageSize,
        take: filter.pageSize,
        include: { category: true, author: true, reviewer: true },
      }),
      this.prisma.article.count({ where }),
    ]);

    return { items, total };
  }

  /**
   * 公开API用：只能看status='published'的文章，这是Public Controller唯一允许的查询入口，
   * 不暴露一个"status可由调用方任意传入"的公开方法，避免Controller层不小心传错status参数
   * 就让草稿内容对外可见——把"只看已发布"这条规则锁在Repository方法本身里，而不是
   * 依赖每个调用方都记得传对参数。
   */
  async findPublishedList(params: { categoryId?: string; tagId?: string; page: number; pageSize: number }) {
    const where: Record<string, unknown> = { status: 'published', deletedAt: null };
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.tagId) where.articleTags = { some: { tagId: params.tagId } };

    const [items, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
        include: { category: true, author: true },
      }),
      this.prisma.article.count({ where }),
    ]);
    return { items, total };
  }

  findPublishedBySlug(slug: string) {
    return this.prisma.article.findFirst({
      where: { slug, status: 'published', deletedAt: null },
      include: {
        category: true,
        author: true,
        reviewer: true,
        articleTags: { include: { tag: true } },
      },
    });
  }

  findByIdForAdmin(id: string) {
    return this.prisma.article.findFirst({
      where: { id, deletedAt: null },
      include: { category: true, author: true, reviewer: true, articleTags: { include: { tag: true } } },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.article.findUnique({ where: { slug } });
  }

  create(data: {
    title: string;
    slug: string;
    categoryId?: string;
    summary?: string;
    content: string;
    coverImage?: string;
    seoTitle?: string;
    seoKeywords?: string;
    seoDescription?: string;
    authorId?: string;
  }) {
    return this.prisma.article.create({ data });
  }

  update(
    id: string,
    data: Partial<{
      title: string;
      categoryId: string;
      summary: string;
      content: string;
      coverImage: string;
      seoTitle: string;
      seoKeywords: string;
      seoDescription: string;
      authorId: string;
    }>,
  ) {
    return this.prisma.article.update({ where: { id }, data });
  }

  updateStatus(
    id: string,
    data: { status: string; reviewerId?: string; reviewedAt?: Date; publishedAt?: Date },
  ) {
    return this.prisma.article.update({ where: { id }, data });
  }

  softDelete(id: string) {
    return this.prisma.article.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  incrementViewCount(id: string) {
    return this.prisma.article.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  setTags(articleId: string, tagIds: string[]) {
    return this.prisma.$transaction([
      this.prisma.articleTag.deleteMany({ where: { articleId } }),
      this.prisma.articleTag.createMany({
        data: tagIds.map((tagId) => ({ articleId, tagId })),
      }),
    ]);
  }
}
