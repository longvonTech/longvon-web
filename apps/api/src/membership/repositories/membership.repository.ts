import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { MembershipTier } from '../tier-capability-matrix';

export interface MembershipRecord {
  id: string;
  customerId: string;
  tier: string;
  startedAt: Date;
  expiresAt: Date | null;
  paymentStatus: string;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class MembershipRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 查询Customer当前有效的Membership——每个Customer理论上只有一条活跃Membership记录。
   * 用withRlsContext确保数据库层也只能看到自己的记录。
   */
  findActiveForCustomer(customerId: string): Promise<MembershipRecord | null> {
    return this.prisma.withRlsContext({ customerId }, (tx) =>
      tx.membership.findFirst({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
      }),
    ) as Promise<MembershipRecord | null>;
  }

  /**
   * 首次初始化Customer的Membership记录（新注册用户自动获得free tier）。
   * 调用方在发现findActiveForCustomer返回null时才调用本方法，不幂等，
   * 不使用upsert——避免对一个已有Membership的Customer误触发tier重置。
   */
  createFree(customerId: string): Promise<MembershipRecord> {
    return this.prisma.withRlsContext({ customerId }, (tx) =>
      tx.membership.create({
        data: {
          customerId,
          tier: 'free',
          startedAt: new Date(),
          paymentStatus: 'none',
          autoRenew: false,
        },
      }),
    ) as Promise<MembershipRecord>;
  }

  updateTier(id: string, customerId: string, tier: MembershipTier, expiresAt: Date | null) {
    return this.prisma.withRlsContext({ customerId }, (tx) =>
      tx.membership.update({
        where: { id },
        data: { tier, expiresAt, paymentStatus: tier === 'free' ? 'none' : 'current' },
      }),
    );
  }

  markPaymentStatus(id: string, customerId: string, paymentStatus: string) {
    return this.prisma.withRlsContext({ customerId }, (tx) =>
      tx.membership.update({ where: { id }, data: { paymentStatus } }),
    );
  }

  // 后台用：不走RLS，管理员视角查所有，供MembershipAdminController使用
  findManyForAdmin(filter: { tier?: string; page: number; pageSize: number }) {
    const where: Record<string, unknown> = {};
    if (filter.tier) where.tier = filter.tier;
    return this.prisma.membership.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
      include: { customer: { select: { id: true, phone: true, nickname: true } } },
    });
  }
}
