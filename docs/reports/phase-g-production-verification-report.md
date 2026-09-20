# Phase G — Production Stability & SEO/GEO Verification Report

**Task:** TASK-G-DEPLOY-VERIFY  
**Site:** https://www.longvon.com  
**ECS:** Aliyun ECS (`/root/mateyou`)  
**Verified at:** 2026-09-20 (Asia/Shanghai)  
**Verdict:** **Production SEO/GEO Foundation Verified**

This report records live verification evidence. No speculative “Approved” claims without HTTP/build checks.

---

## 1. Current production architecture

```
GitHub main
  → GitHub Actions (CI success or workflow_dispatch)
  → rsync source → ECS /root/mateyou
  → rsync --delete apps/api/src (purge ECS-only orphans)
  → DEPLOY_SKIP_GIT_PULL=1 ./scripts/deploy.sh
       → Prisma generate
       → migrate deploy
       → backup prior Web/API artifacts → /root/mateyou/_rollback/
       → next build (standalone) + copy public/static into standalone
       → nest build
       → sync-static.sh → Nginx static root
       → pm2 restart mateyou-web (:3000) + mateyou-api (:4000)
       → health check + production-smoke-test.sh

Internet
  → Nginx (TLS termination)
  → Web :3000 (Next.js standalone)
  → API :4000 (NestJS)
  → PostgreSQL localhost:5432 (mateyou_prod)
```

**Runtime processes (live):** PM2 `mateyou-web` + `mateyou-api` both `online`.

---

## 2. Web deployment method

| Step | Command / mechanism |
|------|---------------------|
| Install | Repo monorepo `node_modules` already on ECS (CI does not reinstall every time; builds use existing deps) |
| Prisma | `npm run db:generate` (workspace `packages/database`) |
| Build | `npm run build --workspace=apps/web` → Next.js 15 standalone |
| Standalone static | `deploy.sh` copies `apps/web/public` → `apps/web/.next/standalone/apps/web/public` and `.next/static` into standalone |
| Nginx dual-path | `scripts/sync-static.sh` also copies `llms.txt` + images + `_next/static` to `/var/www/mateyou/` |
| Start | PM2 `mateyou-web` → Next standalone server on `:3000` |

**llms.txt / public fix:** Confirmed. After clean rebuild, `standalone/.../public/llms.txt` exists and HTTPS `/llms.txt` returns 200 `text/plain`.

---

## 3. API deployment method

| Step | Command / mechanism |
|------|---------------------|
| Source reconciliation | CI `rsync --delete` of `apps/api/src/` + `deploy.sh` orphan cleanup |
| Prisma | Same generate step as Web (shared client) |
| Build | `npm run build --workspace=apps/api` → `nest build` → `apps/api/dist/main.js` |
| Start | PM2 `mateyou-api` on `:4000` |
| Health | `GET /health/live`, `GET /health/ready` → 200 |

**Historical failure eliminated:** ECS-only `apps/api/src/distribution` and orphan `article-publish-pipeline` / `article-cover-image` services broke `nest build`. Mitigation:

1. CI `--delete` sync of `apps/api/src`
2. `deploy.sh` moves any residual orphans to `/root/mateyou/_orphans/`
3. Live check: no `distribution` dir; no orphan pipeline file

API builds from clean repo source without server history files.

---

## 4. GitHub → ECS flow

Defined in `.github/workflows/deploy.yml`:

1. Trigger: CI workflow success on `main` push, or manual `workflow_dispatch`
2. Checkout the CI head SHA
3. `rsync` repo → ECS (excludes `node_modules`, `.next`, `dist`, `.git`, `.env.production`, `_orphans`, `_rollback`)
4. Separate `rsync --delete` for `apps/api/src/`
5. SSH: `DEPLOY_SKIP_GIT_PULL=1 ./scripts/deploy.sh`

ECS does **not** depend on `git pull` for the canonical path (avoids ECS→GitHub TLS issues). Manual `./scripts/deploy.sh` without skip still supports `git pull` when `.git` exists.

---

## 5. `deploy.sh` behavior

Script: `scripts/deploy.sh`

**Idempotency (verified):** Executed successfully **three times** on ECS during this task (second/third after orphan cleanup). Rebuild + PM2 restart did not brick the previous deploy. Third run exit code `0`.

**Does not depend on:**

- Leftover API `distribution` modules
- Hand-copied `dist` / standalone trees
- Manual source edits on the server

**Rollback (basic):** Before each build, copies prior artifacts to durable paths **outside** `.next` (important: `next build` wipes `.next`, so in-tree `.next/standalone.bak.*` was ineffective and has been fixed):

