# LONGVON GEO Task #15.3 — M2 Deployment Report

**Date:** 2026-10-17 (UTC+8)  
**Target:** https://www.longvon.com  
**Release set:** M2 (URL + StructuredData + ZH/EN Ring1C)  
**Final status:** **DEPLOYED AND VERIFIED**  
**Rollback triggered:** **No**  
**AI visibility impact:** **NOT VERIFIED** (technical SEO/schema only; do not infer AI recommendation)

Evidence directory: `docs/geo/_task15_3_evidence/`

---

## 1. Execution timeline (actual)

| Time (approx, local) | Step | Result |
|----------------------|------|--------|
| ~14:44–14:48 | Read Task #15 / #15.1 / #15.2; confirm deploy path (`scripts/deploy.sh`, GHA rsync → ECS `/root/mateyou`, PM2 `mateyou-web` / `mateyou-api`) | OK |
| ~14:48 | SSH alias `mateyou-ecs` → CONNECTED; prod healthy (web+api online) | OK |
| ~14:49 | Record local baseline `main` @ `d868a18…`; dirty tree preserved (no reset/clean/stash/add -A) | OK |
| ~14:50 | Create isolated worktree `/tmp/longvon-release-15-m2` at `d868a18`; copy **only** M2 files | OK |
| ~14:51–14:56 | `npm ci` in worktree | OK (exit 0) |
| ~14:56 | `node --test scripts/geo/verify-site-url.mjs` | **12/12 pass** |
| ~14:56 | `tsc --noEmit -p apps/web/tsconfig.json` | **pass** |
| ~14:56 | `next lint` on M2 files | **pass** |
| ~14:56–14:57 | Local `NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build --workspace=apps/web` | **pass**; robots/sitemap bake OK |
| ~15:05 | Pre-deploy backup on ECS; rsync **only** 7 M2 sources | OK |
| ~15:05–15:08 | ECS web-only build + `pm2 restart mateyou-web` (no DB migrate, no API rebuild) | OK |
| ~15:08–15:10 | Live HTTPS acceptance (robots/sitemap/pages/JSON-LD) | OK |

---

## 2. Pre / post version identifiers

| Item | Before | After |
|------|--------|-------|
| Web `BUILD_ID` | `dB_AknY7v4p7F-UlvFGv8` | `1_zGbAQWmiEKINOejV1Wd` |
| Standalone mtime (pre) | 2026-10-08 08:39:19 +0800 | rebuilt 2026-10-17 |
| PM2 `mateyou-web` | online, restarts **5**, uptime ~9D | online, restarts **6**, fresh start |
| PM2 `mateyou-api` | online, restarts **0** | **unchanged** (not restarted) |
| Live robots Host/Sitemap | `http://localhost:3000` | `https://www.longvon.com` |
| Sitemap localhost `<loc>` count | **130** | **0** |

**Rollback artifacts retained on ECS:**

- `/root/mateyou/_rollback/web-standalone.bak.20261017150501`
- `/root/mateyou/_rollback/m2-src-bak.20261017150501` (pre-M2 copies of overwritten sources)

---

## 3. M2 files actually published

Copied from dirty workspace → release worktree → ECS `/root/mateyou` (hashes matched):

| # | Path | Action |
|---|------|--------|
| 1 | `apps/web/lib/resolve-site-url.ts` | ADD |
| 2 | `apps/web/lib/site.ts` | REPLACE |
| 3 | `apps/web/app/layout.tsx` | REPLACE |
| 4 | `apps/web/components/StructuredData.tsx` | REPLACE (full current GEO+Task15 content) |
| 5 | `apps/web/app/products/ring1c/page.tsx` | REPLACE (full current GEO+Task15 content) |
| 6 | `apps/web/app/en/products/ring1c/page.tsx` | REPLACE (full current GEO+Task15 content) |
| 7 | `scripts/geo/verify-site-url.mjs` | ADD |

**Explicitly not published:** API syndication, Prisma migrations, nginx, other GEO pages, `.env*.example`, `SizeGuide.tsx`, `geo.ts`, dirty homepage/OEM churn, etc.

**Dependency note:** ZH Ring1C imports HEAD `SizeGuide` + HEAD `geo` symbols (`BRAND_RELATION_ZH`, `LEGAL_NAME_ZH`) — present on ECS; no extra files required. Modified dirty `SizeGuide` (giftcard.jpg) **not** shipped.

---

## 4. Build / test / lint / TypeScript

| Check | Where | Result |
|-------|-------|--------|
| URL unit tests | Laptop worktree | **PASS** 12/12 |
| URL unit tests | ECS (pre-build) | **PASS** 11 pass + 1 skip (`.ts` direct import) |
| TypeScript `tsc --noEmit` | Laptop worktree | **PASS** |
| Lint (M2 file list) | Laptop worktree | **PASS** (no warnings/errors) |
| Next.js production build | Laptop + `NEXT_PUBLIC_SITE_URL=https://www.longvon.com` | **PASS** |
| Next.js production build | ECS + production env (`SITE_URL_HOST=www.longvon.com`) | **PASS** (pre-existing admin hook warnings only) |
| Baked robots Host/Sitemap | ECS `.next/server/app/robots.txt.body` | `https://www.longvon.com` |
| Baked sitemap localhost | ECS | **0** |

