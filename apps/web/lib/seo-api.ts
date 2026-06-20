import { apiFetch } from './api-client';

export interface InternalLinkSuggestion {
  type: 'hub' | 'sibling' | 'conversion';
  title: string;
  url: string;
}

export interface InternalLinkingResult {
  articleId: string | null;
  derivedFrom: { clusterRootKeyword: string | null; topicSlug: string | null };
  links: InternalLinkSuggestion[];
  compliance: { hasHubLink: boolean; siblingLinkCount: number; meetsMinimum: boolean } | null;
}

export function getInternalLinksBySlug(slug: string) {
  return apiFetch<InternalLinkingResult>(`/seo/internal-links/by-slug/${slug}`);
}
