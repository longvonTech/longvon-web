import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { buildArticlePageMetadata, ArticleDetailView } from '../../../../components/ArticleDetailView';
import { getArticleBySlug } from '../../../../lib/knowledge-api';
import { getArticlePublicPath, isPartnerCategorySlug } from '../../../../lib/article-path';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildArticlePageMetadata({ slug, section: 'partner' });
}

export default async function PartnerArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug).catch(() => null);
  if (!article) notFound();

  const categorySlug = article.category?.slug ?? null;
  if (!isPartnerCategorySlug(categorySlug)) {
    redirect(getArticlePublicPath(slug, categorySlug));
  }

  return <ArticleDetailView slug={slug} section="partner" />;
}
