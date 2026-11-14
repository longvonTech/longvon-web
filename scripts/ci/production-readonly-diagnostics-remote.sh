#!/usr/bin/env bash
# LONGVON-PROD-RECOVERY-002 — remote readonly diagnostics (runs ON ECS via SSH).
# Allowed: disk check, env load (no URL print), pg_dump backup, readonly SQL, migration dir inventory.
# Forbidden: migrate resolve/deploy, DDL/DML, mv/rm of migrations, deploy, pm2 restart.
# Artifact surface: ONLY the sanitized Markdown report written to REPORT_OUT_DIR.
set -euo pipefail
# NOTE: do not use set -x (would leak secrets)

umask 077

APPROVED_KEEP_DIRS="${APPROVED_KEEP_DIRS:-00000000000000_init 20250627000000_news_enterprise_media}"
TARGET_MIGRATION="${TARGET_MIGRATION:-20261002000000_syndication_jobs}"
if [[ ! "$TARGET_MIGRATION" =~ ^[0-9]{14}_[A-Za-z0-9_]+$ ]]; then
  echo "ERROR: TARGET_MIGRATION failed allowlist pattern" >&2
  exit 1
fi
for _kd in $APPROVED_KEEP_DIRS; do
  if [[ ! "$_kd" =~ ^[A-Za-z0-9_]+$ ]]; then
    echo "ERROR: APPROVED_KEEP_DIRS entry failed allowlist: $_kd" >&2
    exit 1
  fi
done
ROOT="/root/mateyou"
MIG_DIR="$ROOT/packages/database/prisma/migrations"
# Unique per-run report dir (never wipe / chmod / reuse shared or foreign trees)
RUN_ID="${RUN_ID:-$(date -u +%Y%m%dT%H%M%SZ)-$$}"
if [[ ! "$RUN_ID" =~ ^[A-Za-z0-9._-]+$ ]]; then
  echo "ERROR: RUN_ID failed allowlist" >&2
  exit 1
fi
EXPECTED_REPORT_OUT_DIR="/tmp/prod-db-recovery-002-${RUN_ID}"
if [ -n "${REPORT_OUT_DIR:-}" ]; then
  if [ "$REPORT_OUT_DIR" != "$EXPECTED_REPORT_OUT_DIR" ]; then
    echo "ERROR: REPORT_OUT_DIR must be exactly ${EXPECTED_REPORT_OUT_DIR}" >&2
    echo "got: ${REPORT_OUT_DIR}" >&2
    exit 1
  fi
else
  REPORT_OUT_DIR="$EXPECTED_REPORT_OUT_DIR"
fi

# True only for a real directory that is not a symlink (including via final path component).
is_real_dir() {
  local p="$1"
  # -L before -d: reject symlinks even when the target is a directory.
  if [ -L "$p" ]; then
    return 1
  fi
  [ -d "$p" ]
}

# Stage statuses (do not mask failures)
O1_BACKUP_STATUS="NOT_STARTED"
O1_SQL_STATUS="NOT_STARTED"
O3_INVENTORY_STATUS="NOT_STARTED"
OVERALL_STATUS="RUNNING"
DISK_CHECK_STATUS="NOT_STARTED"
DB_SIZE_BYTES=""
FS_AVAIL_BYTES=""
DISK_REQUIRED_BYTES=""
DISK_MARGIN_BYTES=""

fail_section() {
  local section="$1"
  local msg="$2"
  echo "ERROR[${section}]: $msg" >&2
  case "$section" in
    O1_BACKUP) O1_BACKUP_STATUS="FAILED" ;;
    O1_SQL) O1_SQL_STATUS="FAILED" ;;
    O3_INVENTORY) O3_INVENTORY_STATUS="FAILED" ;;
    DISK_CHECK) DISK_CHECK_STATUS="FAILED"; O1_BACKUP_STATUS="FAILED" ;;
  esac
  OVERALL_STATUS="FAILED"
}

secure_chmod_tree() {
  local dir="$1"
  chmod 700 "$dir"
  find "$dir" -type f -exec chmod 600 {} +
  find "$dir" -type d -exec chmod 700 {} +
}

redact_line() {
  sed -E \
    -e 's#postgresql://[^[:space:]]+#postgresql://***REDACTED***#gi' \
    -e 's#(PASSWORD|SECRET|TOKEN|API_KEY)[=:][^[:space:]]+#\1=***#gi' \
    -e 's#redis://:[^@]+@#redis://:***@#gi'
}

