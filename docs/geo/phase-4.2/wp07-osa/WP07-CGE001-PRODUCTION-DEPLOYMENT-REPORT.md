# WP07 + CGE-001 Production Deployment Report

**Final status:** `FAILED` (ECS deploy blocked) · production pages for SDK/OSA remain **not live**  
**Asia/Shanghai:** 2026-11-13 19:04 CST · **UTC:** 2026-11-13T11:04:44Z  
**Authorized content SHA:** `6762bb656c7d603669ef46a8a8ad6eaf33da439a`  
**Production target:** `https://www.longvon.com`

## 1. Pre-deploy checks

| Check | Result |
|---|---|
| Approved SHA exists | **YES** — `6762bb6` |
| `geo/phase-4.2-execution` tip equals approved? | **NO** — tip `0990579` (docs-only completion report ahead) |
| Tip delta vs approved | Docs only (3 files); **no app/code delta** |
| Decision | Deploy **exact approved SHA**, not tip |
| PR #10 / #11 | Both **MERGED** |
| Uncommitted deploy edits | None |
| Prod target clear | `https://www.longvon.com` |
| Evidence | `evidence/pre-deploy-check.txt` |

## 2. Deploy path taken

1. Pinned branch `cursor/deploy-sdk-osa-6762bb6-fc31` @ **`6762bb6`** (exact).  
2. Direct `workflow_dispatch` for “Deploy to ECS” → **HTTP 403** (`Resource not accessible by integration`).  
3. Fallback (authorized release path): PR **#14** `cursor/deploy-sdk-osa-6762bb6-fc31` → `main`, headOid confirmed **`6762bb6`**.  
4. Merged to `main` via merge-async → merge commit **`7ea1126d8d0301e1a077eac90841ba3d83b4029e`** (UTC 2026-11-13T11:00:32Z).  
5. CI on `main` **success** — run `43413542994`.  
6. Deploy to ECS auto-triggered — run **`43413969407`** — **failure**.

**No unauthorized code/claim edits. No OSA draft publish. No prisma migrate-resolve attempted.**

## 3. Platform / IDs

| Item | Value |
|---|---|
| Platform | GitHub Actions → Alibaba Cloud ECS (`Deploy to ECS` / `scripts/deploy.sh`) |
| Environment | `production` (workflow `environment: production`) |
| CI run | https://github.com/longvonTech/longvon-web/actions/runs/43413542994 — **success** |
| Deploy run | https://github.com/longvonTech/longvon-web/actions/runs/43413969407 — **failure** |
| Main tip after merge | `7ea1126` (contains approved `6762bb6`) |
| Actual live web content | **Previous production build** (SDK/OSA still 404) |

## 4. Failure root cause (stop condition)

Deploy reached ECS, ran `db:migrate:deploy`, then stopped:

```
Error: P3009
migrate found failed migrations in the target database
The `20261002000000_syndication_jobs` migration started at 2026-10-17 15:16:32.005100 UTC failed
```

Evidence: `evidence/deploy-ecs-failure-43413969407.txt`  
This is a **pre-existing production DB migration failure** (from 2026-10-17). Resolving it requires DBA/`prisma migrate resolve` (or equivalent) — **outside this authorization** (no unauthorized infra/migration repair).

Per stop rules: **STOPPED. Did not force-fix.**

## 5. Production URL acceptance (real URLs)

| URL | HTTP | Status |
|---|---|---|
| https://www.longvon.com/ | 200 | Site up |
| https://www.longvon.com/en/smart-ring-sdk-api | **404** | **FAILED** (not deployed) |
| https://www.longvon.com/smart-ring-sdk-api | **404** | **FAILED** |
| https://www.longvon.com/en/osa-smart-ring-technology | **404** | **FAILED** |
| https://www.longvon.com/osa-smart-ring-technology | **404** | **FAILED** |
| https://www.longvon.com/en/smart-ring-manufacturer | 200 | Existing page OK |
| https://www.longvon.com/en/smart-ring-oem-odm | 200 | Existing page OK |

SEO / disclaimer / conversion-path verification for **new** SDK/OSA pages: **BLOCKED** (pages not served).

## 6. Status summary

| Item | Status |
|---|---|
| Approved SHA on `main` | `DEPLOYED` to git `main` only (`7ea1126` includes `6762bb6`) |
| ECS production web release | `FAILED` |
| SDK/OSA live verification | `FAILED` / not live |
| Overall mission | `FAILED` — awaiting owner decision on DB migration repair |

## 7. Residual risks & owner decisions required

1. **Resolve failed Prisma migration** `20261002000000_syndication_jobs` on production DB (authorize `migrate resolve` / repair), then re-run Deploy to ECS.  
2. Confirm whether tip docs commit `0990579` should also land on `main` later (docs-only; not required for SDK/OSA pages).  
3. After successful ECS deploy, re-run full production acceptance (HTTP/SEO/disclaimer/CTA).  
4. Do **not** treat `main` merge alone as production publish — ECS web still on prior build.

## 8. Stop

No further deploy attempts. No migration repair. No content publish. Waiting for owner infrastructure authorization.
