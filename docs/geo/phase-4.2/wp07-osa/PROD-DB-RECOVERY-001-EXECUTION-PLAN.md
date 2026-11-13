# PROD-DB-RECOVERY-001 — Controlled Execution Plan (Option B)

**Project:** LONGVON GEO Phase 4.2  
**Decision:** Owner selected **Option B** (abandon orphan syndication migration; clear P3009; align ECS migrations to git; redeploy SDK+OSA)  
**Approved deploy content SHA:** `6762bb656c7d603669ef46a8a8ad6eaf33da439a`  
**Asia/Shanghai:** 2026-11-13 19:55 · **UTC:** 2026-11-13T11:55:00Z  
**This round:** **PLAN ONLY** — no DB writes · no `migrate resolve` · no DDL/DML · no ECS delete/move · no workflow edit · no redeploy  

**Basis:** `PROD-DB-MIGRATION-INVESTIGATION-001.md` · Actions `39044287850` / `43413969407`  
**Agent access this session:** no `DATABASE_URL` · no ECS SSH secrets → live O-1/O-3 inspect commands are **prepared, not executed**.

---

## Decision map (Option B)

| Step | ID | Intent | Execute this round? |
|---|---|---|---|
| Backup + readonly DB/structure | **O-1** | Prove safe to abandon migration | **No** — plan + commands only |
| Mark failed migration rolled-back | **O-2** | Clear P3009 history row | **No** |
| Remove ECS orphan migration dirs | **O-3** | Prevent re-apply after resolve | **No** |
| Rsync strategy | **O-4** | Prefer **no code change** this release | **No** |
| Redeploy approved SHA | **O-5** | Ship SDK+OSA | **No** |
| Production acceptance | **O-6** | Verify live pages | **No** (checklist ready) |

### Critical sequencing (do not reorder)

1. **O-1** must pass (table absent / no dependency) before **O-2**.  
2. **O-3** must complete **before** the next `prisma migrate deploy` (O-5).  
   - After `migrate resolve --rolled-back`, if `20261002000000_syndication_jobs/` **still exists on ECS**, the next deploy will **re-apply** it → **42501 / P3018** again.  
3. **O-4** code change is **optional** for this one-shot if O-3 cleans disk.  
4. **O-5** only after O-1 + O-2 + O-3 approved and done.  
5. **O-6** after O-5 green.

**Investigation O-3 (GRANT CREATE on growth)** is **out of scope** for Option B (that was Option A).

---

## Shared targets (credentials redacted)

| Item | Value |
|---|---|
| DB (from Actions) | PostgreSQL `mateyou_prod` @ `localhost:5432` (from ECS host) |
| Schemas | `analytics_pii, audit, growth, health, public` |
| App root on ECS | `/root/mateyou` |
| Migrations path | `/root/mateyou/packages/database/prisma/migrations` |
| Env load | `.env.production` or `ecosystem.config.js` via `scripts/deploy.sh` `load_production_env` |
| Connection string | **REDACTED** — use existing ECS production `DATABASE_URL` (never paste in tickets) |
| Git migrations at approved SHA | Only `00000000000000_init`, `20250627000000_news_enterprise_media` (+ `migration_lock.toml`) |
| Failed migration name | `20261002000000_syndication_jobs` |
| Failed started_at (UTC) | `2026-10-17 15:16:32.005100` |

---

## O-1 — Database backup and readonly inspection

### 1. Goal

Produce a recoverable DB backup and **readonly** evidence that Option B is safe:
- Confirm `_prisma_migrations` failed row for `20261002000000_syndication_jobs`
- Confirm whether `growth.syndication_jobs` exists
- List related indexes/constraints/privileges
- Document restore procedure

### 2. Exact commands (prepared — **not run this round**)

**On ECS (as deploy user), after loading env without echoing secrets:**

