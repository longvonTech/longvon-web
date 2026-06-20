#!/usr/bin/env bash
# =============================================================
# MATEYOU Platform — QA Acceptance Script (TASK-201I)
# 在域名和SSL配置完成后执行
# 使用：./scripts/qa-acceptance.sh https://www.longvon.com
# =============================================================

BASE_URL="${1:-https://www.longvon.com}"
REPORT="docs/release/qa-acceptance-report.md"
PASS=0; FAIL=0

check_url() {
  local label="$1"
  local url="$2"
  local expected="${3:-200}"
  local status
  status=$(curl -so /dev/null -w "%{http_code}" --max-time 10 "${url}" 2>/dev/null)
  if [ "${status}" = "${expected}" ]; then
    echo "  ✅ ${label} → HTTP ${status}"
    PASS=$((PASS+1))
    echo "| ${label} | ✅ HTTP ${status} |" >> "${REPORT}"
  else
    echo "  ❌ ${label} → HTTP ${status}（期望 ${expected}）"
    FAIL=$((FAIL+1))
    echo "| ${label} | ❌ HTTP ${status}（期望 ${expected}） |" >> "${REPORT}"
  fi
}

check_content() {
  local label="$1"
  local url="$2"
  local needle="$3"
  local body
  body=$(curl -s --max-time 10 "${url}" 2>/dev/null)
  if echo "${body}" | grep -q "${needle}"; then
    echo "  ✅ ${label} 内容包含「${needle}」"
    PASS=$((PASS+1))
    echo "| ${label} | ✅ 包含「${needle}」 |" >> "${REPORT}"
  else
    echo "  ❌ ${label} 未找到「${needle}」"
    FAIL=$((FAIL+1))
    echo "| ${label} | ❌ 未找到「${needle}」 |" >> "${REPORT}"
  fi
}

echo "# QA Acceptance Report (TASK-201I)" > "${REPORT}"
echo "" >> "${REPORT}"
echo "测试目标：${BASE_URL}" >> "${REPORT}"
echo "执行时间：$(date '+%Y-%m-%d %H:%M:%S')" >> "${REPORT}"
echo "" >> "${REPORT}"
echo "| 检查项 | 结果 |" >> "${REPORT}"
echo "|---|---|" >> "${REPORT}"

echo ""
echo "===== MATEYOU QA Acceptance ====="
echo "目标：${BASE_URL}"
echo ""

echo "── 页面可访问性 ──"
check_url "首页" "${BASE_URL}/"
check_url "Ring1C产品页" "${BASE_URL}/products/ring1c"
check_url "评估入口" "${BASE_URL}/assessment"
check_url "知识库列表" "${BASE_URL}/knowledge"
check_url "合作总览" "${BASE_URL}/partner"
check_url "医院合作" "${BASE_URL}/partner/hospital"
check_url "药房合作" "${BASE_URL}/partner/pharmacy"
check_url "OEM合作" "${BASE_URL}/partner/oem"
check_url "区域代理" "${BASE_URL}/partner/distributor"
check_url "企业采购" "${BASE_URL}/partner/enterprise"
check_url "会员权益" "${BASE_URL}/membership"
check_url "robots.txt" "${BASE_URL}/robots.txt"
check_url "sitemap.xml" "${BASE_URL}/sitemap.xml"

echo ""
echo "── SEO 验证 ──"
check_content "robots.txt 允许Baiduspider" "${BASE_URL}/robots.txt" "Baiduspider"
check_content "sitemap.xml 包含首页" "${BASE_URL}/sitemap.xml" "longvon.com"
check_content "首页 title" "${BASE_URL}/" "MATEYOU"
check_content "首页 结构化数据" "${BASE_URL}/" "application/ld+json"
check_content "产品页 ProductSchema" "${BASE_URL}/products/ring1c" "application/ld+json"

echo ""
echo "── HTTP→HTTPS 跳转 ──"
HTTP_STATUS=$(curl -so /dev/null -w "%{http_code}" --max-time 10 "http://www.longvon.com/" 2>/dev/null)
if [ "${HTTP_STATUS}" = "301" ] || [ "${HTTP_STATUS}" = "302" ]; then
  echo "  ✅ HTTP 跳转 → ${HTTP_STATUS}"
  PASS=$((PASS+1))
  echo "| HTTP→HTTPS跳转 | ✅ ${HTTP_STATUS} |" >> "${REPORT}"
else
  echo "  ❌ HTTP 跳转失败 → ${HTTP_STATUS}"
  FAIL=$((FAIL+1))
  echo "| HTTP→HTTPS跳转 | ❌ ${HTTP_STATUS} |" >> "${REPORT}"
fi

echo ""
echo "── API 健康检查 ──"
check_url "API /health/live" "${BASE_URL}/api/health/live"
check_url "API /health/ready" "${BASE_URL}/api/health/ready"

echo ""
echo "── 合规文案 ──"
check_content "首页免责声明" "${BASE_URL}/" "仅供参考"
check_content "产品页合规声明" "${BASE_URL}/products/ring1c" "非医疗器械"
check_content "评估页免责声明" "${BASE_URL}/assessment" "不构成医学诊断"

# 结论
echo "" >> "${REPORT}"
echo "## 统计" >> "${REPORT}"
echo "" >> "${REPORT}"
echo "- PASS：${PASS}" >> "${REPORT}"
echo "- FAIL：${FAIL}" >> "${REPORT}"
echo "" >> "${REPORT}"
if [ "${FAIL}" -eq 0 ]; then
  echo "## 结论：**PASS**" >> "${REPORT}"
else
  echo "## 结论：**FAIL**（${FAIL} 项需要修复）" >> "${REPORT}"
fi

echo ""
echo "=================================="
echo " QA 完成  PASS=${PASS}  FAIL=${FAIL}"
echo " 报告：${REPORT}"
echo "=================================="
exit "${FAIL}"
