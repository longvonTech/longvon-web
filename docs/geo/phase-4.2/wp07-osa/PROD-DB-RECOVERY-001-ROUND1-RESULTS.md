# PROD-DB-RECOVERY-001 — Round 1 Results

**Asia/Shanghai:** 2026-11-13 20:20 · **UTC:** 2026-11-13T12:20:00Z  
**Authorized this round:** O-1 (full) · O-3 **readonly inventory only** · O-6 checklist acceptance  
**Deferred (not executed):** O-2 resolve · O-3 mv/rm · O-4 workflow · O-5 deploy  

---

## Executive status

| Item | Status |
|---|---|
| O-1 live backup + SQL | **BLOCKED** — Cloud Agent VM has **no ECS SSH private key** |
| O-3 live migration dir inventory | **BLOCKED** — same access gap |
| O-6 acceptance checklist | **ACCEPTED** as release gate (standards only; not run on live post-deploy) |
| Forbidden ops | **None executed** |

**Root blocker:** `ssh` to production (`47.121.119.233`, historically Host `mateyou-ecs`) returns `Permission denied (publickey)`. GitHub Actions secrets `ECS_HOST` / `ECS_USER` / `ECS_SSH_KEY_B64` are **not readable** by this agent (`gh secret list` → HTTP 403). Self-hosted Mac worker with `longvon-web` is online, but subagent launch is currently **model-quota blocked**, so Round 1 could not be delegated there either.

A Cursor environment setup request was filed for `ECS_HOST`, `ECS_USER`, `ECS_SSH_KEY_B64` so Round 1 can be re-run immediately after credentials are injected.

---

## 1. Database backup results and checksums

| Field | Result |
|---|---|
| Target path | `/root/mateyou/_rollback/db-backup-prod-db-recovery-001-<UTC>/` |
| `pg_dump -Fc` | **NOT EXECUTED** |
| Dump size | **N/A** |
| SHA256 | **N/A** |
| `pg_restore -l` integrity | **N/A** |
| `_prisma_migrations` CSV | **NOT EXECUTED** |
| Credentials in this report | **None** (no connection string printed) |

**Connection target (redacted, from prior Actions evidence only):**

| Field | Value |
|---|---|
| Engine | PostgreSQL |
| Database | `mateyou_prod` |
| Host (from ECS Prisma) | `localhost:5432` (on ECS) |
| Schemas | `analytics_pii, audit, growth, health, public` |
| User / password | **REDACTED** — not used this round |

**Probe log (this VM):**

```text
ssh -o BatchMode=yes root@47.121.119.233 → Permission denied (publickey)
TCP 5432 on public IP → closed (expected; DB is localhost-only on ECS)
Local psql/pg_dump → not installed on agent image
```

---

## 2. Failed migration — real DB record

| Field | Live value | Source |
|---|---|---|
| migration_name | `20261002000000_syndication_jobs` | Actions P3009/P3018 (not live SELECT) |
| started_at | `2026-10-17 15:16:32.005100 UTC` | Actions |
| finished_at | **UNKNOWN (live)** — inferred unfinished/failed | Actions |
| rolled_back_at | **UNKNOWN (live)** | EVIDENCE GAP |
| logs | **UNKNOWN (live)** — error text only in Actions | EVIDENCE GAP |
| applied_steps_count | **UNKNOWN (live)** | EVIDENCE GAP |
| id / checksum | **UNKNOWN (live)** | EVIDENCE GAP |

**Live `_prisma_migrations` SELECT: NOT EXECUTED.**

---

## 3. `growth.syndication_jobs` existence

| Check | Result |
|---|---|
| `to_regclass('growth.syndication_jobs')` | **NOT EXECUTED** |
| `information_schema.tables` | **NOT EXECUTED** |
| Indexes / constraints | **NOT EXECUTED** |
| `CREATE` privilege on schema `growth` for deploy role | **NOT EXECUTED** (historically denied — Actions 42501 on 2026-10-17) |

**Strict classification:** **无法确定** (live).  
**Historical inference only (not a substitute for O-1):** CREATE TABLE failed with ACL error → table **likely never created**.

---

## 4. ECS migration directory inventory

| Check | Result |
|---|---|
| Live `ls` of `/root/mateyou/packages/database/prisma/migrations` | **NOT EXECUTED** |
| Count from last deploy log (2026-11-13) | **8 migrations found** (Actions `43413969407`) |
| Directory names | **EVIDENCE GAP** — Actions did not print names |
| Per-dir file counts / SQL digests | **EVIDENCE GAP** |

### Known from Actions error excerpt only

| Directory (suspected on disk) | Evidence |
|---|---|
| `20261002000000_syndication_jobs` | P3018 applied this name; SQL prefix in log |

SQL prefix recovered earlier (not full file):

```sql
-- Third-party syndication jobs (WeChat MP first)
CREATE SCHEMA IF NOT EXISTS "growth";
CREATE TABLE IF NOT EXISTS "growth"."syndication_jobs" (
```