```bash
# --- O-1a: connect target (hide credentials) ---
cd /root/mateyou
set -a; source .env.production 2>/dev/null || true; set +a
# Fallback: load from ecosystem.config.js the same way deploy.sh does (see scripts/deploy.sh)
echo "DB host check (no password):"
node -e 'const u=new URL(process.env.DATABASE_URL); console.log({protocol:u.protocol,host:u.host,pathname:u.pathname,username:u.username,password:"***"})'

STAMP=$(date -u +%Y%m%dT%H%M%SZ)
BK=/root/mateyou/_rollback/db-backup-prod-db-recovery-001-$STAMP
mkdir -p "$BK"

# --- O-1b: logical backup (read DB → write dump files only) ---
# Prefer custom format for restore flexibility
pg_dump "$DATABASE_URL" -Fc -f "$BK/mateyou_prod.dump"
# Also dump prisma migrations table as plain SQL for quick inspect
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "\copy (SELECT * FROM _prisma_migrations ORDER BY started_at) TO STDOUT WITH CSV HEADER" > "$BK/_prisma_migrations.csv"

# Integrity
ls -lh "$BK"
sha256sum "$BK/mateyou_prod.dump" | tee "$BK/mateyou_prod.dump.sha256"
pg_restore -l "$BK/mateyou_prod.dump" | head -50   # TOC readable ⇒ dump not corrupt
```

**Readonly inspect SQL:**

```sql
-- Target failed row
SELECT id, checksum, finished_at, migration_name, logs, rolled_back_at,
       started_at, applied_steps_count
FROM _prisma_migrations
WHERE migration_name = '20261002000000_syndication_jobs';

-- Full history (for context)
SELECT migration_name, started_at, finished_at, rolled_back_at,
       applied_steps_count, left(coalesce(logs,''), 200) AS logs_prefix
FROM _prisma_migrations
ORDER BY started_at;

-- Table existence
SELECT to_regclass('growth.syndication_jobs') AS syndication_jobs_regclass;

SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema = 'growth' AND table_name = 'syndication_jobs';

-- Columns / indexes / constraints IF table exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'growth' AND table_name = 'syndication_jobs'
ORDER BY ordinal_position;

SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'growth' AND tablename = 'syndication_jobs';

SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'growth.syndication_jobs'::regclass;

-- Privileges on schema growth (explain original 42501)
SELECT n.nspname, r.rolname,
       has_schema_privilege(r.rolname, n.nspname, 'USAGE') AS usage,
       has_schema_privilege(r.rolname, n.nspname, 'CREATE') AS create
FROM pg_namespace n
CROSS JOIN pg_roles r
WHERE n.nspname = 'growth'
  AND r.rolname = current_user;
```

### 3. Writes / deletes

| Action | Writes? |
|---|---|
| `pg_dump` / CSV export | Writes **backup files** under `_rollback/` only |
| SELECT / `\copy` | **No** DB mutation |
| This planning round | **Nothing executed** |

### 4. Risk

| Risk | Mitigation |
|---|---|
| Dump disk pressure | Check `df -h` before dump; keep under `_rollback` |
| Credential leak in logs | Never `echo $DATABASE_URL`; redact in reports |
| Misread “table missing” | Use both `to_regclass` and `information_schema` |

### 5. Preconditions

- Owner approves **O-1** readonly + backup file creation on ECS.  
- Operator has SSH to ECS and DB connect rights (existing deploy role is enough for SELECT/dump if granted).  
- Free disk for dump size ≈ DB size.

### 6. Backup

- Path: `/root/mateyou/_rollback/db-backup-prod-db-recovery-001-<UTC>/mateyou_prod.dump`  
- Checksum: sibling `.sha256`  
- CSV: `_prisma_migrations.csv`

### 7. Rollback / restore

