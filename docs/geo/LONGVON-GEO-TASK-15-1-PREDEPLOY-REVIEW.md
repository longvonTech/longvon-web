# LONGVON GEO Task #15.1 — Pre-Deploy Review & Build Verification

**Date:** 2026-10-17  
**Mode:** Review only — **no commit / push / deploy / reset / clean / stash**  
**Evidence:** `docs/geo/_task15_1_evidence/`  
**Conclusion:** **READY FOR HUMAN DEPLOY APPROVAL** (gated — see §8)

---

## 1. Git state (before/during review)

| Item | Value |
|------|--------|
| Branch | `main` |
| HEAD | `d868a186e6ff6c7b26c7fe6e796ac1097d12355c` |
| HEAD date / subject | 2026-09-22 — `docs(geo): Qwen commercial recommendation research GEO v1.2` |
| Dirty tree | Yes — ~40 modified tracked + large untracked set (GEO docs, syndication, etc.) |
| Staged | Empty |
| Evidence | `_task15_1_evidence/git-status.txt` |

Task #15.1 did **not** alter application source; only wrote this report + evidence captures.

---

## 2. Per-file diff review (A / B / C)

Legend:  
**A** = Task #15 P0 fix  
**B** = Prior uncommitted GEO/OEM (pre-15)  
**C** = Unclear / mixed / unrelated churn in same file  

| File | vs HEAD | Classification | What changed | Regression risk | Must ship for P0 URL? | Split diff? |
|------|---------|----------------|--------------|-----------------|----------------------|-------------|
| `apps/web/lib/resolve-site-url.ts` | **Untracked NEW** | **A** | Prod-safe resolver; throws if prod missing/localhost | Low | **Yes** | N/A (new) |
| `apps/web/lib/site.ts` | Tiny (+re-export) | **A** | `getSiteUrl()` → `resolveSiteUrl` | Low | **Yes** | No |
| `apps/web/app/layout.tsx` | Tiny | **A** | `metadataBase: new URL(getSiteUrl())` | Low — prod build **requires** env | **Yes** | No |
| `apps/web/app/robots.ts` | Unchanged | — | Already uses `getSiteUrl()` | — | Indirect | — |
| `apps/web/app/sitemap.ts` | Unchanged | — | Already uses `getSiteUrl()` | — | Indirect | — |
| `scripts/geo/verify-site-url.mjs` | **Untracked NEW** | **A** | Node tests | None for runtime | Recommended (CI), not runtime | N/A |
| `apps/web/components/StructuredData.tsx` | Large (~+408/−) | **A+B** | **A:** `getSiteUrl()`, remove sku/mpn/Offer/App price0; **B:** entity `@graph`, FAQs constants, OEM Service, variants | Medium — ships whole GEO schema layer | **Yes for schema integrity**; larger than URL-only | **Ideal but costly** — recommend ship whole file after skim |
| `apps/web/app/products/ring1c/page.tsx` | Large (~+788/−) | **A+B** | **A:** company link + visible FAQ map; **B:** H1/三 H2 GEO rewrite, metrics, SizeGuide demotion dependency | Medium–High visual/content | **Yes if deploying Task 15 product fixes**; URL-only deploy can omit | **Yes if possible** — otherwise accept full file |
| `apps/web/app/en/products/ring1c/page.tsx` | Large (~+247/−) | **A+B** | **A:** About LONGVON + FAQ UI; **B:** EN semantic modules | Medium | Same as ZH | Prefer skim-then-ship whole |
| `.env.example` | Mixed | **A+C** | **A:** SITE_URL comments; **C:** other syndication/LLM keys from earlier work | Low for SITE_URL comments | Optional | **Yes — only SITE_URL comment hunk** |
| `.env.production.example` | Mixed | **A+C** | **A:** SITE_URL required wording; **C:** other prod keys | Low | Optional | **Yes — only SITE_URL hunk** |

### Minimum publish sets

**Set M1 — URL P0 only (smallest):**  
`resolve-site-url.ts`, `site.ts`, `layout.tsx` (+ rebuild with env). Fixes robots/sitemap/canonical bake.

**Set M2 — Task #15 complete (recommended for approval):**  
M1 + `StructuredData.tsx` + ZH/EN `ring1c/page.tsx` + `verify-site-url.mjs` (+ optional env example SITE_URL comments).

**Do not** publish the entire dirty tree (`git add -A`).

---

## 3. Production URL logic review

| Requirement | Result | Evidence |
|-------------|--------|----------|
| Prod missing `NEXT_PUBLIC_SITE_URL` fails clearly | **PASS** | `next build` without env → `Error: [site-url] NEXT_PUBLIC_SITE_URL is required in production` (`build-no-env.txt`) |
| Prod rejects localhost root | **PASS** | Unit tests + resolver source |
| Canonical host `https://www.longvon.com` | **PASS** (when env set at build) | `robots.txt.body`, `sitemap.xml.body`, EN ring1c HTML |
| robots / sitemap / metadataBase / page canonicals consistent | **PASS** in local prod build artifact | Host/Sitemap = `https://www.longvon.com`; EN canonical + hreflang absolute https |
| Dev localhost still OK | **PASS** | 12/12 unit tests |
| HTTP→HTTPS upgrade for non-local | **PASS** | unit test |
| Trailing slash stripped | **PASS** | unit test |
| **Next build-time baking verified** (not only Node unit test) | **PASS** | Full `NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build` exit 0; prerendered bodies use prod host |

