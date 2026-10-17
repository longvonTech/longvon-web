# LONGVON GEO Task #15.4 — Hreflang Fix & Page Regression Report

**Date:** 2026-10-17 (UTC+8)  
**Target:** https://www.longvon.com  
**Based on:** Task #15.3 M2 deployment (`BUILD_ID` was `1_zGbAQWmiEKINOejV1Wd`)  
**Final status:** **DEPLOYED AND VERIFIED**  
**Rollback triggered:** **No**  
**AI visibility impact:** **NOT VERIFIED** (hreflang/canonical + visual checks only)

Evidence: `docs/geo/_task15_4_evidence/`

---

## 1. Git status (before / after this task)

| Item | Before Task #15.4 | After Task #15.4 (workspace) |
|------|-------------------|------------------------------|
| Branch | `main` | `main` (unchanged) |
| HEAD | `d868a186e6ff6c7b26c7fe6e796ac1097d12355c` | same — **no commit** |
| Dirty tree | Yes (~108 short-status lines) | Still dirty; Task #15.4 only touched listed files |
| Staged | Empty | Empty |
| Destructive git ops | — | **NOT RUN** (`reset` / `clean` / `stash -u` / `add -A` / push) |

Workspace changes introduced by this task (not committed):

1. `apps/web/app/products/ring1c/page.tsx` — ZH metadata uses `siteAlternates(..., 'zh')`
2. `scripts/geo/verify-site-url.mjs` — new unit test for shared hreflang set
3. This report + `_task15_4_evidence/`

---

## 2. Files changed and actual diff

### 2.1 Runtime fix (deployed)

**File:** `apps/web/app/products/ring1c/page.tsx`

**Intent:** Use shared helper `siteAlternates()` (already used by EN Ring1C and other bilingual pages) instead of canonical-only `alternates`.

Focused diff vs pre-deploy ECS source (`_rollback/m15_4-src-bak.20261017153724`):

```diff
+import { siteAlternates } from '../../../lib/i18n-routes';
 ...
-  alternates: { canonical: `${site}/products/ring1c` },
+  alternates: siteAlternates(site, '/products/ring1c', 'zh'),
```

**Not changed:** product copy, FAQ content, StructuredData, EN Ring1C page (already correct), other SEO pages.

### 2.2 Test-only (deployed to ECS scripts for CI/ops smoke; not runtime)

**File:** `scripts/geo/verify-site-url.mjs`

- Added: `Ring1C ZH/EN metadata both use siteAlternates (shared hreflang set)`

### 2.3 Shared helper (unchanged)

`apps/web/lib/i18n-routes.ts` → `siteAlternates()` already emits:

| key | URL for bare `/products/ring1c` |
|-----|----------------------------------|
| canonical | ZH or EN depending on locale arg |
| `zh-CN` | `https://www.longvon.com/products/ring1c` |
| `en` | `https://www.longvon.com/en/products/ring1c` |
| `x-default` | ZH product URL (project default) |

---

## 3. Live baseline (before fix) — HTTPS

