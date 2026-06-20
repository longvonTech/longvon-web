export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { listArticles } from '../../lib/knowledge-api';
import { getSiteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: '健康知识库 | MATEYOU',
  description: '经医学审核的健康知识文章，覆盖睡眠、压力、体重管理等主题。',
  alternates: { canonical: `${getSiteUrl()}/knowledge` },
  openGraph: {
    title: '健康知识库 | MATEYOU',
    description: '经医学审核的健康知识文章，覆盖睡眠、压力、体重管理等主题。',
    url: `${getSiteUrl()}/knowledge`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '健康知识库 | MATEYOU',
    description: '经医学审核的健康知识文章，覆盖睡眠、压力、体重管理等主题。',
  },
};

// 呼应seo-content-ux-v1.md：本页面对应Knowledge Center的列表模板。
// Sprint 2A暂不实现分类/标签的前端筛选交互（按categoryId/tagId筛选的API已就位，
// 但筛选UI属于后续视觉设计落地的范畴，本Sprint聚焦"数据能否端到端跑通"）。
export default async function KnowledgeListPage() {
  const { items } = await listArticles();

  return (
    <main style={{ maxWidth: 760, margin: '60px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>健康知识库</h1>
      <p style={{ color: '#666', marginTop: 8 }}>
        全部内容经医学审核专家审核后发布。
      </p>

      {items.length === 0 ? (
        <p style={{ marginTop: 40, color: '#888' }}>
          暂无已发布文章。
        </p>
      ) : (
        <ul style={{ marginTop: 32, listStyle: 'none', padding: 0 }}>
          {items.map((article) => (
            <li key={article.id} style={{ padding: '20px 0', borderBottom: '1px solid #eee' }}>
              <Link href={`/knowledge/${article.slug}`} style={{ fontSize: 18, fontWeight: 500 }}>
                {article.title}
              </Link>
              {article.summary && (
                <p style={{ color: '#555', marginTop: 6 }}>{article.summary}</p>
              )}
              <div style={{ color: '#999', fontSize: 13, marginTop: 6 }}>
                {article.category?.name ?? '未分类'}
                {article.author?.name ? ` · ${article.author.name}` : ''}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
