# GEO-FIX-01: LONGVON Identity & Language Correction

| Field | Value |
|---|---|
| Branch | `geo/fix-01-identity-language` |
| Date | 2026-11-02 |
| Source audit | `docs/geo/GEO-TECH-AUDIT.md` |
| Deploy | **Not deployed.** Awaiting approval. |
| Merge | **Not merged.** |

## Objective

Correct the five confirmed technical issues that reduce English discoverability and OEM/ODM entity attribution, without adding landing pages, crawler rules, AI files, pricing, product specs, or commercial claim changes.

---

## Summary of outcomes

| # | Issue | Status |
|---|---|---|
| 1 | Server-rendered `html lang` | **Fixed** — EN routes SSR `lang="en"`; ZH routes SSR `lang="zh-CN"` |
| 2 | RFQ reciprocal hreflang + x-default | **Fixed** — `/partner/oem` ↔ `/en/partner/oem` share the same language set; `x-default` → EN RFQ |
| 3 | LONGVON / MATEYOU identity separation | **Fixed** for root metadata, partner hub, knowledge/hospital/pharmacy title suffixes; consumer MATEYOU pages preserved |
| 4 | ISO 13485 / NMPA credential wording in JSON-LD | **Fixed** — removed from `knowsAbout`; description remains “oriented”; visible trust bullets clarified |
| 5 | `/en/smart-ring-oem-odm` Organization + Service schema | **Fixed** — reuses `/#organization` and `/#service-oem-odm` |

---

## 1. Server-rendered language attributes

### Change

- Added `apps/web/middleware.ts` to stamp request header `x-html-lang` from pathname (`/en`, `/en/*` → `en`; otherwise `zh-CN`).
- Root layout (`apps/web/app/layout.tsx`) is async, reads that header via `headers()`, and renders `<html lang={lang}>`.
- Removed client-only `HtmlLang` (`apps/web/components/HtmlLang.tsx` deleted; `apps/web/app/en/layout.tsx` no longer mounts it).

### Before / after (production HTML on `http://127.0.0.1:3010`)

| URL | Before (live prod / audit) | After (local prod build) |
|---|---|---|
| `/en` | `<html lang="zh-CN">` | `<html lang="en">` |
| `/en/partner/oem` | `<html lang="zh-CN">` | `<html lang="en">` |
| `/en/smart-ring-oem-odm` | `<html lang="zh-CN">` | `<html lang="en">` |
| `/` | `<html lang="zh-CN">` | `<html lang="zh-CN">` |
| `/partner/oem` | `<html lang="zh-CN">` | `<html lang="zh-CN">` |

Evidence collected from raw `curl` response bodies (not browser DOM).

---

## 2. Hreflang correction (RFQ pair)

### Change

- Added `oemRfqAlternates()` in `apps/web/lib/i18n-routes.ts` with reciprocal `zh-CN` / `en` and **`x-default` → English RFQ**.
- Extended `siteAlternates(..., { xDefault })` so non-RFQ bilingual pages keep previous ZH `x-default` (no unrelated SEO expansion).
- ZH `/partner/oem` now uses `oemRfqAlternates(site, 'zh')` instead of canonical-only.
- EN `/en/partner/oem` uses `oemRfqAlternates(site, 'en')`.

### Before / after

**Before (audit)**

`/en/partner/oem`:

```
canonical → /en/partner/oem
hreflang zh-CN → /partner/oem
hreflang en → /en/partner/oem
hreflang x-default → /partner/oem   ← Chinese
```

`/partner/oem`:

```
canonical → /partner/oem
(no hreflang)
```

**After (local prod build)**

Both pages emit the same absolute language set:

```
canonical (ZH page) → https://www.longvon.com/partner/oem
canonical (EN page) → https://www.longvon.com/en/partner/oem
hreflang zh-CN → https://www.longvon.com/partner/oem
hreflang en → https://www.longvon.com/en/partner/oem
hreflang x-default → https://www.longvon.com/en/partner/oem
```

Canonical remains locale-self on each page. Absolute Next.js `alternates.languages` entries are present (nav may also emit relative language links; they do not conflict with the absolute set).

### Intentionally unchanged

Other bilingual pages (`/`, `/en`, GEO pages, Ring1C) still use `siteAlternates` / `geoAlternates` with **ZH `x-default`**. Only the OEM RFQ pair was switched to EN `x-default`, matching the overseas B2B objective and the audit recommendation. Changing every GEO `x-default` was deferred to avoid a broad SEO policy flip without separate approval.

---

## 3. LONGVON / MATEYOU entity separation

### Identity rules applied

