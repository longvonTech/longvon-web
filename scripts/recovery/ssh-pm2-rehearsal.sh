#!/usr/bin/env bash
# GitHub Linux / dedicated nonproduction host only. All keys are ephemeral fixtures.
set -euo pipefail
[[ "$(uname -s)" == Linux ]]
: "${RUNNER_TEMP:?Isolated runner temporary directory required}"
stage=$(mktemp -d "$RUNNER_TEMP/lv-ssh.XXXXXX")
runner_user=$(id -un)
sshd_bin=$(command -v sshd || printf /usr/sbin/sshd)
[[ -x "$sshd_bin" ]]
port=$(node -e 'const n=require("net").createServer();n.listen(0,"127.0.0.1",()=>{console.log(n.address().port);n.close()})')
ssh-keygen -q -t ed25519 -N '' -f "$stage/host-key"
ssh-keygen -q -t ed25519 -N '' -f "$stage/client-key"
cp "$stage/client-key.pub" "$stage/authorized_keys"
chmod 600 "$stage/authorized_keys"
printf '[127.0.0.1]:%s %s\n' "$port" "$(cat "$stage/host-key.pub")" > "$stage/known_hosts"
cat > "$stage/sshd_config" <<EOF
Port $port
ListenAddress 127.0.0.1
HostKey $stage/host-key
PidFile $stage/sshd.pid
AuthorizedKeysFile $stage/authorized_keys
PasswordAuthentication no
KbdInteractiveAuthentication no
UsePAM yes
StrictModes no
PermitRootLogin no
AllowUsers $runner_user
LogLevel VERBOSE
EOF
trap 'rc=$?; if [[ $rc -ne 0 && -f "$stage/sshd.log" ]]; then cat "$stage/sshd.log"; fi; if [[ -f "$stage/sshd.pid" ]]; then sudo kill "$(cat "$stage/sshd.pid")" || true; fi; rm -rf "$stage"' EXIT
sudo mkdir -p /run/sshd
sudo "$sshd_bin" -f "$stage/sshd_config" -E "$stage/sshd.log"
# Quote only task-owned paths and explicitly forward no agent or authentication environment.
printf -v command 'cd %q && PATH=%q LV_REHEARSAL_OUTPUT=%q %q scripts/recovery/pm2-rehearsal.cjs' \
  "$PWD" "$PATH" "$RUNNER_TEMP/linux-pm2.json" "$(command -v node)"
ssh -F /dev/null -i "$stage/client-key" -o IdentitiesOnly=yes -o BatchMode=yes \
  -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$stage/known_hosts" \
  -p "$port" "$runner_user@127.0.0.1" "$command"
printf 'NONPRODUCTION_SSH_PM2_REHEARSAL_PASS\n'
