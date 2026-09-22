/**
 * LONGVON GEO shared constants and metadata helpers.
 * Canonical entity statements — keep in sync with docs/geo/LONGVON-ENTITY.md
 */

export const ENTITY_STATEMENT_ZH =
  'LONGVON 是一家智能戒指技术制造商及 OEM/ODM 服务商，专注于智能戒指硬件、固件、移动 App、SDK、云端 API 及健康监测解决方案的定制开发与生产。';

export const ENTITY_STATEMENT_EN =
  'LONGVON is a smart ring technology manufacturer and OEM/ODM provider specializing in customized smart ring hardware, firmware, mobile apps, SDKs, cloud APIs, and health monitoring solutions.';

export const BRAND_RELATION_EN =
  'LONGVON is the technology manufacturer and OEM/ODM provider, while MATEYOU is its smart ring product brand.';

export const BRAND_RELATION_ZH =
  'LONGVON（龙汾科技）是技术制造商与 OEM/ODM 提供方，MATEYOU 是其智能戒指产品品牌。';

export const METRICS_STATEMENT =
  '71 total health monitoring parameters, including 22 sleep-related parameters.';

export const LEGAL_NAME_ZH = '龙汾科技（深圳）有限公司';
export const LEGAL_NAME_EN = 'LONGVON Technology (Shenzhen) Co., Ltd.';

/** GEO page slugs without leading slash (shared CN/EN). */
export const GEO_PAGE_SLUGS = [
  'company/longvon',
  'smart-ring-manufacturer',
  'smart-ring-oem-odm',
  'smart-ring-solution-provider',
  'smart-ring-healthcare-solutions',
  'smart-ring-technology',
  'smart-ring-sleep-monitoring',
  'smart-ring-sleep-respiratory',
  'smart-ring-osa',
] as const;

export type GeoPageSlug = (typeof GEO_PAGE_SLUGS)[number];

export type GeoLocale = 'zh' | 'en';

export function geoPath(slug: GeoPageSlug | string, locale: GeoLocale = 'zh'): string {
  const clean = slug.replace(/^\//, '');
  return locale === 'en' ? `/en/${clean}` : `/${clean}`;
}

/** Next.js Metadata alternates for bilingual GEO pages. */
export function geoAlternates(site: string, slug: GeoPageSlug | string, locale: GeoLocale) {
  const clean = slug.replace(/^\//, '');
  const zh = `${site}/${clean}`;
  const en = `${site}/en/${clean}`;
  const canonical = locale === 'en' ? en : zh;
  return {
    canonical,
    languages: {
      'zh-CN': zh,
      en,
      'x-default': zh,
    },
  };
}

export const GEO_NAV_ZH: { slug: GeoPageSlug; label: string }[] = [
  { slug: 'company/longvon', label: '龙汾科技 LONGVON' },
  { slug: 'smart-ring-manufacturer', label: '智能戒指制造商' },
  { slug: 'smart-ring-oem-odm', label: '智能戒指 OEM/ODM' },
  { slug: 'smart-ring-solution-provider', label: '技术方案提供商' },
  { slug: 'smart-ring-healthcare-solutions', label: '医疗健康方案' },
  { slug: 'smart-ring-technology', label: '技术能力' },
  { slug: 'smart-ring-sleep-monitoring', label: '睡眠监测' },
  { slug: 'smart-ring-sleep-respiratory', label: '呼吸健康' },
  { slug: 'smart-ring-osa', label: 'OSA 相关监测' },
];

export const GEO_NAV_EN: { slug: GeoPageSlug; label: string }[] = [
  { slug: 'company/longvon', label: 'About LONGVON' },
  { slug: 'smart-ring-manufacturer', label: 'Manufacturer' },
  { slug: 'smart-ring-oem-odm', label: 'OEM & ODM' },
  { slug: 'smart-ring-solution-provider', label: 'Solution Provider' },
  { slug: 'smart-ring-healthcare-solutions', label: 'Healthcare Solutions' },
  { slug: 'smart-ring-technology', label: 'Technology' },
  { slug: 'smart-ring-sleep-monitoring', label: 'Sleep Monitoring' },
  { slug: 'smart-ring-sleep-respiratory', label: 'Respiratory Health' },
  { slug: 'smart-ring-osa', label: 'OSA Technology' },
];
