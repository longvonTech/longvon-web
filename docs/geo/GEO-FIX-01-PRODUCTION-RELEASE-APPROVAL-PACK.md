# GEO-FIX-01 PRODUCTION RELEASE APPROVAL PACK

**Review type:** Final read-only production release approval review  
**Reviewed at (UTC):** 2026-11-08T14:56:27Z  
**Package:** `GEO-FIX-01-PHASE-3` / `3.0.0`  
**Frozen payload commit:** `8e41fd4c6cf8f934ded7b8b87ddebc35a61e1ecf`  
**Frozen Phase 3 docs commit:** `8ac87e6810110444ecc9af20cd16b6f033c10ad6`  
**Frozen manifest SHA256:** `bc13b55c7163068edc2e7a00ac6dd8a49625f67127c8aa06a726bc7be7af688f`  

## Final verdict

# READY FOR HUMAN RELEASE APPROVAL

**This pack does not authorize deployment.** Production publish requires a separate written owner approval after this pack.

No blockers found in fresh re-verification of frozen package, backup inventory, on-server backup tree, tarball digests, live production hashes, denylist-protected G5/OEM files, or nginx Contact 301.

## 1. Evidence actually re-read this review

| Evidence | Result |
|---|---|
| `docs/geo/packages/geo-fix-01/MANIFEST.json` | Package 3.0.0; 31 Option B targets; manifest SHA `bc13b55c7163068edc2e7a00ac6dd8a49625f67127c8aa06a726bc7be7af688f` |
| Payload files under `docs/geo/packages/geo-fix-01/payload/` | All copy payloads SHA256 match manifest (`payload_ok`, 0 bad) |
| `PHASE-3-OPTIONB-SOURCE-BACKUP-REPORT.md` | Present; claims consistent with live re-check |
| `docs/geo/backup-evidence/optionb-20261108T143100Z/` | Inventory SHA `ce52d796…`; tarball sidecar `567e42c6…` |
| On-server `/root/mateyou/_rollback/geo-fix-01-optionb-src.20261108T143100Z` | Exists mode `700`; 28 files + 3 MISSING markers |
| On-server tarball `…20261108T143100Z.tar.gz` | Exists mode `600`; SHA256 `567e42c62e4946afa73b7dccdebf42b325d3da1793f6129ccc18844f239f52b9` (matches sidecar) |
| Live production vs backup hashes | `LIVE_VS_BACKUP_ERRORS 0` |
| Manifest target set vs inventory set | **Equal** (0 only-in-manifest / 0 only-in-inventory) |

## 2. Classification clarifications (blocking if wrong — verified)

| Class | Count | Detail |
|---|---|---|
| BACKED_UP present files | **28** | 27 REPLACE + **1 DELETE target** |
| MISSING_EXPECTED_FOR_ADD | **3** | `middleware.ts`, `assessment/layout.tsx`, `dashboard/layout.tsx` |
| DELETE target | **1** | `apps/web/components/HtmlLang.tsx` |
| Total Option B targets | **31** | Matches frozen manifest exactly |

### HtmlLang.tsx
- **Is DELETE target:** YES (`action=DELETE` in frozen manifest).
- **Included in the 28 backed-up files:** YES (`status=BACKED_UP`, backup SHA `1cd1f534caeae8dd2b1cafd8d2736d1461401866aa8d1511221f2f082c6e65de`).
- **After DELETE deploy, restore method:** copy  
  `/root/mateyou/_rollback/geo-fix-01-optionb-src.20261108T143100Z/files/apps/web/components/HtmlLang.tsx`  
  → `/root/mateyou/apps/web/components/HtmlLang.tsx`, then verify SHA256 equals backup hash above; then rebuild/swap runtime as required by runbook.

### ADD targets
- Not present on production source tree (expected).
- Recorded via `meta/*.MISSING` markers; rollback after a failed deploy = ensure these paths are removed again if COPY created them.

## 3. 31-file verification matrix

Machine-readable: `docs/geo/GEO-FIX-01-31-FILE-VERIFICATION-MATRIX.csv`  
**Blocker column:** all empty.

