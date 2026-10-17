# LONGVON GEO Task #15 — P0 Fix Report

**Date:** 2026-10-17  
**Type:** Targeted Fix / Regression Verification  
**Deploy / commit:** **Not performed** (awaiting human approval)  
**Basis:** Task #14 Acceptance / Production / Structured Data / Git audits

---

## 1. Pre-fix findings (from Task #14 + re-check)

| ID | Issue | Pre-fix status |
|----|-------|-----------------|
| A | `getSiteUrl()` silently fell back to `http://localhost:3000` | Confirmed in `apps/web/lib/site.ts` |
| B | Prod `robots.txt` Host/Sitemap = localhost | Re-confirmed live 2026-10-17 (`docs/geo/_task15_prod-robots-still.txt`) |
| C | Prod sitemap `<loc>` all localhost | Confirmed Task #14 evidence |
| D | EN canonical/hreflang → localhost | Confirmed Task #14 (via `getSiteUrl` at build) |
| E | FAQPage without visible FAQ | Confirmed in workspace Ring1C pages |
| F | Product `offers` InStock without visible commerce | Confirmed |
| G | Unverified `sku` / `mpn` | Confirmed; no ERP/docs evidence in repo |
| H | App `offers.price = '0'` | Confirmed |
| I | Missing direct `/company/longvon` link on Ring1C | Confirmed |

**Workspace protection:** Pre-status captured (`git status --short` ≈ 93 porcelain lines). No reset/clean/stash/commit/push/deploy.

---

## 2. Files actually modified (this task)

| File | Why | Diff origin note |
|------|-----|------------------|
| `apps/web/lib/resolve-site-url.ts` | **NEW** — pure URL resolver; prod refuses missing/localhost | Task #15 only |
| `apps/web/lib/site.ts` | Wire `getSiteUrl()` → resolver | Task #15 only (file was clean vs prior tiny helper) |
| `apps/web/app/layout.tsx` | `metadataBase` uses `getSiteUrl()` | Task #15 only (minimal) |
| `apps/web/components/StructuredData.tsx` | Site origin via `getSiteUrl()`; remove sku/mpn/offers/app price; keep entity graph | **Mixed** with prior uncommitted JSON-LD work; this task’s hunks = risk removals + dynamic origin |
| `apps/web/app/products/ring1c/page.tsx` | Company link + visible FAQ mapped to `RING1C_FAQS_ZH` | **Mixed** with prior GEO rewrite; this task = company link + FAQ UI |
| `apps/web/app/en/products/ring1c/page.tsx` | About LONGVON link + visible FAQ | **Mixed**; this task = company links + FAQ UI |
| `scripts/geo/verify-site-url.mjs` | **NEW** — Node test contract | Task #15 only |
| `.env.example` | Clarify SITE_URL prod rules | **Mixed file** — only SITE_URL comment block intended for this task |
| `.env.production.example` | Clarify SITE_URL required | **Mixed file** — only SITE_URL comment intended |

**Not modified (already correct consumers):** `apps/web/app/robots.ts`, `apps/web/app/sitemap.ts` — both already call `getSiteUrl()`; fix is upstream.

---

## 3. URL configuration logic

```text
resolveSiteUrl(raw, nodeEnv):
  development + missing  → http://localhost:3000
  production + missing   → THROW (no silent localhost)
  production + localhost → THROW
  production + http://www… → upgrade to https://www…
  strip trailing slash
```

`getSiteUrl()` reads `NEXT_PUBLIC_SITE_URL` + `NODE_ENV`.

**Human ops (not done by agent):** ensure ECS/PM2 build & runtime have:

```bash
NEXT_PUBLIC_SITE_URL=https://www.longvon.com
```

(`ecosystem.config.js` already lists this value historically; live robots prove it was **not** baked into the current running web build.)

---

## 4. robots / Sitemap / canonical / hreflang

### Code-level (post-fix)

| Check | Result | Evidence |
|-------|--------|----------|
| robots/sitemap call `getSiteUrl` | **PASS** | source + `verify-site-url` test |
| Prod simulation URLs | **PASS** — all `https://www.longvon.com…`, no localhost | `_task15_url-simulation.txt` |
| Prod missing env throws | **PASS** | same |
| Live robots still localhost | **FAIL (expected until deploy)** | `_task15_prod-robots-still.txt` |
| Live canonical/hreflang | **NOT VERIFIED** as fixed on prod | requires rebuild+restart |

`siteAlternates()` already builds language-correct canonical/hreflang from `site` argument; once `getSiteUrl()` returns production origin at **build time**, EN pages stop emitting localhost.

---

## 5. JSON-LD before → after (workspace)

| Field / pattern | Before | After | Basis |
|-----------------|--------|-------|-------|
| Site origin | Hardcoded `https://www.longvon.com` | `getSiteUrl()` | Align with env; still prod-safe when env set |
| `sku` / `mpn` | Present | **Removed** | No verified ERP/logistics IDs in repo |
| Product `offers` InStock | Present | **Removed** | No visible price/purchase terms on page |
| App `offers.price=0` | Present | **Removed** | Free download vs VIP/membership unclear |
| FAQPage | Schema only | Schema **+ visible FAQ** (ZH/EN) | Scheme A — consistency |
| manufacturer / brand | LONGVON / MATEYOU | **Kept** | Entity model correct |
| OEM Service / App types | Present | **Kept** | |

---

## 6. Offer / SKU / MPN / FAQ decisions

| Item | Decision | Rationale |
|------|----------|-----------|
| Product Offer | **Removed** | Page CTAs are OEM/assessment, not a verified storefront Offer |
| sku / mpn | **Removed** | **FACT CHECK REQUIRED** historically; no authoritative source found → do not invent |
| App Offer | **Removed** | Avoid implying entire commercial stack is free |
| FAQPage | **Kept** after adding visible FAQ | Matches `RING1C_FAQS_ZH/EN`; non-medical wording |