```bash
# Emergency restore to a NEW database first (preferred), not in-place blind restore
createdb mateyou_prod_restore_test
pg_restore -d "postgresql://USER@localhost:5432/mateyou_prod_restore_test" \
  /root/mateyou/_rollback/db-backup-prod-db-recovery-001-<UTC>/mateyou_prod.dump
# In-place restore of production requires separate owner + DBA approval (out of Option B happy path)
```

### 8. Verification

| Check | Pass criteria |
|---|---|
| Dump TOC | `pg_restore -l` lists schemas/tables |
| SHA256 | Re-hash matches |
| Failed row | One row, `finished_at` null (or equivalent failed state), name exact |
| Table | `to_regclass` **NULL** → Option B proceed; **non-NULL** → **STOP**, re-evaluate (may need Option A/D) |

### 9. Owner approval required

- [ ] Approve SSH + readonly SQL on production  
- [ ] Approve writing `pg_dump` under `/root/mateyou/_rollback/`  
- [ ] Approve proceeding to O-2 **only if** table absent (or explicitly accept data implications if present)

### Live results (this round)

| Item | Status |
|---|---|
| Connection | **NOT EXECUTED** — no agent DB/SSH access |
| Backup | **NOT EXECUTED** |
| `_prisma_migrations` dump | **NOT EXECUTED** (inferred from Actions only) |
| `growth.syndication_jobs` | **无法确定** until O-1 runs |

---

## O-2 — Migration status repair (`--rolled-back`)

### 1. Goal / target object

- **migration_name:** `20261002000000_syndication_jobs`  
- Clear Prisma **P3009** failed-history block without applying the migration.

### 2. Why `--rolled-back` is appropriate (Option B)

| Fact | Evidence |
|---|---|
| Not in approved git SHA `6762bb6` | `git ls-tree` — only 2 migrations |
| Original apply failed on CREATE TABLE ACL | Actions `39044287850` → 42501 |
| Feature (WeChat syndication jobs) not required for SDK/OSA static pages | Investigation §5 |
| Marking **applied** would lie unless table fully matches SQL | SQL body incomplete; table likely never created |

**Gate:** O-1 must show table **absent** (or owner accepts explicit exception).

### 3. Exact command (prepared — **not run**)

```bash
cd /root/mateyou
set -a; source .env.production 2>/dev/null || true; set +a
# Ensure Prisma sees the migration name known to _prisma_migrations.
# Prefer running while the failed folder still exists OR immediately after recording its name from O-1/O-3 listing.
cd packages/database
npx prisma migrate resolve --rolled-back 20261002000000_syndication_jobs
```

Equivalent via workspace root (same as deploy):

```bash
cd /root/mateyou
npm run db:migrate:deploy --dry-run 2>/dev/null || true  # optional; Prisma may not support dry-run — skip if unsupported
# Actual resolve:
npm exec --workspace=packages/database -- prisma migrate resolve --rolled-back 20261002000000_syndication_jobs
```

### 4. Writes / deletes

| Action | Effect |
|---|---|
| `migrate resolve --rolled-back` | **Writes** `_prisma_migrations` (marks/clears failed migration as rolled back) |
| Schema/data tables | **No** DDL/DML on business tables |

### 5. Risk

| Risk | Level | Notes |
|---|---|---|
| Resolve while table partially exists | Medium | Mitigated by O-1 gate |
| Folder remains → next deploy re-applies | **High** | Mitigated by mandatory **O-3 before O-5** |
| Wrong migration name | Low | Use exact name from O-1 SELECT |

### 6. Preconditions

- [ ] O-1 backup completed + checksum OK  
- [ ] O-1: `to_regclass('growth.syndication_jobs')` is NULL **OR** owner-signed exception  
- [ ] Owner explicitly approves **O-2** write to `_prisma_migrations`  
- [ ] Operator understands O-3 must follow before deploy  

### 7. Backup

Rely on O-1 `pg_dump` + `_prisma_migrations.csv` taken **immediately before** resolve.

### 8. Rollback if resolve goes wrong

