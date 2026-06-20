import { apiFetch } from './api-client';

// 与后端Public API(knowledge-public.controller.ts)返回结构对应的最小类型声明，
// 只声明页面实际用到的字段，不是对Prisma模型的完整镜像

export interface ArticleSummary {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  category: { name: string; slug: string } | null;
  author: { name: string } | null;
}

export interface ArticleDetail extends ArticleSummary {
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  reviewer: { name: string; credentials: string } | null;
  reviewedAt: string | null;
  articleTags: { tag: { name: string; slug: string } }[];
}

export interface TopicHub {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  topicArticles: { sortOrder: number; article: ArticleSummary }[];
}

export interface AuthorProfile {
  id: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  title: string | null;
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export function listArticles(params?: { categoryId?: string; tagId?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params?.categoryId) query.set('categoryId', params.categoryId);
  if (params?.tagId) query.set('tagId', params.tagId);
  if (params?.page) query.set('page', String(params.page));
  const qs = query.toString();
  return apiFetch<PaginatedResult<ArticleSummary>>(`/knowledge/articles${qs ? `?${qs}` : ''}`);
}

export function getArticleBySlug(slug: string) {
  return apiFetch<ArticleDetail>(`/knowledge/articles/${slug}`);
}

export function getTopicBySlug(slug: string) {
  return apiFetch<TopicHub>(`/knowledge/topics/${slug}`);
}

export function getAuthorById(id: string) {
  return apiFetch<AuthorProfile>(`/knowledge/authors/${id}`);
}
