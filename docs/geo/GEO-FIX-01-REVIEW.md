# GEO-FIX-01 Independent Code Review & Release Readiness

| Field | Value |
|---|---|
| Review date | 2026-11-02 |
| Branch | `geo/fix-01-identity-language` |
| Implementation report | `docs/geo/GEO-FIX-01-REPORT.md` |
| Audit | `docs/geo/GEO-TECH-AUDIT.md` |
| Mode | Read-only. No commits, stash, merge, rebase, or deploy. |
| Base commit | `0b0d50d` (`fix(ci): set NEXT_PUBLIC_SITE_URL for production web builds`) |
| Branch HEAD | **Identical to `main` / `origin/main`** (`0b0d50d`) |
| Unique commits on branch | **0** |

---

## Verdict

**APPROVED AFTER SPECIFIC FIXES**

The five GEO-FIX-01 corrections are technically correct and were validated on a local production build. They are **not** release-ready as a merge of this branch.

The branch has no commits. All FIX-01 work sits in an uncommitted working tree mixed with a large set of unrelated dirty and untracked files. Merging the branch today would ship **nothing**. Committing the working tree as-is would ship API, Prisma, nginx, deleted GEO archives, G5 attribution, and OEM page rewrites that are outside GEO-FIX-01.

Do not merge. Do not deploy from this working tree. Isolate a clean FIX-01 commit first (steps in §5).

---

## 1. Pass / fail for each of the five fixes

Judged on **implementation quality of the FIX-01 hunks**, not on git isolation. Isolation is a release blocker and is scored separately.

| # | Fix | Code | Local SSR evidence | Isolation | Overall |
|---|---|---|---|---|---|
| 1 | Server-rendered `html lang` | **PASS** | **PASS** (`/en*` → `lang="en"`) | **FAIL** (mixed into `layout.tsx` with G5 import) | Conditional pass |
| 2 | Reciprocal RFQ hreflang + EN `x-default` | **PASS** | **PASS** | **FAIL** (hreflang lives in OEM pages that also contain a large pre-existing rewrite vs git HEAD) | Conditional pass |
| 3 | LONGVON / MATEYOU identity | **PASS** with notes | **PASS** on sampled titles | **PASS** for title-only files; mixed for `layout.tsx` | Conditional pass |
| 4 | JSON-LD credential wording | **PASS** | **PASS** (`knowsAbout` has no ISO 13485 / NMPA) | **PASS** for `StructuredData.tsx` vs current tree; extra schema vs git HEAD | Conditional pass |
| 5 | `/en/smart-ring-oem-odm` Organization + Service | **PASS** | **PASS** (same `@id`s) | **FAIL** if the whole OEM GEO page diff vs HEAD is committed | Conditional pass |

**Git isolation of the branch as a merge unit: FAIL.**

---

## 2. Git isolation

### 2.1 Actual base

```
HEAD        = 0b0d50d
main        = 0b0d50d
origin/main = 0b0d50d
geo/fix-01-identity-language = 0b0d50d
commits on branch not in main: none
```

The branch pointer is a label on `main`. FIX-01 exists only as uncommitted edits.

Working tree vs HEAD (this review):

- Modified tracked files: **75**
- Deleted tracked files: **41** (mostly `docs/geo/*` archives)
- Untracked: **62**

### 2.2 Pre-existing dirty work inherited when the branch was created

These were already dirty on `main` before GEO-FIX-01 and are **not** part of the five corrections:

**Must exclude (API / data / infra / ops)**

- `apps/api/**` (growth, leads, syndication, commercial metrics)
- `packages/database/prisma/schema.prisma` and untracked migrations
- `infra/nginx.conf`, `infra/nginx-ecs-sites-mateyou.conf`
- `.env.example`, `.env.production.example`, `.gitignore`, `package-lock.json`
- `scripts/sync-lead-archive.sh`, `scripts/*zhihu*`, `scripts/*csdn*`, `scripts/*wikidata*`, `scripts/vibbe-publish-once.mjs`
- `docs/audits/`, `docs/automation/`, `docs/private/`, G1/G5/G6 GEO ops docs, snapshots, weekly
- Deleted `docs/geo/CHINA-AI-*`, `LONGVON-ENTITY*`, Task 15 reports, Qwen trackers

