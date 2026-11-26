#!/usr/bin/env bash
set -euo pipefail
umask 077

stage=$(mktemp -d "$RUNNER_TEMP/longvon-web.XXXXXX")
trap 'rm -rf "$stage"' EXIT
[[ "$GITHUB_REPOSITORY" == longvonTech/longvon-web && "$GITHUB_REF" == refs/heads/main ]]
[[ "$GITHUB_RUN_ID" =~ ^[1-9][0-9]*$ && "$GITHUB_RUN_ATTEMPT" =~ ^[1-9][0-9]*$ ]]
if [[ "$OPERATION" == release ]]; then
  target="actions-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT"
else
  target="$ROLLBACK_ID"
fi
node - "$target" <<'JS'
const {authorize} = require('./scripts/recovery/web-switch.cjs');
const e = process.env;
authorize({operation: e.OPERATION, target: process.argv[2], approval: e.APPROVAL,
  approvedApproval: e.REVIEWED_APPROVAL, enabled: e.HANDOFF_READY,
  expectedBuild: e.EXPECTED_BUILD, healthy: JSON.parse(e.HEALTHY_RELEASES), approvedTarget: e.REVIEWED_TARGET});
JS

printf 'operation=%s target=%s approval=%s actor=%s triggering_actor=%s workflow_sha=%s expected_active_build=%s\n' \
  "$OPERATION" "$target" "$APPROVAL" "$GITHUB_ACTOR" "$GITHUB_TRIGGERING_ACTOR" "$GITHUB_SHA" "$EXPECTED_BUILD"
if [[ "$OPERATION" == release ]]; then
  bash scripts/recovery/fetch-fixed-web.sh "$stage"
fi

mkdir -p "$stage/payload/scripts/recovery" "$stage/payload/scripts/rfq/release"
cp scripts/recovery/web-switch.cjs "$stage/payload/scripts/recovery/"
cp scripts/rfq/release/{activation,static}-transaction.cjs "$stage/payload/scripts/rfq/release/"
printf '%s' "$ECS_SSH_KEY_B64" | base64 -d > "$stage/key"
ssh-keygen -y -f "$stage/key" > /dev/null
ssh_opts=(-i "$stage/key" -o BatchMode=yes -o StrictHostKeyChecking=yes
  -o HostKeyAlias=longvon-ecs -o "UserKnownHostsFile=$GITHUB_WORKSPACE/.github/ecs_known_hosts")
host="$ECS_USER@$ECS_HOST"
remote="/root/mateyou/_recovery/incoming/cloud-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT"
ssh "${ssh_opts[@]}" -- "$host" "umask 077; mkdir '$remote'"
scp -r "${ssh_opts[@]}" -- "$stage/payload/." "$host:$remote/"
# Quote each argument for the remote shell. No caller-controlled path is sent.
printf -v args ' %q' "$OPERATION" "$target" "$APPROVAL" "$REVIEWED_APPROVAL" "$HANDOFF_READY" \
  "$EXPECTED_BUILD" "$HEALTHY_RELEASES" "$GITHUB_RUN_ID" "$GITHUB_RUN_ATTEMPT" "${REVIEWED_TARGET:-}"
ssh "${ssh_opts[@]}" -- "$host" "node '$remote/scripts/recovery/web-switch.cjs'$args"
