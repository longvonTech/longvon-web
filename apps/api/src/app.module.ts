import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './common/health/health.controller';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { IdentityModule } from './identity/identity.module';
import { CustomerModule } from './customer/customer.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { SeoModule } from './seo/seo.module';
import { PartnerModule } from './partner/partner.module';
import { AssessmentModule } from './assessment/assessment.module';
import { MembershipModule } from './membership/membership.module';
import { ImageAdminModule } from './image-admin/image-admin.module';
import { GrowthModule } from './growth/growth.module';
import { NewsModule } from './news/news.module';

// Sprint范围声明：
// Sprint 1  = 基础框架 + 基础数据层 + 基础认证体系（Identity+Customer）
// Sprint 2A = Knowledge Domain
// Sprint 2B = SEO Domain
// Sprint 3  = Partner Domain（Leads/Partners/CRM基础能力）
// Sprint 4  = Assessment Engine
// Sprint 5  = Membership Domain（新增MembershipModule：四档Tier/能力矩阵/订阅状态机/
//               Assessment×Membership集成）
// AI Assistant / Payment Gateway / HealthMetrics / HealthRiskProfiles 仍未实现
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RedisModule,
    IdentityModule,
    CustomerModule,
    KnowledgeModule,
    SeoModule,
    PartnerModule,
    AssessmentModule,
    MembershipModule,
    ImageAdminModule,
    GrowthModule,
    NewsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