| # | Path | Action | Prod state | Backup | Candidate SHA | Backup SHA | Restore | Rollback |
|---|---|---|---|---|---|---|---|---|
| 1 | `apps/web/middleware.ts` | ADD | ABSENT_EXPECTED | MISSING_EXPECTED_FOR_ADD | `384f53cf5239…` | `—` | PASS | delete ADD |
| 2 | `apps/web/app/assessment/layout.tsx` | ADD | ABSENT_EXPECTED | MISSING_EXPECTED_FOR_ADD | `d3a4c4ad2be8…` | `—` | PASS | delete ADD |
| 3 | `apps/web/app/dashboard/layout.tsx` | ADD | ABSENT_EXPECTED | MISSING_EXPECTED_FOR_ADD | `c6be9544f5b7…` | `—` | PASS | delete ADD |
| 4 | `apps/web/app/about/page.tsx` | REPLACE | PRESENT | BACKED_UP | `c6edb5f81420…` | `86e2960f6c2f…` | PASS | restore bak |
| 5 | `apps/web/app/assessment/page.tsx` | REPLACE | PRESENT | BACKED_UP | `7ee962aa30e4…` | `671f0abb16d5…` | PASS | restore bak |
| 6 | `apps/web/app/authors/[id]/page.tsx` | REPLACE | PRESENT | BACKED_UP | `06b6e839404e…` | `51ba36d7ba83…` | PASS | restore bak |
| 7 | `apps/web/app/en/layout.tsx` | REPLACE | PRESENT | BACKED_UP | `17bb0676eb7f…` | `b79bcb149f1b…` | PASS | restore bak |
| 8 | `apps/web/app/en/partner/oem/page.tsx` | REPLACE | PRESENT | BACKED_UP | `c6882b5233fd…` | `5babf1d3d2b6…` | PASS | restore bak |
| 9 | `apps/web/app/en/smart-ring-oem-odm/page.tsx` | REPLACE | PRESENT | BACKED_UP | `2ae508e8b213…` | `23f699aa45dd…` | PASS | restore bak |
| 10 | `apps/web/app/knowledge/[slug]/page.tsx` | REPLACE | PRESENT | BACKED_UP | `65985dfe3a64…` | `aeb130e8960e…` | PASS | restore bak |
| 11 | `apps/web/app/knowledge/page.tsx` | REPLACE | PRESENT | BACKED_UP | `3c0c99a10c06…` | `6859a2d18a77…` | PASS | restore bak |
| 12 | `apps/web/app/layout.tsx` | REPLACE | PRESENT | BACKED_UP | `d2add71a289f…` | `ee2a8356d272…` | PASS | restore bak |
| 13 | `apps/web/app/membership/page.tsx` | REPLACE | PRESENT | BACKED_UP | `af6e80b7d8f9…` | `7debdd66d58e…` | PASS | restore bak |
| 14 | `apps/web/app/metrics/[slug]/page.tsx` | REPLACE | PRESENT | BACKED_UP | `617431e40330…` | `9ff4ef6def02…` | PASS | restore bak |
| 15 | `apps/web/app/metrics/page.tsx` | REPLACE | PRESENT | BACKED_UP | `84c7ca9927b2…` | `a05647e66fae…` | PASS | restore bak |
| 16 | `apps/web/app/news/[slug]/page.tsx` | REPLACE | PRESENT | BACKED_UP | `c1bef5b06d44…` | `01b1691a0d76…` | PASS | restore bak |
| 17 | `apps/web/app/news/page.tsx` | REPLACE | PRESENT | BACKED_UP | `6478ef09215b…` | `fa0b16635bb4…` | PASS | restore bak |
| 18 | `apps/web/app/partner/articles/page.tsx` | REPLACE | PRESENT | BACKED_UP | `3b07c018c6db…` | `79d8f9c4fc41…` | PASS | restore bak |
| 19 | `apps/web/app/partner/distributor/page.tsx` | REPLACE | PRESENT | BACKED_UP | `f7b29320afa4…` | `21c2e55781f2…` | PASS | restore bak |
| 20 | `apps/web/app/partner/enterprise/page.tsx` | REPLACE | PRESENT | BACKED_UP | `ea38342e3cf8…` | `f0b84358a919…` | PASS | restore bak |
| 21 | `apps/web/app/partner/hospital/page.tsx` | REPLACE | PRESENT | BACKED_UP | `1c609d01a10c…` | `f98a5b4331db…` | PASS | restore bak |
| 22 | `apps/web/app/partner/oem/page.tsx` | REPLACE | PRESENT | BACKED_UP | `7a7917d9a91b…` | `f3836e2c6e29…` | PASS | restore bak |
| 23 | `apps/web/app/partner/page.tsx` | REPLACE | PRESENT | BACKED_UP | `79b228f5b93d…` | `68341a744091…` | PASS | restore bak |
| 24 | `apps/web/app/partner/pharmacy/page.tsx` | REPLACE | PRESENT | BACKED_UP | `cfb18e339fd5…` | `d2f0b8591419…` | PASS | restore bak |
| 25 | `apps/web/app/products/ring1c/page.tsx` | REPLACE | PRESENT | BACKED_UP | `b403f05c8b66…` | `429fc359dc87…` | PASS | restore bak |
| 26 | `apps/web/app/topics/[slug]/page.tsx` | REPLACE | PRESENT | BACKED_UP | `15d6f9f938a6…` | `36b1d43897e5…` | PASS | restore bak |
| 27 | `apps/web/components/ArticleDetailView.tsx` | REPLACE | PRESENT | BACKED_UP | `52fbe64868f7…` | `d5470396ae00…` | PASS | restore bak |
| 28 | `apps/web/components/StructuredData.tsx` | REPLACE | PRESENT | BACKED_UP | `8a6dbb658b39…` | `b68bca062abb…` | PASS | restore bak |
| 29 | `apps/web/lib/i18n-routes.ts` | REPLACE | PRESENT | BACKED_UP | `5e9242e5cc0b…` | `80fe66c184fc…` | PASS | restore bak |
| 30 | `apps/web/components/HtmlLang.tsx` | DELETE | PRESENT | BACKED_UP | `—` | `1cd1f534caea…` | PASS | restore HtmlLang from bak |
| 31 | `apps/web/app/en/smart-ring-manufacturer/page.tsx` | REPLACE | PRESENT | BACKED_UP | `2912e2b5965c…` | `726cc0b872e0…` | PASS | restore bak |

