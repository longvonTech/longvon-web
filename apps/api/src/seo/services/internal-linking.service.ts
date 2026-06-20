import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleRepository } from '../../knowledge/repositories/article.repository';
import { TopicRepository } from '../../knowledge/repositories/topic.repository';
import { KeywordClusterRepository } from '../repositories/keyword.repository';

export interface InternalLinkSuggestion {
  type: 'hub' | 'sibling' | 'conversion';
  title: string;
  url: string;
}

export interface InternalLinkingResult {
  articleId: string;
  derivedFrom: { clusterRootKeyword: string | null; topicSlug: string | null };
  links: InternalLinkSuggestion[];
  compliance: {
    hasHubLink: boolean;
    siblingLinkCount: number;
    meetsMinimum: boolean; // 呼应health-knowledge-graph-v1.md第3部分：每篇文章≥1条链回Hub，≥2条链至同集群文章
  };
}

/**
 * Internal Linking Engine —— TASK-103验收标准要求的
 * "Keyword Cluster → Topic → Article → Internal Link" 完整链路在此落地。
 *
 * 范围边界（重要）：第三类链接"conversion"（呼应health-knowledge-graph-v1.md
 * "≥1条链至转化入口"的要求）本Sprint始终返回空数组——转化入口在当前架构里
 * 指向Assessment Engine或Membership页面，这两个Domain都是TASK-103明确排除的范围。
 * 这里没有删掉这个分类，而是保留空数组+类型声明，让消费方（前端/未来Sprint）
 * 在数据结构上就已经预期这个字段存在，等Assessment/Membership上线后只需要
 * 补充查询逻辑，不需要再额外协调一次数据结构变更。
 */
@Injectable()
export class InternalLinkingService {
  constructor(
    private readonly articleRepo: ArticleRepository,
    private readonly topicRepo: TopicRepository,
    private readonly clusterRepo: KeywordClusterRepository,
  ) {}

  async getSuggestionsForArticle(articleId: string): Promise<InternalLinkingResult> {
    const article = await this.articleRepo.findByIdForAdmin(articleId);
    if (!article) throw new NotFoundException('文章不存在');

    // 第一步：Article → Topic（该文章所属的全部专题）
    const topicLinks = await this.topicRepo.findTopicsByArticleId(articleId);

    const links: InternalLinkSuggestion[] = [];
    let clusterRootKeyword: string | null = null;
    let primaryTopicSlug: string | null = null;

    for (const [index, topicLink] of topicLinks.entries()) {
      const topic = topicLink.topic;
      if (index === 0) primaryTopicSlug = topic.slug;

      // Hub链接：文章链回其所属专题聚合页
      links.push({ type: 'hub', title: topic.name, url: `/topics/${topic.slug}` });

      // 第二步：Topic → KeywordCluster（确认该Topic是否作为某个Cluster的Hub）
      // 这一步是"形成完整链路"要求中最关键的一环——证明Topic与KeywordCluster确实关联，
      // 不是两套孤立的数据
      const cluster = await this.clusterRepo.findByHubTopicId(topic.id);
      if (cluster && index === 0) clusterRootKeyword = cluster.rootKeyword;

      // 第三步：Topic → 同专题下的其他已发布文章（Sibling链接，同集群文章互链）
      const hub = await this.topicRepo.findBySlugWithArticles(topic.slug);
      const siblings = (hub?.topicArticles ?? [])
        .filter((ta) => ta.article.id !== articleId && ta.article.status === 'published')
        .slice(0, 4); // 单个Topic下最多取4条互链建议，避免内链区块过长

      for (const sibling of siblings) {
        links.push({
          type: 'sibling',
          title: sibling.article.title,
          url: `/knowledge/${sibling.article.slug}`,
        });
      }
    }

    // 转化入口链接：本Sprint恒为空，见类顶部说明
    const conversionLinks: InternalLinkSuggestion[] = [];
    links.push(...conversionLinks);

    const hasHubLink = links.some((l) => l.type === 'hub');
    const siblingLinkCount = links.filter((l) => l.type === 'sibling').length;

    return {
      articleId,
      derivedFrom: { clusterRootKeyword, topicSlug: primaryTopicSlug },
      links,
      compliance: {
        hasHubLink,
        siblingLinkCount,
        meetsMinimum: hasHubLink && siblingLinkCount >= 2,
      },
    };
  }
}