| Surface | Brand in title / metadata |
|---|---|
| Root default title / description / keywords | **LONGVON** manufacturer + OEM/ODM |
| Root title template | `%s \| LONGVON` |
| OEM / GEO / company / about / news / partner hub / partner articles | **LONGVON** |
| Knowledge hub + articles, hospital / pharmacy / distributor / enterprise, membership, assessment, metrics, dashboard | **MATEYOU** (absolute titles — no double suffix) |
| Ring1C product pages | Keep **MATEYOU Ring1C … \| LONGVON …** (brand + manufacturer) |

### Before / after titles (local prod build)

| URL | Before | After |
|---|---|---|
| Site default (pages without absolute title) | `MATEYOU · AI数字健康平台 \| 龙汾科技` + template `\| MATEYOU` | `智能戒指制造商与 OEM/ODM \| LONGVON 龙汾科技` + template `\| LONGVON` |
| `/knowledge` | `健康知识库 \| MATEYOU \| MATEYOU` | `健康知识库 \| MATEYOU` |
| `/partner/hospital` | `医院合作 \| MATEYOU \| MATEYOU` | `医院合作 \| MATEYOU` |
| `/partner/pharmacy` | `药房渠道合作 \| MATEYOU \| MATEYOU` | `药房渠道合作 \| MATEYOU` |
| `/partner` | `商业合作 \| MATEYOU` (+ possible double) | `商业合作 \| LONGVON` |
| `/partner/articles` | `商业合作资讯 \| MATEYOU` | `商业合作资讯 \| LONGVON` |
| `/membership` | default MATEYOU platform title | `会员权益 \| MATEYOU` |
| `/dashboard` | default MATEYOU platform title | `我的健康中心 \| MATEYOU` |
| `/en/partner/oem` | already LONGVON absolute | unchanged absolute LONGVON |
| `/en/products/ring1c` | MATEYOU + LONGVON absolute | unchanged |

Descriptions for hospital/pharmacy pages still mention MATEYOU as the consumer brand; body copy was not rewritten beyond title/metadata scope.

---

## 4. Credential and regulatory wording

### JSON-LD (`Organization.knowsAbout`)

**Before:** included `'ISO 13485'` and `'NMPA medical device manufacturing practices'` alongside enterprise awards.

**After:** those two entries removed. Remaining knowsAbout is manufacturer / OEM / monitoring capability language plus Class 100000 cleanroom and National High-Tech Enterprise.

`Organization.description` still states **“ISO 13485–oriented quality practices (project-scoped)”** — expertise wording, not a certificate claim.

`sameAs` no longer includes the on-site `/en/company/longvon` URL (kept `https://www.mateyou.net` only).

### Visible trust copy (`CompanyTrustEvidence`)

Bullets that previously read as NMPA Class II capability / “aligned with NMPA GMP and ISO 13485” were clarified to **project-scoped / oriented / not a public certification or registration claim**. No new certifications invented.

### Unchanged (by design)

- Enterprise awards already listed as on-site credentials (National High-Tech Enterprise, SME designations) remain in `award`.
- Body copy elsewhere that already said “oriented / aligned / not FDA/CE/NMPA certification” was left alone.

---

## 5. Core OEM/ODM page structured data

### Change

- Added `OemEntityGraphSchema` reusing `@id` `https://www.longvon.com/#organization` and `#service-oem-odm`.
- Mounted on `/en/smart-ring-oem-odm`.
- `oemServiceNode(locale)` now points `url` / `termsOfService` at the locale-correct RFQ and GEO OEM pages.
- `OemServiceSchema({ locale })` no longer inlines a second anonymous Organization under `provider` (uses `{ '@id': orgId() }` only).

### After (local prod HTML, `/en/smart-ring-oem-odm`)

JSON-LD scripts: Organization + Service + WebPage graph, plus existing BreadcrumbList and FAQPage.

```
Organization @id = https://www.longvon.com/#organization
Service @id = https://www.longvon.com/#service-oem-odm
  provider = { @id: https://www.longvon.com/#organization }
  url = https://www.longvon.com/en/partner/oem
WebPage @id = https://www.longvon.com/en/smart-ring-oem-odm#webpage
  mainEntity = { @id: #service-oem-odm }
  about = { @id: #organization }
```

Canonical: `https://www.longvon.com/en/smart-ring-oem-odm` (unchanged self-canonical).

---

## Modified files (GEO-FIX-01 scope)

### Added

- `apps/web/middleware.ts`
- `apps/web/app/assessment/layout.tsx`
- `apps/web/app/dashboard/layout.tsx`
- `apps/web/lib/i18n-routes.spec.mjs`
- `docs/geo/GEO-FIX-01-REPORT.md` (this file)

### Updated

