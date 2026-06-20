# MATEYOU Platform Monorepo

MATEYOU AI Digital Health Platform 工程仓库（Phase E Sprint 1：基础工程骨架）。

## 范围说明

本Sprint仅完成：Monorepo结构、Next.js前端骨架、NestJS后端骨架（Identity+Customer模块）、PostgreSQL/Redis接入、Prisma Schema与迁移脚本、CI基础配置。**不包含**AI Assistant/Assessment/CRM/Membership业务逻辑，详见`/docs/review/phase-e-sprint-1-review-v1.md`。

## 目录结构

```
apps/
  web/      Next.js前端（仅占位首页）
  api/      NestJS后端（Identity + Customer模块）
  cms/      Strapi CMS（占位，未实际接线，见apps/cms/README.md）
packages/
  database/ Prisma Schema + 迁移脚本，供api与cms未来共同引用
```

## 本地启动（需要网络访问，本沙箱环境无法执行以下步骤）

```bash
# 1. 安装依赖
npm install

# 2. 启动PostgreSQL与Redis
docker-compose up -d postgres redis

# 3. 复制环境变量并填入实际值
cp .env.example .env

# 4. 生成Prisma Client
npm run db:generate

# 5. 执行数据库迁移（首次初始化）
npm run db:migrate:dev

# 6. 分别启动前后端开发服务器
npm run dev:api   # http://localhost:4000
npm run dev:web   # http://localhost:3000
```

## 已知限制（本Sprint产出时的沙箱环境约束）

本仓库在无网络访问的沙箱环境中手写完成，**未实际执行过`npm install`/`prisma generate`/`prisma migrate`**，所有依赖版本号与Prisma Schema均为人工核对编写，不能保证100%没有版本兼容性问题或语法笔误，**首次在有网络的真实环境中执行第1-5步时需要预留时间排查潜在的初始化问题**，不应假设这套骨架"开箱即用零问题"。详见`/docs/review/phase-e-sprint-1-review-v1.md`第3部分。

## 相关文档

工程实现依据`/docs/database/physical-database-freeze-v1.md`与`/docs/engineering/`下全部Phase A-D架构文档，本仓库代码注释中大量引用具体文档章节，便于追溯每个设计决策的来源。
