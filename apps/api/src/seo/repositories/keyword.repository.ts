import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class KeywordClusterRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.keywordCluster.findMany({
      include: { hubTopic: true },
      orderBy: { rootKeyword: 'asc' },
    });
  }

  findById(id: string) {
    return this.prisma.keywordCluster.findUnique({
      where: { id },
      include: { hubTopic: true, seoKeywords: true },
    });
  }

  /**
   * Internal Linking Engine的关键查询：给定一个Topic，找到以它为Hub的KeywordCluster。
   * 这是"Keyword Cluster → Topic"这一段链路在代码里的具体体现
   * （呼应health-knowledge-graph-v1.md的Topic Cluster设计：一个Cluster以一个Topic为Hub）。
   */
  findByHubTopicId(topicId: string) {
    return this.prisma.keywordCluster.findFirst({ where: { hubTopicId: topicId } });
  }

  create(data: { rootKeyword: string; hubTopicId?: string; description?: string }) {
    return this.prisma.keywordCluster.create({ data });
  }

  update(
    id: string,
    data: Partial<{ rootKeyword: string; hubTopicId: string; description: string }>,
  ) {
    return this.prisma.keywordCluster.update({ where: { id }, data });
  }
}

@Injectable()
export class SEOKeywordRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filter?: { clusterId?: string; status?: string }) {
    return this.prisma.seoKeyword.findMany({
      where: {
        clusterId: filter?.clusterId,
        status: filter?.status,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.seoKeyword.findUnique({ where: { id } });
  }

  create(data: {
    keyword: string;
    searchVolume?: number;
    competitionScore?: number;
    trend?: string;
    recommendationLevel?: string;
    clusterId?: string;
    linkedArticleId?: string;
  }) {
    // status默认'discovered'（Prisma Schema层默认值），本Sprint手工创建的关键词
    // 同样从'discovered'状态开始，与未来Agent自动发现的关键词共用同一套状态机，
    // 不因为是人工录入就跳过状态流转
    return this.prisma.seoKeyword.create({ data });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.seoKeyword.update({ where: { id }, data: { status } });
  }

  linkToArticle(id: string, articleId: string) {
    return this.prisma.seoKeyword.update({
      where: { id },
      data: { linkedArticleId: articleId, status: 'in_use' },
    });
  }
}