```sql
-- Only with DBA + owner approval. Prefer restore from O-1 dump of _prisma_migrations
-- or re-insert failed row from CSV snapshot — do NOT invent checksums.
```

If resolve succeeds but deploy must be aborted: leave site on current PM2 build (O-5 not yet run); restore `_prisma_migrations` from O-1 CSV/dump under DBA supervision.

### 9. Post-resolve verification SQL

```sql
SELECT migration_name, started_at, finished_at, rolled_back_at, applied_steps_count
FROM _prisma_migrations
WHERE migration_name = '20261002000000_syndication_jobs';
-- Expect: no blocking failed row (rolled_back_at set and/or row removed per Prisma version behavior)

SELECT migration_name, finished_at, rolled_back_at
FROM _prisma_migrations
ORDER BY started_at;
```

```bash
cd /root/mateyou/packages/database
npx prisma migrate status
# Expect: no P3009; pending only if orphan folders still present (must be fixed by O-3)
```

### 10. Owner approval required

- [ ] Approve exact command `prisma migrate resolve --rolled-back 20261002000000_syndication_jobs`  
- [ ] Confirm **not** `--applied`  
- [ ] Confirm O-3 will run before any deploy  

---

## O-3 — ECS orphan migration directory cleanup

### 1. Goal

List **all** migration directories on ECS; retain only those present at approved SHA `6762bb6`; backup then remove orphans so post-resolve `migrate deploy` cannot re-apply syndication (or other ghosts).

### 2. Exact listing commands (readonly — **not run this round**)

```bash
MIG=/root/mateyou/packages/database/prisma/migrations
ls -la "$MIG"
find "$MIG" -mindepth 1 -maxdepth 1 -type d | sort

# Per-directory inventory
for d in "$MIG"/*/; do
  name=$(basename "$d")
  echo "===== $name ====="
  find "$d" -type f | wc -l
  ls -la "$d"
  if [ -f "$d/migration.sql" ]; then
    wc -l "$d/migration.sql"
    head -20 "$d/migration.sql"
    echo "...(tail)..."
    tail -5 "$d/migration.sql"
  else
    echo "NO migration.sql"
  fi
done
```

### 3. Expected comparison matrix (fill during approved O-3 inspect)

| Directory name | In git SHA `6762bb6`? | Files | migration.sql summary | App dependency | Action |
|---|---|---|---|---|---|
| `00000000000000_init` | **YES** | (fill) | Init ERD / multi-schema | Core | **KEEP** |
| `20250627000000_news_enterprise_media` | **YES** | (fill) | `news` video_url/media columns | News | **KEEP** |
| `20261002000000_syndication_jobs` | **NO** | (fill) | WeChat syndication CREATE TABLE (partial known) | Not in release | **DELETE after backup** |
| *(other dirs — Actions reported **8** total)* | Unknown until list | (fill) | (fill) | Unknown | Default **DELETE after backup** if not in git SHA |

**Known gap:** Actions only reported count (**8**), not names. Full list requires O-3 readonly SSH.

### 4. Dependency check (before delete)

```bash
# Code references (on ECS tree + optional local)
rg -n "syndication_jobs|SyndicationJob" /root/mateyou/apps /root/mateyou/packages --glob '!node_modules/**' || true
pm2 list
# Confirm mateyou-web / mateyou-api do not require this table for current traffic
```

Git at `6762bb6`: **no** `SyndicationJob` / `syndication_jobs` references in app code (investigation).

### 5. Proposed delete set (pending list)

- **Definitely proposed:** `20261002000000_syndication_jobs`  
- **Conditionally proposed:** every other directory under `prisma/migrations/` **not** in `{00000000000000_init, 20250627000000_news_enterprise_media}`  
- **Never delete:** `migration_lock.toml`; the two git migrations above  

### 6. Backup then delete commands (prepared — **not run**)

