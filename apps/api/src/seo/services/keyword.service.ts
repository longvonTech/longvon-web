import { Injectable, NotFoundException } from '@nestjs/common';
import { KeywordClusterRepository, SEOKeywordRepository } from '../repositories/keyword.repository';
import { TopicRepository } from '../../knowledge/repositories/topic.repository';
import { ArticleRepository } from '../../knowledge/repositories/article.repository';
import { CreateKeywordClusterDto, UpdateKeywordClusterDto } from '../dto/keyword-cluster.dto';
import { CreateSeoKeywordDto } from '../dto/seo-keyword.dto';

@Injectable()
export class KeywordClusterService {
  constructor(
    private readonly repo: KeywordClusterRepository,
    private readonly topicRepo: TopicRepository,
  ) {}

  findAll() {
    return this.repo.findAll();
  }

  async findById(id: string) {
    const cluster = await this.repo.findById(id);
    if (!cluster) throw new NotFoundException('关键词集群不存在');
    return cluster;
  }

  async create(dto: CreateKeywordClusterDto) {
    if (dto.hubTopicId) {
      const topic = await this.topicRepo.findById(dto.hubTopicId);
      if (!topic) throw new NotFoundException('指定的Hub专题不存在');
    }
    return this.repo.create(dto);
  }

  async update(id: string, dto: UpdateKeywordClusterDto) {
    await this.findById(id);
    return this.repo.update(id, dto);
  }
}

@Injectable()
export class SeoKeywordService {
  constructor(
    private readonly repo: SEOKeywordRepository,
    private readonly articleRepo: ArticleRepository,
  ) {}

  findAll(filter?: { clusterId?: string; status?: string }) {
    return this.repo.findAll(filter);
  }

  create(dto: CreateSeoKeywordDto) {
    return this.repo.create(dto);
  }

  async linkToArticle(id: string, articleId: string) {
    const article = await this.articleRepo.findByIdForAdmin(articleId);
    if (!article) throw new NotFoundException('文章不存在');
    return this.repo.linkToArticle(id, articleId);
  }

  reject(id: string) {
    return this.repo.updateStatus(id, 'rejected');
  }
}
