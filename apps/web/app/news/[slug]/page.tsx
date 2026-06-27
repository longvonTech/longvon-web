export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedNews } from '../../../lib/news-api';
import { getSiteUrl } from '../../../lib/site';
import type { NewsMediaItem } from '../../../lib/news-api';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const item = await getPublishedNews(slug);
    return {
      title: `${item.title} | 企业动态`,
      description: item.summary ?? item.title,
      alternates: { canonical: `${getSiteUrl()}/news/${slug}` },
    };
  } catch {
    return { title: '企业动态' };
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  let item;
  try {
    item = await getPublishedNews(slug);
  } catch {
    notFound();
  }

  const media = (Array.isArray(item.media) ? item.media : []) as NewsMediaItem[];
  const paragraphs = item.content.split(/\n+/).filter(Boolean);

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div style={{ marginBottom: 32, fontSize: 14 }}>
        <Link href="/" style={{ color: '#6B7280' }}>首页</Link>
        <span style={{ color: '#D1D5DB', margin: '0 8px' }}>/</span>
        <Link href="/news" style={{ color: '#6B7280' }}>企业动态</Link>
      </div>

      <time style={{ fontSize: 14, color: '#9CA3AF' }}>{formatDate(item.publishedAt)}</time>
      <h1 style={{ fontSize: 'clamp(28px,4vw,36px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#1D1D1F', margin: '12px 0 20px', lineHeight: 1.25 }}>
        {item.title}
      </h1>
      {item.summary && (
        <p style={{ fontSize: 18, color: '#6B7280', lineHeight: 1.7, marginBottom: 32 }}>{item.summary}</p>
      )}

      {item.coverImage && (
        <img
          src={item.coverImage}
          alt=""
          style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 16, marginBottom: 32 }}
        />
      )}

      {item.videoUrl && (
        <video
          src={item.videoUrl}
          controls
          style={{ width: '100%', borderRadius: 16, marginBottom: 32, background: '#000' }}
        />
      )}

      <div style={{ fontSize: 17, color: '#374151', lineHeight: 1.9 }}>
        {paragraphs.map(p => (
          <p key={p} style={{ margin: '0 0 1.2em' }}>{p}</p>
        ))}
      </div>

      {media.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#1D1D1F' }}>相关图集</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {media.map(m => (
              <div key={m.url}>
                {m.type === 'video' ? (
                  <video src={m.url} controls style={{ width: '100%', borderRadius: 12, background: '#000' }} />
                ) : (
                  <img src={m.url} alt={m.caption ?? ''} style={{ width: '100%', borderRadius: 12 }} />
                )}
                {m.caption && <p style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}>{m.caption}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #F3F4F6' }}>
        <Link href="/news" style={{ fontSize: 15, color: '#2563EB', fontWeight: 600 }}>← 返回企业动态</Link>
      </div>
    </main>
  );
}
