import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TopicRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.topic.findMany({ orderBy: { name: 'asc' } });
  }

  /**
   * Topic Hub页面所需的查询：专题本身信息 + 已发布文章列表（按topic_articles.sort_order排序）。
   * 呼应seo-content-ux-v1.md第3部分"按子主题分组"的结构——本Sprint先实现基础排序，
   * 子主题分组的具体分组逻辑依赖health-knowledge-graph-v1.md的图谱关系，
   * 而KnowledgeGraphNode/Edge的运营管理界面不在TASK-102范围内，分组逻辑留待后续Sprint。
   */
  findBySlugWithArticles(slug: string) {
    return this.prisma.topic.findFirst({
      where: { slug },
      include: {
        topicArticles: {
          orderBy: { sortOrder: 'asc' },
          include: {
            article: {
              include: { author: true, category: true },
            },
          },
        },
      },
    });
  }

  findById(id: string) {
    return this.prisma.topic.findUnique({ where: { id } });
  }

  create(data: { name: string; slug: string; description?: string; coverImage?: string }) {
    return this.prisma.topic.create({ data });
  }

  update(id: string, data: Partial<{ name: string; description: string; coverImage: string }>) {
    return this.prisma.topic.update({ where: { id }, data });
  }

  addArticle(topicId: string, articleId: string, sortOrder = 0) {
    return this.prisma.topicArticle.upsert({
      where: { topicId_articleId: { topicId, articleId } },
      create: { topicId, articleId, sortOrder },
      update: { sortOrder },
    });
  }

  removeArticle(topicId: string, articleId: string) {
    return this.prisma.topicArticle.delete({
      where: { topicId_articleId: { topicId, articleId } },
    });
  }

  /**
   * 反向查询：给定一篇文章，找到它所属的全部专题。
   * 供internal-linking.service.ts的Hub链接推导使用。
   */
  findTopicsByArticleId(articleId: string) {
    return this.prisma.topicArticle.findMany({
      where: { articleId },
      include: { topic: true },
    });
  }
}