# Read KEY=value from a dotenv file without sourcing/executing it.
extract_dotenv_value() {
  local file="$1" key="$2"
  local line raw val
  [ -f "$file" ] || return 1
  line="$(grep -E "^[[:space:]]*(export[[:space:]]+)?${key}=" "$file" | tail -n 1)" || return 1
  [ -n "$line" ] || return 1
  raw="${line#*=}"
  # Trim CR and surrounding whitespace
  raw="$(printf '%s' "$raw" | tr -d '\r' | sed -E 's/^[[:space:]]+//;s/[[:space:]]+$//')"
  if [[ "$raw" =~ ^\"(.*)\"$ ]]; then
    val="${BASH_REMATCH[1]}"
  elif [[ "$raw" =~ ^\'(.*)\'$ ]]; then
    val="${BASH_REMATCH[1]}"
  else
    val="$raw"
  fi
  printf '%s' "$val"
}

# Text-scan ecosystem.config.js for DATABASE_URL string literal (no require/eval).
extract_ecosystem_database_url() {
  local file="$1"
  [ -f "$file" ] || return 1
  ECOSYSTEM_CONFIG_PATH="$file" node <<'NODE'
const fs = require('fs');
const file = process.env.ECOSYSTEM_CONFIG_PATH;
const text = fs.readFileSync(file, 'utf8');
// Match DATABASE_URL: '...' or "..." only (no template literals / concatenation).
const re = /DATABASE_URL\s*:\s*(['"])([^'"\\]*(?:\\.[^'"\\]*)*)\1/;
const m = text.match(re);
if (!m) process.exit(2);
let v = m[2];
v = v.replace(/\\(['"\\])/g, '$1');
process.stdout.write(v);
NODE
}

export_database_url_safely() {
  local val="$1"
  if [ -z "$val" ]; then
    echo "ERROR: empty DATABASE_URL" >&2
    return 1
  fi
  if [[ "$val" == *$'\n'* || "$val" == *$'\r'* ]]; then
    echo "ERROR: DATABASE_URL contains newline" >&2
    return 1
  fi
  if [[ "$val" == *'$('* || "$val" == *'`'* || "$val" == *'${'* ]]; then
    echo "ERROR: DATABASE_URL contains shell expansion markers" >&2
    return 1
  fi
  if [[ ! "$val" =~ ^postgres(ql)?:// ]]; then
    echo "ERROR: DATABASE_URL is not a postgres URL scheme" >&2
    return 1
  fi
  export DATABASE_URL="$val"
}

echo "==> HOST identity"
hostname
date -u +"UTC=%Y-%m-%dT%H:%M:%SZ"
if [ ! -d "$ROOT" ]; then
  fail_section O1_BACKUP "MATEYOU_ROOT missing: $ROOT"
  exit 1
fi
echo "MATEYOU_ROOT_OK=yes"

echo "==> Disk space (pre-check overview)"
df -h "$ROOT" / 2>/dev/null | redact_line || df -h | redact_line

echo "==> Load DATABASE_URL (safe parse only; never source/eval/require config)"
cd "$ROOT"
ENV_SOURCE="none"
unset DATABASE_URL || true
if [ -f .env.production ]; then
  if VAL="$(extract_dotenv_value .env.production DATABASE_URL)"; then
    if export_database_url_safely "$VAL"; then
      ENV_SOURCE=".env.production (dotenv parse)"
    fi
  fi
fi
if [ -z "${DATABASE_URL:-}" ] && [ -f ecosystem.config.js ]; then
  set +e
  VAL="$(extract_ecosystem_database_url ecosystem.config.js)"
  ECO_RC=$?
  set -e
  if [ "$ECO_RC" -eq 0 ] && [ -n "$VAL" ]; then
    if export_database_url_safely "$VAL"; then
      ENV_SOURCE="ecosystem.config.js (text scan)"
    fi
  elif [ "$ECO_RC" -eq 2 ]; then
    echo "WARN: DATABASE_URL string literal not found in ecosystem.config.js"
  else
    echo "WARN: failed to text-scan ecosystem.config.js"
  fi
fi
echo "ENV_SOURCE=$ENV_SOURCE"
if [ -z "${DATABASE_URL:-}" ]; then
  fail_section O1_BACKUP "DATABASE_URL could not be loaded safely; refusing to bypass"
  exit 1
fi
node -e 'const u=new URL(process.env.DATABASE_URL); console.log(JSON.stringify({protocol:u.protocol,host:u.host,db:u.pathname,user:u.username,password:"***"}))'

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
ROLLBACK_PARENT="$ROOT/_rollback"
BK="$ROLLBACK_PARENT/db-backup-prod-db-recovery-002-${STAMP}-${RUN_ID}"
DUMP_FILE="$BK/mateyou_prod.dump"
DUMP_SHA_FILE="$BK/mateyou_prod.dump.sha256"
TOC_FILE="$BK/pg_restore_toc.txt"
TOC_ERR_FILE="$BK/pg_restore_toc.err"
BACKUP_FAIL_REASON=""
REMOTE_SCRIPT_PATH="${REMOTE_SCRIPT:-}"
# Only write into BK when this run exclusively created it (never into a pre-existing dir).
BK_OWNED="no"
ROLLBACK_PARENT_CREATED="no"

# ----- _rollback parent: create only if missing; never chmod a pre-existing shared dir -----
echo "==> Ensure _rollback parent (no chmod on pre-existing)"
if [ -L "$ROLLBACK_PARENT" ]; then
  BACKUP_FAIL_REASON="_rollback parent is a symlink (refusing): $ROLLBACK_PARENT"
  fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
  O1_BACKUP_STATUS="O1_BACKUP_FAILED"
  O1_SQL_STATUS="NOT_EXECUTED"
  echo "O1_BACKUP_FAILED=yes"
elif [ -e "$ROLLBACK_PARENT" ]; then
  if ! is_real_dir "$ROLLBACK_PARENT"; then
    BACKUP_FAIL_REASON="_rollback parent exists but is not a real directory: $ROLLBACK_PARENT"
    fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
    O1_BACKUP_STATUS="O1_BACKUP_FAILED"
    O1_SQL_STATUS="NOT_EXECUTED"
    echo "O1_BACKUP_FAILED=yes"
  else
    # Pre-existing shared dir: do NOT chmod, clear, or alter permissions.
    echo "ROLLBACK_PARENT_PREEXISTING=yes"
  fi
else
  # Does not exist — create leaf parent only (not mkdir -p through unknown parents beyond ROOT).
  if [ ! -d "$ROOT" ] || [ -L "$ROOT" ]; then
    BACKUP_FAIL_REASON="mateyou root is missing or a symlink; cannot create _rollback safely"
    fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
    O1_BACKUP_STATUS="O1_BACKUP_FAILED"
    O1_SQL_STATUS="NOT_EXECUTED"
    echo "O1_BACKUP_FAILED=yes"
  elif ! mkdir "$ROLLBACK_PARENT" 2>/dev/null; then
    # Race or unexpected failure — re-validate; never chmod whatever appeared.
    if [ -L "$ROLLBACK_PARENT" ]; then
      BACKUP_FAIL_REASON="_rollback parent became a symlink after mkdir race: $ROLLBACK_PARENT"
      fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
      O1_BACKUP_STATUS="O1_BACKUP_FAILED"
      O1_SQL_STATUS="NOT_EXECUTED"
      echo "O1_BACKUP_FAILED=yes"
    elif is_real_dir "$ROLLBACK_PARENT"; then
      # Another process created a real dir; treat as pre-existing (no chmod).
      echo "ROLLBACK_PARENT_PREEXISTING=yes (created concurrently)"
    else
      BACKUP_FAIL_REASON="unable to create or safely confirm _rollback parent: $ROLLBACK_PARENT"
      fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
      O1_BACKUP_STATUS="O1_BACKUP_FAILED"
      O1_SQL_STATUS="NOT_EXECUTED"
      echo "O1_BACKUP_FAILED=yes"
    fi
  else
    if [ -L "$ROLLBACK_PARENT" ] || ! is_real_dir "$ROLLBACK_PARENT"; then
      BACKUP_FAIL_REASON="_rollback parent after create is not a real directory: $ROLLBACK_PARENT"
      fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
      O1_BACKUP_STATUS="O1_BACKUP_FAILED"
      O1_SQL_STATUS="NOT_EXECUTED"
      echo "O1_BACKUP_FAILED=yes"
    else
      # Only chmod directories this run newly created.
      chmod 700 "$ROLLBACK_PARENT"
      ROLLBACK_PARENT_CREATED="yes"
      echo "ROLLBACK_PARENT_CREATED=yes"
    fi
  fi
fi

# ----- Backup leaf: atomic mkdir; chmod only if this run created it -----
if [ "$O1_BACKUP_STATUS" != "O1_BACKUP_FAILED" ]; then
  if ! is_real_dir "$ROLLBACK_PARENT"; then
    BACKUP_FAIL_REASON="cannot safely confirm _rollback parent is a real directory before write"
    fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
    O1_BACKUP_STATUS="O1_BACKUP_FAILED"
    O1_SQL_STATUS="NOT_EXECUTED"
    echo "O1_BACKUP_FAILED=yes"
  elif ! mkdir "$BK" 2>/dev/null; then
    # Do not reuse, clear, chmod, or write into an existing backup directory.
    BACKUP_FAIL_REASON="backup directory already exists (refusing reuse/overwrite): $BK"
    fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
    O1_BACKUP_STATUS="O1_BACKUP_FAILED"
    O1_SQL_STATUS="NOT_EXECUTED"
    echo "O1_BACKUP_FAILED=yes"
    echo "BACKUP_DIR=$BK"
    echo "BACKUP_FAIL_REASON=$BACKUP_FAIL_REASON"
  elif [ -L "$BK" ] || ! is_real_dir "$BK"; then
    BACKUP_FAIL_REASON="backup leaf after create is not a real directory: $BK"
    fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
    O1_BACKUP_STATUS="O1_BACKUP_FAILED"
    O1_SQL_STATUS="NOT_EXECUTED"
    echo "O1_BACKUP_FAILED=yes"
  else
    chmod 700 "$BK"
    BK_OWNED="yes"
  fi
fi

# ----- REPORT_OUT_DIR: must match RUN_ID path; create-only; refuse any pre-existing (even empty) -----
echo "==> Create report dir (refuse reuse / symlink / chmod of foreign)"
if [ "$REPORT_OUT_DIR" != "$EXPECTED_REPORT_OUT_DIR" ]; then
  echo "ERROR: REPORT_OUT_DIR mismatch after setup" >&2
  exit 1
fi
if [ -L "$REPORT_OUT_DIR" ] || [ -e "$REPORT_OUT_DIR" ]; then
  echo "ERROR: REPORT_OUT_DIR already exists (refusing reuse even if empty): $REPORT_OUT_DIR" >&2
  echo "Refusing to chmod, clear, or overwrite an existing path." >&2
  exit 1
fi
if ! mkdir "$REPORT_OUT_DIR" 2>/dev/null; then
  echo "ERROR: failed to create REPORT_OUT_DIR atomically: $REPORT_OUT_DIR" >&2
  exit 1
fi
if [ -L "$REPORT_OUT_DIR" ] || ! is_real_dir "$REPORT_OUT_DIR"; then
  echo "ERROR: REPORT_OUT_DIR after create is not a real directory: $REPORT_OUT_DIR" >&2
  exit 1
fi
chmod 700 "$REPORT_OUT_DIR"

echo "BACKUP_DIR=$BK"
echo "BK_OWNED=$BK_OWNED"
echo "ROLLBACK_PARENT_CREATED=$ROLLBACK_PARENT_CREATED"
echo "REPORT_OUT_DIR=$REPORT_OUT_DIR"
echo "RUN_ID=$RUN_ID"
if [ -n "$REMOTE_SCRIPT_PATH" ]; then
  echo "REMOTE_SCRIPT=$REMOTE_SCRIPT_PATH"
fi

DUMP_BYTES=""
DUMP_SHA256=""
PG_RESTORE_OK="no"
PG_RESTORE_TOC_LINES="0"
TABLE_EXISTS="unknown"
GROWTH_USAGE="unknown"
GROWTH_CREATE="unknown"
DEP_MATCH_COUNT="0"
TARGET_MIGRATION_FOUND="no"
M_NAME=""; M_STARTED=""; M_FINISHED=""; M_ROLLED=""; M_STEPS=""; M_CHECKSUM=""
declare -a INV_LINES=()
declare -a ECS_ONLY=()
declare -a KEEP_STATUS=()

# ---------- Disk protection before pg_dump (skip if backup dir was not created) ----------
if [ "$O1_BACKUP_STATUS" != "O1_BACKUP_FAILED" ]; then
  echo "==> Disk protection check (readonly)"
  DISK_CHECK_STATUS="RUNNING"
  set +e
  DB_SIZE_BYTES="$(psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -At -c "SELECT pg_database_size(current_database());")"
  DB_SIZE_RC=$?
  set -e
  if [ "$DB_SIZE_RC" -ne 0 ] || [ -z "$DB_SIZE_BYTES" ]; then
    fail_section DISK_CHECK "unable to read pg_database_size"
    BACKUP_FAIL_REASON="unable to read pg_database_size"
    O1_SQL_STATUS="NOT_EXECUTED"
    # Keep empty BK we created; do not delete it. Continue to O-3 + report.
  else
    # Available bytes on filesystem containing backup dir (POSIX df -k; column 4 = avail KB)
    FS_AVAIL_KB="$(df -Pk "$BK" | awk 'NR==2 {print $4}')"
    if [ -z "$FS_AVAIL_KB" ] || ! [[ "$FS_AVAIL_KB" =~ ^[0-9]+$ ]]; then
      fail_section DISK_CHECK "unable to read df available space for $BK"
      BACKUP_FAIL_REASON="unable to read df available space for $BK"
      O1_SQL_STATUS="NOT_EXECUTED"
    else
      FS_AVAIL_BYTES=$((FS_AVAIL_KB * 1024))
      # Conservative requirement: 2x DB size + 1 GiB margin
      DISK_MARGIN_BYTES=$((1024 * 1024 * 1024))
      DISK_REQUIRED_BYTES=$((DB_SIZE_BYTES * 2 + DISK_MARGIN_BYTES))
      echo "DB_SIZE_BYTES=$DB_SIZE_BYTES"
      echo "FS_AVAIL_BYTES=$FS_AVAIL_BYTES"
      echo "DISK_REQUIRED_BYTES=$DISK_REQUIRED_BYTES"
      echo "DISK_MARGIN_BYTES=$DISK_MARGIN_BYTES"
      if [ "$FS_AVAIL_BYTES" -lt "$DISK_REQUIRED_BYTES" ]; then
        fail_section DISK_CHECK "insufficient free space: avail=$FS_AVAIL_BYTES required=$DISK_REQUIRED_BYTES"
        BACKUP_FAIL_REASON="insufficient free space: avail=$FS_AVAIL_BYTES required=$DISK_REQUIRED_BYTES"
        O1_SQL_STATUS="NOT_EXECUTED"
      else
        DISK_CHECK_STATUS="OK"
      fi
    fi
  fi
fi

# ---------- O-1 backup ----------
# Exclusive create dump file (noclobber); never overwrite an existing dump. On failure keep dir as-is.
if [ "$DISK_CHECK_STATUS" = "OK" ] && [ "$O1_BACKUP_STATUS" != "O1_BACKUP_FAILED" ]; then
  O1_BACKUP_STATUS="RUNNING"
  if [ -e "$DUMP_FILE" ]; then
    BACKUP_FAIL_REASON="dump file already exists (refusing overwrite): $DUMP_FILE"
    fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
    O1_BACKUP_STATUS="O1_BACKUP_FAILED"
    echo "O1_BACKUP_FAILED=yes"
    O1_SQL_STATUS="NOT_EXECUTED"
  else
    # Atomic exclusive create of empty dump path (bash noclobber); then pg_dump into it.
    set +e
    (
      set -C
      : > "$DUMP_FILE"
    )
    EXCL_RC=$?
    set -e
    if [ "$EXCL_RC" -ne 0 ]; then
      BACKUP_FAIL_REASON="failed exclusive create of dump file (exists or race): $DUMP_FILE"
      fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
      O1_BACKUP_STATUS="O1_BACKUP_FAILED"
      echo "O1_BACKUP_FAILED=yes"
      O1_SQL_STATUS="NOT_EXECUTED"
    else
      chmod 600 "$DUMP_FILE"
      set +e
      pg_dump "$DATABASE_URL" -Fc -f "$DUMP_FILE"
      DUMP_RC=$?
      set -e
      if [ "$DUMP_RC" -ne 0 ] || [ ! -s "$DUMP_FILE" ]; then
        BACKUP_FAIL_REASON="pg_dump failed rc=$DUMP_RC (existing backup dir retained: $BK)"
        fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
        O1_BACKUP_STATUS="O1_BACKUP_FAILED"
        echo "O1_BACKUP_FAILED=yes"
        # Do not rm dump/dir — leave partial for forensics; never overwrite foreign backups.
        O1_SQL_STATUS="NOT_EXECUTED"
      else
        chmod 600 "$DUMP_FILE"
        DUMP_BYTES="$(wc -c < "$DUMP_FILE" | tr -d ' ')"
        if [ -e "$DUMP_SHA_FILE" ]; then
          BACKUP_FAIL_REASON="sha256 sidecar already exists (refusing overwrite): $DUMP_SHA_FILE"
          fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
          O1_BACKUP_STATUS="O1_BACKUP_FAILED"
          echo "O1_BACKUP_FAILED=yes"
          O1_SQL_STATUS="NOT_EXECUTED"
        else
          set +e
          (
            set -C
            sha256sum "$DUMP_FILE" > "$DUMP_SHA_FILE"
          )
          SHA_RC=$?
          set -e
          if [ "$SHA_RC" -ne 0 ]; then
            BACKUP_FAIL_REASON="failed exclusive write of sha256 sidecar"
            fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
            O1_BACKUP_STATUS="O1_BACKUP_FAILED"
            echo "O1_BACKUP_FAILED=yes"
            O1_SQL_STATUS="NOT_EXECUTED"
          else
            chmod 600 "$DUMP_SHA_FILE"
            DUMP_SHA256="$(awk '{print $1}' "$DUMP_SHA_FILE")"
            # pipefail-safe TOC listing
            if [ -e "$TOC_FILE" ] || [ -e "$TOC_ERR_FILE" ]; then
              BACKUP_FAIL_REASON="TOC sidecar already exists (refusing overwrite)"
              fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
              O1_BACKUP_STATUS="O1_BACKUP_FAILED"
              echo "O1_BACKUP_FAILED=yes"
              O1_SQL_STATUS="NOT_EXECUTED"
            else
              set +e
              (
                set -C
                : > "$TOC_FILE"
                : > "$TOC_ERR_FILE"
              )
              TOC_EXCL_RC=$?
              set -e
              if [ "$TOC_EXCL_RC" -ne 0 ]; then
                BACKUP_FAIL_REASON="failed exclusive create of TOC sidecars"
                fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
                O1_BACKUP_STATUS="O1_BACKUP_FAILED"
                echo "O1_BACKUP_FAILED=yes"
                O1_SQL_STATUS="NOT_EXECUTED"
              else
                set +e
                pg_restore -l "$DUMP_FILE" >"$TOC_FILE" 2>"$TOC_ERR_FILE"
                TOC_RC=$?
                set -e
                chmod 600 "$TOC_FILE" "$TOC_ERR_FILE" 2>/dev/null || true
                if [ "$TOC_RC" -eq 0 ]; then
                  PG_RESTORE_OK="yes"
                  PG_RESTORE_TOC_LINES="$(wc -l < "$TOC_FILE" | tr -d ' ')"
                  O1_BACKUP_STATUS="OK"
                else
                  BACKUP_FAIL_REASON="pg_restore -l failed rc=$TOC_RC (dump retained: $DUMP_FILE)"
                  fail_section O1_BACKUP "$BACKUP_FAIL_REASON"
                  O1_BACKUP_STATUS="O1_BACKUP_FAILED"
                  echo "O1_BACKUP_FAILED=yes"
                  O1_SQL_STATUS="NOT_EXECUTED"
                fi
              fi
            fi
          fi
        fi
      fi
    fi
  fi
elif [ "$O1_BACKUP_STATUS" != "O1_BACKUP_FAILED" ]; then
  # Disk check failed path already set statuses; ensure backup marked failed for gating.
  O1_BACKUP_STATUS="O1_BACKUP_FAILED"
  echo "O1_BACKUP_FAILED=yes"
  O1_SQL_STATUS="NOT_EXECUTED"
fi

# ---------- O-1 SQL (readonly) — only after successful backup ----------
if [ "$O1_BACKUP_STATUS" = "OK" ]; then
  O1_SQL_STATUS="RUNNING"
  set +e
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "\copy (SELECT id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count FROM _prisma_migrations ORDER BY started_at) TO STDOUT WITH CSV HEADER" > "$BK/_prisma_migrations.csv"
  CSV_RC=$?
  set -e
  if [ "$CSV_RC" -ne 0 ]; then
    set +e
    psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "\copy (SELECT * FROM _prisma_migrations ORDER BY started_at) TO STDOUT WITH CSV HEADER" > "$BK/_prisma_migrations.csv"
    CSV_RC=$?
    set -e
  fi
  if [ "$CSV_RC" -eq 0 ]; then
    chmod 600 "$BK/_prisma_migrations.csv"
  else
    fail_section O1_SQL "_prisma_migrations CSV export failed"
  fi

  # Target row: store full raw on ECS only; expose status fields (no logs) to report
  set +e
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -At -F '|' -c "
SELECT
  coalesce(migration_name::text, '<NULL>'),
  coalesce(started_at::text, '<NULL>'),
  coalesce(finished_at::text, '<NULL>'),
  coalesce(rolled_back_at::text, '<NULL>'),
  coalesce(applied_steps_count::text, '<NULL>'),
  coalesce(checksum::text, '<NULL>'),
  coalesce(logs::text, '<NULL>')
FROM _prisma_migrations
WHERE migration_name = '${TARGET_MIGRATION//\'/\'\'}';
" > "$BK/target_migration_row_raw.txt"
  ROW_RC=$?
  set -e
  chmod 600 "$BK/target_migration_row_raw.txt" 2>/dev/null || true
  if [ "$ROW_RC" -eq 0 ] && [ -s "$BK/target_migration_row_raw.txt" ]; then
    TARGET_MIGRATION_FOUND="yes"
    IFS='|' read -r M_NAME M_STARTED M_FINISHED M_ROLLED M_STEPS M_CHECKSUM _M_LOGS < "$BK/target_migration_row_raw.txt" || true
    # logs stay only in target_migration_row_raw.txt on ECS
  else
    TARGET_MIGRATION_FOUND="no"
    echo "TARGET_ROW_EMPTY_OR_FAILED" > "$BK/target_migration_row_raw.txt"
    chmod 600 "$BK/target_migration_row_raw.txt"
  fi

  set +e
  REGCLASS="$(psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -At -c "SELECT coalesce(to_regclass('growth.syndication_jobs')::text, '')")"
  REG_RC=$?
  set -e
  if [ "$REG_RC" -ne 0 ]; then
    fail_section O1_SQL "to_regclass query failed"
    TABLE_EXISTS="query_failed"
  elif [ -z "$REGCLASS" ]; then
    TABLE_EXISTS="no"
  else
    TABLE_EXISTS="yes"
  fi

  # Structure details stay on ECS only (may contain column names / defs)
  {
    echo "TABLE_EXISTS=$TABLE_EXISTS"
    psql "$DATABASE_URL" -c "SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'growth' AND table_name = 'syndication_jobs';" || true
    psql "$DATABASE_URL" -c "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'growth' AND table_name = 'syndication_jobs' ORDER BY ordinal_position;" || true
    psql "$DATABASE_URL" -c "SELECT indexname FROM pg_indexes WHERE schemaname = 'growth' AND tablename = 'syndication_jobs';" || true
    if [ "$TABLE_EXISTS" = "yes" ]; then
      psql "$DATABASE_URL" -c "SELECT conname FROM pg_constraint WHERE conrelid = 'growth.syndication_jobs'::regclass;" || true
    fi
  } > "$BK/structure_checks_raw.txt" 2>&1 || true
  chmod 600 "$BK/structure_checks_raw.txt" 2>/dev/null || true

  set +e
  PRIV_LINE="$(psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -At -F '|' -c "
SELECT
  has_schema_privilege(current_user, n.nspname, 'USAGE')::text,
  has_schema_privilege(current_user, n.nspname, 'CREATE')::text
FROM pg_namespace n
WHERE n.nspname = 'growth';
")"
  PRIV_RC=$?
  set -e
  if [ "$PRIV_RC" -eq 0 ] && [ -n "$PRIV_LINE" ]; then
    IFS='|' read -r GROWTH_USAGE GROWTH_CREATE <<<"$PRIV_LINE"
  else
    fail_section O1_SQL "growth privilege query failed"
    GROWTH_USAGE="query_failed"
    GROWTH_CREATE="query_failed"
  fi

  if [ "$O1_SQL_STATUS" = "RUNNING" ]; then
    O1_SQL_STATUS="OK"
  fi
fi

# ---------- O-3 inventory ----------
O3_INVENTORY_STATUS="RUNNING"
if [ ! -d "$MIG_DIR" ]; then
  fail_section O3_INVENTORY "migrations dir missing: $MIG_DIR"
else
  while IFS= read -r p; do
    base="$(basename "$p")"
    if [ -d "$p" ]; then
      if [ -f "$p/migration.sql" ]; then
        sz="$(wc -c < "$p/migration.sql" | tr -d ' ')"
        sum="$(sha256sum "$p/migration.sql" | awk '{print $1}')"
        INV_LINES+=("DIR|$base|HAS_SQL=yes|BYTES=$sz|SHA256=$sum")
      else
        INV_LINES+=("DIR|$base|HAS_SQL=no|BYTES=0|SHA256=")
      fi
      keep=0
      for k in $APPROVED_KEEP_DIRS; do
        [ "$base" = "$k" ] && keep=1
      done
      if [ "$keep" -eq 0 ]; then
        ECS_ONLY+=("$base")
      fi
    elif [ -f "$p" ]; then
      sz="$(wc -c < "$p" | tr -d ' ')"
      sum="$(sha256sum "$p" | awk '{print $1}')"
      INV_LINES+=("FILE|$base|HAS_SQL=n/a|BYTES=$sz|SHA256=$sum")
    fi
  done < <(find "$MIG_DIR" -mindepth 1 -maxdepth 1 | sort)

  for keep in $APPROVED_KEEP_DIRS; do
    if [ -d "$MIG_DIR/$keep" ]; then
      KEEP_STATUS+=("KEEP_PRESENT=$keep")
    else
      KEEP_STATUS+=("KEEP_MISSING=$keep")
    fi
  done
  if [ -f "$MIG_DIR/migration_lock.toml" ]; then
    LOCK_SHA="$(sha256sum "$MIG_DIR/migration_lock.toml" | awk '{print $1}')"
    LOCK_BYTES="$(wc -c < "$MIG_DIR/migration_lock.toml" | tr -d ' ')"
    KEEP_STATUS+=("LOCK_PRESENT=migration_lock.toml|BYTES=$LOCK_BYTES|SHA256=$LOCK_SHA")
  else
    KEEP_STATUS+=("LOCK_MISSING=migration_lock.toml")
  fi

  # Dependency scan: count only for report; raw hits stay on ECS.
  # Write sidecars only into this-run owned BK, else into REPORT_OUT_DIR (never a foreign backup dir).
  if [ "$BK_OWNED" = "yes" ]; then
    SIDE_DIR="$BK"
  else
    SIDE_DIR="$REPORT_OUT_DIR"
  fi
  set +e
  if command -v rg >/dev/null 2>&1; then
    rg -n "syndication_jobs|SyndicationJob" "$ROOT/apps" "$ROOT/packages" \
      --glob '!node_modules/**' --glob '!**/generated/**' \
      > "$SIDE_DIR/dependency_scan_raw.txt" 2>/dev/null
  else
    grep -RIn --exclude-dir=node_modules --exclude-dir=generated \
      -e 'syndication_jobs' -e 'SyndicationJob' "$ROOT/apps" "$ROOT/packages" \
      > "$SIDE_DIR/dependency_scan_raw.txt" 2>/dev/null
  fi
  set -e
  chmod 600 "$SIDE_DIR/dependency_scan_raw.txt" 2>/dev/null || true
  if [ -s "$SIDE_DIR/dependency_scan_raw.txt" ]; then
    DEP_MATCH_COUNT="$(wc -l < "$SIDE_DIR/dependency_scan_raw.txt" | tr -d ' ')"
  else
    DEP_MATCH_COUNT="0"
    echo "NO_MATCHES" > "$SIDE_DIR/dependency_scan_raw.txt"
    chmod 600 "$SIDE_DIR/dependency_scan_raw.txt"
  fi

  {
    printf '%s\n' "${INV_LINES[@]}"
    printf '%s\n' "${KEEP_STATUS[@]}"
    for d in "${ECS_ONLY[@]:-}"; do echo "ECS_ONLY_DIR=$d"; done
  } > "$SIDE_DIR/migrations_inventory_raw.txt"
  chmod 600 "$SIDE_DIR/migrations_inventory_raw.txt"

  if [ "$O3_INVENTORY_STATUS" = "RUNNING" ]; then
    O3_INVENTORY_STATUS="OK"
  fi
fi

# Never chmod/touch a pre-existing foreign backup directory.
if [ "$BK_OWNED" = "yes" ]; then
  secure_chmod_tree "$BK"
fi

if [ "$OVERALL_STATUS" != "FAILED" ]; then
  OVERALL_STATUS="OK"
fi

# ---------- Sanitized Markdown (Artifact-safe) ----------
REPORT="$REPORT_OUT_DIR/PROD-DB-RECOVERY-002-DIAGNOSTICS-REPORT.md"
{
  echo "# PROD-DB-RECOVERY-002 Diagnostics Report"
  echo
  echo "**Generated UTC:** $STAMP"
  echo "**Evidence class:** actual execution (ECS via Actions readonly workflow)"
  echo "**Overall status:** \`$OVERALL_STATUS\`"
  echo "**Disk check:** \`$DISK_CHECK_STATUS\` · **O-1 backup:** \`$O1_BACKUP_STATUS\` · **O-1 SQL:** \`$O1_SQL_STATUS\` · **O-3 inventory:** \`$O3_INVENTORY_STATUS\`"
  echo "**Backup dir (ECS only):** \`$BK\`"
  echo "**Report dir (ECS temp):** \`$REPORT_OUT_DIR\`"
  echo "**ENV_SOURCE:** \`$ENV_SOURCE\`"
  echo
  echo "## Host"
  echo "- hostname: \`$(hostname)\`"
  echo "- UTC: \`$(date -u +%Y-%m-%dT%H:%M:%SZ)\`"
  echo "- mateyou root: present"
  echo
  echo "## Disk protection (pre-pg_dump)"
  echo "| Field | Value |"
  echo "|---|---|"
  echo "| status | \`$DISK_CHECK_STATUS\` |"
  echo "| db_size_bytes | \`${DB_SIZE_BYTES:-n/a}\` |"
  echo "| fs_avail_bytes | \`${FS_AVAIL_BYTES:-n/a}\` |"
  echo "| required_bytes (2x DB + 1GiB) | \`${DISK_REQUIRED_BYTES:-n/a}\` |"
  echo "| margin_bytes | \`${DISK_MARGIN_BYTES:-n/a}\` |"
  echo
  echo "## O-1 Backup"
  echo "| Field | Value |"
  echo "|---|---|"
  echo "| status | \`$O1_BACKUP_STATUS\` |"
  echo "| backup_dir | \`$BK\` |"
  echo "| dump_path | \`${DUMP_FILE:-n/a}\` |"
  echo "| fail_reason | \`${BACKUP_FAIL_REASON:-none}\` |"
  echo "| dump_bytes | \`${DUMP_BYTES:-n/a}\` |"
  echo "| sha256 | \`${DUMP_SHA256:-n/a}\` |"
  echo "| pg_restore_-l | \`$PG_RESTORE_OK\` |"
  echo "| toc_lines | \`$PG_RESTORE_TOC_LINES\` |"
  echo
  echo "## ECS temp script (retained for owner-approved cleanup)"
  echo "| Field | Value |"
  echo "|---|---|"
  echo "| remote_script | \`${REMOTE_SCRIPT_PATH:-n/a}\` |"
  echo "| note | Workflow does **not** auto-delete this path; owner may approve cleanup later. |"
  echo

  echo "## Target migration \`$TARGET_MIGRATION\`"
  echo "| Field | Value |"
  echo "|---|---|"
  echo "| found | \`$TARGET_MIGRATION_FOUND\` |"
  echo "| migration_name | \`${M_NAME:-n/a}\` |"
  echo "| started_at | \`${M_STARTED:-n/a}\` |"
  echo "| finished_at | \`${M_FINISHED:-n/a}\` |"
  echo "| rolled_back_at | \`${M_ROLLED:-n/a}\` |"
  echo "| applied_steps_count | \`${M_STEPS:-n/a}\` |"
  echo "| checksum | \`${M_CHECKSUM:-n/a}\` |"
  echo "| logs | **redacted — retained only on ECS** \`$BK/target_migration_row_raw.txt\` |"
  echo
  echo "## growth.syndication_jobs"
  echo "| Field | Value |"
  echo "|---|---|"
  echo "| exists | \`$TABLE_EXISTS\` |"
  echo "| schema_USAGE | \`$GROWTH_USAGE\` |"
  echo "| schema_CREATE | \`$GROWTH_CREATE\` |"
  echo
  echo "## O-3 Migration directories"
  echo "| Kind | Name | migration.sql | Bytes | SHA256 |"
  echo "|---|---|---|---|---|"
  for line in "${INV_LINES[@]:-}"; do
    IFS='|' read -r kind name has bytes sha <<<"$line"
    echo "| $kind | \`$name\` | $has | $bytes | \`$sha\` |"
  done
  echo
  echo "### Keep-set vs approved SHA"
  echo '```'
  printf '%s\n' "${KEEP_STATUS[@]:-}"
  echo '```'
  echo
  echo "### ECS-only directories (not in approved keep-set)"
  if [ "${#ECS_ONLY[@]}" -eq 0 ]; then
    echo "_None detected (or inventory failed)._"
  else
    for d in "${ECS_ONLY[@]}"; do
      echo "- \`$d\`"
    done
  fi
  echo
  echo "## Dependency scan summary"
  echo "| Field | Value |"
  echo "|---|---|"
  echo "| pattern | \`syndication_jobs\\|SyndicationJob\` |"
  echo "| match_line_count | \`$DEP_MATCH_COUNT\` |"
  echo "| detail | raw hits retained only on ECS (not in Artifact) |"
  echo
  echo "## Forbidden actions"
  echo "None executed: no migrate resolve/deploy, no DDL/DML, no mv/rm, no deploy, no pm2 restart."
  echo
  echo "## Artifact policy"
  echo "This Markdown is the only file intended for GitHub Artifact upload. Dump, CSV, raw logs, SQL snippets, and raw scans remain on ECS under the backup directory."
} > "$REPORT"
chmod 600 "$REPORT"

# No directory wipe: this run only creates REPORT in its unique empty REPORT_OUT_DIR.

echo "REPORT_PATH=$REPORT"
echo "REPORT_OUT_DIR=$REPORT_OUT_DIR"
echo "BACKUP_DIR=$BK"
echo "BACKUP_FAIL_REASON=${BACKUP_FAIL_REASON:-}"
echo "REMOTE_SCRIPT=${REMOTE_SCRIPT_PATH:-}"
echo "DISK_CHECK_STATUS=$DISK_CHECK_STATUS"
echo "O1_BACKUP_STATUS=$O1_BACKUP_STATUS"
echo "O1_SQL_STATUS=$O1_SQL_STATUS"
echo "O3_INVENTORY_STATUS=$O3_INVENTORY_STATUS"
echo "OVERALL_STATUS=$OVERALL_STATUS"

if [ "$OVERALL_STATUS" != "OK" ]; then
  exit 1
fi
echo "DONE"