```bash
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
MIG=/root/mateyou/packages/database/prisma/migrations
ORPH_BK=/root/mateyou/_orphans/prisma-migrations-backup-$STAMP
mkdir -p "$ORPH_BK"

# Backup entire migrations tree first
cp -a "$MIG" "$ORPH_BK/migrations"

# Example deletes (ONLY after owner approves exact name list from inventory):
# mv keeps recovery easy; prefer mv over rm
for name in 20261002000000_syndication_jobs ; do
  # REPLACE/EXTEND this list with approved orphan names from inventory
  if [ -d "$MIG/$name" ]; then
    mv "$MIG/$name" "$ORPH_BK/"
  fi
done

# Verify only git migrations remain
ls -la "$MIG"
# Expect exactly:
#   00000000000000_init/
#   20250627000000_news_enterprise_media/
#   migration_lock.toml
```

### 7. Writes / deletes

| Action | Effect |
|---|---|
| `cp -a` backup | Creates files under `_orphans/` |
| `mv` orphan dirs | **Removes** from active migrations path (not permanent wipe) |

### 8. Risk

| Risk | Mitigation |
|---|---|
| Deleting a legit uncommitted migration still needed | Inventory + owner name list; backup first |
| App depends on table | O-1 + `rg` dependency check |
| Accidental delete of init | Hard allowlist keep-set |

### 9. Preconditions

- [ ] O-1 complete  
- [ ] Owner approves **exact** directory name list to move  
- [ ] Backup path has space  

### 10. Restore command

```bash
ORPH_BK=/root/mateyou/_orphans/prisma-migrations-backup-<UTC>
MIG=/root/mateyou/packages/database/prisma/migrations
# Restore one dir
cp -a "$ORPH_BK/20261002000000_syndication_jobs" "$MIG/"
# Or restore full tree from "$ORPH_BK/migrations"
```

### 11. Verification

```bash
ls -1 /root/mateyou/packages/database/prisma/migrations
# Must match git SHA 6762bb6 migration folders only (2 dirs + lock)
test ! -d /root/mateyou/packages/database/prisma/migrations/20261002000000_syndication_jobs
```

### 12. Owner approval required

- [ ] Approve readonly inventory SSH  
- [ ] Approve backup under `_orphans/`  
- [ ] Approve exact `mv` name list (paste into approval comment)  

### Live results (this round)

| Item | Status |
|---|---|
| Full ECS dir list | **NOT EXECUTED** — evidence gap (only “8 migrations found”) |
| File counts / SQL digests | **PENDING O-3 inspect** |

---

## O-4 — Deploy sync strategy (rsync)

### 1. Goal

Decide whether `.github/workflows/deploy.yml` must change so future deploys cannot leave orphan migrations.

### 2. Current behavior

- Main rsync: **no** `--delete` → ECS-only migration folders **persist**.  
- Only `apps/api/src/` uses `--delete`.  
- Root cause amplifier of “6 → 8 migrations found”.

### 3. Recommendation for **this** recovery

| Choice | Verdict |
|---|---|
| Modify `deploy.yml` now | **Not required** if O-3 manually aligns disk before O-5 |
| Prefer | **No code change** this release (owner priority) |
| Follow-up | Separate PR later: e.g. `rsync -az --delete` **only** for `packages/database/prisma/migrations/` |

### 4. Optional future Diff (submit only if owner insists now — **not applied**)

```diff
# Conceptual — DO NOT MERGE without separate approval
+          echo "==> Reconcile prisma migrations with --delete"
+          rsync -az --delete \
+            -e "$RSYNC_SSH" \
+            ./packages/database/prisma/migrations/ \
+            "${ECS_USER}@${ECS_HOST}:/root/mateyou/packages/database/prisma/migrations/"
```

| | |
|---|---|
| Writes | Changes CI deploy behavior permanently |
| Risk | `--delete` removes any legitimate ECS-only migration not in the checked-out SHA — usually desired |
| Rollback | Revert workflow commit |
| This round | **No Diff committed** |

