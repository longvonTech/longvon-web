#!/usr/bin/env bash
set -euo pipefail
source scripts/ci/ssh-remote-env.sh
keep='00000000000000_init 20250627000000_news_enterprise_media'
target='20261002000000_syndication_jobs'
run='20261115T120000Z-123-1'
report="/tmp/prod-db-recovery-002-$run"
script="/tmp/production-readonly-diagnostics-remote-$run.sh"
validate_remote_args "$keep" "$target" "$run" "$report" "$script"
command=$(build_remote_env_command "$keep" "$target" "$run" "$report" /usr/bin/env)
actual=$(bash -c "$command")
for expected in \
  "APPROVED_KEEP_DIRS=$keep" \
  "TARGET_MIGRATION=$target" \
  "RUN_ID=$run" \
  "REPORT_OUT_DIR=$report" \
  "REMOTE_SCRIPT=/usr/bin/env"; do
  grep -Fqx -- "$expected" <<<"$actual" || { echo "missing or mismatched remote variable: $expected" >&2; exit 1; }
done

# Shell metacharacters, quotes, whitespace, and substitutions stay literal data.
payload="space 'quote'; \$(touch /tmp/codex-ssh-quote-pwned) \$HOME"
quoted=$(quote_remote_arg "$payload")
roundtrip=$(bash -c "printf '%s' $quoted")
[[ "$roundtrip" == "$payload" ]] || { echo "shell quoting roundtrip failed" >&2; exit 1; }
[[ ! -e /tmp/codex-ssh-quote-pwned ]] || { echo "quote payload executed" >&2; exit 1; }

for bad in $'bad\nvalue' 'bad;value' 'bad=value'; do
  if validate_remote_args "$keep" "$bad" "$run" "$report" "$script" >/dev/null 2>&1; then
    echo "illegal TARGET_MIGRATION accepted" >&2; exit 1
  fi
done
if validate_remote_args "$keep" "$target" "$run" "/tmp/foreign" "$script" >/dev/null 2>&1; then echo "illegal REPORT_OUT_DIR accepted" >&2; exit 1; fi
if validate_remote_args "$keep" "$target" "$run" "$report" "/tmp/x;touch-pwned" >/dev/null 2>&1; then echo "illegal REMOTE_SCRIPT accepted" >&2; exit 1; fi
if validate_remote_args "$keep" "$target" "$run" "$report" "$script" $'bad\nkeep' >/dev/null 2>&1; then echo "illegal keep-set accepted" >&2; exit 1; fi
echo "SSH remote environment quoting tests passed"
