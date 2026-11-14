#!/usr/bin/env bash
# LONGVON-PROD-RECOVERY-002 — remote readonly diagnostics (runs ON ECS via SSH).
# Allowed: disk check, env load (no URL print), pg_dump backup, readonly SQL, migration dir inventory.
# Forbidden: migrate resolve/deploy, DDL/DML, mv/rm of migrations, deploy, pm2 restart.
set -euo pipefail
# NOTE: do not use set -x (would leak secrets)

APPROVED_KEEP_DIRS="${APPROVED_KEEP_DIRS:-00000000000000_init 20250627000000_news_enterprise_media}"
TARGET_MIGRATION="${TARGET_MIGRATION:-20261002000000_syndication_jobs}"
ROOT="/root/mateyou"
MIG_DIR="$ROOT/packages/database/prisma/migrations"
REPORT_DIR_LOCAL="${REPORT_OUT_DIR:-/tmp/prod-db-recovery-002}"
mkdir -p "$REPORT_DIR_LOCAL"

redact() {
  # Strip common secret patterns from stdin for report safety
  sed -E \
    -e 's#postgresql://[^[:space:]]+#postgresql://***REDACTED***#gi' \
    -e 's#(PASSWORD|SECRET|TOKEN|API_KEY)[=:][^[:space:]]+#\1=***#gi' \
    -e 's# redis://:[^@]+@#redis://:***@#gi'
}

echo "==> HOST identity"
hostname
date -u +"UTC=%Y-%m-%dT%H:%M:%SZ"
test -d "$ROOT" && echo "MATEYOU_ROOT_OK=yes" || { echo "MATEYOU_ROOT_OK=no"; exit 1; }

echo "==> Disk space"
df -h "$ROOT" / /var 2>/dev/null | redact || df -h | redact

