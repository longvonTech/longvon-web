# Strapi CMS（Sprint 1占位，未实际接线）

## 现状

本Sprint的网络环境无法执行`npx create-strapi-app`（沙箱无外网访问），因此`apps/cms`目录暂未包含真实的Strapi工程，仅有本说明文件与`docker-compose.yml`中已注释的Strapi服务占位配置。

## 待网络可用时的接入步骤

```bash
# 在apps/cms目录下执行（需要网络访问npm registry）
npx create-strapi-app@latest . --quickstart --typescript

# 完成后取消docker-compose.yml中Strapi服务的注释
# 并在.env中填入STRAPI_*相关密钥（.env.example已预留占位变量）
```

## 与核心API的边界

Strapi仅负责Knowledge Domain的内容管理（Articles/Categories/Topics/Tags等，呼应database-domain-model-v1.md第5部分），不负责用户身份/评估/会员等业务数据——这些已经在`apps/api`（NestJS）中实现，不会迁移到Strapi管理。Strapi写入的内容数据最终落在哪个数据库连接（独立Strapi自带数据库 vs 复用主PostgreSQL实例的独立schema）留待接入时根据`physical-database-freeze-v1.md`的schema划分原则确认，倾向于复用主实例的`public`schema（Articles等表已在Prisma Schema中定义），避免维护两套数据库连接与两份数据备份策略。
