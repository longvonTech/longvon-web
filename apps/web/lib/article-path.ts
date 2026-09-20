/** 商业合作板块分类 slug（与 API / DB categories.slug 一致） */
export const PARTNER_CATEGORY_SLUG = 'partner';

export function isPartnerCategorySlug(slug?: string | null): boolean {
  return slug === PARTNER_CATEGORY_SLUG;
}

export function getArticlePublicPath(slug: string, categorySlug?: string | null): string {
  return isPartnerCategorySlug(categorySlug)
    ? `/partner/articles/${slug}`
    : `/knowledge/${slug}`;
}

export function getArticleAbsoluteUrl(
  siteUrl: string,
  slug: string,
  categorySlug?: string | null,
): string {
  const base = siteUrl.replace(/\/$/, '');
  return `${base}${getArticlePublicPath(slug, categorySlug)}`;
}