echo "==> Load production env (DATABASE_URL never printed)"
cd "$ROOT"
if [ -f .env.production ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.production 2>/dev/null || true
  set +a
  echo "ENV_SOURCE=.env.production"
fi
if [ -z "${DATABASE_URL:-}" ] && [ -f ecosystem.config.js ]; then
  eval "$(node - <<'NODE'
const config = require('./ecosystem.config.js');
const api = config.apps.find((a) => a.name === 'mateyou-api');
const web = config.apps.find((a) => a.name === 'mateyou-web');
const env = { ...(api?.env || {}), ...(web?.env || {}) };
for (const [key, value] of Object.entries(env)) {
  if (value == null || value === '') continue;
  if (key === 'DATABASE_URL' || key.endsWith('_URL') || /SECRET|PASSWORD|TOKEN|KEY/i.test(key)) {
    // still export; never print
  }
  const escaped = String(value).replace(/'/g, "'\\''");
  process.stdout.write(`export ${key}='${escaped}'\n`);
}
NODE
)"
  echo "ENV_SOURCE=ecosystem.config.js (fallback)"
fi
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL not set after load"
  exit 1
fi
# Redacted connection metadata only
node -e 'const u=new URL(process.env.DATABASE_URL); console.log(JSON.stringify({protocol:u.protocol,host:u.host,db:u.pathname,user:u.username,password:"***"}))'

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BK="$ROOT/_rollback/db-backup-prod-db-recovery-001-$STAMP"
mkdir -p "$BK"
echo "BACKUP_DIR=$BK"

echo "==> O-1 pg_dump -Fc"
pg_dump "$DATABASE_URL" -Fc -f "$BK/mateyou_prod.dump"
ls -lh "$BK/mateyou_prod.dump"
sha256sum "$BK/mateyou_prod.dump" | tee "$BK/mateyou_prod.dump.sha256"
echo "==> pg_restore -l (first 40 TOC lines)"
pg_restore -l "$BK/mateyou_prod.dump" | head -40
TOC_COUNT="$(pg_restore -l "$BK/mateyou_prod.dump" | wc -l | tr -d ' ')"
echo "PG_RESTORE_TOC_LINES=$TOC_COUNT"

echo "==> Export _prisma_migrations (CSV + target row)"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "\copy (SELECT id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count FROM _prisma_migrations ORDER BY started_at) TO STDOUT WITH CSV HEADER" > "$BK/_prisma_migrations.csv" || {
  echo "WARN: column set may differ; trying SELECT *"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "\copy (SELECT * FROM _prisma_migrations ORDER BY started_at) TO STDOUT WITH CSV HEADER" > "$BK/_prisma_migrations.csv"
}
# Target migration as aligned text (logs truncated in report file separately)
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -At -F '|' -c "
SELECT
  coalesce(migration_name::text, '<NULL>'),
  coalesce(started_at::text, '<NULL>'),
  coalesce(finished_at::text, '<NULL>'),
  coalesce(rolled_back_at::text, '<NULL>'),
  coalesce(applied_steps_count::text, '<NULL>'),
  coalesce(checksum::text, '<NULL>'),
  coalesce(left(coalesce(logs,''), 2000), '<NULL>')
FROM _prisma_migrations
WHERE migration_name = '$TARGET_MIGRATION';
" > "$BK/target_migration_row.txt" || echo "TARGET_ROW_QUERY_FAILED" | tee "$BK/target_migration_row.txt"

# Column existence probe
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "\d+ _prisma_migrations" > "$BK/_prisma_migrations_describe.txt" 2>&1 || true

echo "==> O-1 structure: growth.syndication_jobs"
{
  echo "--- to_regclass ---"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "SELECT to_regclass('growth.syndication_jobs') AS syndication_jobs_regclass;"
  echo "--- information_schema.tables ---"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'growth' AND table_name = 'syndication_jobs';"
  echo "--- columns ---"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema = 'growth' AND table_name = 'syndication_jobs' ORDER BY ordinal_position;"
  echo "--- indexes ---"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "SELECT indexname, indexdef FROM pg_indexes WHERE schemaname = 'growth' AND tablename = 'syndication_jobs';"
  echo "--- constraints (only if relation exists) ---"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "
DO \$\$
BEGIN
  IF to_regclass('growth.syndication_jobs') IS NOT NULL THEN
    RAISE NOTICE 'TABLE_EXISTS';
  ELSE
    RAISE NOTICE 'TABLE_ABSENT';
  END IF;
END\$\$;
"
  if psql "$DATABASE_URL" -At -c "SELECT to_regclass('growth.syndication_jobs') IS NOT NULL;" | grep -q t; then
    psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'growth.syndication_jobs'::regclass;"
  else
    echo "CONSTRAINTS: skipped (table absent)"
  fi
  echo "--- schema growth privileges for current_user ---"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "
SELECT n.nspname, current_user AS rolname,
       has_schema_privilege(current_user, n.nspname, 'USAGE') AS usage,
       has_schema_privilege(current_user, n.nspname, 'CREATE') AS create
FROM pg_namespace n
WHERE n.nspname = 'growth';
"
} > "$BK/structure_checks.txt" 2>&1

echo "==> O-3 migration directory inventory"
{
  echo "MIG_DIR=$MIG_DIR"
  ls -la "$MIG_DIR" || true
  echo "--- per-directory ---"
  if [ -d "$MIG_DIR" ]; then
    find "$MIG_DIR" -mindepth 1 -maxdepth 1 \( -type d -o -type f \) | sort | while read -r p; do
      base="$(basename "$p")"
      if [ -d "$p" ]; then
        fc="$(find "$p" -type f | wc -l | tr -d ' ')"
        echo "DIR name=$base files=$fc"
        if [ -f "$p/migration.sql" ]; then
          sz="$(wc -c < "$p/migration.sql" | tr -d ' ')"
          sum="$(sha256sum "$p/migration.sql" | awk '{print $1}')"
          echo "  migration.sql bytes=$sz sha256=$sum"
          echo "  head:"
          head -20 "$p/migration.sql" | sed 's/^/    /'
        else
          echo "  migration.sql: ABSENT"
        fi
      else
        echo "FILE name=$base bytes=$(wc -c < "$p" | tr -d ' ') sha256=$(sha256sum "$p" | awk '{print $1}')"
      fi
    done
  fi
  echo "--- keep-set compare (approved git SHA dirs) ---"
  for keep in $APPROVED_KEEP_DIRS; do
    if [ -d "$MIG_DIR/$keep" ]; then echo "KEEP_PRESENT=$keep"; else echo "KEEP_MISSING=$keep"; fi
  done
  if [ -f "$MIG_DIR/migration_lock.toml" ]; then
    echo "LOCK_PRESENT=migration_lock.toml sha256=$(sha256sum "$MIG_DIR/migration_lock.toml" | awk '{print $1}')"
  else
    echo "LOCK_MISSING=migration_lock.toml"
  fi
  echo "--- ECS-only dirs (not in approved keep set) ---"
  if [ -d "$MIG_DIR" ]; then
    find "$MIG_DIR" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort | while read -r d; do
      keep=0
      for k in $APPROVED_KEEP_DIRS; do [ "$d" = "$k" ] && keep=1; done
      if [ "$keep" -eq 0 ]; then echo "ECS_ONLY_DIR=$d"; fi
    done
  fi
} > "$BK/migrations_inventory.txt" 2>&1

echo "==> Code dependency scan (readonly rg)"
{
  echo "--- syndication_jobs / SyndicationJob under apps+packages ---"
  if command -v rg >/dev/null 2>&1; then
    rg -n "syndication_jobs|SyndicationJob" "$ROOT/apps" "$ROOT/packages" --glob '!node_modules/**' --glob '!**/generated/**' || echo "NO_MATCHES"
  else
    grep -RIn --exclude-dir=node_modules --exclude-dir=generated -e 'syndication_jobs' -e 'SyndicationJob' "$ROOT/apps" "$ROOT/packages" 2>/dev/null || echo "NO_MATCHES"
  fi
} > "$BK/dependency_scan.txt" 2>&1

# Build sanitized markdown report (no DATABASE_URL)
REPORT="$BK/PROD-DB-RECOVERY-002-DIAGNOSTICS-REPORT.md"
{
  echo "# PROD-DB-RECOVERY-002 Diagnostics Report"
  echo
  echo "**Generated UTC:** $STAMP"
  echo "**Evidence class:** actual execution (ECS via Actions readonly workflow)"
  echo "**Backup dir:** \`$BK\` (stays on ECS; not uploaded to GitHub)"
  echo
  echo "## Host"
  echo '```'
  hostname
  date -u
  echo '```'
  echo
  echo "## Disk"
  echo '```'
  df -h "$ROOT" 2>/dev/null | redact || true
  echo '```'
  echo
  echo "## O-1 Backup"
  echo '```'
  ls -lh "$BK/mateyou_prod.dump" "$BK/mateyou_prod.dump.sha256" 2>/dev/null
  cat "$BK/mateyou_prod.dump.sha256"
  echo "PG_RESTORE_TOC_LINES=$TOC_COUNT"
  echo '```'
  echo
  echo "## Target migration \`$TARGET_MIGRATION\`"
  echo
  echo "| Field | Value |"
  echo "|---|---|"
  if [ -s "$BK/target_migration_row.txt" ] && ! grep -q TARGET_ROW_QUERY_FAILED "$BK/target_migration_row.txt"; then
    IFS='|' read -r m_name m_started m_finished m_rolled m_steps m_checksum m_logs < "$BK/target_migration_row.txt" || true
    echo "| migration_name | \`${m_name:-<unparsed>}\` |"
    echo "| started_at | \`${m_started:-<unparsed>}\` |"
    echo "| finished_at | \`${m_finished:-<unparsed>}\` |"
    echo "| rolled_back_at | \`${m_rolled:-<unparsed>}\` |"
    echo "| applied_steps_count | \`${m_steps:-<unparsed>}\` |"
    echo "| checksum | \`${m_checksum:-<unparsed>}\` |"
    echo "| logs (truncated) | see below |"
    echo
    echo '```'
    echo "${m_logs:-}" | redact
    echo '```'
  else
    echo "| (row) | **NOT FOUND or query failed — see raw file on ECS** |"
    echo
    echo '```'
    cat "$BK/target_migration_row.txt" 2>/dev/null | redact || true
    echo '```'
  fi
  echo
  echo "## Structure checks"
  echo '```'
  cat "$BK/structure_checks.txt" | redact
  echo '```'
  echo
  echo "## O-3 Migrations inventory"
  echo '```'
  cat "$BK/migrations_inventory.txt" | redact
  echo '```'
  echo
  echo "## Dependency scan"
  echo '```'
  cat "$BK/dependency_scan.txt" | redact
  echo '```'
  echo
  echo "## Forbidden actions"
  echo "None executed: no migrate resolve/deploy, no DDL/DML, no mv/rm, no deploy, no pm2 restart."
} > "$REPORT"

# Copy sanitized report for Actions to fetch
cp -a "$REPORT" "$REPORT_DIR_LOCAL/PROD-DB-RECOVERY-002-DIAGNOSTICS-REPORT.md"
cp -a "$BK/mateyou_prod.dump.sha256" "$REPORT_DIR_LOCAL/" 2>/dev/null || true
cp -a "$BK/migrations_inventory.txt" "$REPORT_DIR_LOCAL/" 2>/dev/null || true
cp -a "$BK/structure_checks.txt" "$REPORT_DIR_LOCAL/" 2>/dev/null || true
cp -a "$BK/target_migration_row.txt" "$REPORT_DIR_LOCAL/" 2>/dev/null || true
cp -a "$BK/dependency_scan.txt" "$REPORT_DIR_LOCAL/" 2>/dev/null || true
# Explicitly do NOT copy the dump file off-box via this script

echo "REPORT_PATH=$REPORT"
echo "SANITIZED_COPY=$REPORT_DIR_LOCAL/PROD-DB-RECOVERY-002-DIAGNOSTICS-REPORT.md"
echo "DONE"