### 5. Owner approval required

- [ ] Confirm **O-4 = no workflow change** for this recovery **OR**  
- [ ] Approve separate workflow Diff PR before merge  

---

## O-5 — Redeploy approved SDK + OSA

### 1. Goal / exact SHA

| Item | Value |
|---|---|
| Content SHA | `6762bb656c7d603669ef46a8a8ad6eaf33da439a` |
| Note | `main` merge commit `7ea1126` contains this content; tree for apps matches release |
| Do **not** deploy unrelated tip docs unless owner asks |

### 2. Trigger options (none executed)

| Method | How | Notes |
|---|---|---|
| A. `workflow_dispatch` “Deploy to ECS” | Actions UI / `gh workflow run` with ref pointing at commit whose tree is approved | Agent previously got **403** on dispatch; **owner/human** can trigger |
| B. Empty/docs-free push to `main` after O-2+O-3 | `workflow_run` after CI success on `main` | Checkout uses `workflow_run.head_sha` |
| C. Re-run failed deploy job | Only if head SHA still desired | Still needs O-2+O-3 first or will fail P3009 again |

**Workflow file:** `.github/workflows/deploy.yml` (`Deploy to ECS`)  
**Environment:** `production`  
**Remote script:** `DEPLOY_SKIP_GIT_PULL=1 ./scripts/deploy.sh`

### 3. Expected migrate behavior after O-2+O-3

```
Prisma migrate deploy
Datasource: mateyou_prod @ localhost:5432
2 migrations found in prisma/migrations
No pending migrations (init + news already applied)
→ exit 0
→ npm run build (web + api)
→ pm2 restart
```

If orphans remain: may show >2 migrations and attempt `syndication_jobs` again → **FAIL**.

### 4. Writes during deploy

| Step | Effect |
|---|---|
| rsync | Overwrites files under `/root/mateyou` (excludes `.env.production`, `_orphans`, `_rollback`) |
| `db:migrate:deploy` | Should be **no-op** if history clean + 2 folders |
| `backup_web_standalone` | Writes `_rollback/web-standalone.bak.*` / `api-dist.bak.*` |
| `next build` / nest build | Replaces build artifacts |
| `pm2 restart` | Process restart (brief blip) |

### 5. Risk

| Risk | Mitigation |
|---|---|
| P3009 returns | Do not trigger until O-2+O-3 verified |
| Build/runtime error | Use `_rollback` restore (below) |
| Wrong SHA | Checkout ref must be `6762bb6` or `main` containing only that release content |

### 6. Preconditions

- [ ] O-1, O-2, O-3 done and verified  
- [ ] O-4 decision recorded (no change OK)  
- [ ] Owner approves production Deploy trigger  
- [ ] CI green if using push path  

### 7. Backup / rollback

Deploy script already backs up standalone + API dist. Manual rollback:

```bash
# Identify latest backup
ls -1dt /root/mateyou/_rollback/web-standalone.bak.* | head -3
# Restore previous web standalone (example — adjust paths to PM2 cwd)
# Owner/DBA: stop mateyou-web, restore backup into apps/web/.next/standalone, restart pm2
pm2 stop mateyou-web
# ... copy backup back ...
pm2 restart ecosystem.config.js
```

DB rollback not expected for no-op migrate; use O-1 dump only if migrate unexpectedly mutates.

### 8. Verification (deploy job)

- Actions run conclusion = success  
- Log: `2 migrations found` (or equal to git)  
- No P3009/P3018  
- `pm2 status` mateyou-web online  
- Then proceed to O-6 URL checks  

### 9. Owner approval required

- [ ] Approve trigger method (A/B/C)  
- [ ] Approve exact git ref / SHA  
- [ ] Approve production window  

---

## O-6 — Production acceptance checklist