**Must exclude (web, unrelated to the five fixes)**

- `apps/web/lib/lead-attribution.ts` (+ spec)
- `apps/web/components/LeadAttributionCapture.tsx` **and its import in `layout.tsx`**
- `apps/web/lib/partner-api.ts`, `apps/web/next.config.ts` extra redirects (unless already in production)
- `apps/web/components/HeroSection.tsx`, `QualificationForm.tsx`, `SizeGuide.tsx`
- Untracked `apps/web/components/OemRfqForm.tsx`, `EnTrustStrip.tsx`, `geo-trust-en.ts`, `public/images/company/`, `tsconfig.tsbuildinfo`
- Large content diffs vs git HEAD on GEO pages (`page.tsx`, company pages, `geo-commercial.ts`, `GeoPageLayout.tsx`, `sitemap.ts`) that predate FIX-01
- `apps/web/components/CompanyTrustEvidence.tsx` as a **whole new component** (HEAD company pages do not import it). FIX-01 only tightened a few credential bullets inside that untracked file.

### 2.3 Mixed files (FIX-01 hunks + unrelated hunks in the same path)

These would drag unrelated changes into a naive `git add <file>`:

| File | FIX-01 hunk | Unrelated hunk vs `0b0d50d` |
|---|---|---|
| `apps/web/app/layout.tsx` | `headers()`, `html lang`, LONGVON default title/description | `LeadAttributionCapture` import + render |
| `apps/web/app/partner/oem/page.tsx` | `oemRfqAlternates(site, 'zh')` | Full RFQ rewrite vs HEAD `PartnerLandingLayout` (~296 lines) |
| `apps/web/app/en/partner/oem/page.tsx` | `oemRfqAlternates(site, 'en')`, `OemServiceSchema locale="en"` | Full EN RFQ rewrite vs HEAD |
| `apps/web/app/en/smart-ring-oem-odm/page.tsx` | `OemEntityGraphSchema` | NPI / trust-strip body that is not in git HEAD |
| `apps/web/components/StructuredData.tsx` | locale-aware service URL, no duplicate provider Organization, `OemEntityGraphSchema`, no ISO/NMPA in `knowsAbout` | Longer org description, `award[]`, contactPoint URL change vs HEAD |

**Production vs git HEAD mismatch (confirmed):** live `https://www.longvon.com/partner/oem` is already the long RFQ page (HTTP 200, ~57 KB, title `智能戒指 OEM/ODM 合作 | LONGVON`), not HEAD’s `OEM代工合作 | PartnerLandingLayout`. A “clean” commit that reapplies FIX-01 metadata onto **git HEAD OEM pages** and then deploys `apps/web` from `0b0d50d` would **regress production RFQ content**. Isolation must be against the deployed web tree, not only against git HEAD.

### 2.4 What would enter a merge today

- `git merge geo/fix-01-identity-language` → **empty** (no unique commits).
- `git add -A && git commit` on this branch → **the entire dirty tree**, including API/Prisma/nginx/deleted docs. Not acceptable.

---

## 3. Code review of the five fixes

### 3.1 Server-rendered language — PASS (logic)

`htmlLangFromPathname` uses `/en` and `/en/*` only. `/enfoo` stays `zh-CN`. Middleware only sets request header `x-html-lang`; it does not rewrite URLs, cookies, or crawler rules.

Root layout reads the header and SSRs `<html lang>`. Fallback without the header is `zh-CN` (safe for Chinese and for prerender without middleware).

`HtmlLang` is deleted and has **no remaining imports**. English layout is a pass-through.

**Runtime:** `headers()` in the root layout makes pages request-dynamic. The production build already marked essentially all public HTML routes `ƒ` except `robots.txt` (static) and `/metrics/[slug]` (SSG, Chinese — fallback `zh-CN` is correct). No English SSG routes exist today. **Risk:** a future static English page would inherit `zh-CN` unless middleware runs at request time.