- `/root/mateyou/_rollback/web-standalone.bak.<timestamp>`
- `/root/mateyou/_rollback/api-dist.bak.<timestamp>`
- Retains last 3 of each

**Verified present after rebuild:**  
`_rollback/web-standalone.bak.20260920214657` (includes `public/llms.txt`) and `api-dist.bak.20260920214700`.

**Post-deploy checks:**

- Health waits until `/`, GEO bodies (`LONGVON` / `ODM` / `OSA`), `/llms.txt`, and API `/health/live` succeed
- Runs `scripts/production-smoke-test.sh` (one automatic retry for post-restart warmup races)

---

## 6. Web build result

| Check | Result |
|-------|--------|
| `next build` on ECS | **PASS** (Next.js 15.5.19, compiled successfully) |
| GEO routes in build output | `/company/longvon`, `/smart-ring-*` (all 7) present as static `○` |
| `/robots.txt`, `/sitemap.xml` | Present in build output |
| Standalone + `public/llms.txt` | **PASS** after `sync_standalone_public` |

---

## 7. API build result

| Check | Result |
|-------|--------|
| `nest build` on ECS | **PASS** |
| `apps/api/dist/main.js` | Present (deploy.sh asserts) |
| Orphan `distribution` | Absent on live tree |
| Clean rebuild (no history deps) | **PASS** (repeated deploy runs) |

---

## 8. Prisma generate result

| Check | Result |
|-------|--------|
| `npm run db:generate` | **PASS** — Prisma Client v5.22.0 → `packages/database/generated/client` |
| `npm run db:migrate:deploy` | **PASS** — 5 migrations; no pending |

---

## 9. robots.txt verification

| Item | Result |
|------|--------|
| URL | https://www.longvon.com/robots.txt |
| HTTP | **200** |
| Content-Type | `text/plain` |
| Sitemap directive | `Sitemap: https://www.longvon.com/sitemap.xml` |
| Host | `https://www.longvon.com` |
| GEO Allow | All 7 GEO paths explicitly allowed for Baiduspider / GPTBot / Google-Extended / PerplexityBot / `*` |
| Disallow | `/api/`, `/admin/`, `/dashboard`, `/_next/` |
| Site-wide block | **None** — public content remains crawlable |
| localhost leak | **None** |

---

## 10. sitemap.xml verification

| Item | Result |
|------|--------|
| URL | https://www.longvon.com/sitemap.xml |
| HTTP | **200** |
| Content-Type | `application/xml` |
| Format | Valid `<urlset>` XML |
| Production host only | All `https://www.longvon.com/...` |
| localhost | **None** |
| GEO URLs included | All 7 (`/company/longvon` + 6 smart-ring pages) |
| Knowledge articles | Included (dynamic entries with `lastmod`) |
| Admin/dashboard | Not listed |

---

## 11. llms.txt verification

| Item | Result |
|------|--------|
| URL | https://www.longvon.com/llms.txt |
| HTTP | **200** |
| Content-Type | `text/plain; charset=utf-8` |
| Non-empty | Yes (~2.1KB) |
| Entity wording | LONGVON manufacturer/OEM-ODM; MATEYOU brand developed by LONGVON |
| Metrics | `71 total health monitoring parameters` / 22 sleep-related |
| Linked pages | Match live GEO + product/partner URLs |
| localhost / staging / test URLs | **None** |
| Standalone public copy | Present under live standalone + Nginx static copy |

---

## 12. GEO page verification

Live HTTPS checks (2026-09-20). All pages: HTTP **200**, single canonical, `robots=index, follow`, no `noindex`, Open Graph + Twitter Card present.

| Path | Title (abbrev.) | Canonical | H1 present |
|------|-----------------|-----------|------------|
| `/company/longvon` | 龙汾科技… \| LONGVON Smart Ring… | `…/company/longvon` (1×) | Yes |
| `/smart-ring-manufacturer` | LONGVON \| Smart Ring Manufacturer… | self | Yes |
| `/smart-ring-oem-odm` | Smart Ring OEM & ODM… \| LONGVON | self | Yes |
| `/smart-ring-technology` | Smart Ring Technology… \| LONGVON | self | Yes |
| `/smart-ring-sleep-monitoring` | Smart Ring Sleep Monitoring… | self | Yes |
| `/smart-ring-sleep-respiratory` | 智能戒指睡眠呼吸健康监测… | self | Yes |
| `/smart-ring-osa` | Smart Ring OSA & Sleep Respiratory… | self | Yes |

**GEO understandability (existing copy only):**

