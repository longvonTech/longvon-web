#!/bin/bash
# 同步静态资源到Nginx目录
cp -r /root/mateyou/apps/web/public/images /var/www/mateyou/
cp -r /root/mateyou/apps/web/.next/static/* /var/www/mateyou/static/
chown -R www-data:www-data /var/www/mateyou
chmod -R 755 /var/www/mateyou
echo "同步完成"