---

## 5. Deploy method and result

**Environment confirmed (not assumed):**

- Host via SSH `mateyou-ecs` → ECS `/root/mateyou`
- Process manager: **PM2** (`mateyou-web` → standalone `server.js`, `mateyou-api`)
- Reverse proxy: nginx (public HTTPS 200)
- Node on ECS: **v20.20.2** / npm **10.8.2**
- `NEXT_PUBLIC_SITE_URL` present in production env / ecosystem (value not logged)

**Method used (safer than full `./scripts/deploy.sh`):**

1. Backup standalone + overwritten sources  
2. Rsync **only** M2 sources  
3. Load production env; force bake host check (reject localhost)  
4. `npm run build --workspace=apps/web`  
5. Sync `public` + `.next/static` into standalone  
6. `pm2 restart mateyou-web --update-env` only  
7. Local health: `/`, robots prod sitemap URL, API `/health/live`

**Not run (by design):**

- `npm run db:migrate:deploy` — **NOT RUN**
- API rebuild / `pm2 restart mateyou-api` — **NOT RUN**
- Full-repo rsync of dirty laptop tree — **NOT RUN**
- Git commit / push — **NOT RUN**

**Result:** web online; API online; localhost SEO bake fixed.

---

## 6. Live HTTPS checks — robots / sitemap / canonical / hreflang

### A. robots.txt — **PASS**

- HTTP **200**
- `Host: https://www.longvon.com`
- `Sitemap: https://www.longvon.com/sitemap.xml`
- localhost count: **0**

### B. sitemap.xml — **PASS**

- HTTP **200**
- `<loc>` count: **66**; all `https://www.longvon.com…`
- localhost count: **0** (was 130)

### C. Pages — **PASS**

| URL | HTTP | Notes |
|-----|------|-------|
| `/products/ring1c` | 200 | H1 `MATEYOU Ring1C 智能戒指`; FAQ + company links |
| `/en/products/ring1c` | 200 | H1 `MATEYOU Ring1C Smart Ring`; FAQ + company links |
| `/` | 200 | OK |
| `/company/longvon` | 200 | OK |

### D. canonical / hreflang

| Page | canonical | hreflang | localhost |
|------|-----------|----------|-----------|
| ZH `/products/ring1c` | `https://www.longvon.com/products/ring1c` **PASS** | **None emitted** (source only sets `alternates.canonical`) | none |
| EN `/en/products/ring1c` | `https://www.longvon.com/en/products/ring1c` **PASS** | zh-CN / en / x-default absolute longvon URLs **PASS** | none |

**Residual:** ZH Ring1C still lacks language alternate link tags; EN carries the bilingual hreflang set. Not a localhost regression; tracked as follow-up (not rolled back).

---

## 7. JSON-LD acceptance — **PASS**

Both ZH and EN:

- JSON-LD blocks parse (**3** each)
- Types include Organization, Brand, Product, Service, SoftwareApplication, FAQPage, BreadcrumbList, WebPage (entity graph present)
- **Offer count: 0**
- **No** `InStock`, **no** invented `MATEYOU-RING1C` sku/mpn, **no** App `price: 0`
- FAQPage questions **all appear as visible page FAQ text** (not schema-only)

---

## 8. Product page functional checks — **PASS**

- Visible FAQ headings/content (ZH `常见问题`; EN FAQ questions)
- LONGVON company links (`/company/longvon` present on both)
- No 5xx on checked URLs
- Layout HTML intact enough for content/schema extraction (visual UI pixel QA: **NOT VERIFIED** beyond HTML/HTTP)

---

## 9. Failures / unverified / residual risk

| Item | Status |
|------|--------|
| AI recommendation / GEO visibility improvement | **NOT VERIFIED** |
| ZH Ring1C hreflang language tags | **Residual gap** (canonical only in shipped M2 source) |
| Pixel-perfect UI / mobile layout review | **NOT VERIFIED** (HTML/HTTP only) |
| Full `deploy.sh` path (git pull + migrate + API) | **NOT RUN** (intentionally web-only) |
| Git commit of M2 sources | **NOT RUN** (per task) — workspace remains dirty; ECS has sources + build |
| Next.js “Failed to find Server Action” log lines after restart | Observed once in PM2 error log; web Ready; treated as stale-client noise — **monitor** |
| Embedded credential in local `git remote` URL | **NOT VERIFIED** in this task for rotation; do not commit remotes with tokens |

---

## 10. Rollback

- **Triggered:** No  
- **Available:** restore `_rollback/web-standalone.bak.20261017150501` into `apps/web/.next/standalone`, optionally restore `m2-src-bak.20261017150501` sources, then `pm2 restart mateyou-web`  
- **Current service state:** `mateyou-web` **online**; `mateyou-api` **online**; API live health **OK**

---

## 11. Conclusion

**DEPLOYED AND VERIFIED**

M2 was built with `NEXT_PUBLIC_SITE_URL=https://www.longvon.com`, deployed to production ECS as a web-only release, and live HTTPS checks confirm robots/sitemap/canonical (EN hreflang) no longer use localhost; Ring1C ZH/EN FAQ + company links + cleaned JSON-LD are live. Rollback package retained; no DB migration; no git commit/push.
