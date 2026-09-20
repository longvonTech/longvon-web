#!/bin/bash
# Longvon production deploy (ECS: /root/mateyou)
#
# Canonical flow (GitHub Actions):
#   checkout → rsync to ECS (excludes node_modules/.next/dist/.git) →
#   DEPLOY_SKIP_GIT_PULL=1 ./scripts/deploy.sh
#
# Manual on ECS (if .git present and secrets allow):
#   ./scripts/deploy.sh
#
# Idempotent: safe to re-run. Previous builds kept outside .next at:
#   /root/mateyou/_rollback/web-standalone.bak.<timestamp>
#   /root/mateyou/_rollback/api-dist.bak.<timestamp>
#
set -euo pipefail
cd /root/mateyou

WEB_DIR="/root/mateyou/apps/web"
STANDALONE_WEB="$WEB_DIR/.next/standalone/apps/web"
API_DIST="/root/mateyou/apps/api/dist"

load_production_env() {
  if [ -f .env.production ]; then
    set -a
    # shellcheck disable=SC1091
    source .env.production 2>/dev/null || true
    set +a
  fi

  if [ -z "${DATABASE_URL:-}" ] && [ -f ecosystem.config.js ]; then
    eval "$(node - <<'NODE'
const config = require('./ecosystem.config.js');
const api = config.apps.find((a) => a.name === 'mateyou-api');
const web = config.apps.find((a) => a.name === 'mateyou-web');
const env = { ...(api?.env || {}), ...(web?.env || {}) };
for (const [key, value] of Object.entries(env)) {
  if (value == null || value === '') continue;
  const escaped = String(value).replace(/'/g, "'\\''");
  process.stdout.write(`export ${key}='${escaped}'\n`);
}
NODE
)"
  fi

  if [ -z "${DATABASE_URL:-}" ]; then
    echo "ERROR: DATABASE_URL 未设置。请检查 .env.production 或 ecosystem.config.js"
    exit 1
  fi
}

cleanup_non_repo_orphans() {
  # Historical ECS-only module (not in GitHub main) previously broke nest build.
  if [ -d apps/api/src/distribution ]; then
    local stamp
    stamp="$(date +%Y%m%d%H%M%S)"
    mkdir -p /root/mateyou/_orphans
    echo "WARN: moving non-repo apps/api/src/distribution → _orphans/distribution-$stamp"
    mv apps/api/src/distribution "/root/mateyou/_orphans/distribution-$stamp"
  fi

  # Orphan services left on ECS by non-delete rsync; they import missing distribution.
  for f in \
    apps/api/src/growth/services/article-publish-pipeline.service.ts \
    apps/api/src/growth/services/article-cover-image.service.ts
  do
    if [ -f "$f" ]; then
      echo "WARN: removing non-repo orphan $f"
      mkdir -p /root/mateyou/_orphans
      mv "$f" "/root/mateyou/_orphans/$(basename "$f").$(date +%Y%m%d%H%M%S)"
    fi
  done
}

backup_web_standalone() {
  # Keep outside apps/web/.next — next build wipes that directory.
  local rollback_root="/root/mateyou/_rollback"
  mkdir -p "$rollback_root"
  if [ -d "$WEB_DIR/.next/standalone" ]; then
    local stamp
    stamp="$(date +%Y%m%d%H%M%S)"
    echo "备份当前 Web standalone → _rollback/web-standalone.bak.$stamp"
    rm -rf "$rollback_root/web-standalone.bak.$stamp"
    cp -a "$WEB_DIR/.next/standalone" "$rollback_root/web-standalone.bak.$stamp"
    # Keep at most 3 backups
    ls -1dt "$rollback_root"/web-standalone.bak.* 2>/dev/null | tail -n +4 | xargs -r rm -rf
  fi
  if [ -d "$API_DIST" ]; then
    local stamp
    stamp="$(date +%Y%m%d%H%M%S)"
    echo "备份当前 API dist → _rollback/api-dist.bak.$stamp"
    rm -rf "$rollback_root/api-dist.bak.$stamp"
    cp -a "$API_DIST" "$rollback_root/api-dist.bak.$stamp"
    ls -1dt "$rollback_root"/api-dist.bak.* 2>/dev/null | tail -n +4 | xargs -r rm -rf
  fi
}