- `apps/web/app/layout.tsx`
- `apps/web/app/en/layout.tsx`
- `apps/web/lib/i18n-routes.ts`
- `apps/web/components/StructuredData.tsx`
- `apps/web/components/CompanyTrustEvidence.tsx`
- `apps/web/components/ArticleDetailView.tsx`
- `apps/web/app/partner/oem/page.tsx`
- `apps/web/app/en/partner/oem/page.tsx`
- `apps/web/app/en/smart-ring-oem-odm/page.tsx`
- `apps/web/app/knowledge/page.tsx`
- `apps/web/app/knowledge/[slug]/page.tsx`
- `apps/web/app/partner/page.tsx`
- `apps/web/app/partner/articles/page.tsx`
- `apps/web/app/partner/hospital/page.tsx`
- `apps/web/app/partner/pharmacy/page.tsx`
- `apps/web/app/partner/distributor/page.tsx`
- `apps/web/app/partner/enterprise/page.tsx`
- `apps/web/app/membership/page.tsx`
- `apps/web/app/about/page.tsx`
- `apps/web/app/products/ring1c/page.tsx`
- `apps/web/app/authors/[id]/page.tsx`
- `apps/web/app/topics/[slug]/page.tsx`
- `apps/web/app/assessment/page.tsx`
- `apps/web/app/metrics/page.tsx`
- `apps/web/app/metrics/[slug]/page.tsx`
- `apps/web/app/news/page.tsx`
- `apps/web/app/news/[slug]/page.tsx`
- `scripts/geo/verify-site-url.mjs`

### Deleted

- `apps/web/components/HtmlLang.tsx`

### Note on working tree

Branch `geo/fix-01-identity-language` was created from a dirty `main` that already contained unrelated GEO/content/API modifications. The list above is the GEO-FIX-01 intentional set. Do not treat every dirty file on the branch as part of this fix when reviewing or committing.

---

## Build and validation results

### Unit / source checks

```
node --experimental-strip-types --test apps/web/lib/i18n-routes.spec.mjs
→ 4/4 pass (htmlLangFromPathname + oemRfqAlternates)

node --test scripts/geo/verify-site-url.mjs
→ 17/17 pass (includes new GEO-FIX-01 asserts for lang SSR, RFQ hreflang, knowsAbout, OemEntityGraphSchema)
```

### Production build

```
NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build --workspace=apps/web
→ Compiled successfully
→ Typecheck OK
→ ESLint: 2 pre-existing warnings in admin pages only
→ Middleware emitted (34.2 kB)
→ Routes /en/smart-ring-oem-odm, /partner/oem, /en/partner/oem present
```

### Local production HTTP validation

Started with `next start -p 3010` (Next printed the usual standalone warning; server still served pages for validation).

Confirmed via raw HTTP:

- EN pages: `lang="en"`
- ZH pages: `lang="zh-CN"`
- RFQ reciprocal hreflang + EN `x-default`
- OEM page Organization/Service `@id` reuse; no ISO/NMPA in `knowsAbout`
- Consumer titles keep single `| MATEYOU` (no double suffix)

### Local-only failures (not regressions of this fix)

| Path | Result | Explanation |
|---|---|---|
| `/knowledge` | 500 (`fetch failed` / ECONNREFUSED) | Page fetches knowledge API; no API running locally. **Title metadata still resolves to `健康知识库 \| MATEYOU`.** |
| `/partner/articles` | 500 same cause | Same API dependency. Title still `商业合作资讯 \| LONGVON`. |

These pages build and were not modified beyond absolute titles. Production already runs with API; no deploy performed here.

---

## Issues not safely resolved in this slice

| Item | Reason |
|---|---|
| Flip all GEO / home `x-default` to English | Only RFQ pair was in scope. Broader flip needs explicit SEO/locale approval. |
| Deduplicate knowledge near-duplicate articles | Content/ops decision; would change sitemap volume and indexation. Out of scope. |
| Add Organization schema to `/about` / `/en/about` | Audit P1 follow-up; not one of the five mandated items. |
| `noindex` `/dashboard` | Audit P2; not requested in GEO-FIX-01. Title corrected to MATEYOU only. |
| Commit / PR / deploy | Explicitly forbidden until approval. |

---

## Answer for reviewers

GEO-FIX-01 corrects the five confirmed technical defects from the audit on branch `geo/fix-01-identity-language`. English OEM pages now declare `lang="en"` in the original HTML; the RFQ pair is reciprocal with English `x-default`; sitewide default identity is LONGVON while consumer MATEYOU surfaces keep a single MATEYOU title; JSON-LD no longer lists ISO 13485/NMPA as `knowsAbout` credentials; and `/en/smart-ring-oem-odm` exposes Organization + Service using the existing entity IDs.

**Do not merge or deploy until approved.**
)
