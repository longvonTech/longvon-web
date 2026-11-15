#!/usr/bin/env bash
set -euo pipefail
source scripts/ci/ssh-remote-env.sh

keep='00000000000000_init 20250627000000_news_enterprise_media'
target='20261002000000_syndication_jobs'
run='20261115T120000Z-123-1'
report="/tmp/prod-db-recovery-002-$run"
script=$(mktemp "/tmp/production-readonly-diagnostics-remote-$run-XXXXXX.sh")
scratch=$(mktemp -d)
trap 'rm -f "$script"; rm -rf "$scratch"' EXIT
cat > "$script" <<'REMOTE'
#!/usr/bin/env bash
/usr/bin/env
REMOTE
chmod 700 "$script"

validate_remote_args "$keep" "$target" "$run" "$report" "$script"
command=$(build_remote_env_command "$keep" "$target" "$run" "$report" "$script")
actual=$(bash -c "$command")
for expected in \
  "APPROVED_KEEP_DIRS=$keep" \
  "TARGET_MIGRATION=$target" \
  "RUN_ID=$run" \
  "REPORT_OUT_DIR=$report" \
  "REMOTE_SCRIPT=$script"; do
  grep -Fqx -- "$expected" <<<"$actual" || { echo "missing or mismatched remote variable: $expected" >&2; exit 1; }
done

# Confirm env assignments precede a separate executable path in the final command.
[[ "$command" == env\ *\ "$script" ]] || { echo "remote script path not separated from env assignments" >&2; exit 1; }
[[ "$command" != *"eval"* ]] || { echo "unexpected eval in remote command" >&2; exit 1; }

# Quotes, whitespace, semicolon, dollar expansion, and command substitution remain literal.
payload="space 'single' \"double\"; \$(touch $scratch/pwned) \$HOME"
quoted=$(quote_remote_arg "$payload")
roundtrip=$(bash -c "printf '%s' $quoted")
[[ "$roundtrip" == "$payload" ]] || { echo "shell quoting roundtrip failed" >&2; exit 1; }
[[ ! -e "$scratch/pwned" ]] || { echo "command substitution payload executed" >&2; exit 1; }

for bad in 'bad;value' 'bad=value' $'bad\nvalue'; do
  if validate_remote_args "$keep" "$bad" "$run" "$report" "$script" >/dev/null 2>&1; then echo "illegal migration accepted" >&2; exit 1; fi
done
for bad in 'bad;run' 'bad run' $'bad\nrun'; do
  if validate_remote_args "$keep" "$target" "$bad" "$report" "$script" >/dev/null 2>&1; then echo "illegal RUN_ID accepted" >&2; exit 1; fi
done
if validate_remote_args "$keep" "$target" "$run" "/tmp/foreign" "$script" >/dev/null 2>&1; then echo "illegal REPORT_OUT_DIR accepted" >&2; exit 1; fi
if validate_remote_args "$keep" "$target" "$run" "$report" "/tmp/x;touch-pwned" >/dev/null 2>&1; then echo "illegal REMOTE_SCRIPT accepted" >&2; exit 1; fi
if validate_remote_args "$keep" "$target" "$run" "$report" "$script" $'bad\nkeep' >/dev/null 2>&1; then echo "illegal keep-set accepted" >&2; exit 1; fi

echo "SSH remote environment quoting tests passed"