Fetched 2026-10-17 (not inferred from #15.3 alone):

| Path | HTTP | canonical | hreflang | FAQ / company |
|------|------|-----------|----------|---------------|
| `/products/ring1c` | 200 | `…/products/ring1c` | **none** | FAQPage + 常见问题 + company links |
| `/en/products/ring1c` | 200 | `…/en/products/ring1c` | zh-CN / en / x-default (absolute longvon) | FAQPage + company links |
| `/company/longvon` | 200 | OK | zh-CN / en / x-default | OK |
| `/en/company/longvon` | 200 | OK | zh-CN / en / x-default | OK |

**Gap confirmed:** ZH Ring1C missing hreflang; EN already correct; language sets would not reciprocate until ZH fixed.

Evidence: `_task15_4_evidence/live-baseline.json`, `zh-ring1c.html`, `en-ring1c.html`.

---

## 4. Tests / TypeScript / lint / production build

| Check | Where | Result |
|-------|-------|--------|
| `node --test scripts/geo/verify-site-url.mjs` | `/tmp/longvon-release-15-m2` worktree | **PASS** 13/13 |
| Same unit tests | ECS pre-build | **PASS** 12 + 1 skip (`.ts` import) |
| `tsc --noEmit -p apps/web/tsconfig.json` | worktree | **PASS** |
| `next lint` (ring1c ZH/EN + i18n-routes) | worktree | **PASS** |
| `NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build --workspace=apps/web` | worktree | **PASS** |
| Same web production build | ECS | **PASS** (pre-existing admin hook warnings only) |
| EN build artifact metadata | worktree `.next/.../en/products/ring1c.html` | canonical + matching hreflang set; no localhost |
| ZH bake in static HTML | N/A | ZH route is **dynamic** (`force-dynamic`); verified via live SSR after deploy |

---

## 5. Visual regression (desktop + mobile)

**Tooling used:** Cursor IDE browser (navigate + snapshot + screenshots + CDP viewport emulation).  
**Pre-deploy live pages** (post-#15.3 content; pre-hreflang-fix HTML).

| Surface | Viewport | Result |
|---------|----------|--------|
| ZH Ring1C | Desktop 1440×900 | **PASS** — H1, company CTAs, hero image, nav, dark hero readable |
| ZH Ring1C | Mobile 390×844 | **PASS** — hamburger + EN switcher; H1/CTAs/FAQ present in a11y tree; broken images **0** |
| EN Ring1C | Desktop 1440×900 | **PASS** — H1, About LONGVON links, product image, nav |
| EN Ring1C | Mobile 390×844 | **PASS** — hamburger + 中文 switcher; H1 + company links visible |
| FAQ visibility | both locales | **PASS** (a11y: FAQ headings/answers present; not accordion-collapsed away) |
| Console / network | ZH DOM probe | broken `<img>` count **0**; full console log dump **NOT VERIFIED** (no persistent console collector) |
| HTTP 5xx | checked URLs | **none observed** (200) |

Screenshots saved under `_task15_4_evidence/`:

- `task15-4-zh-ring1c-desktop.png`
- `task15-4-zh-ring1c-mobile.png`
- `task15-4-en-ring1c-desktop.png`
- `task15-4-en-ring1c-mobile.png`

**Residual visual note:** EN page is lighter (white hero) vs ZH dark hero — intentional design difference, not a regression from this hreflang patch.

---

## 6. Deployment

| Item | Value |
|------|--------|
| Deployed? | **Yes** — web-only minimal fix |
| Host | ECS via SSH `mateyou-ecs` `/root/mateyou` |
| Method | rsync **only** `apps/web/app/products/ring1c/page.tsx` (+ updated `verify-site-url.mjs`); `NEXT_PUBLIC_SITE_URL=https://www.longvon.com`; `npm run build --workspace=apps/web`; sync standalone public/static; `pm2 restart mateyou-web` |
| DB migrate | **NOT RUN** |
| API rebuild / restart | **NOT RUN** (`mateyou-api` still restarts **0**) |
| Backup | `/root/mateyou/_rollback/web-standalone.bak.20261017153724` + `m15_4-src-bak.20261017153724` |
| Pre `BUILD_ID` | `1_zGbAQWmiEKINOejV1Wd` |
| Post `BUILD_ID` | `xfym8k0U5MkkafTPmFQFI` |
| PM2 after | `mateyou-web` online (restarts **7**); `mateyou-api` online |

---

## 7. Post-deploy live HTTPS checks

| Page | canonical | hreflang set | localhost | Match peer? |
|------|-----------|--------------|-----------|-------------|
| `/products/ring1c` | `https://www.longvon.com/products/ring1c` | zh-CN → ZH, en → EN, x-default → ZH | no | **Yes** |
| `/en/products/ring1c` | `https://www.longvon.com/en/products/ring1c` | **identical language map** | no | **Yes** |

No duplicate conflicting canonical tags observed (single canonical per page).  
Evidence: `_task15_4_evidence/live-post.json`, `zh-ring1c-post.html`, `en-ring1c-post.html`.

Web + API local health on ECS: **OK** after restart.

---

## 8. Unverified / residual risk

| Item | Status |
|------|--------|
| AI commercial-query visibility delta | **NOT VERIFIED** |
| Full browser console / network HAR | **NOT VERIFIED** |
| Pixel-perfect cross-browser (Safari/Firefox) | **NOT VERIFIED** |
| Git commit of fix | **NOT RUN** — sources on ECS + dirty laptop tree |
| Other pages still missing ZH `siteAlternates` if any | Out of scope; company pages already OK |
| Transient Next.js Server Action mismatch logs after restart | Possible; monitor — not a hreflang failure |

---

## 9. Production baseline for later AI retest

Use this snapshot when comparing commercial AI answers later:

| Field | Value |
|-------|--------|
| Site | https://www.longvon.com |
| Web `BUILD_ID` | `xfym8k0U5MkkafTPmFQFI` |
| Ring1C ZH | hreflang + canonical absolute longvon; FAQ + company entity links |
| Ring1C EN | matching hreflang set; FAQ + company links |
| robots/sitemap host | longvon (from Task #15.3; not re-broken here) |
| Deploy stamp | `20261017153724` |
| AI effect claim | **do not claim** until same query matrix retested |

---

## 10. Conclusion

**DEPLOYED AND VERIFIED**

ZH Ring1C now emits the same `siteAlternates` hreflang set as EN; live HTTPS confirms reciprocal canonical/hreflang; desktop/mobile visual checks via browser automation found no blocking layout/FAQ/company-link regressions; web-only deploy completed with rollback retained. No git commit/push. AI visibility remains **NOT VERIFIED**.