- LONGVON = smart ring technology manufacturer / OEM-ODM provider (龙汾科技)
- MATEYOU = brand developed by LONGVON (not manufacturer)
- Capabilities covered: Manufacturing, OEM, ODM, hardware/software/App/SDK, Sleep / Respiratory / OSA-related monitoring
- No new medical-efficacy claims added in this task

**CTA / internal links:** OEM partner + related GEO links present (entity page includes cooperation CTA and related technology links).

---

## 13. Smoke test results

Script: `scripts/production-smoke-test.sh`

| Run | Base | Result |
|-----|------|--------|
| Post-deploy #3 first attempt | `http://127.0.0.1:3000` | Partial FAIL (warmup race on ODM/OSA body) → automatic retry |
| Post-deploy #3 retry | `http://127.0.0.1:3000` + API | **PASS=32 FAIL=0** |
| Manual HTTPS | `https://www.longvon.com` | **PASS=30 FAIL=0** |

Checks covered: `/`, robots, sitemap, llms.txt, 7 GEO pages, Content-Types, key markers, no localhost leaks, API live/ready (when `API_URL` set).

---

## 14. Issues found

1. **API ECS orphans** (`distribution` + growth pipeline services) broke clean `nest build`.
2. **Standalone missing `public/`** historically caused `/llms.txt` 404.
3. **Rollback backups under `.next/`** were deleted by the next `next build` (ineffective rollback).
4. **Post-PM2-restart warmup:** some GEO routes briefly returned 200 shells without full page body markers (smoke false negatives).

---

## 15. Issues fixed

| Issue | Fix |
|-------|-----|
| API orphans | CI `rsync --delete` on `apps/api/src` + `deploy.sh` move-to-`_orphans` |
| standalone `public/` / llms.txt | `sync_standalone_public` in `deploy.sh` + `sync-static.sh` Nginx copy |
| Ineffective rollback | Backups moved to `/root/mateyou/_rollback/` (web + api); CI excludes `_rollback` |
| Warmup false negatives | Stronger health predicates + one smoke retry |
| Smoke automation | Added `scripts/production-smoke-test.sh`, invoked from `deploy.sh` |

---

## 16. Unresolved / residual risks

| Item | Status |
|------|--------|
| Google Search Console / Analytics | Intentionally **not** added (task constraint) |
| Full cold `npm ci` on every deploy | Not required today; dependency drift possible if ECS `node_modules` diverges — monitor |
| Manual rollback runbook | Backups exist; restoring still requires operator `cp` + `pm2 restart` (acceptable basic mechanism) |
| First-request soft shells | Mitigated by health+retry; Next cold start may still need a few seconds |

---

## 17. Risks

- ECS secret material remains in `ecosystem.config.js` / env (out of scope; do not commit).
- Baiduspider `Crawl-delay: 1` may slow deep crawls (by design, not a block).
- Knowledge sitemap entries depend on API/DB availability at build/runtime of sitemap generation — currently serving correctly.

---

## 18. Next-phase recommendations

Only after this foundation stays green:

1. **Phase G — AI Content & SEO Growth Center** (content automation) — proceed carefully; do not weaken deploy idempotency.
2. Add a short operator rollback note: restore `_rollback/*` → restart PM2.
3. Optionally pin/CI-cache `node_modules` or run `npm ci` on deploy when lockfile changes.
4. Continue GEO visibility sampling (China + global) using existing trackers — no Google product dependency required.

---

## Acceptance checklist

| Criterion | Status |
|-----------|--------|
| Web production build success | **Verified** |
| API production build success | **Verified** |
| Prisma generate success | **Verified** |
| `deploy.sh` repeatable | **Verified** (3 successful ECS runs) |
| API running | **Verified** (`/health/live`, `/health/ready`) |
| Web running | **Verified** |
| robots.txt = 200 | **Verified** |
| sitemap.xml = 200 | **Verified** |
| llms.txt = 200 | **Verified** |
| 7 GEO pages = 200 | **Verified** |
| GEO canonical OK | **Verified** (1× each, self-URL) |
| GEO metadata OK | **Verified** (title/desc/OG/Twitter) |
| sitemap includes GEO | **Verified** |
| robots does not block public site | **Verified** |
| No dependency on server history files | **Verified** |
| production smoke test pass | **Verified** (localhost 32/32; HTTPS 30/30) |

### Final status

**Production SEO/GEO Foundation Verified**

Evidence basis: live ECS builds, HTTPS probes from ECS (`curl -sk`), and `scripts/production-smoke-test.sh` — not sandbox speculation.
