# PROD-DB-MIGRATION-INVESTIGATION-001

**Task:** Read-only investigation of production Prisma P3009 / failed migration `20261002000000_syndication_jobs`  
**Asia/Shanghai:** 2026-11-13 19:15 · **UTC:** 2026-11-13T11:15:00Z  
**Scope honored:** no DB writes · no `migrate resolve` / `migrate deploy` · no SQL DDL/DML · no ECS redeploy  

---

## 1. Failed migration analysis

### 1.1 Presence in authorized git tree

| Location | Result |
|---|---|
| Current `main` (`7ea1126`) | **ABSENT** — only `00000000000000_init`, `20250627000000_news_enterprise_media` |
| Approved deploy SHA `6762bb6` | **ABSENT** |
| Full git history search for path `**/20261002000000_syndication_jobs/**` | **Not found** (0 commits) |

**Conclusion:** This migration is **not part of the authorized SDK/OSA release tree**. It persists as an **orphan migration directory on the ECS filesystem** and/or a **failed row in `_prisma_migrations`**, kept alive because production rsync in `.github/workflows/deploy.yml` does **not** use `--delete` for the main tree (only API `src/` uses `--delete`). Prisma then enumerates **all** folders under `/root/mateyou/packages/database/prisma/migrations` on disk.

Evidence of orphan count drift:
- 2026-10-17 deploy log: **6 migrations found**
- 2026-11-13 deploy log: **8 migrations found**
- Git at those SHAs: **2 migration folders**

### 1.2 SQL content recoverable from Actions (partial)

Full `migration.sql` file is **not in git**. Only the Prisma error “Position” excerpt from the **original** failure is available (run `39044287850`, 2026-10-17).

Reconstructed known prefix:

```sql
-- Third-party syndication jobs (WeChat MP first)
CREATE SCHEMA IF NOT EXISTS "growth";

CREATE TABLE IF NOT EXISTS "growth"."syndication_jobs" (
```

| Element | Status from evidence |
|---|---|
| Creates schema `growth` | **Intended** (`CREATE SCHEMA IF NOT EXISTS`) |
| Creates table `growth.syndication_jobs` | **Intended** (failed here) |
| Columns / indexes / FKs / other ops | **EVIDENCE MISSING** — log truncated at opening `(` of `CREATE TABLE` |
| Irreversible ops (DROP/TRUNCATE/data rewrite) | **Cannot confirm** — no full SQL |

Comment in SQL identifies purpose: **third-party syndication jobs (WeChat MP first)**.

---

## 2. Production migration record (`_prisma_migrations`)

### 2.1 Access

| Check | Result |
|---|---|
| Agent production DB credentials / readonly URL | **Not available** in this environment |
| Direct query of `_prisma_migrations` | **NOT EXECUTED** (no access; write forbidden anyway) |

### 2.2 Inferred record from Prisma CLI output (not a DB dump)

From deploy logs (Prisma reading production DB `mateyou_prod`):

| Field | Inferred value | Source |
|---|---|---|
| migration_name | `20261002000000_syndication_jobs` | P3009 / P3018 messages |
| started_at | **2026-10-17 15:16:32.005100 UTC** | Nov 13 P3009 text |
| finished_at | **null / unfinished** (failed) | P3018 then persistent P3009 |
| rolled_back_at | **Unknown** — no log states rollback | EVIDENCE MISSING |
| logs | See §4 | Actions |
| applied_steps_count | **Unknown** | EVIDENCE MISSING |

**Confidence:** High that a **failed** row exists for this migration name; exact `_prisma_migrations` columns require a **readonly SQL** by owner/DBA.

---

## 3. Production database structure check

| Object | Expected by migration | Live check | Status |
|---|---|---|---|
| Schema `growth` | Created / used | Datasource already lists schemas including `growth` in Prisma connect string | Schema **exists as a named schema** in DB config; **CREATE privilege** for deploy role was denied on 2026-10-17 |
| Table `growth.syndication_jobs` | `CREATE TABLE IF NOT EXISTS` | **Not queried** | **无法确定** — no readonly `\dt` / `information_schema` access |
| Indexes / FKs on that table | Unknown (SQL incomplete) | **Not queried** | **无法确定** |

