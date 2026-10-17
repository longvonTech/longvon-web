/**
 * Structured data (JSON-LD) for SEO / GEO / AI entity extraction.
 * LONGVON = manufacturer Organization; MATEYOU = Brand only (never Organization alternateName).
 * Site origin comes from getSiteUrl() — never hardcode localhost in production output.
 */

import { getSiteUrl } from '../lib/site';

const ORG_NAME = 'LONGVON Technology (Shenzhen) Co., Ltd.';
const ORG_NAME_ZH = '龙汾科技（深圳）有限公司';

function siteOrigin() {
  return getSiteUrl();
}

function orgId() {
  return `${siteOrigin()}/#organization`;
}
function brandId() {
  return `${siteOrigin()}/#brand-mateyou`;
}
function websiteId() {
  return `${siteOrigin()}/#website`;
}
function oemServiceId() {
  return `${siteOrigin()}/#service-oem-odm`;
}
function ring1cId() {
  return `${siteOrigin()}/products/ring1c#product`;
}
function appId() {
  return `${siteOrigin()}/#app-mateyou`;
}
function logoUrl() {
  return `${siteOrigin()}/images/longvon-logo.png`;
}

type Locale = 'zh' | 'en';

function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function orgNode() {
  return {
    '@type': 'Organization',
    '@id': orgId(),
    name: ORG_NAME,
    alternateName: [ORG_NAME_ZH, 'LONGVON', '龙汾科技'],
    url: siteOrigin(),
    logo: { '@type': 'ImageObject', url: logoUrl() },
    image: logoUrl(),
    description:
      'LONGVON (龙汾科技（深圳）有限公司) is a smart ring manufacturer and OEM/ODM technology provider offering hardware, firmware, health algorithms, mobile apps, SDK/API and manufacturing. MATEYOU is its product brand — not the manufacturer.',
    foundingDate: '2017',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Shenzhen',
      addressRegion: 'Guangdong',
      addressCountry: 'CN',
    },
    brand: { '@id': brandId() },
    makesOffer: { '@id': oemServiceId() },
    knowsAbout: [
      'Smart Ring Manufacturer',
      '智能戒指制造商',
      'Smart Ring OEM',
      'Smart Ring ODM',
      'Smart Ring Technology Provider',
      'Healthcare Smart Ring Solutions',
      'Sleep Monitoring',
      'Respiratory Health Monitoring',
      'OSA-related Monitoring',
      'SpO2',
      'HRV',
      'AHI',
      'ODI',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      availableLanguage: ['Chinese', 'English'],
      areaServed: ['CN', 'Worldwide'],
      url: `${siteOrigin()}/partner/oem`,
    },
    sameAs: ['https://www.mateyou.net'],
    mainEntityOfPage: `${siteOrigin()}/company/longvon`,
  };
}

function brandNode() {
  return {
    '@type': 'Brand',
    '@id': brandId(),
    name: 'MATEYOU',
    alternateName: ['美特优'],
    url: `${siteOrigin()}/products/ring1c`,
    description:
      'MATEYOU is LONGVON’s smart ring / AI health product brand. MATEYOU is not the manufacturer; LONGVON Technology (Shenzhen) Co., Ltd. manufactures the products.',
    logo: logoUrl(),
  };
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': websiteId(),
    name: 'LONGVON',
    alternateName: ['龙汾科技', 'longvon.com'],
    url: siteOrigin(),
    inLanguage: ['zh-CN', 'en'],
    publisher: { '@id': orgId() },
    about: { '@id': orgId() },
  };
}

function oemServiceNode() {
  return {
    '@type': 'Service',
    '@id': oemServiceId(),
    name: 'Smart Ring OEM / ODM',
    alternateName: ['智能戒指 OEM/ODM', 'Custom Smart Ring Development'],
    serviceType: ['OEM', 'ODM', 'Smart Ring Manufacturing', 'Wearable Technology Solution'],
    provider: { '@id': orgId() },
    areaServed: 'Worldwide',
    url: `${siteOrigin()}/partner/oem`,
    description:
      'End-to-end smart ring OEM/ODM: hardware, firmware, health algorithms, mobile app, project-based SDK/API, and manufacturing for qualified brand and digital-health projects.',
    termsOfService: `${siteOrigin()}/smart-ring-oem-odm`,
  };
}

