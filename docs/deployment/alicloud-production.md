# MATEYOU Platform — 阿里云生产部署手册

版本：Phase F v1.0  
域名：www.longvon.com  
部署目标：阿里云 ECS + PostgreSQL + Redis + Docker  
更新日期：2024年

---

## 1. 服务器配置要求

| 项目 | 最低配置 | 推荐配置 |
|---|---|---|
| ECS规格 | 4核8GB（ecs.c7.xlarge） | 4核16GB（ecs.c7.2xlarge） |
| 系统盘 | 40GB SSD | 100GB SSD |
| 数据盘 | — | 200GB SSD（挂载到/data） |
| 带宽 | 5Mbps 按量 | 10Mbps 包年 |
| 操作系统 | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |
| 地域 | 华南（深圳）或华东（上海） | 华南（深圳）— 龙汾科技所在地 |

### 1.1 安全组规则

```
入站：
  22/TCP   → 仅运维IP白名单（SSH）
  80/TCP   → 0.0.0.0/0（HTTP，Nginx强制跳转HTTPS）
  443/TCP  → 0.0.0.0/0（HTTPS）

出站：
  全部放行（需要访问百度API推送、阿里云SMS等）

内部（ECS内部通信，Docker网络自动处理，无需手动配置）：
  3000/TCP → web → nginx
  4000/TCP → api → nginx/web
  5432/TCP → postgres → api
  6379/TCP → redis → api
```

---

## 2. 服务器初始化

```bash
# 以 root 登录后执行

# 更新系统
apt update && apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | bash
# 若阿里云网络访问Docker Hub慢，可配置镜像加速：
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://registry.cn-hangzhou.aliyuncs.com"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "5"
  }
}
EOF
systemctl restart docker

# 安装 docker compose（V2 插件形式）
apt install docker-compose-plugin -y

# 确认版本
docker --version
docker compose version

# 创建运行目录
mkdir -p /data/mateyou
chown $USER:$USER /data/mateyou
```

---

## 3. 域名解析

在阿里云域名控制台添加以下解析记录：

| 记录类型 | 主机记录 | 记录值 | TTL |
|---|---|---|---|
| A | @ | ECS公网IP | 600 |
| A | www | ECS公网IP | 600 |

等待DNS生效（通常5-10分钟），验证：
```bash
nslookup www.longvon.com
```

---

## 4. SSL 证书

### 4.1 申请证书
1. 登录阿里云 SSL 控制台 → 证书管理 → 购买免费证书（DV单域名，1年有效）
2. 完成域名验证（DNS验证方式最简单）
3. 下载证书，选择 **Nginx** 格式
4. 上传至服务器：

```bash
mkdir -p /etc/ssl/mateyou
# 将下载的证书文件上传（通常包含 .pem 和 .key 两个文件）
# 重命名为标准名称：
mv xxx.pem /etc/ssl/mateyou/fullchain.pem
mv xxx.key /etc/ssl/mateyou/privkey.pem
chmod 600 /etc/ssl/mateyou/privkey.pem
```

### 4.2 证书自动续期
阿里云免费证书有效期1年，到期前30天会收到邮件提醒，手动续期并重新上传即可。
更换证书后执行 `docker compose restart nginx` 生效。

---

## 5. 项目部署

### 5.1 克隆代码

```bash
cd /data/mateyou
git clone https://github.com/longvonTech/mateyou-platform.git .
# 或从私有仓库克隆，需要配置 SSH Key 或 Access Token
```

### 5.2 配置环境变量

```bash
cp .env.production.example .env.production
nano .env.production
# 按模板说明填入所有必填项：
# - POSTGRES_PASSWORD（强密码，建议 openssl rand -hex 32 生成）
# - REDIS_PASSWORD（同上）
# - JWT_ACCESS_SECRET（openssl rand -hex 64）
# - JWT_REFRESH_SECRET（openssl rand -hex 64）
# - NEXT_PUBLIC_BAIDU_TONGJI_ID（百度统计ID）
# - NEXT_PUBLIC_BAIDU_VERIFICATION（百度站点验证码）
# - BAIDU_PUSH_TOKEN（百度主动推送Token）
```

### 5.3 构建并启动

```bash
# 首次启动（构建镜像）
docker compose --env-file .env.production up -d --build

# 查看启动状态（等待所有服务 healthy）
docker compose ps

# 查看日志
docker compose logs -f api      # API日志
docker compose logs -f web      # Web日志
docker compose logs -f nginx    # Nginx日志
```

### 5.4 数据库初始化

```bash
# 等待 postgres 服务 healthy 后执行
docker compose --env-file .env.production exec api \
  npx prisma migrate deploy --schema packages/database/prisma/schema.prisma

# 导入种子数据（六大评估定义）
docker compose --env-file .env.production exec api \
  npx ts-node packages/database/prisma/seed.ts
```

### 5.5 验证上线

```bash
# 验证 HTTPS 可访问
curl -I https://www.longvon.com

# 验证 API 健康检查
curl https://www.longvon.com/api/health/live

# 验证 robots.txt
curl https://www.longvon.com/robots.txt

# 验证 sitemap.xml
curl https://www.longvon.com/sitemap.xml | head -20
```

---

## 6. 百度SEO配置（Sprint 8）

