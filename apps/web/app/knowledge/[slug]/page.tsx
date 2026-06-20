import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug } from '../../../lib/knowledge-api';
import { getInternalLinksBySlug } from '../../../lib/seo-api';
import { getSiteUrl } from '../../../lib/site';
import { ArticleSchema, BreadcrumbSchema } from '../../../components/StructuredData';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug).catch(() => null);
  if (!article) return { title: '文章未找到 | MATEYOU' };
  const title = article.seoTitle || `${article.title} | MATEYOU`;
  const description = article.seoDescription || article.summary || undefined;
  const url = `${getSiteUrl()}/knowledge/${article.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug).catch(() => null);
  if (!article) notFound();

  const internalLinks = await getInternalLinksBySlug(slug).catch(() => null);
  const siteUrl = getSiteUrl();

  return (
    <main style={{ maxWidth: 680, margin: '60px auto', padding: '0 24px' }}>
      {article!.publishedAt && (
        <ArticleSchema
          title={article!.title}
          description={article!.summary ?? article!.title}
          url={`${siteUrl}/knowledge/${article!.slug}`}
          publishedAt={article!.publishedAt}
          authorName={article!.author?.name ?? 'MATEYOU编辑团队'}
          reviewerName={article!.reviewer?.name}
        />
      )}
      <BreadcrumbSchema items={[
        { name: '首页', url: siteUrl },
        { name: '健康知识库', url: `${siteUrl}/knowledge` },
        { name: article!.title, url: `${siteUrl}/knowledge/${article!.slug}` },
      ]} />

      <h1 style={{ fontSize: 26, fontWeight: 600 }}>{article!.title}</h1>

      <div style={{ color: '#888', fontSize: 13, marginTop: 12 }}>
        {article!.author?.name && <span>{article!.author.name} 撰写</span>}
        {article!.reviewer && (
          <span> · {article!.reviewer.name}（{article!.reviewer.credentials}）医学审核</span>
        )}
      </div>

      <article style={{ marginTop: 24, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
        {article!.content}
      </article>

      {article!.articleTags.length > 0 && (
        <div style={{ marginTop: 32, color: '#666', fontSize: 13 }}>
          标签：{article!.articleTags.map((t) => t.tag.name).join('、')}
        </div>
      )}

      {internalLinks && internalLinks.links?.length > 0 && (
        <div style={{ marginTop: 40, padding: 20, background: '#f8f9ff', borderRadius: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>延伸阅读</div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {internalLinks.links.slice(0, 3).map((link: { url: string; title: string; type: string }) => (
              <li key={link.url} style={{ marginBottom: 8 }}>
                <Link href={link.url} style={{ color: '#0066cc', fontSize: 14 }}>
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
