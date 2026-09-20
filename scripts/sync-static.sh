#!/bin/bash
# 同步静态资源到Nginx目录
mkdir -p /var/www/mateyou/static
if [ -d /root/mateyou/apps/web/public/images ]; then
  cp -r /root/mateyou/apps/web/public/images /var/www/mateyou/
fi
# llms.txt 等根路径静态文件（Nginx 也可直接命中，作双保险）
if [ -f /root/mateyou/apps/web/public/llms.txt ]; then
  cp /root/mateyou/apps/web/public/llms.txt /var/www/mateyou/llms.txt
fi
if [ -d /root/mateyou/apps/web/.next/static ]; then
  cp -r /root/mateyou/apps/web/.next/static/* /var/www/mateyou/static/
fi
chown -R www-data:www-data /var/www/mateyou 2>/dev/null || true
chmod -R 755 /var/www/mateyou
echo "同步完成"