function property(name: string, value: string | number) {
  return { '@type': 'PropertyValue', name, value: String(value) };
}

function ring1cProductNode(locale: Locale, pageUrl: string) {
  const isZh = locale === 'zh';
  const images = [
    `${siteOrigin()}/images/ring1c/Black-45-Left.jpg`,
    `${siteOrigin()}/images/ring1c/hero-main.jpg`,
    `${siteOrigin()}/images/ring1c/colors/black.jpg`,
    `${siteOrigin()}/images/ring1c/colors/white.jpg`,
    `${siteOrigin()}/images/ring1c/colors/pink.jpg`,
    `${siteOrigin()}/images/ring1c/colors/blue.jpg`,
  ];

  return {
    '@type': 'Product',
    '@id': ring1cId(),
    name: 'MATEYOU Ring1C',
    alternateName: isZh
      ? ['Ring1C', 'MATEYOU 智能戒指', '美特优 Ring1C']
      : ['Ring1C', 'MATEYOU Smart Ring'],
    description: isZh
      ? 'MATEYOU Ring1C 是 LONGVON（龙汾科技）研发制造的智能戒指参考产品：71 项健康监测参数（含 22 项睡眠相关），覆盖睡眠、SpO₂、HRV、呼吸健康与 OSA 相关监测。消费级可穿戴设备，非医疗器械；监测结果仅供健康参考，不构成医学诊断。MATEYOU 为产品品牌，LONGVON 为制造商。'
      : 'MATEYOU Ring1C is a smart ring reference product manufactured by LONGVON: 71 health monitoring parameters including 22 sleep-related parameters (sleep, SpO₂, HRV, respiratory health, OSA-related monitoring). Consumer wearable—not a medical device. Health reference only, not diagnosis. MATEYOU is the brand; LONGVON is the manufacturer.',
    url: pageUrl,
    image: images,
    category: isZh ? '智能戒指 / 可穿戴健康监测' : 'Smart Ring / Wearable Health Monitoring',
    brand: { '@id': brandId() },
    manufacturer: { '@id': orgId() },
    isRelatedTo: { '@id': oemServiceId() },
    material: isZh ? '氧化锆陶瓷外壳；抗过敏高分子聚合物内衬' : 'Zirconia ceramic shell; hypoallergenic polymer liner',
    weight: {
      '@type': 'QuantitativeValue',
      value: 4,
      unitCode: 'GRM',
    },
    color: isZh
      ? ['极地白', '樱粉色', '星空蓝', '曜石黑']
      : ['White', 'Pink', 'Blue', 'Black'],
    additionalProperty: [
      property(isZh ? '健康监测参数总数' : 'Total health monitoring parameters', 71),
      property(isZh ? '睡眠相关参数' : 'Sleep-related parameters', 22),
      property(isZh ? '产品定位' : 'Product class', isZh ? '消费级健康监测可穿戴（非医疗器械）' : 'Consumer health-monitoring wearable (not a medical device)'),
      property(isZh ? '传感器' : 'Sensors', isZh ? '多波长PPG、温度传感、六轴运动传感' : 'Multi-wavelength PPG, temperature, 6-axis IMU'),
      property(isZh ? '续航' : 'Battery life', isZh ? '约7–10天' : 'About 7–10 days'),
      property(isZh ? '防水' : 'Water resistance', 'IP68'),
      property(isZh ? '蓝牙' : 'Bluetooth', '5.2'),
      property(isZh ? '兼容系统' : 'Compatibility', 'iOS 14+ / Android 8+'),
      property(isZh ? '尺寸' : 'Sizes', 'US 6–US 13'),
      property(
        isZh ? '监测边界' : 'Monitoring boundary',
        isZh
          ? '睡眠/呼吸/OSA相关监测仅供健康参考，不诊断、不治疗、不替代PSG'
          : 'Sleep/respiratory/OSA-related monitoring for health reference only — not diagnosis, treatment, or PSG replacement',
      ),
    ],
    hasVariant: [
      { '@type': 'Product', name: 'MATEYOU Ring1C White', color: isZh ? '极地白' : 'White', image: `${siteOrigin()}/images/ring1c/colors/white.jpg`, manufacturer: { '@id': orgId() }, brand: { '@id': brandId() } },
      { '@type': 'Product', name: 'MATEYOU Ring1C Pink', color: isZh ? '樱粉色' : 'Pink', image: `${siteOrigin()}/images/ring1c/colors/pink.jpg`, manufacturer: { '@id': orgId() }, brand: { '@id': brandId() } },
      { '@type': 'Product', name: 'MATEYOU Ring1C Blue', color: isZh ? '星空蓝' : 'Blue', image: `${siteOrigin()}/images/ring1c/colors/blue.jpg`, manufacturer: { '@id': orgId() }, brand: { '@id': brandId() } },
      { '@type': 'Product', name: 'MATEYOU Ring1C Black', color: isZh ? '曜石黑' : 'Black', image: `${siteOrigin()}/images/ring1c/colors/black.jpg`, manufacturer: { '@id': orgId() }, brand: { '@id': brandId() } },
    ],
  };
}

