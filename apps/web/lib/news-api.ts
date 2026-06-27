import { apiFetch } from './api-client';

export type NewsMediaItem = {
  type: 'image' | 'video';
  url: string;
  caption?: string;
};

export type NewsListItem = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  coverImage: string | null;
  videoUrl: string | null;
  publishedAt: string | null;
};

export type NewsDetail = NewsListItem & {
  content: string;
  media: NewsMediaItem[];
  status: string;
  createdAt: string;
  updatedAt: string;
};

export async function listPublishedNews(): Promise<NewsListItem[]> {
  return apiFetch<NewsListItem[]>('/news');
}

export async function getPublishedNews(slug: string): Promise<NewsDetail> {
  return apiFetch<NewsDetail>(`/news/${slug}`);
}
