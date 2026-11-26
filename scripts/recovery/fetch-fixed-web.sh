#!/usr/bin/env bash
set -euo pipefail
umask 077
stage=$1

[[ "$ARTIFACT_ID" == 15081915933 ]]
gh api "repos/longvonTech/longvon-web/actions/artifacts/$ARTIFACT_ID" > "$stage/artifact.json"
gh api "repos/longvonTech/longvon-web/actions/runs/45741771535" > "$stage/run.json"
python3 scripts/recovery/fixed-candidate.py source "$stage/artifact.json" "$stage/run.json" \
  "$ARTIFACT_ID" "$SOURCE_SHA" "$EXPECTED_SHA"
curl --silent --show-error --fail --location --proto '=https' --proto-redir '=https' \
  --header "Authorization: Bearer $GH_TOKEN" --output "$stage/candidate.zip" \
  "https://api.github.com/repos/longvonTech/longvon-web/actions/artifacts/$ARTIFACT_ID/zip"
python3 scripts/recovery/fixed-candidate.py archive "$stage/candidate.zip" "$EXPECTED_SHA" "$stage/payload"
