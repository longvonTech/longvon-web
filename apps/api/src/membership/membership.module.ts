import { Module } from '@nestjs/common';
import { MembershipRepository } from './repositories/membership.repository';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { MembershipService } from './services/membership.service';
import { MembershipAnalyticsService } from './services/membership-analytics.service';
import { TierGuard } from './guards/tier.guard';
import { MembershipCustomerController } from './controllers/customer/membership-customer.controller';
import { MembershipAdminController } from './controllers/admin/membership-admin.controller';
import { AssessmentMembershipController } from './controllers/customer/assessment-membership.controller';
import { AssessmentModule } from '../assessment/assessment.module';

/**
 * Membership Domain模块。
 *
 * 重要架构说明（呼应TASK-106D"不得修改Assessment Engine核心逻辑"）：
 * 本模块导入AssessmentModule，获得AssessmentSessionService的使用权，
 * 用于在AssessmentMembershipController中读取评估结果后做Tier过滤。
 * AssessmentModule本身没有任何Membership代码，依赖方向是单向的：
 *   MembershipModule → AssessmentModule  （正确）
 *   AssessmentModule → MembershipModule  （禁止，永远不应发生）
 *
 * 不依赖、不引用Payment Gateway/AI Assistant/HealthMetrics/HealthRiskProfiles
 * ——呼应TASK-106本Sprint禁止事项。
 */
@Module({
  imports: [AssessmentModule],
  controllers: [
    MembershipCustomerController,
    MembershipAdminController,
    AssessmentMembershipController,
  ],
  providers: [
    MembershipRepository,
    SubscriptionRepository,
    MembershipService,
    MembershipAnalyticsService,
    TierGuard,
  ],
  exports: [
    // 导出MembershipService与TierGuard，供未来AI Assistant等模块使用@RequiresCapability
    MembershipService,
    TierGuard,
  ],
})
export class MembershipModule {}
