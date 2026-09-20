import Link from 'next/link';
import type { ArticleSummary } from '../lib/knowledge-api';
import { getArticlePublicPath } from '../lib/article-path';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatViews(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万次阅读`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k次阅读`;
  return `${count}次阅读`;
}

interface Props {
  items: ArticleSummary[];
  emptyText?: string;
}

export function ArticleListSection({ items, emptyText = '暂无已发布文章。' }: Props) {
  if (items.length === 0) {
    return <p style={{ color: '#9CA3AF', fontSize: 16 }}>{emptyText}</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((article, idx) => (
        <article
          key={article.id}
          style={{
            padding: '28px 0',
            borderBottom: '1px solid #F3F4F6',
            borderTop: idx === 0 ? '1px solid #F3F4F6' : 'none',
          }}
        >
          <Link
            href={getArticlePublicPath(article.slug, article.category?.slug)}
            style={{ textDecoration: 'none' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {article.category?.name && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#2563EB',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      marginBottom: 8,
                      display: 'block',
                    }}
                  >
                    {article.category.name}
                  </span>
                )}
                <h2
                  style={{
                    fontSize: 'clamp(16px,2vw,19px)',
                    fontWeight: 600,
                    color: '#1D1D1F',
                    lineHeight: 1.4,
                    marginBottom: 8,
                  }}
                >
                  {article.title}
                </h2>
                {article.summary && (
                  <p
                    style={{
                      fontSize: 15,
                      color: '#6B7280',
                      lineHeight: 1.6,
                      marginBottom: 12,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as any,
                    }}
                  >
                    {article.summary}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {article.publishedAt && (
                    <span style={{ fontSize: 13, color: '#9CA3AF' }}>📅 {formatDate(article.publishedAt)}</span>
                  )}
                  <span style={{ fontSize: 13, color: '#9CA3AF' }}>👁 {formatViews(article.viewCount || 0)}</span>
                  {article.author?.name && (
                    <span style={{ fontSize: 13, color: '#9CA3AF' }}>✍️ {article.author.name}</span>
                  )}
                </div>
              </div>
              {article.coverImage && (
                <div style={{ width: 100, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
