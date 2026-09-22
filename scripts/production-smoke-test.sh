#!/bin/bash
# Production smoke test for Longvon SEO/GEO foundation.
# Usage:
#   BASE_URL=https://www.longvon.com ./scripts/production-smoke-test.sh
#   BASE_URL=http://127.0.0.1:3000 ./scripts/production-smoke-test.sh
#   API_URL=http://127.0.0.1:4000 ./scripts/production-smoke-test.sh
#
# Exit 0 only if all required checks pass.

set -euo pipefail

BASE_URL="${BASE_URL:-https://www.longvon.com}"
API_URL="${API_URL:-}"
# Prefer insecure TLS when probing from the ECS host itself (self-check).
CURL_OPTS=(-sS -L --max-time 25)
if [[ "${ALLOW_INSECURE_TLS:-0}" == "1" ]]; then
  CURL_OPTS+=(-k)
fi

FAIL=0
PASS=0

pass() { echo "PASS  $1"; PASS=$((PASS + 1)); }
fail() { echo "FAIL  $1"; FAIL=$((FAIL + 1)); }

check_http() {
  local path="$1"
  local expect="${2:-200}"
  local url="${BASE_URL}${path}"
  local code
  code=$(curl "${CURL_OPTS[@]}" -o /tmp/smoke_body.$$ -w '%{http_code}' "$url" || echo "000")
  if [[ "$code" == "$expect" ]]; then
    pass "HTTP $code $path"
  else
    fail "HTTP $code (want $expect) $path"
  fi
}

check_contains() {
  local path="$1"
  local needle="$2"
  local url="${BASE_URL}${path}"
  local body
  body=$(curl "${CURL_OPTS[@]}" "$url" || true)
  if echo "$body" | grep -Fq "$needle"; then
    pass "contains '$needle' @ $path"
  else
    fail "missing '$needle' @ $path"
  fi
}

check_content_type() {
  local path="$1"
  local expect_substr="$2"
  local url="${BASE_URL}${path}"
  local ctype
  ctype=$(curl "${CURL_OPTS[@]}" -I "$url" | tr -d '\r' | awk -F': ' 'tolower($1)=="content-type"{print $2; exit}')
  if echo "$ctype" | grep -qi "$expect_substr"; then
    pass "Content-Type~$expect_substr @ $path ($ctype)"
  else
    fail "Content-Type want~$expect_substr got='$ctype' @ $path"
  fi
}

echo "=== Longvon production smoke test ==="
echo "BASE_URL=$BASE_URL"
echo

# Core infra
check_http "/"
check_http "/robots.txt"
check_http "/sitemap.xml"
check_http "/llms.txt"

check_content_type "/robots.txt" "text/plain"
check_content_type "/sitemap.xml" "xml\\|text/xml\\|application/xml"
check_content_type "/llms.txt" "text/plain\\|octet-stream\\|charset"

# GEO pages
for p in \
  /company/longvon \
  /smart-ring-manufacturer \
  /smart-ring-oem-odm \
  /smart-ring-solution-provider \
  /smart-ring-healthcare-solutions \
  /smart-ring-technology \
  /smart-ring-sleep-monitoring \
  /smart-ring-sleep-respiratory \
  /smart-ring-osa \
  /en/company/longvon \
  /en/smart-ring-manufacturer \
  /en/smart-ring-oem-odm \
  /en/smart-ring-solution-provider \
  /en/smart-ring-healthcare-solutions \
  /en/smart-ring-technology \
  /en/smart-ring-sleep-monitoring \
  /en/smart-ring-sleep-respiratory \
  /en/smart-ring-osa
do
  check_http "$p"
done

# Key text markers (actual page content)
check_contains "/company/longvon" "龙汾科技"
check_contains "/company/longvon" "LONGVON"
check_contains "/en/company/longvon" "OEM/ODM"
check_contains "/en/smart-ring-manufacturer" "Smart Ring Manufacturer"
check_contains "/smart-ring-manufacturer" "智能戒指制造商"
check_contains "/smart-ring-oem-odm" "ODM"
check_contains "/smart-ring-solution-provider" "解决方案提供商"
check_contains "/smart-ring-healthcare-solutions" "医疗健康"
check_contains "/en/smart-ring-solution-provider" "Solution Provider"
check_contains "/en/smart-ring-healthcare-solutions" "Healthcare"
check_contains "/smart-ring-sleep-monitoring" "睡眠监测"
check_contains "/smart-ring-sleep-respiratory" "呼吸健康"
check_contains "/smart-ring-osa" "OSA"
check_contains "/llms.txt" "71 total health monitoring parameters"
check_contains "/llms.txt" "en/company/longvon"
check_contains "/llms.txt" "smart ring product brand"
check_contains "/llms.txt" "smart-ring-solution-provider"
check_contains "/robots.txt" "Sitemap:"
check_contains "/robots.txt" "/en/company/longvon"
check_contains "/sitemap.xml" "smart-ring-manufacturer"
check_contains "/sitemap.xml" "en/smart-ring-manufacturer"
check_contains "/sitemap.xml" "smart-ring-solution-provider"
check_contains "/sitemap.xml" "smart-ring-healthcare-solutions"
check_contains "/sitemap.xml" "company/longvon"
check_contains "/sitemap.xml" "smart-ring-sleep-respiratory"

# No localhost leak in public SEO files
for path in /robots.txt /sitemap.xml /llms.txt; do
  body=$(curl "${CURL_OPTS[@]}" "${BASE_URL}${path}" || true)
  if echo "$body" | grep -Eqi 'localhost|127\.0\.0\.1'; then
    fail "localhost/127.0.0.1 found in $path"
  else
    pass "no localhost in $path"
  fi
done

# Optional API health
if [[ -n "$API_URL" ]]; then
  for ep in /health/live /health/ready; do
    code=$(curl "${CURL_OPTS[@]}" -o /tmp/api_health.$$ -w '%{http_code}' "${API_URL}${ep}" || echo "000")
    if [[ "$code" == "200" ]]; then
      pass "API HTTP 200 ${API_URL}${ep}"
    else
      fail "API HTTP $code ${API_URL}${ep}"
    fi
  done
fi

rm -f /tmp/smoke_body.$$ /tmp/api_health.$$ 2>/dev/null || true

echo
echo "=== Summary: PASS=$PASS FAIL=$FAIL ==="
if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
exit 0
