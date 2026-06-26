import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface SubscriptionRecord {
  id: string;
  customerId: string;
  membershipId: string;
  planTier: string;
  billingCycle: string;
  amount: unknown; // Prisma Decimal
  currency: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  paymentGatewayRef: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionData {
  customerId: string;
  membershipId: string;
  planTier: string;
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  currency?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActiveForCustomer(customerId: string): Promise<SubscriptionRecord | null> {
    return this.prisma.withRlsContext({ customerId }, (tx) =>
      tx.subscription.findFirst({
        where: { customerId, status: 'active' },
        orderBy: { createdAt: 'desc' },
      }),
    ) as Promise<SubscriptionRecord | null>;
  }

  findHistoryForCustomer(customerId: string) {
    return this.prisma.withRlsContext({ customerId }, (tx) =>
      tx.subscription.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  findById(id: string): Promise<SubscriptionRecord | null> {
    return this.prisma.subscription.findUnique({
      where: { id },
    }) as Promise<SubscriptionRecord | null>;
  }

  create(data: CreateSubscriptionData): Promise<SubscriptionRecord> {
    return this.prisma.subscription.create({
      data: {
        ...data,
        status: 'active',
        currency: data.currency ?? 'CNY',
      },
    }) as Promise<SubscriptionRecord>;
  }

  updateStatus(id: string, status: string) {
    return this.prisma.subscription.update({ where: { id }, data: { status } });
  }

  // 扫描已到期的active订阅，供定时任务（本Sprint不实现，同Abandoned埋点逻辑）
  findExpiredActive() {
    return this.prisma.subscription.findMany({
      where: { status: 'active', currentPeriodEnd: { lt: new Date() } },
      select: { id: true, customerId: true, membershipId: true, planTier: true },
    });
  }

  // 后台统计用
  countByStatus() {
    return this.prisma.subscription.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
  }

  countByPlanTier() {
    return this.prisma.subscription.groupBy({
      by: ['planTier'],
      where: { status: 'active' },
      _count: { _all: true },
    });
  }
}