### 6.1 百度搜索资源平台站点验证

1. 登录 https://ziyuan.baidu.com → 用户中心 → 站点管理 → 添加站点
2. 输入 https://www.longvon.com
3. 选择 **HTML标签验证** 方式，复制 `content` 中的验证码
4. 将验证码填入 `.env.production` 的 `NEXT_PUBLIC_BAIDU_VERIFICATION`
5. 重新部署 Web 服务后，点击"完成验证"

### 6.2 百度统计接入

1. 登录 https://tongji.baidu.com → 管理 → 新增网站
2. 获取统计代码中的网站ID（32位十六进制字符串）
3. 填入 `.env.production` 的 `NEXT_PUBLIC_BAIDU_TONGJI_ID`
4. 重新部署 Web 服务后，等待约24小时百度统计开始收集数据

### 6.3 百度主动推送（加速收录）

详见 Sprint 8 实现的 `/seo/baidu-push` API 端点文档。

---

## 7. 备份策略

### 7.1 PostgreSQL 每日自动备份

```bash
# 创建备份脚本
cat > /data/mateyou/scripts/backup-db.sh << 'BACKUP_EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/data/backups/postgres
mkdir -p $BACKUP_DIR

docker compose -f /data/mateyou/docker-compose.yml \
  --env-file /data/mateyou/.env.production \
  exec -T postgres \
  pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} | \
  gzip > ${BACKUP_DIR}/mateyou_${DATE}.sql.gz

# 保留最近30天的备份，删除更早的
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "[$(date)] 备份完成：mateyou_${DATE}.sql.gz"
BACKUP_EOF

chmod +x /data/mateyou/scripts/backup-db.sh

# 添加 crontab（每日凌晨3点备份）
(crontab -l 2>/dev/null; echo "0 3 * * * /data/mateyou/scripts/backup-db.sh >> /data/logs/backup.log 2>&1") | crontab -
```

### 7.2 备份验证
每周执行一次恢复演练，确认备份文件完整可用：
```bash
# 解压验证
gunzip -t /data/backups/postgres/mateyou_LATEST.sql.gz
```

---

## 8. 日志策略

Docker 已配置 json-file 日志驱动，各服务最大保留 5 个文件 × 20MB = 100MB。

日志查看命令：
```bash
# 实时日志
docker compose logs -f --tail=100 api

# Nginx 访问日志（按日期过滤百度爬虫访问）
docker compose exec nginx grep "Baiduspider" /var/log/nginx/access.log | tail -20
```

---

## 9. 更新部署流程

```bash
cd /data/mateyou

# 拉取最新代码
git pull origin main

# 重新构建并滚动更新（Nginx会短暂不可用，约30秒）
docker compose --env-file .env.production up -d --build

# 如果有数据库迁移
docker compose --env-file .env.production exec api \
  npx prisma migrate deploy --schema packages/database/prisma/schema.prisma

# 确认服务恢复健康
docker compose ps
```

---

## 10. 故障恢复

### 10.1 单服务重启

```bash
docker compose restart api     # 重启 API
docker compose restart web     # 重启 Web
docker compose restart nginx   # 重启 Nginx（配置变更后）
```

### 10.2 全量重启

```bash
docker compose --env-file .env.production down
docker compose --env-file .env.production up -d
```

### 10.3 数据库恢复（从备份）

```bash
# 1. 停止 API（防止写入冲突）
docker compose stop api

# 2. 恢复备份
gunzip -c /data/backups/postgres/mateyou_YYYYMMDD.sql.gz | \
  docker compose exec -T postgres psql -U ${POSTGRES_USER} ${POSTGRES_DB}

# 3. 重启 API
docker compose start api
```

### 10.4 常见问题

| 症状 | 排查步骤 |
|---|---|
| 502 Bad Gateway | 检查 `docker compose ps`，确认 web/api 是否 healthy |
| API 无响应 | `docker compose logs api` 查看错误，常见原因：DB连接失败 |
| 数据库连接失败 | 检查 .env.production 中的 DATABASE_URL 是否正确 |
| 百度未收录 | 确认 robots.txt 允许 Baiduspider，确认 sitemap.xml 可访问，手动提交到百度搜索资源平台 |

---

## 11. 上线验收清单

在正式发布前逐项确认：

### 产品功能
- [ ] 首页正常加载（https://www.longvon.com）
- [ ] Ring1C 产品页正常（/products/ring1c）
- [ ] 知识库列表/文章详情正常（/knowledge）
- [ ] 六大评估入口正常（/assessment）
- [ ] 合作申请表单提交成功（/partner/hospital 等）
- [ ] 会员权益页正常（/membership）

### SEO
- [ ] robots.txt 正常（/robots.txt）
- [ ] sitemap.xml 正常（/sitemap.xml）
- [ ] 百度站点验证通过
- [ ] 百度统计数据开始收集

### 安全
- [ ] HTTPS 强制跳转正常（http → https）
- [ ] SSL 证书有效（证书到期日 > 30天）
- [ ] API 端点未对外暴露（仅通过 Nginx 代理）
- [ ] .env.production 未提交到 git

### 监控
- [ ] /health/live 端点返回 200
- [ ] /health/ready 端点返回 200（DB/Redis 均正常）
- [ ] Docker 所有服务状态为 healthy
