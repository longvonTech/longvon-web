import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug } from '../../../lib/knowledge-api';
import { getInternalLinksBySlug } from '../../../lib/seo-api';
import { getSiteUrl } from '../../../lib/site';
import { ArticleSchema, BreadcrumbSchema } from '../../../components/StructuredData';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const article = await getArticleBySlug(params.slug);
    const title = article.seoTitle || `${article.title} | MATEYOU`;
    const description = article.seoDescription || article.summary || undefined;
    const url = `${getSiteUrl()}/knowledge/${article.slug}`;

    return {
      title,
      description,
      // Canonical：每篇文章只有一个权威URL，呼应seo-content-ux-v1.md对重复内容的处理原则，
      // 本Sprint文章没有多参数变体（如分页/筛选参数拼接到详情页URL的情况），canonical即自身URL
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        images: article.coverImage ? [article.coverImage] : undefined,
      },
      twitter: {
        card: article.coverImage ? 'summary_large_image' : 'summary',
        title,
        description,
        images: article.coverImage ? [article.coverImage] : undefined,
      },
    };
  } catch {
    return { title: '文章未找到 | MATEYOU' };
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const article = await getArticleBySlug(params.slug).catch(() => null);

  if (!article) {
    notFound();
  }

  // 内链建议获取失败不应该让整篇文章无法显示
  const internalLinks = await getInternalLinksBySlug(params.slug).catch(() => null);

  const siteUrl = getSiteUrl();

  return (
    <main style={{ maxWidth: 680, margin: '60px auto', padding: '0 24px' }}>
      {/* Sprint 8：ArticleSchema正式上线，取消Sprint 2B/3的占位注释 */}
      {article.publishedAt && (
        <ArticleSchema
          title={article.title}
          description={article.summary ?? article.title}
          url={`${siteUrl}/knowledge/${article.slug}`}
          publishedAt={article.publishedAt}
          authorName={article.author?.name ?? 'MATEYOU编辑团队'}
          reviewerName={article.reviewer?.name}
        />
      )}
      <BreadcrumbSchema items={[
        { name: '首页', url: siteUrl },
        { name: '健康知识库', url: `${siteUrl}/knowledge` },
        { name: article.title, url: `${siteUrl}/knowledge/${article.slug}` },
      ]} />

      <h1 style={{ fontSize: 26, fontWeight: 600 }}>{article.title}</h1>

      <div style={{ color: '#888', fontSize: 13, marginTop: 12 }}>
        {article.author?.name && <span>{article.author.name} 撰写</span>}
        {article.reviewer && (
          <span>
            {' '}
            · {article.reviewer.name}（{article.reviewer.credentials}）医学审核
            {article.reviewedAt ? ` · 审核时间 ${new Date(article.reviewedAt).toLocaleDateString('zh-CN')}` : ''}
          </span>
        )}
      </div>

      <article style={{ marginTop: 24, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
        {article.content}
      </article>

      {article.articleTags.length > 0 && (
        <div style={{ marginTop: 32, color: '#666', fontSize: 13 }}>
          标签：{article.articleTags.map((t) => t.tag.name).join('、')}
        </div>
      )}

      {internalLinks && internalLinks.links.length > 0 && (
        <nav style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #eee' }} aria-label="延伸阅读">
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>延伸阅读</h2>
          <ul style={{ marginTop: 12, listStyle: 'none', padding: 0 }}>
            {internalLinks.links.map((link, i) => (
              <li key={`${link.url}-${i}`} style={{ marginTop: 8 }}>
                <Link href={link.url} style={{ color: '#0066cc' }}>
                  {link.title}
                </Link>
                {link.type === 'hub' && (
                  <span style={{ color: '#aaa', fontSize: 12 }}> · 所属专题</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </main>
  );
}
