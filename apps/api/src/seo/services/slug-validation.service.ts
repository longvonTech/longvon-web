import { Injectable } from '@nestjs/common';
import { ArticleRepository } from '../../knowledge/repositories/article.repository';
import { TopicRepository } from '../../knowledge/repositories/topic.repository';
import { CategoryRepository, TagRepository } from '../../knowledge/repositories/reference-data.repository';
import { isValidSlugFormat } from '../../knowledge/utils/slug.util';

export type SlugEntityType = 'article' | 'topic' | 'category' | 'tag';

export interface SlugValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * 跨实体的Slug校验服务。
 * 各实体的slug在数据库层各自是独立的UNIQUE约束（不同实体走不同URL前缀，
 * /knowledge/[slug] vs /topics/[slug]，技术上不需要全站唯一），
 * 但仍提供统一的校验入口，方便后台编辑器在用户输入slug时即时校验，
 * 不用等表单提交后才从数据库错误里解析出"slug重复"这个信息。
 */
@Injectable()
export class SlugValidationService {
  constructor(
    private readonly articleRepo: ArticleRepository,
    private readonly topicRepo: TopicRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly tagRepo: TagRepository,
  ) {}

  async validate(entityType: SlugEntityType, slug: string): Promise<SlugValidationResult> {
    if (!isValidSlugFormat(slug)) {
      return {
        valid: false,
        reason: 'slug格式不合法，只能包含小写字母、数字与短横线，且不能以短横线开头或结尾',
      };
    }

    const existing = await this.findExisting(entityType, slug);
    if (existing) {
      return { valid: false, reason: `slug "${slug}" 已被使用` };
    }

    return { valid: true };
  }

  private findExisting(entityType: SlugEntityType, slug: string) {
    switch (entityType) {
      case 'article':
        return this.articleRepo.findBySlug(slug);
      case 'topic':
        return this.topicRepo.findBySlugWithArticles(slug);
      case 'category':
        return this.categoryRepo.findBySlug(slug);
      case 'tag':
        return this.tagRepo.findBySlug(slug);
    }
  }
}
