# GEO-FIX-01 Rollback & Post-Deploy Checklist

**Package:** GEO-FIX-01-PHASE-3 / 3.0.0  
**Backup:** `/root/mateyou/_rollback/geo-fix-01-optionb-src.20261108T143100Z`  
**Tarball SHA256:** `567e42c62e4946afa73b7dccdebf42b325d3da1793f6129ccc18844f239f52b9`  
**Inventory SHA256:** `ce52d7961e83afa145116421ed9e794f024ce0569b5df6dedbd1450341dfb953`  
**Status:** Checklist prepared for human-approved execution only. **Do not run until separate written deploy approval.**

## A. Roles & approval gates

| Gate | Required approval | Executor |
|---|---|---|
| G0 This approval pack accepted | LONGVON owner sign-off on `GEO-FIX-01-PRODUCTION-RELEASE-APPROVAL-PACK.md` | Owner |
| G1 Production Option B COPY/DELETE | Explicit written deploy authorization naming package 3.0.0 + backup id | Deploy owner |
| G2 Web build + standalone/process recycle | Explicit written authorization (PM2/process ops named) | Deploy owner |
| G3 nginx changes | **Out of scope — do not reload/edit nginx for FIX-01** | N/A |
| G4 Rollback | Deploy owner may trigger on fail criteria below; notify LONGVON | Deploy owner |

## B. Pre-deploy checks (read then authorize write)

- [ ] Confirm frozen manifest SHA256 still `bc13b55c7163068edc2e7a00ac6dd8a49625f67127c8aa06a726bc7be7af688f`
- [ ] Confirm on-server backup dir + tarball SHA256 unchanged
- [ ] Re-hash live 31 targets; abort on any CONFLICT vs predeploy pins / expected ADD absence
- [ ] Confirm denylist live hashes for G5/OEM/`next.config.ts` unchanged
- [ ] Confirm nginx Contact 301 still present (read-only)
- [ ] Dry-run: `node scripts/geo/copy-fix-01-whitelist.mjs --target /root/mateyou --dry-run` (or equivalent confined target) shows **COPY 30 / DELETE 1**
- [ ] Confirm `NEXT_PUBLIC_SITE_URL=https://www.longvon.com` will be used for build
- [ ] Written G1 (+ G2 if same window) approval recorded

## C. Deploy file list & order

### C1. COPY (30) — apply first, whitelist only
Apply in manifest `copy_to_production` order via FIX-01 copy helper (not tree rsync):

1. ADD `apps/web/middleware.ts`
2. ADD `apps/web/app/assessment/layout.tsx`
3. ADD `apps/web/app/dashboard/layout.tsx`
4–30. REPLACE (27 files) as listed in `GEO-FIX-01-31-FILE-VERIFICATION-MATRIX.csv` where action=REPLACE

### C2. DELETE (1) — apply after COPY
31. DELETE `apps/web/components/HtmlLang.tsx`

### C3. Runtime (requires G2)
- [ ] Build `apps/web` with production site URL
- [ ] Swap standalone / recycle process **only if G2 approved**
- [ ] **Do not** nginx reload
- [ ] **Do not** touch G5/OEM form files, env, or database

## D. Post-deploy HTTP / SSR / metadata acceptance

| # | Check | Pass criteria |
|---|---|---|
| D1 | Homepage `/` | 200; `html[lang=zh-CN]` |
| D2 | Manufacturer EN | 200; `lang=en`; meta description length **145**; approved wording |
| D3 | OEM EN | 200; `lang=en`; meta description length **152**; approved wording |
| D4 | Contact | **301** → `https://www.longvon.com/partner/oem` |
| D5 | OEM form | Page renders; no unauthorized form/code drift |
| D6 | G5 | `LeadAttributionCapture` still mounted from layout |
| D7 | i18n | hreflang / x-default spot-check OEM |
| D8 | JSON-LD | Present/sane on manufacturer & OEM |
| D9 | Logs | No burst 5xx in app/nginx during window |

Record timestamps, response codes, and extracted meta/`lang` strings.

## E. Monitoring during window

- [ ] Watch app process status (read-only until G2)
- [ ] Tail nginx access/error for `/`, `/contact`, `/en/partner/oem`, `/en/smart-ring-manufacturer`
- [ ] Watch for RFQ/G5 anomalies (no schema/API changes expected)

## F. Rollback trigger conditions

Trigger rollback if any of:
1. Pre-deploy hash CONFLICT after approval freeze
2. COPY/DELETE helper failure mid-apply
3. Build failure after source apply
4. Any D1–D6 acceptance fail
5. G5 capture missing after deploy
6. Contact 301 broken (investigate nginx without FIX-01 scope creep; restore app sources if app-side regression)
7. Owner abort

## G. Rollback execution order (after G4)

**Source of truth:** backup directory (prefer directory; tarball if directory damaged — verify SHA256 first).

1. **Restore 28 files** from  
   `.../geo-fix-01-optionb-src.20261108T143100Z/files/`  
   onto matching paths under `/root/mateyou/` (includes restoring `HtmlLang.tsx`).
2. **Remove ADD paths if present:**  
   `apps/web/middleware.ts`  
   `apps/web/app/assessment/layout.tsx`  
   `apps/web/app/dashboard/layout.tsx`
3. Verify each restored file SHA256 == inventory `backup_sha256`; verify ADD paths absent.
4. Rebuild + swap runtime if G2-class ops were used during deploy (requires same class of approval for rollback runtime).
5. Re-run section D acceptance against **pre-FIX-01** expectations (`lang=zh-CN` on EN pages; old meta lengths) if full rollback intended.
6. Record rollback time, operator, and hash verification log.

### HtmlLang-specific note
DELETE is reversed by **restoring the backed-up file**, not by re-deploying candidate payload.

## H. Sign-off block (human)

| Item | Name | Date | Signature / ticket |
|---|---|---|---|
| Approval pack accepted | | | |
| G1 Option B write approved | | | |
| G2 runtime recycle approved (if any) | | | |
| Post-deploy acceptance passed | | | |
| Or rollback completed | | | |

**Reminder:** Even with `READY FOR HUMAN RELEASE APPROVAL`, no production write may start without the written approvals above.
