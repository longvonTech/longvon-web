#!/bin/bash
set -e
cd /root/mateyou

load_production_env() {
  if [ -f .env.production ]; then
    set -a
    # shellcheck disable=SC1091
    source .env.production 2>/dev/null || true
    set +a
  fi

  # PM2 生产环境以 ecosystem.config.js 为准；.env.production 可能不存在或含未展开的 ${VAR}
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

if [ "${DEPLOY_SKIP_GIT_PULL:-0}" != "1" ]; then
  echo "拉取最新代码..."
  git pull origin main
else
  echo "跳过 git pull（代码已由 CI 同步）"
fi

echo "加载生产环境变量..."
load_production_env

echo "数据库迁移..."
npm run db:migrate:deploy

echo "构建前端..."
npm run build --workspace=apps/web

echo "构建API..."
npm run build --workspace=apps/api

echo "同步静态文件..."
/root/mateyou/scripts/sync-static.sh

echo "重启服务..."
pm2 restart ecosystem.config.js

echo "✅ 部署完成"
