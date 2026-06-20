#!/usr/bin/env bash
# =============================================================
# MATEYOU Platform — ECS Production Deployment Script
# 覆盖：TASK-201B/C/D/E/F/G/H
# 执行环境：阿里云 ECS Ubuntu 24.04 LTS（Root 或 sudo）
# 使用：
#   1. 将整个项目推送到 ECS
#   2. cd /data/mateyou
#   3. cp .env.production.example .env.production && 填写真实值
#   4. chmod +x scripts/deploy-production.sh
#   5. sudo ./scripts/deploy-production.sh
# =============================================================

set -euo pipefail

DEPLOY_LOG="/var/log/mateyou-deploy-$(date +%Y%m%d_%H%M%S).log"
REPORT_DIR="docs/release"
mkdir -p "${REPORT_DIR}"

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "${DEPLOY_LOG}"; }
fail() { log "❌ FAIL: $*"; exit 1; }
pass() { log "✅ PASS: $*"; }

log "===== MATEYOU Production Deployment Started ====="

# ── 预检查 ────────────────────────────────────────────────────
log "检查环境..."
[ -f ".env.production" ] || fail ".env.production 不存在，请先 cp .env.production.example .env.production 并填入真实值"
source .env.production 2>/dev/null || true
[ -n "${POSTGRES_PASSWORD:-}" ] || fail "POSTGRES_PASSWORD 未设置"
[ -n "${JWT_ACCESS_SECRET:-}" ] || fail "JWT_ACCESS_SECRET 未设置"
[ -n "${JWT_REFRESH_SECRET:-}" ] || fail "JWT_REFRESH_SECRET 未设置"
pass "环境变量检查通过"

# ── TASK-201B：生产环境安装 ────────────────────────────────────
log "[201B] 安装系统依赖..."
apt-get update -qq
apt-get install -y -qq \
  curl git \
  postgresql-client \
  redis-tools \
  ca-certificates \
  gnupg \
  lsb-release \
  2>&1 | tail -5

# 安装 Docker（如已安装则跳过）
if ! command -v docker &>/dev/null; then
  log "安装 Docker..."
  curl -fsSL https://get.docker.com | bash
  systemctl enable docker && systemctl start docker
  # 配置阿里云镜像加速
  mkdir -p /etc/docker
  cat > /etc/docker/daemon.json << 'DOCKER_EOF'
{
  "registry-mirrors": ["https://registry.cn-hangzhou.aliyuncs.com"],
  "log-driver": "json-file",
  "log-opts": {"max-size": "100m", "max-file": "5"}
}
DOCKER_EOF
  systemctl restart docker
fi
pass "Docker $(docker --version | cut -d' ' -f3) 就绪"

# 安装 docker compose plugin（如已安装则跳过）
if ! docker compose version &>/dev/null; then
  apt-get install -y -qq docker-compose-plugin
fi
pass "docker compose $(docker compose version --short) 就绪"

# ── Node.js（通过 n 安装 Node 20）───────────────────────────
if ! node --version | grep -q "v20\|v22"; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
pass "Node.js $(node --version) 就绪"

cat >> "${REPORT_DIR}/production-environment-report.md" << ENVREPORT
# Production Environment Report (TASK-201B)

执行时间：$(date '+%Y-%m-%d %H:%M:%S')
服务器：$(hostname)
OS：$(lsb_release -d | cut -f2)
Docker：$(docker --version)
Node.js：$(node --version)
npm：$(npm --version)

状态：**PASS**
ENVREPORT
pass "TASK-201B 生产环境报告已写入"

# ── npm install ───────────────────────────────────────────────
log "安装项目依赖..."
npm install 2>&1 | tail -5
pass "npm install 完成"

# ── TASK-201C：Prisma 生成 + 迁移 ───────────────────────────
log "[201C] Prisma generate..."
npm run db:generate 2>&1 | tail -5
pass "Prisma Client 生成成功"

log "[201C] Prisma migrate deploy..."
npm run db:migrate:deploy 2>&1 | tail -10
pass "数据库迁移完成"

# 验证表数量
TABLE_COUNT=$(PGPASSWORD="${POSTGRES_PASSWORD}" psql \
  -h localhost -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" \
  -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema IN ('public','health','audit','analytics_pii') AND table_type='BASE TABLE';" \
  2>/dev/null | tr -d ' ')

log "数据库表数量：${TABLE_COUNT}"
[ "${TABLE_COUNT:-0}" -ge 39 ] || fail "期望 ≥39 张表，实际 ${TABLE_COUNT}"
pass "39 张表全部存在"