**Side effect to strip:** `LeadAttributionCapture` in the same layout file is G5, not FIX-01. Leaving it in a FIX-01 commit either (a) fails the build if the untracked component is omitted, or (b) ships first-touch attribution sitewide without this review covering it.

Local prod evidence (`next start :3010`): `/en`, `/en/partner/oem`, `/en/smart-ring-oem-odm` → `lang="en"`; `/`, `/partner/oem` → `lang="zh-CN"`.

### 3.2 RFQ hreflang — PASS (logic)

`oemRfqAlternates` is reciprocal: both locales emit the same `languages` map. Canonical is locale-self. `x-default` is the English RFQ URL.

ZH `/partner/oem` no longer uses canonical-only metadata (the audit defect).

Other `siteAlternates` callers keep ZH `x-default`. That is an intentional scope limit, not a bug. It does mean home/GEO clusters still tell unspecified-locale crawlers to use Chinese. Acceptable for this slice.

**Not a hreflang conflict:** `GlobalNav` language switchers use `<a hrefLang>`. Google’s hreflang set is `<link rel="alternate" hreflang>`. Those are different elements. Duplicate *counts* in a naive HTML scrape are nav anchors plus metadata links, not two conflicting alternate sets.

### 3.3 Identity — PASS with notes

Root default + template switch to LONGVON is the correct manufacturer default. Consumer surfaces use `title.absolute` with a single `| MATEYOU`, which is the right fix for the live double suffix `健康知识库 | MATEYOU | MATEYOU`.

Hospital / pharmacy / distributor / enterprise remain MATEYOU (consumer/channel). Partner hub and partner articles switch to LONGVON (B2B). That split is consistent with the task.

Ring1C titles still name MATEYOU as product and LONGVON as manufacturer. Not a global replace.

**Notes (not merge blockers for the five items):**

- `ArticleDetailView` keeps any `seoTitle` that already contains `|` even on partner articles, so a CMS title `… | MATEYOU` would survive on `/partner/articles/[slug]`.
- `/partner` title LONGVON vs child hospital/pharmacy titles MATEYOU is a deliberate mixed hub, not a crawler break.
- Root `openGraph.locale` remains `zh_CN`. EN pages that set `openGraph.locale: en_US` override; EN pages that do not still inherit Chinese OG locale. Pre-existing pattern; not introduced as a new FIX-01 requirement.

### 3.4 Credentials — PASS

Current `knowsAbout` does not list `ISO 13485` or NMPA practices. Description keeps **“ISO 13485–oriented quality practices (project-scoped)”**. `OemServiceSchema` no longer emits a second Organization without `@id`.

vs git HEAD, HEAD never had ISO in `knowsAbout`. Production (audit 2026-11-02) did. Shipping current `StructuredData.tsx` is a production improvement, not a HEAD regression.

`award[]` and the longer description vs HEAD are extra schema, not invented certificates. Visible `CompanyTrustEvidence` bullet cleanup is correct but **not deployable alone** (component untracked; HEAD company pages do not import it). JSON-LD fix does not depend on it.

### 3.5 OEM page structured data — PASS

`OemEntityGraphSchema` reuses:

- `https://www.longvon.com/#organization`
- `https://www.longvon.com/#service-oem-odm`

WebPage `mainEntity` → Service; `about` → Organization; Service `provider` → Organization `@id` only. No second Organization type with a conflicting id. Breadcrumb + FAQ remain separate scripts (valid). Canonical stays self (`/en/smart-ring-oem-odm`).

EN RFQ `OemServiceSchema locale="en"` points service `url` at `/en/partner/oem`. ZH default remains `/partner/oem`.

---

## 4. Runtime verification

### 4.1 Production (live, **FIX-01 not deployed**)

| URL | HTTP | `html lang` | Title | Notes |
|---|---|---|---|---|
| `/knowledge` | **200** | zh-CN | `健康知识库 \| MATEYOU \| MATEYOU` | API-backed page works. Double suffix still live. |
| `/partner/articles` | **200** | zh-CN | `商业合作资讯 \| MATEYOU \| MATEYOU` | API-backed page works. ~198 KB, real h1. |
| `/en/smart-ring-oem-odm` | **200** | **zh-CN** | LONGVON OEM title | Reciprocal GEO hreflang; x-default ZH. No FIX-01 lang. |
| `/smart-ring-oem-odm` | **200** | zh-CN | LONGVON | Reciprocal with EN. |
| `/en/partner/oem` | **200** | **zh-CN** | LONGVON RFQ | x-default still ZH. |
| `/partner/oem` | **200** | zh-CN | LONGVON RFQ | **No** `link rel="alternate"` hreflang. |

