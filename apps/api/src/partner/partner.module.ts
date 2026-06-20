import { Module } from '@nestjs/common';
import { LeadRepository } from './repositories/lead.repository';
import { PartnerRepository } from './repositories/partner.repository';
import { LeadService } from './services/lead.service';
import { PartnerService } from './services/partner.service';
import { LeadAnalyticsService } from './services/lead-analytics.service';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { LeadAdminController } from './controllers/admin/lead-admin.controller';
import { PartnerAdminController } from './controllers/admin/partner-admin.controller';
import { LeadCaptureController } from './controllers/public/lead-capture.controller';

// 呼应TASK-104范围声明：本模块仅实现Partner Domain（Leads/Partners/LeadNotes）。
// 不依赖、不引用AI Assistant/Assessment Engine/Membership/Payments/Subscriptions/
// HealthMetrics/HealthRiskEngine——Lead.conversationId/assessmentResultId等
// Prisma Schema里已存在但跨域的字段，本模块代码不主动写入也不依赖其被填充
// （唯一例外是lead-source-classifier.util.ts里读取这两个字段用于来源分类预留位，
// 这是只读判断，不构成对那两个Domain的功能依赖）。
@Module({
  controllers: [LeadAdminController, PartnerAdminController, LeadCaptureController],
  providers: [
    LeadRepository,
    PartnerRepository,
    LeadService,
    PartnerService,
    LeadAnalyticsService,
    RateLimitGuard,
  ],
})
export class PartnerModule {}
