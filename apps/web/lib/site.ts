/**
 * Public site origin for canonical, hreflang, sitemap, robots, Open Graph.
 */
export {
  CANONICAL_PRODUCTION_SITE_URL,
  resolveSiteUrl,
} from './resolve-site-url';

import { resolveSiteUrl } from './resolve-site-url';

export function getSiteUrl(): string {
  return resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, process.env.NODE_ENV);
}