Local-only 500s on `/knowledge` and `/partner/articles` were API-down in the FIX-01 laptop `next start`. **Not a production regression.** Those routes are healthy on `www.longvon.com`.

### 4.2 Local production build of the working tree (FIX-01 present)

Previously recorded (report + this review’s file read):

- EN OEM / EN RFQ: `lang="en"`
- ZH OEM / ZH RFQ: `lang="zh-CN"`
- RFQ pair: reciprocal absolute hreflang; `x-default` → `https://www.longvon.com/en/partner/oem`
- `/en/smart-ring-oem-odm`: Organization + Service `@id` reuse; `knowsAbout` without ISO/NMPA
- Consumer titles: single `| MATEYOU` on knowledge/hospital/pharmacy/membership/dashboard

No evidence of Chinese OEM or RFQ content regression in that local run (titles, 200s, canonicals intact).

Build: `NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build --workspace=apps/web` succeeded; middleware emitted (34.2 kB). Tests: `i18n-routes.spec.mjs` 4/4, `verify-site-url.mjs` 17/17.

---

## 5. Exact recommended merge strategy

Do **not**: merge this branch, `git add -A`, rebase, or deploy the current working tree.

Do this:

1. **Leave `geo/fix-01-identity-language` as a scratch label.** Create a **new** branch from the web tree that matches production (or from `origin/main` only if OEM RFQ files are first restored to the production versions — git HEAD is behind production on those pages).
2. **Commit only FIX-01 paths**, after stripping mixed hunks:

   **Add as new (clean):**
   - `apps/web/middleware.ts`
   - `apps/web/app/en/layout.tsx` (HtmlLang removed)
   - `apps/web/app/assessment/layout.tsx`
   - `apps/web/app/dashboard/layout.tsx`
   - `apps/web/lib/i18n-routes.spec.mjs` (optional for deploy, required for CI)
   - `docs/geo/GEO-FIX-01-REPORT.md`
   - this review

   **Patch, do not take the whole dirty file blindly:**
   - `apps/web/app/layout.tsx` — keep lang + LONGVON metadata; **drop `LeadAttributionCapture`**
   - `apps/web/lib/i18n-routes.ts` — entire current diff vs HEAD is FIX-01; OK
   - `apps/web/components/StructuredData.tsx` — current file is acceptable for FIX-01 + compatible schema; do not revert `knowsAbout` to include ISO
   - Title-only pages listed in the implementation report (knowledge, hospital, pharmacy, membership, about, news, metrics, authors, topics, `ArticleDetailView`)
   - RFQ + EN OEM pages — apply **metadata/schema hunks onto the production RFQ/OEM source**, not onto git HEAD `PartnerLandingLayout`

   **Delete in the same commit:**
   - `apps/web/components/HtmlLang.tsx`

3. **Do not add** API, Prisma, nginx, env examples, lead-archive scripts, G5 attribution files, deleted GEO archives, `CompanyTrustEvidence.tsx` unless a separate change is approved.
4. CI: `node --test scripts/geo/verify-site-url.mjs` and `node --experimental-strip-types --test apps/web/lib/i18n-routes.spec.mjs`, then `NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build --workspace=apps/web`.
5. Deploy web only. Confirm standalone/nginx still executes Next middleware (otherwise EN `html lang` falls back to `zh-CN`). Smoke-curl:
   - `/en`, `/en/partner/oem`, `/en/smart-ring-oem-odm` → `lang="en"`
   - `/partner/oem` → reciprocal hreflang + EN x-default
   - `/knowledge`, `/partner/articles` → 200, single brand suffix
6. Then merge **that** isolated commit to `main`. Discard or keep the dirty scratch branch separately; do not fast-forward it.

---

## 6. Files that belong to GEO-FIX-01

