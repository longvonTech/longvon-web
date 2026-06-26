import { Controller, ForbiddenException, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../identity/guards/jwt-auth.guard';
import { CurrentUser } from '../../../identity/decorators/current-user.decorator';
import { AppJwtPayload } from '../../../identity/jwt-payload.types';
import { TierGuard, RequiresCapability } from '../../guards/tier.guard';
import { AssessmentSessionService } from '../../../assessment/services/assessment-session.service';
import { MembershipService } from '../../services/membership.service';
import { checkCapability, MembershipTier } from '../../tier-capability-matrix';

/**
 * Assessment × Membership 集成端点（TASK-106D）。
 *
 * 架构取舍说明（重要，呼应"不得修改Assessment Engine核心逻辑"的要求）：
 * AssessmentModule内部没有任何Membership相关代码——ScoringEngineService计算结果时
 * 不知道也不在乎用户是什么Tier，它只负责按规则计算出完整的score/riskLevel/
 * recommendations/riskFactors/nextActions/disclaimer。
 *
 * "权限层"完全在本Controller里：
 * - 读取完整结果后，根据用户Tier决定返回哪些字段
 * - Free用户：返回score + riskLevel + disclaimer（基础结果）
 * - Premium以上：额外返回recommendations（完整建议）
 * - Pro以上：额外返回nextActions + riskFactors（完整结果+趋势/行动）
 * - Enterprise：预留enterpriseReport入口
 *
 * 这样的分层让"调整权限规则"只需要改capability-matrix.ts一个地方，
 * 计分逻辑本身完全不受影响，符合开放/封闭原则。
 */
@Controller('membership/assessment-results')
@UseGuards(JwtAuthGuard, TierGuard)
export class AssessmentMembershipController {
  constructor(
    private readonly sessionService: AssessmentSessionService,
    private readonly membershipService: MembershipService,
  ) {}

  /**
   * 分级返回评估结果——同一条AssessmentResult，根据Tier返回不同粒度的字段。
   * Free: score + riskLevel + disclaimer
   * Premium+: + recommendations
   * Pro+: + nextActions + riskFactors
   */
  @Get(':id')
  @RequiresCapability('assessment.basicResult')
  async getWithTierFiltering(@CurrentUser() user: AppJwtPayload, @Param('id') id: string) {
    if (user.kind !== 'customer') throw new ForbiddenException('该接口仅供C端用户访问');

    const result = await this.sessionService.getById(id, user.sub);
    const recommendations = (result.recommendations ?? {}) as Record<string, unknown>;

    // 查询当前Tier，决定返回字段粒度
    const { tier } = await this.membershipService.getCurrentOrInit(user.sub);
    const canFullResult = checkCapability(tier as MembershipTier, 'assessment.fullResult');
    const canTrend = checkCapability(tier as MembershipTier, 'assessment.trendAnalysis');

    return {
      id: result.id,
      assessmentType: result.assessmentType,
      score: result.score,
      riskLevel: result.riskLevel,
      status: result.status,
      createdAt: result.createdAt,
      // 免责声明始终返回——合规要求，不受Tier限制
      disclaimer: recommendations['disclaimer'] ?? null,
      // Premium以上：完整建议
      recommendations: canFullResult ? (recommendations['recommendations'] ?? null) : null,
      // Pro以上：风险因素+后续行动
      riskFactors: canTrend ? (recommendations['riskFactors'] ?? null) : null,
      nextActions: canTrend ? (recommendations['nextActions'] ?? null) : null,
      // Paywall提示——前端据此决定是否显示升级CTA
      upgradeRequired: !canFullResult
        ? {
            forFullResult: 'premium',
            forTrendAnalysis: 'pro',
          }
        : null,
    };
  }

  /**
   * 历史趋势分析入口（TASK-106D"Pro以上可查看趋势分析"）。
   * 本Sprint只返回历史评估列表，真正的趋势图表留待前端Sprint按设计系统实现。
   */
  @Get()
  @RequiresCapability('assessment.trendAnalysis')
  async getTrendHistory(@CurrentUser() user: AppJwtPayload) {
    if (user.kind !== 'customer') throw new ForbiddenException('该接口仅供C端用户访问');
    return this.sessionService.getHistory(user.sub);
  }
}
