'use client';

import { useEffect } from 'react';

/**
 * 文章详情页挂载后上报 1 次阅读（同 slug 在同一标签页会话内去重）。
 */
export function ArticleViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug || typeof window === 'undefined') return;
    const key = `article-view:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      /* private mode 等忽略去重 */
    }

    const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api').replace(/\/$/, '');
    void fetch(`${base}/knowledge/articles/${encodeURIComponent(slug)}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