### 28 backed-up paths
- `apps/web/app/about/page.tsx`
- `apps/web/app/assessment/page.tsx`
- `apps/web/app/authors/[id]/page.tsx`
- `apps/web/app/en/layout.tsx`
- `apps/web/app/en/partner/oem/page.tsx`
- `apps/web/app/en/smart-ring-oem-odm/page.tsx`
- `apps/web/app/knowledge/[slug]/page.tsx`
- `apps/web/app/knowledge/page.tsx`
- `apps/web/app/layout.tsx`
- `apps/web/app/membership/page.tsx`
- `apps/web/app/metrics/[slug]/page.tsx`
- `apps/web/app/metrics/page.tsx`
- `apps/web/app/news/[slug]/page.tsx`
- `apps/web/app/news/page.tsx`
- `apps/web/app/partner/articles/page.tsx`
- `apps/web/app/partner/distributor/page.tsx`
- `apps/web/app/partner/enterprise/page.tsx`
- `apps/web/app/partner/hospital/page.tsx`
- `apps/web/app/partner/oem/page.tsx`
- `apps/web/app/partner/page.tsx`
- `apps/web/app/partner/pharmacy/page.tsx`
- `apps/web/app/products/ring1c/page.tsx`
- `apps/web/app/topics/[slug]/page.tsx`
- `apps/web/components/ArticleDetailView.tsx`
- `apps/web/components/StructuredData.tsx`
- `apps/web/lib/i18n-routes.ts`
- `apps/web/components/HtmlLang.tsx`
- `apps/web/app/en/smart-ring-manufacturer/page.tsx`

### 3 ADD expected-missing paths
- `apps/web/middleware.ts`
- `apps/web/app/assessment/layout.tsx`
- `apps/web/app/dashboard/layout.tsx`

## 4. Release safety review

