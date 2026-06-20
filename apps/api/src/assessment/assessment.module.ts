import { Module } from '@nestjs/common';
import { ScoringEngineService } from './engine/scoring-engine.service';
import { AssessmentDefinitionRepository } from './repositories/assessment-definition.repository';
import { AssessmentResultRepository } from './repositories/assessment-result.repository';
import { AssessmentDefinitionService } from './services/assessment-definition.service';
import { AssessmentSessionService } from './services/assessment-session.service';
import { AssessmentAnalyticsService } from './services/assessment-analytics.service';
import { AssessmentDefinitionAdminController } from './controllers/admin/assessment-definition-admin.controller';
import { AssessmentComplianceReviewController } from './controllers/admin/assessment-compliance-review.controller';
import { AssessmentController } from './controllers/customer/assessment.controller';

/**
 * Assessment Domain模块——呼应TASK-105范围声明。
 *
 * 架构上最重要的一点：ScoringEngineService是**唯一一个**计分服务，
 * 不存在OsaAssessmentService/SleepAssessmentService等六个并行的Service类。
 * OSA/Sleep/Stress/WeightLoss/Diabetes/Altitude六大评估模块的"实现"
 * 体现为Assessments表中六条不同的定义数据（由
 * packages/database/prisma/seed.ts写入），不是六份并行代码。
 * 这是Sprint任务书"Assessment Engine必须是平台级能力"
 * "禁止为每个评估单独实现一套逻辑"的直接代码体现。
 *
 * 不依赖、不引用Membership/Subscription/Payment/AI Assistant/HealthMetrics/
 * HealthRiskProfiles——呼应TASK-105本Sprint禁止事项。
 */
@Module({
  controllers: [
    AssessmentController,
    AssessmentDefinitionAdminController,
    AssessmentComplianceReviewController,
  ],
  providers: [
    ScoringEngineService,
    AssessmentDefinitionRepository,
    AssessmentResultRepository,
    AssessmentDefinitionService,
    AssessmentSessionService,
    AssessmentAnalyticsService,
  ],
  // 导出AssessmentSessionService供MembershipModule的Assessment×Membership集成层使用；
  // 不导出底层Repository——外部模块只应通过Service访问Assessment数据，
  // 不应该直接操作AssessmentResult/AssessmentDefinition的数据访问层。
  exports: [AssessmentSessionService],
})
export class AssessmentModule {}