---

## 5. Git compare vs approved SHA `6762bb656c7d603669ef46a8a8ad6eaf33da439a`

**Migrations in git at approved SHA (complete list):**

| Path | In git SHA? | Planned disposition (pending live confirm) |
|---|---|---|
| `00000000000000_init/` | **YES** | **KEEP** |
| `20250627000000_news_enterprise_media/` | **YES** | **KEEP** |
| `migration_lock.toml` | **YES** | **KEEP** |
| `20261002000000_syndication_jobs/` | **NO** (0 commits in history) | **REMOVE after backup** (when O-3 write approved) |
| Any other of the “8 − 2” ECS-only dirs | **NO** (by definition) | **REMOVE after backup** once names confirmed |

**Git SQL summaries (approved keep-set):**

| Dir | Lines | Summary |
|---|---|---|
| `00000000000000_init` | 682 | Initial multi-schema platform DDL |
| `20250627000000_news_enterprise_media` | 7 | `news.video_url` / `media` / timestamps |

---

## 6. Business / code dependency check

### At approved SHA `6762bb6` (git)

| Query | Result |
|---|---|
| `syndication_jobs` / `SyndicationJob` in `apps/` + `packages/` | **No matches** |
| Prisma model for syndication jobs | **Absent** |
| `growth` schema models present | Industry/Competitor/Research/Keyword/ContentBrief/ExecutiveReport only — **no syndication** |

### Working tree (docs excluded)

No application code references found outside this investigation/recovery docs set.

### Runtime note

`scripts/deploy.sh` still runs `db:migrate:deploy` before web build — P3009 continues to block SDK/OSA publish until O-2+O-3+O-5.

**Conclusion:** Abandoning the orphan migration is **compatible with approved SDK/OSA release code**. Live confirmation of table absence remains required before O-2.

---

## 7. Recommended minimal O-2 / O-3 (still deferred)

**Do not execute until owner Round 2 approval + successful O-1 re-run.**

### Minimal sequence

1. **Re-run O-1** with SSH access → confirm `to_regclass('growth.syndication_jobs')` is NULL.  
2. **O-3 write (minimal):**  
   - Backup entire `prisma/migrations` → `/root/mateyou/_orphans/prisma-migrations-backup-<UTC>/`  
   - `mv` **only** directories **not** in the git keep-set (must include `20261002000000_syndication_jobs`; plus every other ECS-only name from inventory).  
3. **O-2:**  
   ```bash
   cd /root/mateyou/packages/database
   npx prisma migrate resolve --rolled-back 20261002000000_syndication_jobs
   ```  
4. Verify: `prisma migrate status` clean; `ls migrations` shows **exactly 2** dirs + lock.  
5. Then request **O-5** for SHA `6762bb6`.

**Why O-3 before next deploy:** After `--rolled-back`, leftover folders are treated as pending and will be **re-applied** → 42501/P3018 again.

**O-4:** Still recommend **no** `deploy.yml` change for this recovery.

---

## 8. Risks and evidence gaps

| Gap / risk | Severity | Mitigation |
|---|---|---|
| No live `_prisma_migrations` row | **High** | Inject ECS SSH secrets; re-run O-1 |
| No live table existence proof | **High** | Same |
| Unknown names of ~6 other orphan dirs | **High** | O-3 readonly inventory |
| Full `migration.sql` for syndication unknown | Medium | Read from ECS once SSH works; keep in orphan backup |
| Subagent to Mac worker blocked by model quota | Medium | Prefer secrets on this Cloud VM |
| Secrets present in repo `ecosystem.config.js` (historical) | Security note | **Not used / not printed** this round; recommend rotating out of git separately (out of scope) |

---

## 9. O-6 checklist — accepted standards

Owner accepted the plan checklist as the post-O-5 gate. **Not executed** against production this round (deploy still blocked). Baseline reminder:

| URL | Last known (2026-11-13 deploy report) |
|---|---|
| SDK/OSA EN+ZH | **404** |
| Manufacturer / OEM EN | **200** |
| Sitemap SDK/OSA entries | **N/A** until pages live |

Full checklist remains in `PROD-DB-RECOVERY-001-EXECUTION-PLAN.md` §O-6.

---

## 10. Access unblock checklist (owner)

- [ ] Add Cloud Agent / environment secrets: `ECS_HOST`, `ECS_USER`, `ECS_SSH_KEY_B64` (same as Actions production deploy)  
- [ ] Confirm BatchMode SSH: `ssh -o BatchMode=yes "$ECS_USER@$ECS_HOST" 'hostname; date -u'`  
- [ ] Re-authorize **Round 1 re-run** (O-1 + O-3 readonly) — or approve Round 2 after results land  

---

## 11. Stop

Round 1 **stopped** with access blocker.  
**No** DB writes · **No** `migrate resolve` · **No** ECS `mv`/`rm` · **No** workflow change · **No** redeploy.

Awaiting credentials + next itemized owner approval.
