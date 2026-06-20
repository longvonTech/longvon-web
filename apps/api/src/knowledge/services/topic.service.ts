import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TopicRepository } from '../repositories/topic.repository';
import { slugify } from '../utils/slug.util';
import { CreateTopicDto, UpdateTopicDto } from '../dto/topic.dto';

@Injectable()
export class TopicService {
  constructor(private readonly repo: TopicRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  async getHubBySlug(slug: string) {
    const topic = await this.repo.findBySlugWithArticles(slug);
    if (!topic) throw new NotFoundException('专题不存在');
    // Topic Hub页面只应展示已发布文章，草稿/待审核文章即使被运营提前加入了专题，
    // 也不应该在公开页面里被访客看到——这条过滤放在Service层而不是Repository层，
    // 因为后台管理场景（运营给专题排列文章顺序）需要看到全部状态的文章，
    // 两种场景共用Repository的同一个查询方法，只在面向公开页面的Service方法里做状态过滤。
    return {
      ...topic,
      topicArticles: topic.topicArticles.filter(
        (ta) => ta.article.status === 'published',
      ),
    };
  }

  async getByIdForAdmin(id: string) {
    const topic = await this.repo.findById(id);
    if (!topic) throw new NotFoundException('专题不存在');
    return topic;
  }

  async create(dto: CreateTopicDto) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    if (!slug) throw new ConflictException('无法从名称派生有效的slug，请手动指定slug');
    return this.repo.create({ ...dto, slug });
  }

  async update(id: string, dto: UpdateTopicDto) {
    await this.getByIdForAdmin(id);
    return this.repo.update(id, dto);
  }

  async addArticle(topicId: string, articleId: string, sortOrder?: number) {
    await this.getByIdForAdmin(topicId);
    return this.repo.addArticle(topicId, articleId, sortOrder);
  }

  async removeArticle(topicId: string, articleId: string) {
    await this.getByIdForAdmin(topicId);
    return this.repo.removeArticle(topicId, articleId);
  }
}
