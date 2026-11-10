/**
 * Site-wide bilingual routing helpers.
 * ZH = unprefixed paths; EN = /en/...
 */

export type SiteLocale = 'zh' | 'en';

/** Paths that have a dedicated English counterpart (without /en prefix). */
export const EN_ROUTE_MAP: Record<string, string> = {
  '/': '/',
  '/about': '/about',
  '/products/ring1c': '/products/ring1c',
  '/partner': '/partner',
  '/partner/oem': '/partner/oem',
  '/company/longvon': '/company/longvon',
  '/smart-ring-manufacturer': '/smart-ring-manufacturer',
  '/smart-ring-oem-odm': '/smart-ring-oem-odm',
  '/smart-ring-solution-provider': '/smart-ring-solution-provider',
  '/smart-ring-healthcare-solutions': '/smart-ring-healthcare-solutions',
  '/smart-ring-technology': '/smart-ring-technology',
  '/smart-ring-sdk-api': '/smart-ring-sdk-api',
  '/smart-ring-sleep-monitoring': '/smart-ring-sleep-monitoring',
  '/smart-ring-sleep-respiratory': '/smart-ring-sleep-respiratory',
  '/smart-ring-osa': '/smart-ring-osa',
};

export function getLocaleFromPath(pathname: string): SiteLocale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh';
}

/** Request header set by middleware so the root layout can SSR `<html lang>`. */
export const HTML_LANG_HEADER = 'x-html-lang';

/** BCP 47 language tag for the document. English routes are `/en` and `/en/*`. */
export function htmlLangFromPathname(pathname: string): 'en' | 'zh-CN' {
  return getLocaleFromPath(pathname) === 'en' ? 'en' : 'zh-CN';
}

/** Prefix a bare path for the given locale (`/` → `/en` when en). */
export function localePath(barePath: string, locale: SiteLocale): string {
  const bare = !barePath || barePath === '/' ? '/' : barePath.startsWith('/') ? barePath : `/${barePath}`;
  if (locale === 'zh') return bare;
  return bare === '/' ? '/en' : `/en${bare}`;
}

/** Strip /en prefix for matching. */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) {
    const rest = pathname.slice(3);
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return pathname || '/';
}

/**
 * Switch language while staying on the equivalent page when possible.
 * Unmapped paths fall back to locale home.
 */
export function getAlternateLocalePath(pathname: string, target: SiteLocale): string {
  const bare = stripLocalePrefix(pathname);
  // Exact match
  if (EN_ROUTE_MAP[bare] !== undefined) {
    return target === 'en' ? (bare === '/' ? '/en' : `/en${bare}`) : bare;
  }
  // Prefix match for nested partner pages etc.
  const partnerMatch = bare.match(/^\/partner(\/.*)?$/);
  if (partnerMatch) {
    const sub = partnerMatch[1] || '';
    if (sub === '/oem' || sub === '') {
      return target === 'en' ? `/en/partner${sub}` : `/partner${sub}`;
    }
    // other partner types: EN hub for now
    return target === 'en' ? '/en/partner' : bare;
  }
  return target === 'en' ? '/en' : '/';
}

export const NAV_ZH = [
  { href: '/products/ring1c', label: '产品介绍' },
  { href: '/assessment', label: '健康评估' },
  { href: '/company/longvon', label: '龙汾科技' },
  { href: '/partner', label: '商业合作' },
  { href: '/knowledge', label: '健康知识库' },
  { href: '/about', label: '关于我们' },
] as const;

export const NAV_EN = [
  { href: '/en/products/ring1c', label: 'Product' },
  { href: '/en/company/longvon', label: 'Company' },
  { href: '/en/smart-ring-oem-odm', label: 'OEM / ODM' },
  { href: '/en/smart-ring-technology', label: 'Technology' },
  { href: '/en/smart-ring-sdk-api', label: 'SDK / API' },
  { href: '/en/partner', label: 'Partners' },
  { href: '/en/about', label: 'About' },
] as const;

export function siteAlternates(
  site: string,
  barePath: string,
  locale: SiteLocale,
  options?: { xDefault?: SiteLocale },
) {
  const clean = barePath === '/' ? '' : barePath.replace(/^\//, '');
  const zh = clean ? `${site}/${clean}` : site;
  const en = clean ? `${site}/en/${clean}` : `${site}/en`;
  const xDefaultLocale = options?.xDefault ?? 'zh';
  return {
    canonical: locale === 'en' ? en : zh,
    languages: {
      'zh-CN': zh,
      en,
      'x-default': xDefaultLocale === 'en' ? en : zh,
    },
  };
}

/**
 * Reciprocal hreflang for the OEM RFQ pair.
 * x-default is English: overseas B2B OEM/ODM is the intended unspecified-locale destination.
 */
export function oemRfqAlternates(site: string, locale: SiteLocale) {
  return siteAlternates(site, '/partner/oem', locale, { xDefault: 'en' });
}
