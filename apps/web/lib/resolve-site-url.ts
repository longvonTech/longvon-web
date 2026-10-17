/**
 * Pure site URL resolver (shared by Next.js and Node tests via --experimental-strip-types).
 * Production must never silently emit localhost SEO URLs.
 */

export const CANONICAL_PRODUCTION_SITE_URL = 'https://www.longvon.com';

function stripTrailingSlash(url: string): string {
  return url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
}

function isLocalhostUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === 'localhost' || u.hostname === '127.0.0.1' || u.hostname === '0.0.0.0';
  } catch {
    return /localhost|127\.0\.0\.1/i.test(String(url));
  }
}

export function resolveSiteUrl(
  rawEnv: string | undefined,
  nodeEnv: string | undefined = 'development',
): string {
  const isProd = nodeEnv === 'production';
  const trimmed = typeof rawEnv === 'string' ? rawEnv.trim() : '';

  if (!trimmed) {
    if (isProd) {
      throw new Error(
        `[site-url] NEXT_PUBLIC_SITE_URL is required in production. Expected ${CANONICAL_PRODUCTION_SITE_URL}`,
      );
    }
    return 'http://localhost:3000';
  }

  let normalized = stripTrailingSlash(trimmed);
  if (isProd && normalized.startsWith('http://') && !isLocalhostUrl(normalized)) {
    normalized = `https://${normalized.slice('http://'.length)}`;
  }

  if (isProd && isLocalhostUrl(normalized)) {
    throw new Error(
      `[site-url] NEXT_PUBLIC_SITE_URL must not be localhost in production (got ${normalized}). Use ${CANONICAL_PRODUCTION_SITE_URL}`,
    );
  }

  try {
    // eslint-disable-next-line no-new
    new URL(normalized);
  } catch {
    throw new Error(`[site-url] NEXT_PUBLIC_SITE_URL is not a valid absolute URL: ${normalized}`);
  }

  return normalized;
}