function mateyouAppNode(locale: Locale) {
  const isZh = locale === 'zh';
  return {
    '@type': 'SoftwareApplication',
    '@id': appId(),
    name: 'MATEYOU App',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'iOS 14+, Android 8+',
    url: `${siteOrigin()}/products/ring1c`,
    description: isZh
      ? 'MATEYOU App 是 Ring1C 配套应用，展示健康总览、睡眠、心脏、OSA 相关、压力与运动等监测视图。结果仅供健康参考，不构成医学诊断。'
      : 'MATEYOU App accompanies Ring1C with health overview, sleep, heart, OSA-related, stress and activity views. Health reference only—not medical diagnosis.',
    author: { '@id': orgId() },
    isRelatedTo: { '@id': ring1cId() },
  };
}

/** Full entity graph for homepage / company — AI-readable site map of who/what. */
export function SiteEntityGraphSchema({ locale = 'zh' }: { locale?: Locale }) {
  const productUrl = locale === 'en' ? `${siteOrigin()}/en/products/ring1c` : `${siteOrigin()}/products/ring1c`;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      orgNode(),
      brandNode(),
      websiteNode(),
      oemServiceNode(),
      ring1cProductNode(locale, productUrl),
      mateyouAppNode(locale),
    ],
  };
  return <JsonLd data={data} />;
}

