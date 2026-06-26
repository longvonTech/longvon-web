import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@mateyou/database';

export interface RlsContext {
  customerId?: string;
  role?: string;
  guestSessionId?: string;
  // 紧急提升访问令牌，对应 rls-policy-v1.md 第4部分"管理员规则"——
  // 仅在走完审批流程后才应被设置，本字段在Sprint 1暂无实际签发流程，
  // 预留接口供后续Sprint接入
  elevatedAccessToken?: string;
}

// 呼应 /docs/security/rls-policy-v1.md：
// RLS策略依赖 current_setting('app.current_customer_id') 等会话变量，
// 这些变量必须在与业务查询"同一个事务"内通过 set_config(..., true) 设置
// （true = 仅本事务内生效，事务结束自动清除，避免连接池复用导致的上下文污染）。
// PrismaService不会替业务代码自动注入这些变量——调用方必须显式使用
// withRlsContext，未经过此方法的普通查询不会有任何customer_id上下文，
// 此时RLS策略会按"无任何匹配条件"处理（即默认拒绝访问受RLS保护的行），
// 这是刻意的"显式优于隐式"设计，避免开发者忘记设置上下文却误以为查询已被保护。
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('PostgreSQL连接已建立');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async withRlsContext<T>(
    ctx: RlsContext,
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(async (tx) => {
      if (ctx.customerId) {
        await tx.$executeRaw`SELECT set_config('app.current_customer_id', ${ctx.customerId}, true)`;
      }
      if (ctx.role) {
        await tx.$executeRaw`SELECT set_config('app.current_role', ${ctx.role}, true)`;
      }
      if (ctx.guestSessionId) {
        await tx.$executeRaw`SELECT set_config('app.current_guest_session_id', ${ctx.guestSessionId}, true)`;
      }
      if (ctx.elevatedAccessToken) {
        await tx.$executeRaw`SELECT set_config('app.elevated_access_token', ${ctx.elevatedAccessToken}, true)`;
      }
      return fn(tx);
    });
  }
}
