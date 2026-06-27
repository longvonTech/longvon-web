export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { listPublishedNews } from '../../lib/news-api';
import { getSiteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: '企业动态 | LONGVON 龙汾科技',
  description: '龙汾科技企业新闻、公告与资讯发布。',
  alternates: { canonical: `${getSiteUrl()}/news` },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function NewsListPage() {
  let items: Awaited<ReturnType<typeof listPublishedNews>> = [];
  try {
    items = await listPublishedNews();
  } catch {
    items = [];
  }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px 80px' }}>
      <div style={{ marginBottom: 48 }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 12 }}>
          Enterprise News
        </p>
        <h1 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: '#1D1D1F', marginBottom: 12 }}>
          企业动态
        </h1>
        <p style={{ fontSize: 17, color: '#6B7280', lineHeight: 1.6 }}>
          了解龙汾科技最新企业资讯、产品动态与重要公告。
        </p>
      </div>

      {items.length === 0 ? (
        <p style={{ color: '#9CA3AF', fontSize: 16 }}>暂无已发布内容。</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {items.map((item, idx) => (
            <article key={item.id} style={{
              padding: '28px 0',
              borderBottom: '1px solid #F3F4F6',
              borderTop: idx === 0 ? '1px solid #F3F4F6' : 'none',
            }}>
              <Link href={`/news/${item.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                {item.coverImage && (
                  <img
                    src={item.coverImage}
                    alt=""
                    style={{ width: 160, height: 100, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <time style={{ fontSize: 13, color: '#9CA3AF' }}>{formatDate(item.publishedAt)}</time>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1D1D1F', margin: '8px 0', lineHeight: 1.4 }}>
                    {item.title}
                  </h2>
                  {item.summary && (
                    <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{item.summary}</p>
                  )}
                  {item.videoUrl && (
                    <span style={{ display: 'inline-block', marginTop: 10, fontSize: 12, color: '#2563EB' }}>含视频</span>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