/** Product page graph: Product + App + Org/Brand refs + WebPage. */
export function Ring1CEntityGraphSchema({ locale = 'zh' }: { locale?: Locale }) {
  const pageUrl = locale === 'en' ? `${siteOrigin()}/en/products/ring1c` : `${siteOrigin()}/products/ring1c`;
  const isZh = locale === 'zh';
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      orgNode(),
      brandNode(),
      oemServiceNode(),
      ring1cProductNode(locale, pageUrl),
      mateyouAppNode(locale),
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: isZh ? 'MATEYOU Ring1C 智能戒指' : 'MATEYOU Ring1C Smart Ring',
        description: isZh
          ? 'MATEYOU Ring1C 智能戒指产品页：适用场景、核心参数与品类对比。由 LONGVON 制造。'
          : 'MATEYOU Ring1C smart ring product page: use cases, core specs, and category comparison. Manufactured by LONGVON.',
        isPartOf: { '@id': websiteId() },
        about: { '@id': ring1cId() },
        mainEntity: { '@id': ring1cId() },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${siteOrigin()}/images/ring1c/Black-45-Left.jpg`,
        },
        inLanguage: isZh ? 'zh-CN' : 'en',
      },
    ],
  };
  return <JsonLd data={data} />;
}

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        ...orgNode(),
        brand: brandNode(),
      }}
    />
  );
}

export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        ...websiteNode(),
      }}
    />
  );
}

export function OemServiceSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        ...oemServiceNode(),
        provider: {
          '@type': 'Organization',
          name: ORG_NAME,
          url: siteOrigin(),
        },
      }}
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
      '@id': orgId(),
      name: ORG_NAME,
      logo: { '@type': 'ImageObject', url: logoUrl() },
    },
    ...(reviewerName
      ? {
          reviewedBy: { '@type': 'Person', name: reviewerName },
        }
      : {}),
    disclaimer: '本文内容仅供健康参考，不构成医学诊断或治疗建议。',
  };
  return <JsonLd data={data} />;
}

interface ProductSchemaProps {
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  brand?: string;
}

/** Lightweight Product — prefer Ring1CEntityGraphSchema on the Ring1C page. */
export function ProductSchema({ name, description, url, imageUrl, brand = 'MATEYOU' }: ProductSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    brand: { '@type': 'Brand', name: brand, '@id': brand === 'MATEYOU' ? brandId() : undefined },
    manufacturer: {
      '@type': 'Organization',
      '@id': orgId(),
      name: ORG_NAME,
    },
    ...(imageUrl ? { image: imageUrl } : {}),
    category: 'Smart Ring / Wearable Health Monitoring',
  };
  return <JsonLd data={data} />;
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
  return <JsonLd data={data} />;
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
  return <JsonLd data={data} />;
}

/** Canonical Ring1C FAQs for product pages (AI-extractable Q&A). */
export const RING1C_FAQS_ZH: FaqItem[] = [
  {
    question: 'MATEYOU Ring1C 是什么产品？',
    answer:
      'MATEYOU Ring1C 是 LONGVON（龙汾科技（深圳）有限公司）研发制造的智能戒指参考产品，属于消费级健康监测可穿戴设备，不是医疗器械。',
  },
  {
    question: 'Ring1C 的制造商是谁？MATEYOU 是制造商吗？',
    answer:
      '制造商是龙汾科技（深圳）有限公司（LONGVON）。MATEYOU 是 LONGVON 的产品品牌，不是制造商。',
  },
  {
    question: 'Ring1C 有哪些健康监测参数？',
    answer:
      '公开口径为 71 项健康监测参数，其中 22 项与睡眠相关，覆盖睡眠、SpO₂、HRV、呼吸健康与 OSA 相关监测。结果仅供健康参考，不构成医学诊断。',
  },
  {
    question: 'Ring1C 能否诊断或治疗 OSA？',
    answer:
      '不能。Ring1C 提供 OSA 相关监测/筛查语境的指标（如 AHI、ODI 等）仅供健康参考，不诊断、不治疗，也不替代多导睡眠监测（PSG）。',
  },
];

export const RING1C_FAQS_EN: FaqItem[] = [
  {
    question: 'What is MATEYOU Ring1C?',
    answer:
      'MATEYOU Ring1C is a smart ring reference product designed and manufactured by LONGVON Technology (Shenzhen) Co., Ltd. It is a consumer health-monitoring wearable, not a medical device.',
  },
  {
    question: 'Who manufactures Ring1C? Is MATEYOU the manufacturer?',
    answer:
      'LONGVON manufactures Ring1C. MATEYOU is LONGVON’s product brand — not the manufacturer.',
  },
  {
    question: 'How many health monitoring parameters does Ring1C have?',
    answer:
      'The public metric set is 71 total health monitoring parameters, including 22 sleep-related parameters (sleep, SpO₂, HRV, respiratory health, and OSA-related monitoring). For health reference only — not medical diagnosis.',
  },
  {
    question: 'Can Ring1C diagnose or treat OSA?',
    answer:
      'No. OSA-related indicators (such as AHI and ODI in a screening/monitoring context) are for health reference only. Ring1C does not diagnose or treat OSA and does not replace PSG.',
  },
];
