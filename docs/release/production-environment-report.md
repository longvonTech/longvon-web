# Production Environment Report (TASK-201B)

状态：**PENDING — 等待在真实 ECS 上执行 scripts/deploy-production.sh**

---

## 目标配置

| 项目 | 规格 |
|---|---|
| 平台 | 阿里云 ECS |
| CPU | 4 Core |
| Memory | 8 GB |
| Disk | 100 GB SSD |
| OS | Ubuntu 24.04 LTS |
| Docker | 最新稳定版 |
| docker compose | V2 plugin |
| Node.js | v20 LTS |

## 安装步骤

详见 `docs/deployment/alicloud-production.md` 第2节。  
自动化安装：`sudo scripts/deploy-production.sh`（含检查和安装）

## 验收标准

- [ ] `docker --version` → Docker 26+
- [ ] `docker compose version` → v2.x
- [ ] `node --version` → v20+
- [ ] `/etc/ssl/mateyou/fullchain.pem` 存在
- [ ] 安全组 80/443 开放，22 限 IP 白名单
