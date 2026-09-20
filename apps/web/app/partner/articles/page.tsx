export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleListSection } from '../../../components/ArticleListSection';
import { listArticles } from '../../../lib/knowledge-api';
import { PARTNER_CATEGORY_SLUG } from '../../../lib/article-path';
import { getSiteUrl } from '../../../lib/site';

export const metadata: Metadata = {
  title: '商业合作资讯 | MATEYOU',
  description:
    '智能戒指 OEM/ODM、代工合作、企业采购与渠道合作相关资讯，助力 B2B 决策者了解选型、流程与质量体系。',
  keywords: [
    '智能戒指OEM',
    '智能戒指ODM',
    '商业合作',
    '智能戒指代工',
    '可穿戴OEM',
  ],
  alternates: { canonical: `${getSiteUrl()}/partner/articles` },
};

export default async function PartnerArticlesPage() {
  const { items } = await listArticles({ categorySlug: PARTNER_CATEGORY_SLUG, pageSize: 50 });

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px' }}>
      <div style={{ marginBottom: 48 }}>
        <Link href="/partner" style={{ fontSize: 14, color: '#2563EB', textDecoration: 'none' }}>
          ← 返回商业合作
        </Link>
        <h1
          style={{
            fontSize: 'clamp(28px,4vw,40px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#1D1D1F',
            marginTop: 16,
            marginBottom: 12,
          }}
        >
          商业合作资讯
        </h1>
        <p style={{ fontSize: 17, color: '#6B7280', lineHeight: 1.6 }}>
          面向 OEM/ODM、渠道与企业采购决策者的合作资讯，涵盖选型、流程、质量与交付等实用内容。
        </p>
      </div>

      <ArticleListSection items={items} emptyText="暂无商业合作资讯，敬请期待。" />

      <div
        style={{
          marginTop: 48,
          padding: '20px 24px',
          background: '#f8fafc',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 8 }}>有合作需求？</div>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, marginBottom: 12 }}>
          了解 OEM 代工、区域代理或企业批量采购，可直接提交合作意向。
        </p>
        <Link href="/partner/oem" style={{ color: '#2563EB', fontWeight: 600, fontSize: 15 }}>
          前往 OEM 代工合作页 →
        </Link>
      </div>
    </main>
  );
}