---

## 7. Product fact register

| Fact | Status | Note |
|------|--------|------|
| 71 / 22 metrics | **PASS** | Summed from `health-metrics.ts` |
| ~4g, IP68, BT 5.2, US6–13, 4 colors | **FACT CHECK REQUIRED** | Retained from existing product page copy; need HW/spec owner sign-off |
| Non-medical / non-diagnosis OSA language | **PASS** | Present in FAQ + body |
| Zigonia / polymer materials | **FACT CHECK REQUIRED** | Retained; confirm against BOM |

---

## 8. Company internal links

| Page | Link | Status |
|------|------|--------|
| `/products/ring1c` | `/company/longvon` —「了解龙汾科技（LONGVON）」 | **PASS** (workspace) |
| `/en/products/ring1c` | `/en/company/longvon` —「About LONGVON」 | **PASS** (workspace) |

OEM / manufacturer / technology links retained.

---

## 9. Tests & commands (real output)

```bash
node --test scripts/geo/verify-site-url.mjs
# → 12 pass, 0 fail  (docs/geo/_task15_verify-site-url.txt)

cd apps/web && npx tsc --noEmit -p tsconfig.json
# → exit 0

cd apps/web && npm run lint -- --file app/products/ring1c/page.tsx \
  --file app/en/products/ring1c/page.tsx --file components/StructuredData.tsx \
  --file lib/site.ts --file lib/resolve-site-url.ts --file app/layout.tsx \
  --file app/robots.ts --file app/sitemap.ts
# → No ESLint warnings or errors
```

| Check | Status |
|-------|--------|
| URL unit tests | **PASS** (12/12) |
| TypeScript | **PASS** |
| Targeted lint | **PASS** |
| Full `next build` | **NOT VERIFIED** (not run; needs prod env baked) |
| Local Next HTML render of robots/sitemap | **NOT VERIFIED** (no local server started) |
| Production post-deploy verification | **NOT VERIFIED** — **not deployed** |
| AI visibility improvement | **NOT VERIFIED** (out of scope; no claim) |

---

## 10. Unresolved / remaining

1. **Production still serves localhost robots/sitemap** until rebuild with correct env + restart.  
2. **Mixed dirty tree** — Ring1C / StructuredData / env example files contain pre-Task-15 uncommitted GEO work; release must be human-scoped.  
3. Hardware specs (4g, IP68, etc.) still **FACT CHECK REQUIRED**.  
4. Full production build under `NODE_ENV=production` without `NEXT_PUBLIC_SITE_URL` should now **fail** — confirm in CI/deploy script.  
5. Optional: add npm script alias for `verify-site-url` (not done to avoid package.json churn).

---

## 11. Suggested release file list (for human deploy approval)

**Minimum set for P0 URL + schema integrity:**

```text
apps/web/lib/resolve-site-url.ts          # NEW
apps/web/lib/site.ts
apps/web/app/layout.tsx
apps/web/components/StructuredData.tsx    # review mixed diff
apps/web/app/products/ring1c/page.tsx     # review mixed diff
apps/web/app/en/products/ring1c/page.tsx  # review mixed diff
scripts/geo/verify-site-url.mjs           # NEW (test)
```

**Docs/examples (optional, comments only):**

```text
.env.example                 # only SITE_URL comment hunk if possible
.env.production.example      # only SITE_URL comment hunk if possible
```

**Ops checklist (manual):**

```text
1. Confirm ECS/PM2 env: NEXT_PUBLIC_SITE_URL=https://www.longvon.com
2. Rebuild web WITH that env (Next inlines NEXT_PUBLIC_* at build time)
3. Restart mateyou-web
4. Verify:
   curl -s https://www.longvon.com/robots.txt | grep -E 'Host:|Sitemap:'
   curl -s https://www.longvon.com/sitemap.xml | head
   curl -sI https://www.longvon.com/en/products/ring1c | head
   # HTML: canonical + hreflang must be https://www.longvon.com/...
5. Re-run Task #14 production checks
```

**Do not** `git add -A` the entire dirty tree.

---

## 12. Ready for human deploy approval?

| Gate | Status |
|------|--------|
| P0 URL logic fixed in code | **PASS** |
| JSON-LD risk fields removed / FAQ visible | **PASS** (workspace) |
| Company entity links | **PASS** (workspace) |
| Automated tests for this task | **PASS** |
| Production already fixed | **FAIL** (not deployed) |
| Safe separation of all mixed file hunks | **WARNING** — needs human review of Ring1C + StructuredData diffs |

**Recommendation:** **Yes — enter human deploy approval** for the minimum file set + env rebuild, after a human skims mixed diffs on Ring1C/StructuredData.  
**Not** auto-deployed. **Not** an AI-visibility success claim.

---

## 13. Brief for user

### Fixed (workspace)
- Production URL resolver (no silent localhost)
- Schema uses `getSiteUrl()`; removed Offer/SKU/MPN/App free price
- Visible Ring1C FAQ (ZH/EN) aligned with FAQPage
- Direct company links on Ring1C ZH/EN

### Tests passed
- 12/12 `verify-site-url` · tsc · targeted lint

### Still unverified
- Live prod robots/sitemap/canonical (await deploy)
- Full `next build`
- AI visibility

### Deploy files
See §11 minimum set + ops env rebuild.

### Facts needing humans
- 4g / IP68 / BT 5.2 / sizes / materials  
- Confirm no official sku/mpn before re-adding

### Enter deploy approval?
**Yes, gated.** Rebuild with `NEXT_PUBLIC_SITE_URL=https://www.longvon.com`, then re-audit live HTML.