**Note:** Bundled JS still *contains* the string `http://localhost:3000` as the **development fallback inside the resolver function**. Emitted SEO surfaces (`robots.txt.body`, `sitemap.xml.body`, EN HTML canonical/hreflang) do **not** use localhost when built with the prod env. That is expected.

**Live production site** still shows localhost robots (Task #14/#15) — **NOT fixed until deploy**. Marked separately — not a code regression.

---

## 4. Structured data review (workspace + build artifact)

| Check | Result |
|-------|--------|
| FAQPage Q&A source = visible FAQ (`RING1C_FAQS_*`.map) | **PASS** |
| No Product `InStock` Offer | **PASS** (source + EN HTML) |
| No unverified sku/mpn | **PASS** |
| No App `price: '0'` | **PASS** |
| Org LONGVON / Brand MATEYOU / Product Ring1C / Service OEM / SoftwareApplication App | **PASS** (EN build JSON-LD types) |
| No new medical diagnosis/treatment claims in FAQ | **PASS** (explicit “不能/No”) |
| Duplicate FAQPage scripts | **PASS** — single FaqSchema usage (+ import match) |
| Layout regression from FAQ block | **WARNING** — visual only; no automated UI test; content is below fold after specs |

Build EN HTML sample (`en/products/ring1c.html`):

- canonical: `https://www.longvon.com/en/products/ring1c`
- hreflang: zh-CN → `/products/ring1c`, en → `/en/products/ring1c`, x-default → ZH
- FAQ questions visible in HTML
- `localhost` absent from HTML

ZH Ring1C is `force-dynamic` — not fully prerendered HTML in `.next`; relies on same components. Runtime must use same build env.

---

## 5. Verification results

| Check | Command / method | Status |
|-------|------------------|--------|
| URL tests | `node --test scripts/geo/verify-site-url.mjs` | **PASS** 12/12 |
| TypeScript | `npx tsc --noEmit -p apps/web/tsconfig.json` | **PASS** |
| Lint (scoped) | `next lint` on Task-15 files + robots/sitemap | **PASS** |
| Prod build **without** SITE_URL | `env -u NEXT_PUBLIC_SITE_URL NODE_ENV=production npm run build` | **PASS** (fails as designed) |
| Prod build **with** SITE_URL | `NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build` | **PASS** exit 0 |
| Sitemap locs in artifact | `sitemap.xml.body` — 0× localhost, 50× longvon.com | **PASS** |
| robots artifact | Host + Sitemap = https://www.longvon.com | **PASS** |
| Full monorepo `npm run build` (db+api+web) | Not run | **NOT VERIFIED** |
| Live www.longvon.com after deploy | Not deployed | **NOT VERIFIED** |
| AI visibility lift | Out of scope | **NOT VERIFIED** |

Node: v26.0.0 · Next.js 15.5.19 (from build log) · npm workspaces present.

---

## 6. Product facts — business/hardware confirmation

| Fact | Code status | Business status |
|------|-------------|-----------------|
| 71 total / 22 sleep metrics | **PASS** — `health-metrics.ts` counts sum to 71 (6+7+6+6+4+22+20) | Not clinical validation |
| ~4 g weight | Present in page/schema | **FACT CHECK REQUIRED** |
| IP68 | Present | **FACT CHECK REQUIRED** |
| Bluetooth 5.2 | Present | **FACT CHECK REQUIRED** |
| US 6–13 | Present | **FACT CHECK REQUIRED** |
| Four colors | Present (white/pink/blue/black) | **FACT CHECK REQUIRED** |
| Zirconia / polymer materials | Present | **FACT CHECK REQUIRED** |

Task #15.1 did **not** change these numbers.

---

## 7. Preconditions before human deploy

1. **Rebuild** web with `NEXT_PUBLIC_SITE_URL=https://www.longvon.com` (must be present at **build** time; Next inlines `NEXT_PUBLIC_*`).  
2. Restart process manager with the same env (PM2/ecosystem already documents the value historically).  
3. Human skim **mixed** files: `StructuredData.tsx`, ZH/EN `ring1c/page.tsx` — accept shipping full current contents **or** split A vs B.  
4. Prefer release set **M2** (Task #15 complete) unless only URL hotfix is desired (**M1**).  
5. Post-deploy curl checks: robots Host/Sitemap, sitemap first `<loc>`, EN canonical/hreflang, sample JSON-LD.  
6. Do **not** `git add -A`; do **not** deploy unrelated API/syndication dirty files in the same unreviewed batch.  
7. Spec FACT CHECK can proceed in parallel; do not block URL P0 on HW sign-off if copy already live historically — but do not treat metrics as clinical proof.

---

## 8. Final verdict

### READY FOR HUMAN DEPLOY APPROVAL

**Reasons:**

- Diffs are explainable (A/B/C table).  
- URL unit tests + **real Next production build** prove no silent localhost SEO output when env is set; missing env fails the build.  
- Structured-data risk fields (Offer/sku/mpn/free app) absent in source and EN build HTML.  
- Publish scope can be limited to M1 or M2 — controllable.  

**Still blocked until humans:**

- Actual production cutover / env on ECS.  
- Optional split of mixed Ring1C/StructuredData hunks.  
- Hardware FACT CHECK list.  

**This task stops here.** No deploy, commit, or push performed.
