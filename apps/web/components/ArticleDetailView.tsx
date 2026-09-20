import Link from 'next/link';
import type { Metadata } from 'next';
import { ArticleContent } from './ArticleContent';
import { ArticleViewTracker } from './ArticleViewTracker';
import { BreadcrumbSchema, ArticleSchema } from './StructuredData';
import { getArticleBySlug } from '../lib/knowledge-api';
import { getInternalLinksBySlug } from '../lib/seo-api';
import { getArticleAbsoluteUrl, getArticlePublicPath, isPartnerCategorySlug } from '../lib/article-path';
import { getSiteUrl } from '../lib/site';

interface Props {
  slug: string;
  section: 'knowledge' | 'partner';
}

export async function buildArticlePageMetadata({ slug, section }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(slug).catch(() => null);
  if (!article) return { title: section === 'partner' ? '文章未找到 | 商业合作' : '文章未找到 | MATEYOU' };

  const categorySlug = article.category?.slug ?? null;
  const onPartner = isPartnerCategorySlug(categorySlug);
  if (section === 'knowledge' && onPartner) {
    return {
      alternates: { canonical: getArticleAbsoluteUrl(getSiteUrl(), slug, categorySlug) },
    };
  }
  if (section === 'partner' && !onPartner) {
    return {
      alternates: { canonical: getArticleAbsoluteUrl(getSiteUrl(), slug, categorySlug) },
    };
  }

  const title = article.seoTitle || `${article.title} | MATEYOU`;
  const description = article.seoDescription || article.summary || undefined;
  const url = getArticleAbsoluteUrl(getSiteUrl(), slug, categorySlug);
  return {
    title,
    description,
    keywords: article.seoKeywords?.split(',').map((k) => k.trim()).filter(Boolean),
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
    twitter: { card: 'summary', title, description },
  };
}

export async function ArticleDetailView({ slug, section }: Props) {
  const article = await getArticleBySlug(slug);
  const categorySlug = article.category?.slug ?? null;
  const onPartner = isPartnerCategorySlug(categorySlug);
  const siteUrl = getSiteUrl();
  const articlePath = getArticlePublicPath(slug, categorySlug);
  const internalLinks = await getInternalLinksBySlug(slug).catch(() => null);

  const hubName = onPartner ? '商业合作资讯' : '健康知识库';
  const hubPath = onPartner ? '/partner/articles' : '/knowledge';

  return (
    <main style={{ maxWidth: 680, margin: '60px auto', padding: '0 24px' }}>
      <ArticleViewTracker slug={slug} />
      {article.publishedAt && (
        <ArticleSchema
          title={article.title}
          description={article.summary ?? article.title}
          url={`${siteUrl}${articlePath}`}
          publishedAt={article.publishedAt}
          authorName={article.author?.name ?? 'MATEYOU编辑团队'}
          reviewerName={article.reviewer?.name}
        />
      )}
      <BreadcrumbSchema
        items={[
          { name: '首页', url: siteUrl },
          ...(onPartner
            ? [
                { name: '商业合作', url: `${siteUrl}/partner` },
                { name: hubName, url: `${siteUrl}${hubPath}` },
              ]
            : [{ name: hubName, url: `${siteUrl}${hubPath}` }]),
          { name: article.title, url: `${siteUrl}${articlePath}` },
        ]}
      />

      <h1 style={{ fontSize: 26, fontWeight: 600 }}>{article.title}</h1>

      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          style={{
            width: '100%',
            maxHeight: 360,
            objectFit: 'cover',
            borderRadius: 12,
            marginTop: 20,
          }}
        />
      )}

      <div style={{ color: '#888', fontSize: 13, marginTop: 12 }}>
        {article.author?.name && <span>{article.author.name} 撰写</span>}
        {article.reviewer && (
          <span>
            {' '}
            · {article.reviewer.name}（{article.reviewer.credentials}）医学审核
          </span>
        )}
      </div>

      <article style={{ marginTop: 24 }}>
        <ArticleContent content={article.content} />
      </article>

      {onPartner && (
        <div
          style={{
            marginTop: 40,
            padding: 20,
            background: '#f8fafc',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8 }}>洽谈商业合作</div>
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, marginBottom: 12 }}>
            如需了解智能戒指 OEM/ODM、区域代理或企业批量采购方案，欢迎提交合作意向。
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/partner/oem" style={{ color: '#2563EB', fontSize: 14, fontWeight: 600 }}>
              OEM代工合作 →
            </Link>
            <Link href="/partner" style={{ color: '#2563EB', fontSize: 14 }}>
              全部合作类型 →
            </Link>
          </div>
        </div>
      )}

      {article.articleTags.length > 0 && (
        <div style={{ marginTop: 32, color: '#666', fontSize: 13 }}>
          标签：{article.articleTags.map((t) => t.tag.name).join('、')}
        </div>
      )}

      {internalLinks && internalLinks.links?.length > 0 && (
        <div style={{ marginTop: 40, padding: 20, background: '#f8f9ff', borderRadius: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>延伸阅读</div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {internalLinks.links.slice(0, 5).map((link: { url: string; title: string; type: string }) => (
              <li key={link.url} style={{ marginBottom: 8 }}>
                <Link href={link.url} style={{ color: '#0066cc', fontSize: 14 }}>
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!onPartner && (
        <div
          style={{
            marginTop: 48,
            padding: '16px 20px',
            background: '#F9FAFB',
            borderRadius: 12,
            border: '1px solid #E5E7EB',
          }}
        >
          <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.7 }}>
            <strong style={{ color: '#6B7280' }}>免责声明：</strong>
            本内容仅供健康参考，不构成医学诊断或治疗建议。如有健康疑虑，请及时就医。
          </p>
        </div>
      )}
    </main>
  );
}
