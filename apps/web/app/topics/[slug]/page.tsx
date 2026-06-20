import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTopicBySlug } from '../../../lib/knowledge-api';
import { getSiteUrl } from '../../../lib/site';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug).catch(() => null);
  if (!topic) return { title: '专题未找到 | MATEYOU' };
  const title = topic.name + ' | MATEYOU 健康知识库';
  const url = getSiteUrl() + '/topics/' + slug;
  return { title, description: topic.description ?? undefined, alternates: { canonical: url } };
}

export default async function TopicHubPage({ params }: Props) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug).catch(() => null);
  if (!topic) notFound();

  return (
    <main style={{ maxWidth: 760, margin: '60px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>{topic!.name}</h1>
      {topic!.description && <p style={{ color: '#666', marginTop: 8 }}>{topic!.description}</p>}
      {topic!.topicArticles.length === 0 ? (
        <p style={{ marginTop: 40, color: '#888' }}>该专题下暂无已发布文章。</p>
      ) : (
        <ul style={{ marginTop: 32, listStyle: 'none', padding: 0 }}>
          {topic!.topicArticles.map(({ article }: any) => (
            <li key={article.id} style={{ padding: '16px 0', borderBottom: '1px solid #eee' }}>
              <Link href={'/knowledge/' + article.slug} style={{ fontSize: 17, fontWeight: 500 }}>
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