Run against `https://www.longvon.com` **after** O-5 success. Baseline from prior failed deploy: SDK/OSA were **404**; manufacturer/OEM were **200**.

### HTTP / routes

| # | Check | Pass |
|---|---|---|
| 1 | `/` | 200 |
| 2 | `/en/smart-ring-sdk-api` | 200 |
| 3 | `/smart-ring-sdk-api` | 200 |
| 4 | `/en/osa-smart-ring-technology` | 200 |
| 5 | `/osa-smart-ring-technology` | 200 |
| 6 | `/en/smart-ring-manufacturer` | 200 |
| 7 | `/smart-ring-manufacturer` (if published) | 200 |
| 8 | `/en/smart-ring-oem-odm` | 200 |
| 9 | `/smart-ring-oem-odm` | 200 |
| 10 | `/sitemap.xml` contains SDK + OSA slugs | yes |

### SEO / i18n

| # | Check | Pass |
|---|---|---|
| 11 | Canonical on each SDK/OSA page | self URL |
| 12 | hreflang `zh` / `en` / `x-default` | present + correct |
| 13 | `lang` attribute | zh-CN / en |

### Medical / commercial boundaries (OSA)

| # | Check | Pass |
|---|---|---|
| 14 | EN disclaimer aside present | yes |
| 15 | ZH disclaimer present (FINAL wording) | yes |
| 16 | Ring1C ≠ medical device | yes |
| 17 | AHI ≠ PSG / non-diagnostic | yes |
| 18 | No STOP-BANG as product claim | yes |

### Conversion paths (link exists **and** target 200)

| # | Path | Pass |
|---|---|---|
| 19 | OSA EN → SDK EN | |
| 20 | SDK EN → OSA EN | |
| 21 | OSA/SDK EN → OEM/ODM + `/en/partner/oem` | |
| 22 | OSA ZH → SDK ZH | |
| 23 | SDK ZH → OSA ZH | |
| 24 | OSA/SDK ZH → OEM/ODM + `/partner/oem` | |

### Suggested curl smoke (post-deploy)

```bash
for u in \
  https://www.longvon.com/ \
  https://www.longvon.com/en/smart-ring-sdk-api \
  https://www.longvon.com/smart-ring-sdk-api \
  https://www.longvon.com/en/osa-smart-ring-technology \
  https://www.longvon.com/osa-smart-ring-technology \
  https://www.longvon.com/en/smart-ring-manufacturer \
  https://www.longvon.com/en/smart-ring-oem-odm \
  https://www.longvon.com/sitemap.xml
 do
  code=$(curl -s -o /dev/null -w "%{http_code}" -L "$u")
  echo "$code $u"
done
```

### Owner approval required

- [ ] Accept O-6 checklist as release gate  
- [ ] Sign production PASS/FAIL after execution  

---

## Per-operation approval ticket (copy for owner)

| ID | Approve? | Exact action authorized | Notes |
|---|---|---|---|
| O-1 | ☐ | Readonly SQL + `pg_dump` to `_rollback/db-backup-prod-db-recovery-001-*` | Gate for O-2 |
| O-2 | ☐ | `prisma migrate resolve --rolled-back 20261002000000_syndication_jobs` | Only if table absent |
| O-3 | ☐ | Inventory + `mv` approved orphan dirs → `_orphans/prisma-migrations-backup-*` | Must precede O-5 |
| O-4 | ☐ | **No** `deploy.yml` change **or** separate Diff | Prefer no change |
| O-5 | ☐ | Trigger Deploy for SHA `6762bb6` / method ___ | After O-2+O-3 |
| O-6 | ☐ | Run acceptance checklist on www.longvon.com | After O-5 green |

---

## Stop

**Plan submitted. No recovery steps executed.**  
Awaiting **itemized** owner approvals (O-1 → O-6).  
Next agent turn may execute **only** the IDs explicitly approved in the owner reply.
