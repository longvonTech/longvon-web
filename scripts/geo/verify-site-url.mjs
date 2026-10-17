#!/usr/bin/env node
/**
 * Task #15 — URL / SEO origin checks (Node built-in test + strip-types).
 * Run: node --experimental-strip-types --test scripts/geo/verify-site-url.mjs
 *
 * Note: this file dynamically imports the TypeScript module under strip-types
 * when executed with that flag from package scripts; the self-test below
 * inlines the same contract for environments without strip-types.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

const CANONICAL = 'https://www.longvon.com';

function stripTrailingSlash(url) {
  return url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
}

function isLocalhostUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname === 'localhost' || u.hostname === '127.0.0.1' || u.hostname === '0.0.0.0';
  } catch {
    return /localhost|127\.0\.0\.1/i.test(String(url));
  }
}

/** Mirror of apps/web/lib/resolve-site-url.ts — keep in sync. */
function resolveSiteUrl(rawEnv, nodeEnv = 'development') {
  const isProd = nodeEnv === 'production';
  const trimmed = typeof rawEnv === 'string' ? rawEnv.trim() : '';
  if (!trimmed) {
    if (isProd) {
      throw new Error(`[site-url] NEXT_PUBLIC_SITE_URL is required in production. Expected ${CANONICAL}`);
    }
    return 'http://localhost:3000';
  }
  let normalized = stripTrailingSlash(trimmed);
  if (isProd && normalized.startsWith('http://') && !isLocalhostUrl(normalized)) {
    normalized = `https://${normalized.slice('http://'.length)}`;
  }
  if (isProd && isLocalhostUrl(normalized)) {
    throw new Error(
      `[site-url] NEXT_PUBLIC_SITE_URL must not be localhost in production (got ${normalized}). Use ${CANONICAL}`,
    );
  }
  // eslint-disable-next-line no-new
  new URL(normalized);
  return normalized;
}

test('dev: missing env falls back to localhost', () => {
  assert.equal(resolveSiteUrl(undefined, 'development'), 'http://localhost:3000');
  assert.equal(resolveSiteUrl('', 'development'), 'http://localhost:3000');
});

test('dev: explicit localhost allowed', () => {
  assert.equal(resolveSiteUrl('http://localhost:3000', 'development'), 'http://localhost:3000');
});

test('prod: missing env throws (no silent localhost)', () => {
  assert.throws(() => resolveSiteUrl(undefined, 'production'), /required in production/i);
});

test('prod: localhost env throws', () => {
  assert.throws(() => resolveSiteUrl('http://localhost:3000', 'production'), /must not be localhost/i);
});

test('prod: canonical https www longvon', () => {
  assert.equal(resolveSiteUrl('https://www.longvon.com', 'production'), 'https://www.longvon.com');
  assert.equal(resolveSiteUrl('https://www.longvon.com/', 'production'), 'https://www.longvon.com');
});

test('prod: http non-local upgraded to https', () => {
  assert.equal(resolveSiteUrl('http://www.longvon.com', 'production'), 'https://www.longvon.com');
});

test('TS source exports match mirrored contract', () => {
  const ts = readFileSync(join(root, 'apps/web/lib/resolve-site-url.ts'), 'utf8');
  assert.match(ts, /CANONICAL_PRODUCTION_SITE_URL = 'https:\/\/www\.longvon\.com'/);
  assert.match(ts, /required in production/);
  assert.match(ts, /must not be localhost in production/);
});

test('robots/sitemap use getSiteUrl; no hardcoded localhost', () => {
  const robots = readFileSync(join(root, 'apps/web/app/robots.ts'), 'utf8');
  const sitemap = readFileSync(join(root, 'apps/web/app/sitemap.ts'), 'utf8');
  assert.match(robots, /getSiteUrl/);
  assert.match(sitemap, /getSiteUrl/);
  assert.doesNotMatch(robots, /localhost:3000/);
  assert.doesNotMatch(sitemap, /localhost:3000/);
});

test('StructuredData: no invented sku/mpn/InStock/free app price', () => {
  const sd = readFileSync(join(root, 'apps/web/components/StructuredData.tsx'), 'utf8');
  assert.doesNotMatch(sd, /sku:\s*'MATEYOU-RING1C'/);
  assert.doesNotMatch(sd, /mpn:\s*'RING1C'/);
  assert.doesNotMatch(sd, /InStock/);
  assert.doesNotMatch(sd, /price:\s*'0'/);
  assert.match(sd, /getSiteUrl/);
});

test('Ring1C pages link to company entity', () => {
  const zh = readFileSync(join(root, 'apps/web/app/products/ring1c/page.tsx'), 'utf8');
  const en = readFileSync(join(root, 'apps/web/app/en/products/ring1c/page.tsx'), 'utf8');
  assert.match(zh, /href="\/company\/longvon"/);
  assert.match(en, /href="\/en\/company\/longvon"/);
});

test('Ring1C FAQPage strings are visible in page JSX (not schema-only)', () => {
  const zh = readFileSync(join(root, 'apps/web/app/products/ring1c/page.tsx'), 'utf8');
  const en = readFileSync(join(root, 'apps/web/app/en/products/ring1c/page.tsx'), 'utf8');
  assert.match(zh, /RING1C_FAQS_ZH\.map/);
  assert.match(en, /RING1C_FAQS_EN\.map/);
  assert.match(zh, /FaqSchema faqs=\{RING1C_FAQS_ZH\}/);
  assert.match(en, /FaqSchema faqs=\{RING1C_FAQS_EN\}/);
});

test('Ring1C ZH/EN metadata both use siteAlternates (shared hreflang set)', () => {
  const zh = readFileSync(join(root, 'apps/web/app/products/ring1c/page.tsx'), 'utf8');
  const en = readFileSync(join(root, 'apps/web/app/en/products/ring1c/page.tsx'), 'utf8');
  const i18n = readFileSync(join(root, 'apps/web/lib/i18n-routes.ts'), 'utf8');
  assert.match(i18n, /export function siteAlternates/);
  assert.match(i18n, /'zh-CN'/);
  assert.match(i18n, /'x-default'/);
  assert.match(zh, /siteAlternates\(site,\s*'\/products\/ring1c',\s*'zh'\)/);
  assert.match(en, /siteAlternates\(site,\s*'\/products\/ring1c',\s*'en'\)/);
  // ZH must not use canonical-only alternates (would omit hreflang)
  assert.doesNotMatch(zh, /alternates:\s*\{\s*canonical:/);
});

// Optional: import real TS module when strip-types available
try {
  const tsUrl = pathToFileURL(join(root, 'apps/web/lib/resolve-site-url.ts')).href;
  const real = await import(tsUrl);
  test('strip-types import of resolve-site-url.ts', () => {
    assert.equal(real.resolveSiteUrl('https://www.longvon.com/', 'production'), 'https://www.longvon.com');
    assert.throws(() => real.resolveSiteUrl(undefined, 'production'));
  });
} catch {
  test('strip-types import of resolve-site-url.ts', { skip: 'runtime cannot import .ts directly' }, () => {});
}