**Do not infer table existence from migration record alone.** Failure occurred **before** table create completed (permission error on `CREATE TABLE`). Most likely table was **never created**, but this is **not verified**.

Classification:
- Migration application: **started, failed on first CREATE TABLE** → structure change for `syndication_jobs` likely **完全未执行** (probable) / **无法确定** (strict).
- Schema `growth`: **already present** in multi-schema DB (used by other Prisma models); `CREATE SCHEMA IF NOT EXISTS` may have no-oped or succeeded before table ACL failure.

---

## 4. Failure cause and evidence

### 4.1 Root cause (original, 2026-10-17)

| Item | Value |
|---|---|
| Deploy run | https://github.com/longvonTech/longvon-web/actions/runs/39044287850 |
| Trigger head SHA | `0b0d50d56952b2abe01264b70256a19fe7e641e0` |
| Prisma error | **P3018** (migration failed to apply) |
| PostgreSQL | **42501** — `ERROR: permission denied for schema growth` |
| Failing statement | `CREATE TABLE IF NOT EXISTS "growth"."syndication_jobs" (...` |
| Timing | started **2026-10-17T15:16:32.005100Z** |

**Interpretation:** The DB role used by production `DATABASE_URL` / deploy could connect and see schema `growth`, but **lacked CREATE (or equivalent) privilege on schema `growth`** for creating new tables.

### 4.2 Blocking symptom (2026-11-13 SDK/OSA deploy)

| Item | Value |
|---|---|
| Deploy run | https://github.com/longvonTech/longvon-web/actions/runs/43413969407 |
| Prisma error | **P3009** — failed migrations present; new migrations will not apply |
| Named failed migration | `20261002000000_syndication_jobs` (same started_at) |
| Migrations found on ECS disk | **8** (vs **2** in git) |

No new SQL failure on Nov 13 — deploy **never re-attempted** the CREATE TABLE; it stopped because the **failed history row** remains.

### 4.3 Evidence gaps

| Gap | Status |
|---|---|
| Full `migration.sql` in git | **MISSING** |
| PostgreSQL server logs beyond Actions | **MISSING** |
| Live `_prisma_migrations` dump | **MISSING** (no readonly session) |
| Live `\dn` / `\dt growth.*` | **MISSING** |

**No guessing** beyond what Actions printed.

---

## 5. Business impact

| Area | Impact |
|---|---|
| Public website (current PM2 build) | **Running** — home / manufacturer / OEM return 200; pre-dates failed migrate |
| SDK + OSA pages | **Blocked from going live** — `deploy.sh` runs `db:migrate:deploy` **before** `npm run build` / PM2 restart |
| `syndication_jobs` feature | Intended **WeChat MP / third-party article syndication** job queue — **not** required for static GEO SDK/OSA HTML pages |
| Current production content features | Existing `growth` schema models (industry/competitor/keyword/content brief, etc.) already in Prisma schema — independent of this missing table |
| Other migrations | Any pending migrate is blocked while P3009 stands |
| Data loss risk from this failure | **Low for existing site** — CREATE TABLE failed; unlikely destructive. **Unverified** without DB inspect |

**Net:** A **non–SDK/OSA**, likely **orphan** migration + **ACL issue** is gating the authorized web release because migrate is a hard dependency in `scripts/deploy.sh` L153–154.

---

## 6. Recovery options (evaluation only — **not executed**)

### Option A — Grant schema privilege, then resolve & re-apply (if table still desired)

| | |
|---|---|
| Premise | Owner wants `growth.syndication_jobs`; DBA can `GRANT CREATE ON SCHEMA growth` (and usage) to deploy role; full SQL recovered from ECS disk or backup |
| Steps (conceptual) | 1) Readonly confirm table absent 2) GRANT 3) `migrate resolve` rolled-back **or** fix failed row per Prisma docs 4) `migrate deploy` 5) Redeploy ECS |
| Data risk | Low if only CREATE TABLE; verify SQL first |
| Rollback | DROP TABLE if newly created (after approval) |
| DBA | **Yes** |
| Downtime | Usually none / brief |

