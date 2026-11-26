#!/usr/bin/env bash
# Read only the explicitly selected private policy; no credential export to evidence.
set -euo pipefail
: "${OPS_READ_TOKEN:?Private operations read-only authentication required}"
: "${APPROVED_RELEASE_MANIFEST_SHA256:?Independent reviewed policy digest required}"
[[ "$APPROVED_RELEASE_MANIFEST_SHA256" =~ ^[a-f0-9]{64}$ ]]
GH_TOKEN="$OPS_READ_TOKEN" gh api repos/longvonTech/longvon-ops/contents/manifests/approved-releases.json --jq .content | python3 -c 'import base64,sys;sys.stdout.buffer.write(base64.b64decode(sys.stdin.read()))' > "$1"
python3 - "$1" "$APPROVED_RELEASE_MANIFEST_SHA256" <<'PY'
import hashlib,pathlib,sys
if hashlib.sha256(pathlib.Path(sys.argv[1]).read_bytes()).hexdigest()!=sys.argv[2]:raise ValueError('Private release policy differs from independent approval')
PY