Use this as the allow-list for the isolated commit (after mixed-hunk surgery):

- `apps/web/middleware.ts`
- `apps/web/app/layout.tsx` (FIX-01 hunks only)
- `apps/web/app/en/layout.tsx`
- `apps/web/app/assessment/layout.tsx`
- `apps/web/app/dashboard/layout.tsx`
- `apps/web/lib/i18n-routes.ts`
- `apps/web/lib/i18n-routes.spec.mjs`
- `apps/web/components/StructuredData.tsx`
- `apps/web/components/ArticleDetailView.tsx`
- `apps/web/components/HtmlLang.tsx` (delete)
- `apps/web/app/partner/oem/page.tsx` (hreflang/metadata only, on production page)
- `apps/web/app/en/partner/oem/page.tsx` (hreflang/schema locale only, on production page)
- `apps/web/app/en/smart-ring-oem-odm/page.tsx` (`OemEntityGraphSchema` mount; not the whole NPI body vs HEAD unless that body is already production)
- Title absolute updates: knowledge, hospital, pharmacy, distributor, enterprise, partner hub, partner articles, membership, about, Ring1C ZH, authors, topics, assessment, metrics, news
- `scripts/geo/verify-site-url.mjs`
- `docs/geo/GEO-FIX-01-REPORT.md`

Optional / not required to meet the five fixes: `CompanyTrustEvidence.tsx` bullet edits.

---

## 7. Unrelated changes that must be excluded

Everything in §2.2, plus:

- `LeadAttributionCapture` in root layout
- Entire OEM RFQ **rewrite vs git HEAD** if the deploy base is `0b0d50d` rather than production (would be a content deploy, not FIX-01)
- Untracked `OemRfqForm`, `EnTrustStrip`, `geo-trust-en.ts` unless the deploy already contains them
- All `docs/geo` G1/G5/G6/ops files except the FIX-01 report/review
- `apps/web/tsconfig.tsbuildinfo`

---

## 8. Confirmed bugs and remaining risks

| Severity | Item | Type |
|---|---|---|
| **Blocker** | Branch has 0 commits; working tree is mixed | Process / isolation |
| **Blocker** | Naive commit would include API/Prisma/nginx/deleted docs | Process |
| **Blocker** | git HEAD OEM pages ≠ production OEM pages | Deploy safety |
| High | `layout.tsx` couples FIX-01 lang with untracked G5 `LeadAttributionCapture` | Build/scope |
| Medium | Root `headers()` + missing middleware in a misconfigured standalone deploy → all HTML `lang="zh-CN"` | Ops |
| Low | `<a hrefLang>` in nav is not `rel=alternate`; ignore as hreflang duplication | Noise |
| Low | Partner article `seoTitle` containing `\|` keeps CMS brand suffix | Identity edge |
| Low | GEO/home `x-default` still ZH | Intentional deferral |
| Info | `/about` still has no Organization JSON-LD | Out of scope |
| Info | Production still shows the five audit defects until an isolated deploy | Expected |

No confirmed functional bug in the five FIX-01 implementations themselves.

---

## 9. Is it safe to deploy?

**No — not from this branch or this working tree.**

The five corrections **would** be safe to deploy after:

1. A surgical commit with the allow-list in §6,
2. `LeadAttributionCapture` removed from that commit,
3. OEM files based on **production** RFQ/GEO pages rather than git HEAD landings,
4. Web-only deploy with middleware actually running,
5. Smoke curls in §5.5.

Until then: **do not merge, do not deploy.**

---

## Final conclusion

**APPROVED AFTER SPECIFIC FIXES**

Specific fixes required:

1. Do not merge `geo/fix-01-identity-language` (it equals `main`).
2. Isolate FIX-01 into a new commit/branch using the allow-list; exclude all §7 files.
3. Strip `LeadAttributionCapture` from `layout.tsx` in that commit.
4. Patch RFQ/OEM metadata onto the production page sources, not onto git HEAD `PartnerLandingLayout`.
5. Re-run the listed tests and web build; smoke-curl EN `lang` and RFQ hreflang after deploy.

The five GEO corrections themselves do not need a design redo.
)
