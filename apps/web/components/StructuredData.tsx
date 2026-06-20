/**
 * 结构化数据组件——Sprint 8正式上线（不再占位）。
 * 基于structured-data-schema-mapping-v1.md联合评审结论：
 * ①Organization：官网首页必须包含，无合规争议
 * ②Article：使用Article类型（非MedicalWebPage），待医学合规进一步评审前保守处理
 * ③Product：Ring1C产品页使用Product schema
 * ④Breadcrumb：知识库文章/专题页使用
 */

export function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '龙汾科技（LONGVON）',
    alternateName: 'MATEYOU',
    url: 'https://www.longvon.com',
    logo: 'https://www.longvon.com/images/logo.png',
    description: 'MATEYOU AI数字健康平台，提供基于Ring1C智能戒指的健康风险自评服务',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: '中文',
      areaServed: 'CN',
    },
    sameAs: [],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  authorName: string;
  reviewerName?: string;
}

export function ArticleSchema({ title, description, url, publishedAt, authorName, reviewerName }: ArticleSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    author: { '@type': 'Person', name: authorName },
    publisher: {
      '@type': 'Organization',
      name: 'MATEYOU',
      logo: { '@type': 'ImageObject', url: 'https://www.longvon.com/images/logo.png' },
    },
    ...(reviewerName ? {
      reviewedBy: { '@type': 'Person', name: reviewerName },
    } : {}),
    // 免责声明：页面内容不构成医学诊断，此处不声明MedicalWebPage类型
    disclaimer: '本文内容仅供健康参考，不构成医学诊断或治疗建议。',
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ProductSchemaProps {
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  brand?: string;
}

export function ProductSchema({ name, description, url, imageUrl, brand = 'MATEYOU' }: ProductSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    brand: { '@type': 'Brand', name: brand },
    ...(imageUrl ? { image: imageUrl } : {}),
    category: '智能可穿戴设备 / 消费级健康监测',
    // Ring1C是消费级健康监测设备，不声明医疗器械相关Schema属性
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
