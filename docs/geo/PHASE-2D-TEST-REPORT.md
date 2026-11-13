# Phase 2D — Test Report

Candidate worktree: `/private/tmp/longvon-geo-phase2-candidate`

| Suite / check | Count / command | Result |
|---|---|---|
| Deploy safety (updated for 30 COPY) | 17 tests in `fix-01-deploy.spec.mjs` | PASS 17/17 |
| Field-level Meta protection | 5 tests in `assert-meta-description-only.spec.mjs` | PASS 5/5 |
| FIX-01 routing | 4 tests in `i18n-routes.spec.mjs` | PASS 4/4 |
| Combined node --test run | **26** | PASS 26/0 fail |
| Production build | `NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build --workspace=apps/web` | PASS |
| TypeScript | `tsc --noEmit -p apps/web/tsconfig.json` | PASS |
| Lint | `npm run lint --workspace=apps/web` + eslint on changed files | PASS (existing admin hook warnings only) |
| Contact → OEM | standalone `/contact` 308 → `/partner/oem` 200; `/contact/` follows to OEM | PASS |
| Meta descriptions | 145 / 152 exact unique | PASS |
| html lang / hreflang / JSON-LD | homepage + OEM pair | PASS |
| G5/OEM form unauthorized diff | none vs `71b3e88` | PASS |
| Isolated backup/rollback fixture | COPY30/DELETE1 + restore | PASS (fixture only) |
| Live nginx Contact | public `301` | PASS |
| Current production target hashes | — | **BLOCKED** |
| Real production backup verification | — | **BLOCKED** |

Total automated local tests executed this round: **26** unit/spec + build/tsc/lint + HTTP regression + fixture backup drill.