sync_standalone_public() {
  if [ ! -d "$STANDALONE_WEB" ]; then
    echo "ERROR: standalone output missing at $STANDALONE_WEB"
    exit 1
  fi
  echo "同步 public + static → standalone（修复 /llms.txt 等静态资源）..."
  mkdir -p "$STANDALONE_WEB/public"
  cp -a "$WEB_DIR/public/." "$STANDALONE_WEB/public/"
  mkdir -p "$STANDALONE_WEB/.next"
  rm -rf "$STANDALONE_WEB/.next/static"
  cp -a "$WEB_DIR/.next/static" "$STANDALONE_WEB/.next/static"
  if [ ! -f "$STANDALONE_WEB/public/llms.txt" ]; then
    echo "ERROR: standalone public/llms.txt missing after copy"
    exit 1
  fi
}

post_deploy_health() {
  echo "健康检查..."
  local i
  for i in $(seq 1 24); do
    # Require home + key GEO bodies + llms.txt + API live (avoids soft-error layout shells).
    if curl -sf -o /dev/null http://127.0.0.1:3000/ \
      && curl -sf http://127.0.0.1:3000/company/longvon | grep -Fq 'LONGVON' \
      && curl -sf http://127.0.0.1:3000/smart-ring-oem-odm | grep -Fq 'ODM' \
      && curl -sf http://127.0.0.1:3000/smart-ring-osa | grep -Fq 'OSA' \
      && curl -sf -o /dev/null http://127.0.0.1:3000/llms.txt \
      && curl -sf -o /dev/null http://127.0.0.1:4000/health/live; then
      echo "OK web:/ + GEO bodies + /llms.txt + api:/health/live"
      return 0
    fi
    echo "waiting health ($i/24)..."
    sleep 5
  done
  echo "ERROR: health check failed"
  pm2 status || true
  pm2 logs mateyou-web --lines 30 --nostream || true
  pm2 logs mateyou-api --lines 30 --nostream || true
  return 1
}

if [ "${DEPLOY_SKIP_GIT_PULL:-0}" != "1" ]; then
  echo "拉取最新代码..."
  git pull origin main
else
  echo "跳过 git pull（代码已由 CI/rsync 同步）"
fi

cleanup_non_repo_orphans

echo "加载生产环境变量..."
load_production_env

echo "生成 Prisma Client..."
npm run db:generate

echo "数据库迁移..."
npm run db:migrate:deploy

backup_web_standalone

echo "构建前端 (Next.js production)..."
npm run build --workspace=apps/web
sync_standalone_public

echo "构建 API (NestJS production)..."
npm run build --workspace=apps/api
if [ ! -f "$API_DIST/main.js" ]; then
  echo "ERROR: API dist/main.js missing after build"
  exit 1
fi

echo "同步静态文件到 Nginx..."
/root/mateyou/scripts/sync-static.sh

echo "重启 PM2 (web + api)..."
pm2 restart ecosystem.config.js

post_deploy_health

if [ -x /root/mateyou/scripts/production-smoke-test.sh ]; then
  echo "运行 production smoke test (localhost)..."
  # One retry for post-restart warmup races (layout may briefly omit page body).
  if ! ALLOW_INSECURE_TLS=0 BASE_URL=http://127.0.0.1:3000 API_URL=http://127.0.0.1:4000 \
    /root/mateyou/scripts/production-smoke-test.sh; then
    echo "WARN: smoke test failed once; retrying after 8s..."
    sleep 8
    ALLOW_INSECURE_TLS=0 BASE_URL=http://127.0.0.1:3000 API_URL=http://127.0.0.1:4000 \
      /root/mateyou/scripts/production-smoke-test.sh
  fi
fi

echo "✅ 部署完成"
