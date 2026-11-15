#!/usr/bin/env bash
# Quote arguments for the remote POSIX login shell used by OpenSSH.
quote_remote_arg() {
  local value=${1//\'/\'\\\'\'}
  printf "'%s'" "$value"
}
validate_remote_args() {
  local keep=$1 target=$2 run=$3 report=$4 script=$5
  [[ "$keep" != *
  [[ "$target" =~ ^[0-9]{14}_[A-Za-z0-9_]+$ ]] || { echo "invalid target migration" >&2; return 1; }
  [[ "$run" =~ ^[A-Za-z0-9._-]+$ ]] || { echo "invalid run id" >&2; return 1; }
  [[ "$report" == "/tmp/prod-db-recovery-002-$run" ]] || { echo "invalid report path" >&2; return 1; }
  [[ "$script" =~ ^/tmp/production-readonly-diagnostics-remote-[A-Za-z0-9._-]+\.sh$ ]] || { echo "invalid remote script path" >&2; return 1; }
}
build_remote_env_command() {
  local value result="env" quoted
  for value in "APPROVED_KEEP_DIRS=$1" "TARGET_MIGRATION=$2" "RUN_ID=$3" "REPORT_OUT_DIR=$4" "REMOTE_SCRIPT=$5"; do
    quoted=$(quote_remote_arg "$value")
    result+=" $quoted"
  done
  quoted=$(quote_remote_arg "$5")
  printf '%s %s' "$result" "$quoted"
}
\\n'* && "$keep" != *
  [[ "$target" =~ ^[0-9]{14}_[A-Za-z0-9_]+$ ]] || { echo "invalid target migration" >&2; return 1; }
  [[ "$run" =~ ^[A-Za-z0-9._-]+$ ]] || { echo "invalid run id" >&2; return 1; }
  [[ "$report" == "/tmp/prod-db-recovery-002-$run" ]] || { echo "invalid report path" >&2; return 1; }
  [[ "$script" =~ ^/tmp/production-readonly-diagnostics-remote-[A-Za-z0-9._-]+\.sh$ ]] || { echo "invalid remote script path" >&2; return 1; }
}
build_remote_env_command() {
  local value result="env" quoted
  for value in "APPROVED_KEEP_DIRS=$1" "TARGET_MIGRATION=$2" "RUN_ID=$3" "REPORT_OUT_DIR=$4" "REMOTE_SCRIPT=$5"; do
    quoted=$(quote_remote_arg "$value")
    result+=" $quoted"
  done
  quoted=$(quote_remote_arg "$5")
  printf '%s %s' "$result" "$quoted"
}
\\r'* ]] || { echo "invalid keep-set" >&2; return 1; }
  [[ "$keep" =~ ^[A-Za-z0-9_]+\ [A-Za-z0-9_]+$ ]] || { echo "invalid keep-set" >&2; return 1; }
  [[ "$target" =~ ^[0-9]{14}_[A-Za-z0-9_]+$ ]] || { echo "invalid target migration" >&2; return 1; }
  [[ "$run" =~ ^[A-Za-z0-9._-]+$ ]] || { echo "invalid run id" >&2; return 1; }
  [[ "$report" == "/tmp/prod-db-recovery-002-$run" ]] || { echo "invalid report path" >&2; return 1; }
  [[ "$script" =~ ^/tmp/production-readonly-diagnostics-remote-[A-Za-z0-9._-]+\.sh$ ]] || { echo "invalid remote script path" >&2; return 1; }
}
build_remote_env_command() {
  local value result="env" quoted
  for value in "APPROVED_KEEP_DIRS=$1" "TARGET_MIGRATION=$2" "RUN_ID=$3" "REPORT_OUT_DIR=$4" "REMOTE_SCRIPT=$5"; do
    quoted=$(quote_remote_arg "$value")
    result+=" $quoted"
  done
  quoted=$(quote_remote_arg "$5")
  printf '%s %s' "$result" "$quoted"
}