| Control | Status | Evidence |
|---|---|---|
| G5 / OEM form unchanged by Option B | **PASS** | `OemRfqForm`, `partner-api`, `LeadAttributionCapture`, `lead-attribution` **not** in COPY; live SHA256 match denylist pins |
| Business logic not broadly overwritten | **PASS** | Whitelist-only copy helper; denylist protects homepage/sitemap/GEO ZH pages/next.config/etc. |
| nginx config not in this deploy | **PASS** | Not in 31-file Option B set; Contact remains nginx-owned |
| `next.config.ts` excluded from Option B COPY | **PASS** | Not in copy set; field allowlist `never_copy`; denylist `must_not_change`; live hash `48fe0a78…` |
| Production Contact → OEM 301 protected | **PASS** | `/etc/nginx/sites-enabled/mateyou` still `location = /contact` → `301 https://www.longvon.com/partner/oem` (read-only confirm this review) |
| layout.tsx keeps G5 capture after REPLACE | **PASS (candidate)** | Manifest constraint + prior field/deploy tests; post-deploy must re-assert `LeadAttributionCapture` import/render |
| Manufacturer / OEM Meta description-only | **PASS (candidate)** | Field allowlist 145 / 152; assert script + 26/26 tests previously recorded |

### Post-deploy acceptance methods (must pass after authorized publish)
1. `GET /` → 200; `html lang="zh-CN"`
2. `GET /en/smart-ring-manufacturer` → 200; `html lang="en"`; meta description **145** chars matching approved text
3. `GET /en/partner/oem` → 200; `html lang="en"`; meta description **152** chars matching approved text
4. `GET /contact` → **301** to `/partner/oem` (nginx; do not change nginx in this release)
5. OEM RFQ page renders; form GET smoke only (no real commercial submit unless sales-approved)
6. Confirm `LeadAttributionCapture` still present in deployed `layout` / runtime behavior
7. hreflang / x-default / JSON-LD spot-check on OEM + manufacturer
8. No unexpected 5xx in app/nginx logs during window

## 5. Deploy & rollback (summary)

Full executable checklist: `docs/geo/GEO-FIX-01-ROLLBACK-AND-POST-DEPLOY-CHECKLIST.md`

**File apply order (Option B helper):** COPY all 30 whitelist files (manifest order) → then DELETE `HtmlLang.tsx`.  
**Runtime:** source apply alone is insufficient; authorized window must include web build with `NEXT_PUBLIC_SITE_URL=https://www.longvon.com` and standalone swap / process recycle **only after separate written approval of those ops**.

**Rollback source:** `/root/mateyou/_rollback/geo-fix-01-optionb-src.20261108T143100Z` (+ `.tar.gz`).  
**Rollback order:** restore 28 backed-up files from `files/` → remove any of the 3 ADD paths if present → rebuild/swap → re-run acceptance.

## 6. Approval boundaries

| Step | Allowed now? | Who |
|---|---|---|
| Read-only verification / this pack | Done | Cursor |
| Create/modify backup (already done earlier) | Complete | — |
| Merge PR | **NO** without owner | Repo owner |
| Option B COPY/DELETE on production | **NO** until written deploy approval | Deploy owner + LONGVON |
| Build / PM2 / standalone swap | **NO** until written deploy approval | Deploy owner |
| nginx reload | **NOT part of this release** | — |
| DB migration / G5/OEM edits | **Forbidden** | — |

## 7. Residual non-blocking risks (must brief owner)

1. Production git worktree has unrelated local modifications — operator must avoid colliding paths.
2. Source COPY without successful rebuild leaves live HTML unchanged or inconsistent.
3. Search/AI crawlers will lag after Meta/`lang` change; 7/14/30 clocks start only after real publish.
4. Dirty original local workspace (`geo/fix-01-identity-language`) remains untouched and is not the deploy source; deploy from frozen package / candidate only.

## 8. Forbidden actions during this review

Not performed: deploy, rsync to runtime, merge, PM2, nginx reload, DB migration, production source mutation, frozen manifest/payload mutation, Gemini API, dirty workspace reset/clean/stash.

## 9. Verdict line

`READY FOR HUMAN RELEASE APPROVAL`
