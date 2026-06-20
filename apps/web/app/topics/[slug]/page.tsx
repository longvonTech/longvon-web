import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTopicBySlug } from '../../../lib/knowledge-api';
import { getSiteUrl } from '../../../lib/site';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = await getTopicBySlug(params.slug).catch(() => null);
  if (!topic) return { title: '专题未找到 | MATEYOU' };

  const title = `${topic.name} | MATEYOU 健康知识库`;
  const description = topic.description ?? undefined;
  const url = `${getSiteUrl()}/topics/${topic.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website', // Topic Hub是聚合页而非单篇内容，呼应OpenGraph规范用website而非article
      images: topic.coverImage ? [topic.coverImage] : undefined,
    },
    twitter: {
      card: topic.coverImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: topic.coverImage ? [topic.coverImage] : undefined,
    },
  };
}

// 呼应seo-content-ux-v1.md第3部分Topic Template：Hub页顶部专题介绍+下方文章列表。
// "按子主题分组"依赖health-knowledge-graph-v1.md的图谱关系，超出TASK-102范围，
// 本Sprint先按topic_articles.sort_order的扁平列表展示。
export default async function TopicHubPage({ params }: Props) {
  const topic = await getTopicBySlug(params.slug).catch(() => null);
  if (!topic) {
    notFound();
  }

  return (
    <main style={{ maxWidth: 760, margin: '60px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>{topic.name}</h1>
      {topic.description && <p style={{ color: '#666', marginTop: 8 }}>{topic.description}</p>}

      {topic.topicArticles.length === 0 ? (
        <p style={{ marginTop: 40, color: '#888' }}>该专题下暂无已发布文章。</p>
      ) : (
        <ul style={{ marginTop: 32, listStyle: 'none', padding: 0 }}>
          {topic.topicArticles.map(({ article }) => (
            <li key={article.id} style={{ padding: '16px 0', borderBottom: '1px solid #eee' }}>
              <Link href={`/knowledge/${article.slug}`} style={{ fontSize: 17, fontWeight: 500 }}>
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
