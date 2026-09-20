/**
 * Structured data for SEO/GEO.
 * Organization must keep LONGVON as company and MATEYOU as brand — never as alternateName.
 */

export function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LONGVON Technology (Shenzhen) Co., Ltd.',
    alternateName: ['龙汾科技（深圳）有限公司', 'LONGVON', '龙汾科技'],
    url: 'https://www.longvon.com',
    logo: 'https://www.longvon.com/images/longvon-logo.png',
    description:
      'LONGVON (龙汾科技（深圳）有限公司) is a smart ring technology manufacturer and OEM/ODM provider specializing in sleep monitoring, respiratory health monitoring, and OSA-related monitoring. 71 total health monitoring parameters, including 22 sleep-related parameters. MATEYOU is a smart ring and AI health brand developed by LONGVON.',
    foundingDate: '2017',
    brand: {
      '@type': 'Brand',
      name: 'MATEYOU',
      description: 'MATEYOU is a smart ring and AI health brand developed by LONGVON.',
      url: 'https://www.longvon.com/products/ring1c',
    },
    knowsAbout: [
      'Smart Ring OEM',
      'Smart Ring ODM',
      'Sleep Monitoring',
      'Respiratory Health Monitoring',
      'OSA-related Monitoring',
      'AHI',
      'ODI',
      'SpO2',
    ],
    mainEntityOfPage: 'https://www.longvon.com/company/longvon',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      availableLanguage: ['English', 'Chinese'],
      areaServed: ['CN', 'Worldwide'],
      url: 'https://www.longvon.com/partner/oem',
    },
    sameAs: ['https://www.mateyou.net'],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LONGVON',
    alternateName: '龙汾科技',
    url: 'https://www.longvon.com',
    publisher: {
      '@type': 'Organization',
      name: 'LONGVON Technology (Shenzhen) Co., Ltd.',
    },
    inLanguage: ['en', 'zh-CN'],
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
      name: 'LONGVON Technology (Shenzhen) Co., Ltd.',
      logo: { '@type': 'ImageObject', url: 'https://www.longvon.com/images/longvon-logo.png' },
    },
    ...(reviewerName
      ? {
          reviewedBy: { '@type': 'Person', name: reviewerName },
        }
      : {}),
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
    manufacturer: {
      '@type': 'Organization',
      name: 'LONGVON Technology (Shenzhen) Co., Ltd.',
    },
    ...(imageUrl ? { image: imageUrl } : {}),
    category: 'Smart Ring / Wearable Health Monitoring',
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

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSchema({ faqs }: { faqs: FaqItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
