#!/bin/bash
cd /root/mateyou

if [ "${DEPLOY_SKIP_GIT_PULL:-0}" != "1" ]; then
  echo "拉取最新代码..."
  git pull origin main
else
  echo "跳过 git pull（代码已由 CI 同步）"
fi

echo "构建前端..."
export $(grep -v '^#' .env.production | xargs)
npm run build --workspace=apps/web

echo "构建API..."
npm run build --workspace=apps/api

echo "同步静态文件..."
/root/mateyou/scripts/sync-static.sh

echo "重启服务..."
pm2 restart ecosystem.config.js

echo "✅ 部署完成"
