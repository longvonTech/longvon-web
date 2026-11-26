#!/usr/bin/env bash
# Read-only retrieval. Operations policy and asset digests are independently reviewed.
set -euo pipefail
umask 077
stage=$1
: "${APPROVED_RELEASE_MANIFEST:?Reviewed local manifest path required}"
: "${APPROVED_RELEASE_MANIFEST_SHA256:?Reviewed manifest digest required}"
: "${RELEASE_KEY:?Approved candidate key required}"
policy_values=$(python3 - "$APPROVED_RELEASE_MANIFEST" "$APPROVED_RELEASE_MANIFEST_SHA256" "$RELEASE_KEY" <<'PY'
import sys,runpy,pathlib,hashlib,json,re
f,expected,key=sys.argv[1:];raw=pathlib.Path(f).read_bytes()
if not re.fullmatch('[a-f0-9]{64}',expected) or hashlib.sha256(raw).hexdigest()!=expected:raise ValueError('Reviewed policy digest mismatch')
c=runpy.run_path('scripts/recovery/fixed-candidate.py');p=c['policy'](f,key)
for field in ('artifactId','sourceRun'):
 if not isinstance(p[field],int) or p[field]<=0:raise ValueError('Invalid source identifier')
print(json.dumps(p))
PY
)
read_value(){ printf '%s' "$policy_values" | python3 -c 'import json,sys; p=json.load(sys.stdin); print(p[sys.argv[1]])' "$1"; }
artifact=$(read_value artifactId)
commit=$(read_value commit)
expected=$(read_value zipSha256)
[[ "${ARTIFACT_ID:-$artifact}" == "$artifact" && "${SOURCE_SHA:-$commit}" == "$commit" && "${EXPECTED_SHA:-$expected}" == "$expected" ]]
mkdir -p "$stage"
mode=${FETCH_SOURCE:-archive}
if [[ "$mode" == actions ]]; then
  gh api "repos/longvonTech/longvon-web/actions/artifacts/$artifact" > "$stage/artifact.json"
  run=$(read_value sourceRun)
  gh api "repos/longvonTech/longvon-web/actions/runs/$run" > "$stage/run.json"
  gh api "repos/longvonTech/longvon-web/actions/artifacts/$artifact/zip" > "$stage/candidate.zip"
elif [[ "$mode" == archive ]]; then
  : "${OPS_READ_TOKEN:?Private ops read-only authentication required}"
  archive_values=$(printf '%s' "$policy_values" | python3 -c 'import json,sys,re; p=json.load(sys.stdin); a=p["archive"]; v=p["provenance"]; assert a["repository"]=="longvonTech/longvon-ops"; assert isinstance(a["assetId"],int) and a["assetId"]>0; assert re.fullmatch(r"manifests/provenance/[A-Z0-9-]+\.json",v["path"]); print(a["assetId"],v["path"],v["sha256"])')
  read -r asset provenance provenance_sha <<< "$archive_values"
  GH_TOKEN="$OPS_READ_TOKEN" gh api "repos/longvonTech/longvon-ops/contents/$provenance" --jq .content | python3 -c 'import base64,sys;sys.stdout.buffer.write(base64.b64decode(sys.stdin.read()))' > "$stage/provenance.json"
  python3 - "$stage" "$provenance_sha" <<'PY'
import pathlib,hashlib,json,sys
s=pathlib.Path(sys.argv[1]);raw=(s/'provenance.json').read_bytes()
if hashlib.sha256(raw).hexdigest()!=sys.argv[2]:raise ValueError('Archived provenance drift')
p=json.loads(raw)
for key in ('artifact','run'):(s/(key+'.json')).write_text(json.dumps(p[key]))
PY
  python3 scripts/recovery/download-private-asset.py "$asset" "$expected" "$stage/candidate.zip"
else
  echo 'Unknown retrieval source' >&2; exit 1
fi
python3 scripts/recovery/fixed-candidate.py source "$stage/artifact.json" "$stage/run.json" "$artifact" "$commit" "$expected"
python3 scripts/recovery/fixed-candidate.py archive "$stage/candidate.zip" "$expected" "$stage/payload"