# 验证四个 Schema
for SCHEMA in public health audit analytics_pii; do
  COUNT=$(PGPASSWORD="${POSTGRES_PASSWORD}" psql \
    -h localhost -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" \
    -t -c "SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name='${SCHEMA}';" \
    2>/dev/null | tr -d ' ')
  [ "${COUNT:-0}" -ge 1 ] || fail "Schema '${SCHEMA}' 不存在"
  pass "Schema '${SCHEMA}' 存在"
done

cat >> "${REPORT_DIR}/database-verification-report.md" << DBREPORT
# Database Verification Report (TASK-201C)

执行时间：$(date '+%Y-%m-%d %H:%M:%S')

| 检查项 | 结果 |
|---|---|
| 数据库表总数 | **${TABLE_COUNT}** (≥39) |
| Schema: public | ✅ |
| Schema: health | ✅ |
| Schema: audit | ✅ |
| Schema: analytics_pii | ✅ |
| Prisma migrate deploy | ✅ |

状态：**PASS**
DBREPORT

# ── TASK-201D：种子数据 ──────────────────────────────────────
log "[201D] 写入种子数据（六大评估定义）..."
npm run db:seed 2>&1 | tail -10

# 验证六大评估已写入
for ATYPE in osa sleep stress weight_loss diabetes altitude; do
  COUNT=$(PGPASSWORD="${POSTGRES_PASSWORD}" psql \
    -h localhost -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" \
    -t -c "SELECT COUNT(*) FROM assessments WHERE type='${ATYPE}';" \
    2>/dev/null | tr -d ' ')
  [ "${COUNT:-0}" -ge 1 ] || fail "评估定义 '${ATYPE}' 未成功写入"
  pass "评估定义 '${ATYPE}' 已写入"
done

cat >> "${REPORT_DIR}/assessment-seed-validation-report.md" << SEEDREPORT
# Assessment Seed Validation Report (TASK-201D)

执行时间：$(date '+%Y-%m-%d %H:%M:%S')

| 评估类型 | 结果 |
|---|---|
| OSA | ✅ |
| Sleep | ✅ |
| Stress | ✅ |
| Weight Loss | ✅ |
| Diabetes | ✅ |
| Altitude | ✅ |

状态：**PASS**
SEEDREPORT

# ── TASK-201E：Docker 构建与启动 ────────────────────────────
log "[201E] docker compose build..."
docker compose --env-file .env.production build 2>&1 | tail -20
pass "Docker 镜像构建完成"

log "[201E] docker compose up -d..."
docker compose --env-file .env.production up -d
log "等待服务健康（45秒）..."
sleep 45

# 健康检查
API_STATUS=$(curl -so /dev/null -w "%{http_code}" http://localhost:4000/health/live 2>/dev/null)
WEB_STATUS=$(curl -so /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null)
PG_OK=$(docker compose ps | grep postgres | grep "healthy" | wc -l)
REDIS_OK=$(docker compose ps | grep redis | grep "healthy" | wc -l)

[ "${API_STATUS}" = "200" ] || fail "API /health/live 返回 ${API_STATUS}，期望 200"
[ "${WEB_STATUS}" = "200" ] || fail "Web 返回 ${WEB_STATUS}，期望 200"
[ "${PG_OK}" -ge 1 ] || fail "PostgreSQL 未处于 healthy 状态"
[ "${REDIS_OK}" -ge 1 ] || fail "Redis 未处于 healthy 状态"

cat >> "${REPORT_DIR}/docker-deployment-report.md" << DOCKERREPORT
# Docker Deployment Report (TASK-201E)

执行时间：$(date '+%Y-%m-%d %H:%M:%S')

| 服务 | 状态 |
|---|---|
| API /health/live | HTTP ${API_STATUS} ✅ |
| Web / | HTTP ${WEB_STATUS} ✅ |
| PostgreSQL | healthy ✅ |
| Redis | healthy ✅ |

状态：**PASS**
DOCKERREPORT
pass "TASK-201E Docker 部署验证通过"

log "===== 部署脚本执行完成 ====="
log "后续手动步骤："
log "  1. 配置 SSL 证书（/etc/ssl/mateyou/fullchain.pem + privkey.pem）"
log "  2. 重启 Nginx：docker compose restart nginx"
log "  3. 在百度搜索资源平台完成站点验证"
log "  4. 在百度统计中激活追踪"
log "  5. 执行手动 QA：docs/release/qa-acceptance-report.md"
log "详细步骤见：docs/deployment/alicloud-production.md"