### Option B — Treat as abandoned orphan; clear failed flag; align ECS migrations to git (**recommended for SDK/OSA**)

| | |
|---|---|
| Premise | Feature not in authorized release; table not needed; orphan dirs on ECS explain “8 migrations found” |
| Steps (conceptual) | 1) Readonly confirm no critical dependency 2) DBA: `prisma migrate resolve --rolled-back 20261002000000_syndication_jobs` **or** equivalent `_prisma_migrations` cleanup **with backup** 3) Remove orphan migration folders on ECS **or** change rsync to `--delete` for migrations path 4) Redeploy so migrate sees only git’s 2 migrations 5) Confirm migrate no-op / success then web build |
| Data risk | Low if table never created; **must** confirm before marking rolled-back |
| Rollback | Re-add migration later under proper ACL |
| DBA | **Yes** (at least for resolve + inspect) |
| Downtime | None expected for resolve; redeploy has normal restart window |

### Option C — Deploy-path bypass for static web (code change)

| | |
|---|---|
| Premise | Separate “web-only deploy” skipping migrate |
| Steps | Change `deploy.sh` / workflow; owner-approved code PR; redeploy |
| Data risk | Leaves P3009 in place — API deploys still blocked |
| DBA | No for skip; still needed to clean P3009 eventually |
| Downtime | Normal PM2 restart |
| Note | **Requires new code authorization**; does not fix root cause |

### Option D — Full DBA forensic + restore from backup (if structure found inconsistent)

| | |
|---|---|
| Premise | Readonly shows partial objects / corruption |
| Steps | Backup → compare → repair → resolve → deploy |
| Data risk | Higher; needs change window |
| DBA | **Required** |
| Downtime | Possible |

---

## 7. Recommended path (for owner approval)

**Recommend Option B** as primary for unblocking SDK + OSA:

1. **Readonly** production inspect (owner/DBA):  
   - `SELECT * FROM _prisma_migrations WHERE migration_name LIKE '%syndication%';`  
   - `SELECT to_regclass('growth.syndication_jobs');` / `\dt growth.*`  
2. If table **absent** and no app dependency: mark migration **rolled back** via approved Prisma resolve.  
3. Remove ECS orphan dirs under `packages/database/prisma/migrations/` that are **not** in git (or add migrations `--delete` rsync — separate code approval).  
4. Re-run **Deploy to ECS** for approved web SHA.  
5. Optionally schedule Option A later if WeChat syndication is a real product need (with ACL fix + proper migration in git).

**Do not** mark as “applied” unless the table truly exists and matches intended SQL.

---

## 8. Operations requiring explicit owner approval

| ID | Operation | Why |
|---|---|---|
| O-1 | Readonly SQL on production (`_prisma_migrations`, `to_regclass`, grants listing) | Confirms structure; still needs access grant |
| O-2 | `prisma migrate resolve --rolled-back 20261002000000_syndication_jobs` (or `--applied`) | Writes migration history |
| O-3 | `GRANT CREATE ON SCHEMA growth TO <deploy_role>` (if re-applying) | ACL change |
| O-4 | Delete orphan migration folders on ECS | Filesystem change |
| O-5 | Rsync `--delete` for migrations (workflow change) | Code + deploy behavior change |
| O-6 | Re-trigger Deploy to ECS | Production release |
| O-7 | Any `migrate deploy` / DDL | Explicitly out of this investigation |

---

## 9. Evidence index

| Artifact | Path / URL |
|---|---|
| Original P3018 / 42501 | Actions run `39044287850` (2026-10-17) |
| Later P3009 | Actions run `43413969407` (2026-11-13) |
| Deploy gate | `scripts/deploy.sh` (~L153–154) `npm run db:migrate:deploy` before web build |
| Rsync non-delete | `.github/workflows/deploy.yml` main rsync lacks `--delete` |
| Prior GEO notes | Task 15 docs exclude “API syndication” from publish |
| This report | `docs/geo/phase-4.2/wp07-osa/PROD-DB-MIGRATION-INVESTIGATION-001.md` |

---

## 10. Stop

Investigation complete. **No database writes. No resolve. No redeploy.** Awaiting owner approval of O-1…O-6 as applicable.
