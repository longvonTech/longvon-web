import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MembershipRepository } from '../repositories/membership.repository';
import { SubscriptionRepository, CreateSubscriptionData } from '../repositories/subscription.repository';
import { MembershipAnalyticsService } from './membership-analytics.service';
import {
  MembershipTier,
  TIERS,
  checkCapability,
  listCapabilities,
  CapabilityKey,
} from '../tier-capability-matrix';
import {
  isValidSubscriptionTransition,
  SubscriptionStatus,
} from '../subscription-status.util';

@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepo: MembershipRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
    private readonly analytics: MembershipAnalyticsService,
  ) {}

  /**
   * 获取Customer当前Membership，如不存在则自动初始化free档。
   * 这是整个Membership Service最常被调用的方法——凡是需要知道
   * "当前用户是什么Tier"的场景，都调用本方法，不直接读Customer.tier字段
   * （Customer表本身没有tier字段，tier是Membership表的字段）。
   */
  async getCurrentOrInit(customerId: string) {
    let membership = await this.membershipRepo.findActiveForCustomer(customerId);
    if (!membership) {
      membership = await this.membershipRepo.createFree(customerId);
    }
    return membership;
  }

  /**
   * 查询能力权限——整个Membership Domain对外提供的核心查询接口。
   * 任何模块需要判断"当前Customer能否使用某能力"，调用本方法，
   * 不直接访问CAPABILITY_MATRIX，更不在调用处比较tier字符串。
   */
  async hasCapability(customerId: string, capability: CapabilityKey): Promise<boolean> {
    const membership = await this.getCurrentOrInit(customerId);
    return checkCapability(membership.tier as MembershipTier, capability);
  }

  async getCapabilityList(customerId: string): Promise<{ tier: string; capabilities: CapabilityKey[] }> {
    const membership = await this.getCurrentOrInit(customerId);
    return {
      tier: membership.tier,
      capabilities: listCapabilities(membership.tier as MembershipTier),
    };
  }

  /**
   * 触发Dashboard展示所需的埋点（TASK-106G/106I）。
   */
  async getMembershipDashboard(customerId: string) {
    const membership = await this.getCurrentOrInit(customerId);
    const subscription = await this.subscriptionRepo.findActiveForCustomer(customerId);

    this.analytics.recordViewed(customerId, membership.tier);

    return {
      tier: membership.tier,
      tierDisplayName: TIER_DISPLAY_NAMES[membership.tier as MembershipTier],
      expiresAt: membership.expiresAt,
      paymentStatus: membership.paymentStatus,
      subscription: subscription
        ? {
            id: subscription.id,
            planTier: subscription.planTier,
            billingCycle: subscription.billingCycle,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
          }
        : null,
      capabilities: listCapabilities(membership.tier as MembershipTier),
      upgradeOptions: this.getUpgradeOptions(membership.tier as MembershipTier),
    };
  }

  /**
   * 开始订阅（升级）——本Sprint不接入支付，因此本方法代表
   * "后台管理员手动开通会员"或"未来支付回调成功后"应该执行的业务逻辑。
   * 真实支付集成时，支付回调服务调用本方法即可，本方法不需要改动。
   */
  async startSubscription(
    customerId: string,
    data: Omit<CreateSubscriptionData, 'customerId' | 'membershipId'>,
  ) {
    const membership = await this.getCurrentOrInit(customerId);
    const fromTier = membership.tier;

    if (!TIERS.includes(data.planTier as MembershipTier)) {
      throw new BadRequestException(`无效的会员档位：${data.planTier}`);
    }

    // 创建新订阅记录（不复用旧记录改状态）
    const subscription = await this.subscriptionRepo.create({
      ...data,
      customerId,
      membershipId: membership.id,
    });

    // 升级Membership的tier投影字段
    await this.membershipRepo.updateTier(membership.id, customerId, data.planTier as MembershipTier, data.currentPeriodEnd);

    // 同步到CustomerProfile
    void this.analytics.syncTierToProfile(customerId, data.planTier);

    // 埋点
    this.analytics.recordUpgraded(customerId, fromTier, data.planTier, data.billingCycle);

    // 更新Identity层的tier字段需要重新签发Token——本Sprint不实现该Token更新机制，
    // 登记为遗留风险：用户升级后如不重新登录，其JWT的tier字段仍是旧值，
    // 会导致"升级成功但刷新页面才能看到新权益"的体验问题。
    // 修复方案：支付回调后主动撤销旧Refresh Token，强制用户重新登录换取带新tier的JWT。

    return subscription;
  }

  async cancelSubscription(customerId: string, subscriptionId: string) {
    const sub = await this.subscriptionRepo.findById(subscriptionId);
    if (!sub) throw new NotFoundException('订阅记录不存在');
    if (sub.customerId !== customerId) throw new BadRequestException('无权操作他人订阅');

    if (!isValidSubscriptionTransition(sub.status as SubscriptionStatus, 'canceled')) {
      throw new BadRequestException(`当前订阅状态（${sub.status}）不允许取消`);
    }

    await this.subscriptionRepo.updateStatus(subscriptionId, 'canceled');

    // 取消后将Membership tier降回free，expiresAt清空
    const membership = await this.getCurrentOrInit(customerId);
    await this.membershipRepo.updateTier(membership.id, customerId, 'free', null);
    void this.analytics.syncTierToProfile(customerId, 'free');
    this.analytics.recordCanceled(customerId, sub.planTier);

    return { canceled: true };
  }

  /**
   * 管理员手动变更订阅状态（用于测试/客服场景/本Sprint无支付网关时的手动操作）。
   * 呼应TASK-106E"完整生命周期"——虽然付款回调本Sprint不存在，
   * 管理员仍可手动触发状态机推进，用于端到端测试验证。
   */
  async adminUpdateSubscriptionStatus(subscriptionId: string, newStatus: SubscriptionStatus) {
    const sub = await this.subscriptionRepo.findById(subscriptionId);
    if (!sub) throw new NotFoundException('订阅记录不存在');

    if (!isValidSubscriptionTransition(sub.status as SubscriptionStatus, newStatus)) {
      throw new BadRequestException(
        `不允许从状态"${sub.status}"跳转到"${newStatus}"`,
      );
    }

    await this.subscriptionRepo.updateStatus(subscriptionId, newStatus);

    if (newStatus === 'expired') {
      const membership = await this.membershipRepo.findActiveForCustomer(sub.customerId);
      if (membership) {
        await this.membershipRepo.updateTier(membership.id, sub.customerId, 'free', null);
        void this.analytics.syncTierToProfile(sub.customerId, 'free');
        this.analytics.recordExpired(sub.customerId, sub.planTier);
      }
    }

    return { updated: true, newStatus };
  }

  // 后台管理员直接查询
  findManyForAdmin(filter: { tier?: string; page: number; pageSize: number }) {
    return this.membershipRepo.findManyForAdmin(filter);
  }

  async getAnalyticsSummary() {
    const [byStatus, byTier] = await Promise.all([
      this.subscriptionRepo.countByStatus(),
      this.subscriptionRepo.countByPlanTier(),
    ]);
    return {
      subscriptionsByStatus: byStatus.map((s) => ({ status: s.status, count: s._count._all })),
      activeByTier: byTier.map((t) => ({ tier: t.planTier, count: t._count._all })),
    };
  }

  private getUpgradeOptions(currentTier: MembershipTier) {
    const currentIndex = TIERS.indexOf(currentTier);
    return TIERS.slice(currentIndex + 1).map((tier) => ({
      tier,
      displayName: TIER_DISPLAY_NAMES[tier],
      // 月/年定价在真实支付Sprint中从Products/ProductPrices表取，
      // 本Sprint不接支付，先用占位价格让UI能跑通
      monthlyPrice: PLACEHOLDER_PRICES[tier].monthly,
      yearlyPrice: PLACEHOLDER_PRICES[tier].yearly,
    }));
  }
}

const TIER_DISPLAY_NAMES: Record<MembershipTier, string> = {
  free: '免费版',
  premium: 'Premium',
  pro: 'Pro',
  enterprise: '企业版',
};

// 占位价格，真实价格在支付Sprint从Products表取
const PLACEHOLDER_PRICES: Record<MembershipTier, { monthly: number; yearly: number }> = {
  free: { monthly: 0, yearly: 0 },
  premium: { monthly: 29, yearly: 288 },
  pro: { monthly: 68, yearly: 648 },
  enterprise: { monthly: 0, yearly: 0 }, // 企业版面议
};
