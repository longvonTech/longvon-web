# Go-Live Checklist (TASK-201J)

文档用途：上线前逐项核查，全部 ✅ 后方可宣布 Production Approved。  
执行者：部署工程师（人工逐项确认）

---

## 安全检查

| 项目 | 状态 | 备注 |
|---|---|---|
| HTTPS 强制跳转（HTTP 301→HTTPS） | ⬜ 待验证 | `curl -I http://www.longvon.com` 应返回 301 |
| SSL 证书有效期 > 30天 | ⬜ 待验证 | `openssl s_client -connect www.longvon.com:443` |
| SSL 协议（TLSv1.2+，无弱密码） | ⬜ 待验证 | 可用 ssllabs.com 扫描 |
| JWT_ACCESS_SECRET 为随机64位+ | ⬜ 待确认 | .env.production 已填写 |
| JWT_REFRESH_SECRET 与 ACCESS 不同 | ⬜ 待确认 | .env.production 已填写 |
| RBAC 后台端点已限制角色访问 | ✅ 代码已实现 | JwtAuthGuard + RolesGuard |
| RLS 8张表已启用 | ✅ migration.sql 已写入 | 需 migrate deploy 后确认 |
| API 端口 4000 未对外暴露 | ⬜ 待确认 | 仅 127.0.0.1:4000，通过 Nginx 代理 |
| .env.production 未提交 git | ✅ .gitignore 已配置 | |
| PostgreSQL 密码强度 | ⬜ 待确认 | 建议 openssl rand -hex 32 |
| Redis 密码已设置 | ⬜ 待确认 | .env.production REDIS_PASSWORD |

---

## 数据库检查

| 项目 | 状态 | 备注 |
|---|---|---|
| 39张表全部存在 | ⬜ 待执行 migrate deploy | |
| 四个 Schema 存在 | ⬜ 待验证 | public/health/audit/analytics_pii |
| RLS 策略已创建 | ⬜ 待验证 | migration.sql 已包含 |
| 分区表初始化 | ⬜ 待验证 | 当月+次月分区 |
| 种子数据已写入 | ⬜ 待执行 db seed | 六大评估定义 |
| 每日备份任务已启动 | ⬜ 待配置 | 见 alicloud-production.md 第7节 |
| 备份恢复测试 | ⬜ 上线后一周内 | 必须验证恢复可行 |

---

## SEO 检查

| 项目 | 状态 | 备注 |
|---|---|---|
| robots.txt 正常（/robots.txt） | ⬜ 待验证 | 含 Baiduspider 规则 |
| sitemap.xml 正常（/sitemap.xml） | ⬜ 待验证 | 含全部核心页面 |
| Canonical 标签正确 | ✅ 代码已实现 | generateMetadata 中配置 |
| Organization Schema | ✅ 首页已输出 | |
| Article Schema | ✅ 知识库文章已输出 | |
| Product Schema | ✅ Ring1C产品页已输出 | |
| 百度搜索资源平台站点验证 | ⬜ 待操作 | 见 alicloud-production.md 第6节 |
| 百度 sitemap 提交 | ⬜ 待操作 | 验证通过后提交 |
| 百度主动推送 Token 已配置 | ⬜ 待填写 | .env.production BAIDU_PUSH_TOKEN |

---

## 合规检查

| 项目 | 状态 | 备注 |
|---|---|---|
| 首页底部免责声明 | ✅ | "仅供参考，不构成医学诊断" |
| 产品页合规声明 | ✅ | "非医疗器械，健康数据仅供参考" |
| 评估入口免责声明 | ✅ | 含重要声明模块 |
| 全部评估结果 disclaimer | ✅ | Assessment Engine 已内置 |
| Partner 宣传文案无医疗承诺 | ✅ | 已审查 |
| 会员权益文案无疗效承诺 | ✅ | 已审查 |

---

## 运营检查

| 项目 | 状态 | 备注 |
|---|---|---|
| 百度统计代码已注入 | ⬜ 待填写 | NEXT_PUBLIC_BAIDU_TONGJI_ID |
| 百度统计数据回传 | ⬜ 上线后24小时确认 | |
| 合作申请表单已测试 | ⬜ 待手动测试 | /partner/hospital 等 |
| 后台 CRM 可登录 | ⬜ 待配置管理员账号 | POST /auth/admin/login |
| 健康监控告警 | ⬜ 建议配置 | 阿里云云监控 or 钉钉Webhook |

---

## 最终评审

全部勾选后，填写以下信息后宣布上线：

```
上线时间：____________________
执行人：____________________
域名确认：https://www.longvon.com 可正常访问
结论：【Production Approved】 www.longvon.com Beta v1.0
```

---

**注意：** 在 Runtime Validation Final Report 全部10项 PASS 之前，不得宣布 Production Approved。
