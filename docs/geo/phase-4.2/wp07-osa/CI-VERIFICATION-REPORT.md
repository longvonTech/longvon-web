# CI Verification Report — WP07-DECISION-001-G (D-14=A)

**Audited (UTC):** 2026-11-12T11:54:00Z · **Asia/Shanghai:** 2026-11-12 19:54

## 1. GitHub Actions presence

| Workflow | Path | Trigger | Relevance to #10/#11 |
|---|---|---|---|
| CI | `.github/workflows/ci.yml` | `push`/`pull_request` → **`main` only** | **Does not run** on stacked Phase 4.2 PR bases |
| Deploy ECS | `.github/workflows/deploy.yml` | (deploy pipeline) | **Not authorized** this task |

`gh pr checks 10` → none reported  
`gh pr checks 11` → none reported  
`gh run list --branch cursor/geo-wp07-osa-fc31` → empty  
`gh run list --branch cursor/geo-phase-4-2-cge-fc31` → empty  

### D-14 exception (required)
**CI workflow exists but does not execute for these PR targets.** Therefore GitHub CI cannot be “green” on #10/#11 without changing workflow triggers (out of WP07 scope) or merging to `main`.

**Exception recommendation for owner:** Accept **local verification evidence** below for Phase 4.2 stack merge readiness, **or** require a one-off CI run / temporary workflow trigger before merge. Do **not** invent a green GitHub check.

**This is not claimed as GitHub CI PASS.**

## 2. Local verification (PR #11 tip lineage + decision edits)

| Check | Command / method | UTC time | Target | Result | Blocks merge? |
|---|---|---|---|---|---|
| Build | `NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build --workspace=apps/web` | 2026-11-12T11:53:15Z | apps/web | **PASS** (OSA+SDK routes in output) | No |
| SSR 200 + meta | Standalone server smoke | 2026-11-12T11:53:54Z | OSA/SDK EN+ZH | **PASS** — `evidence/ssr-smoke-wp07-decision-001.txt` | No |
| Canonical | SSR `<link rel="canonical">` | same | OSA EN | `https://www.longvon.com/en/osa-smart-ring-technology` | No |
| hreflang | SSR alternate link tags | same | OSA EN | zh-CN / en / x-default present | No |
| i18n routes | `node --experimental-strip-types --test apps/web/lib/i18n-routes.spec.mjs` | same | routes spec | **5 pass / 0 fail** | No |
| 404 of new routes | SSR | same | OSA/SDK | 200 not 404 | No |
| Internal links | SSR flags sdk↔osa | same | pages | **PASS** | No |
| D-01 disclaimer | SSR string flags | same | OSA EN/ZH | **PASS** | No |
| STOP-BANG absent | SSR | same | OSA pages | **PASS** | No |

## 3. PR #10 (CGE) CI note
Same workflow limitation. CGE previously recorded local build/SSR in `docs/geo/phase-4.2/cge-001/evidence/`. No new GitHub checks since tip `ee246a3`.

## 4. Verdict
| Item | Status |
|---|---|
| GitHub CI green on #10/#11 | **N/A — does not run** (exception logged) |
| Local build/SSR/i18n for decision tip | **PASS** |
| Skip/weaken tests to force green | **Not done** |
