import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/**
 * Membership埋点服务，呼应TASK-106H/106I。
 * 设计原则与AssessmentAnalyticsService完全一致：
 * ①埋点失败不中断主业务流程（catch+log，不throw）；
 * ②写入Events表（event_category='membership'），event_category已在CHECK约束中声明，
 *   此前检查确认已包含'membership'值，无需修改数据库层；
 * ③properties中携带关键维度数据，供后续Customer360/CRM Analytics直接从Events表
 *   group by取统计，不需要回查Memberships/Subscriptions表。
 */
@Injectable()
export class MembershipAnalyticsService {
  private readonly logger = new Logger(MembershipAnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  recordViewed(customerId: string, currentTier: string): void {
    this.emit(customerId, 'membership_viewed', { currentTier });
  }

  recordUpgraded(customerId: string, fromTier: string, toTier: string, billingCycle: string): void {
    this.emit(customerId, 'membership_upgraded', { fromTier, toTier, billingCycle });
  }

  recordCanceled(customerId: string, tier: string): void {
    this.emit(customerId, 'membership_canceled', { tier });
  }

  recordExpired(customerId: string, tier: string): void {
    this.emit(customerId, 'subscription_expired', { tier });
  }

  // membership_renewed 在真实支付成功回调中触发，本Sprint不接入支付，
  // 方法预先声明确保接口完整，实际不会被调用（没有支付回调入口）
  recordRenewed(customerId: string, tier: string, billingCycle: string): void {
    this.emit(customerId, 'membership_renewed', { tier, billingCycle });
  }

  // CustomerProfile更新，呼应TASK-106H"会员行为写入CustomerProfiles"。
  // CustomerProfiles在analytics_pii schema下，这里直接更新membership_level字段，
  // 不走RLS（CustomerProfiles的访问控制依赖elevated_access_token，
  // 此处由内部系统服务调用，不是Customer自己的请求上下文）。
  async syncTierToProfile(customerId: string, membershipLevel: string): Promise<void> {
    try {
      await this.prisma.customerProfile.upsert({
        where: { customerId },
        create: { customerId, membershipLevel },
        update: { membershipLevel },
      });
    } catch (err) {
      this.logger.warn(`CustomerProfile同步失败(${customerId}): ${(err as Error).message}`);
    }
  }

  private emit(customerId: string, eventType: string, properties: Record<string, unknown>): void {
    this.prisma.event
      .create({
        data: {
          customerId,
          eventType,
          eventCategory: 'membership',
          channel: 'web',
          properties: properties as any,
          occurredAt: new Date(),
        },
      })
      .catch((err: Error) => {
        this.logger.warn(`会员埋点写入失败(${eventType}): ${err.message}`);
      });
  }
}
