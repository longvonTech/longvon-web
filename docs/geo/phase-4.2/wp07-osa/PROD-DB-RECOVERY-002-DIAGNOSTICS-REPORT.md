# PROD-DB-RECOVERY-002 — Diagnostics Report

**Asia/Shanghai:** 2026-11-14 20:20 · **UTC:** 2026-11-14T12:20:00Z  
**Task:** Independent GitHub Actions production **readonly** diagnostics workflow  
**Approved content SHA (keep-set compare):** `6762bb656c7d603669ef46a8a8ad6eaf33da439a`  
**Branch (this PR):** `recovery/production-readonly-diagnostics` → `main`  

---

## Evidence classification legend

| Label | Meaning |
|---|---|
| **Actual execution** | Produced by a completed Actions run of this workflow |
| **Historical log** | From prior Actions deploy failures (P3018/P3009) |
| **Inference** | Logical conclusion; not a live query |
| **Unresolved** | Not yet known; requires workflow run |

---

## 0. Status of THIS document revision

| Item | Status | Class |
|---|---|---|
| Workflow file added | **YES** — `.github/workflows/production-readonly-diagnostics.yml` | Actual (repo) |
| Remote script added | **YES** — `scripts/ci/production-readonly-diagnostics-remote.sh` | Actual (repo) |
| Workflow executed | **NO** — owner forbade run until PR review | Unresolved |
| Live O-1 backup / SQL | **NOT RUN** | Unresolved |
| Live O-3 inventory | **NOT RUN** | Unresolved |
| Production deploy / migrate resolve | **NOT RUN** (forbidden) | Actual (policy) |

**After owner approves and manually dispatches the workflow with `confirm_readonly=YES`, replace sections 1–3 below with Artifact contents (sanitized report).** Database dump stays on ECS under `_rollback/`; never in GitHub Artifacts.

---

## 1. O-1 results (pending workflow run)

| Check | Result | Class |
|---|---|---|
| Disk space | **Unresolved** | — |
| Env load path | Designed: `.env.production` then `ecosystem.config.js` (same as `deploy.sh` `load_production_env`); URL never printed | Inference from code review |
| Backup dir | Planned: `/root/mateyou/_rollback/db-backup-prod-db-recovery-001-<UTC>/` | Actual (script) |
| `pg_dump -Fc` size / SHA256 / `pg_restore -l` | **Unresolved** | — |
| `_prisma_migrations` row for `20261002000000_syndication_jobs` | **Unresolved** live; historical: started `2026-10-17 15:16:32.005100 UTC`, failed P3018/42501 | Historical log |
| `finished_at` / `rolled_back_at` / `applied_steps_count` / `checksum` / `logs` | **Unresolved** live | — |
| `to_regclass('growth.syndication_jobs')` | **Unresolved** live; inference: table likely never created (CREATE failed ACL) | Inference |
| Indexes / constraints / growth CREATE privilege | **Unresolved** live; historical CREATE denied | Historical + unresolved |

---

## 2. O-3 results (pending workflow run)

| Check | Result | Class |
|---|---|---|
| Full ECS migration dir list | **Unresolved** (Actions previously reported **8** folders found) | Historical count only |
| Per-dir `migration.sql` size / SHA256 | **Unresolved** | — |
| `migration_lock.toml` | **Unresolved** on ECS; present in git SHA | Partial |
| Keep-set at `6762bb6` | `00000000000000_init`, `20250627000000_news_enterprise_media`, `migration_lock.toml` | Actual (git) |
| ECS-only dirs | **Unresolved** names; must include at least `20261002000000_syndication_jobs` | Historical name + unresolved others |
| Code deps `syndication_jobs` / `SyndicationJob` | Absent in approved git tree `6762bb6` apps/packages | Actual (git); ECS tree pending |

---

## 3. Historical context (not a substitute for live diagnostics)

| Fact | Source |
|---|---|
| Original failure P3018 / SQLSTATE 42501 `permission denied for schema growth` on `CREATE TABLE growth.syndication_jobs` | Actions run `39044287850` |
| Later P3009 blocking deploy; same migration started_at | Actions run `43413969407` |
| Orphan dirs persist because main rsync lacks `--delete` | `deploy.yml` code review |
| Round 1 Cloud Agent / Mac handoff could not obtain SSH | `PROD-DB-RECOVERY-001-ROUND1-RESULTS.md` |

---

## 4. Workflow design summary

| Requirement | Implementation |
|---|---|
| Trigger | `workflow_dispatch` only + input `confirm_readonly == YES` |
| Environment | `production` (same secrets as Deploy) |
| Secrets | `ECS_HOST`, `ECS_USER`, `ECS_SSH_KEY_B64` |
| Runner | `ubuntu-latest` |
| Permissions | `contents: read` only |
| Host key check | `ssh-keyscan` then `StrictHostKeyChecking=yes` (not `no`) |
| Secret hygiene | No `set -x`; redact `postgresql://…` in tee; no dump in Artifacts |
| Does not call | `deploy.yml`, `scripts/deploy.sh`, migrate resolve/deploy, mv/rm, PM2 |

### Expected execution steps (owner, after merge approval)

1. Merge or otherwise land this workflow on a ref Actions can dispatch from (typically `main`).  
2. Actions → **Production readonly diagnostics** → Run workflow.  
3. Inputs: `confirm_readonly=YES`, `approved_sha=6762bb656c7d603669ef46a8a8ad6eaf33da439a`.  
4. Review job logs (redacted) + download Artifact `prod-db-recovery-002-diagnostics`.  
5. Confirm ECS backup path listed in report; dump **not** in Artifact.  
6. Use live results to authorize Round 2 (O-2 / O-3 mv / O-5) separately.

---

## 5. Security / permissions analysis

| Topic | Assessment |
|---|---|
| Token scope | Job `permissions: contents: read` — no contents write, no PR write, no `actions: write` beyond default artifact upload with GITHUB_TOKEN |
| Secret exposure | Key written only under `$RUNNER_TEMP` with mode 600; removed in always cleanup; never echoed |
| Host verification | `StrictHostKeyChecking=yes` after `ssh-keyscan` — MITM harder than `accept-new`/`no` |
| Blast radius | Script staged under `/tmp` on ECS; removed after run; does not alter `/root/mateyou` app tree except creating `_rollback` backup files |
| Data exfil | Explicit refuse if `*.dump` appears in `diagnostics-out/`; Artifact = markdown + small text only |
| Confirm gate | Workflow job skipped unless input exactly `YES` |
| Residual risk | Operator with `production` environment access can still trigger; dump consumes disk — script checks `df` first |

---

## 6. Unresolved / next owner decisions

1. Approve & merge this PR (or allow workflow_dispatch from the branch if repo policy permits).  
2. Manually run the workflow once.  
3. Paste or attach Artifact report into a follow-up commit / Round 2 approval.  
4. Still **do not** authorize O-2 resolve / O-3 deletes / O-5 deploy in this task.

---

## 7. Stop

PR created for review only. **Workflow not executed. Production not contacted from this agent.**
