import { BadRequestException, Injectable } from '@nestjs/common';
import { AssessmentResultRepository } from '../repositories/assessment-result.repository';
import { AssessmentDefinitionService } from './assessment-definition.service';
import { AssessmentAnalyticsService } from './assessment-analytics.service';
import { ScoringEngineService } from '../engine/scoring-engine.service';
import { validateAnswers } from '../engine/answer-validator';
import { Answers, QuestionnaireSchema, ResultTemplate, ScoringRule } from '../engine/types';

/**
 * 呼应TASK-105C"Assessment Session Flow"：in_progress → completed状态机，
 * 支持Save Progress / Resume / Submit。状态机本身很简单（只有两个状态，
 * 一次单向转移），但"保存进度可以反复调用、断点续答取的是同一条记录"
 * 这一交互模式需要被正确实现，不是状态机复杂度的问题，是会话生命周期管理的问题。
 */
@Injectable()
export class AssessmentSessionService {
  constructor(
    private readonly resultRepo: AssessmentResultRepository,
    private readonly definitionService: AssessmentDefinitionService,
    private readonly analytics: AssessmentAnalyticsService,
    private readonly scoringEngine: ScoringEngineService,
  ) {}

  async start(customerId: string, assessmentType: string, channel: string) {
    const definition = await this.definitionService.findLatestByType(assessmentType);
    const result = await this.resultRepo.createInProgress(
      customerId,
      assessmentType,
      channel,
      definition.version,
    );
    this.analytics.recordStarted(customerId, assessmentType);
    return result;
  }

  /**
   * Resume——本质上就是"取回一条in_progress状态的记录"，呼应AssessmentResults.status
   * 定义的语义。不单独区分"start a new"与"resume an existing"两套数据模型，
   * Resume只是对同一条记录的GET。
   */
  async resume(id: string, customerId: string) {
    const result = await this.resultRepo.findByIdForCustomer(id, customerId);
    if (result.status !== 'in_progress') {
      throw new BadRequestException('该评估已完成，无法继续答题（如需重新评估请发起新的评估会话）');
    }
    return result;
  }

  async saveProgress(id: string, customerId: string, partialAnswers: Answers) {
    const result = await this.resultRepo.findByIdForCustomer(id, customerId);
    if (result.status !== 'in_progress') {
      throw new BadRequestException('该评估已完成，无法再保存进度');
    }
    // 合并而非整体覆盖：断点续答场景下，前端可能只传本次新回答的题目，
    // 不要求每次saveProgress都把此前已保存的答案重新传一遍
    const existingAnswers = (result.answers as Answers) ?? {};
    const merged = { ...existingAnswers, ...partialAnswers };
    return this.resultRepo.saveProgress(id, customerId, merged);
  }

  async submit(id: string, customerId: string, finalAnswers: Answers) {
    const result = await this.resultRepo.findByIdForCustomer(id, customerId);
    if (result.status !== 'in_progress') {
      throw new BadRequestException('该评估已完成，不能重复提交');
    }

    const existingAnswers = (result.answers as Answers) ?? {};
    const mergedAnswers = { ...existingAnswers, ...finalAnswers };

    const definition = await this.definitionService.findLatestByType(result.assessmentType);
    // definition的三个JSONB字段在数据库里存储为Prisma.JsonValue（宽泛联合类型），
    // 这里收窄为本引擎的具体接口类型——信任依据是AssessmentDefinitionService.create()
    // 在写入时已经做过结构校验（见validateDefinition），不是无依据的强行断言
    const questionnaireSchema = definition.questionnaireSchema as unknown as QuestionnaireSchema;
    const scoringRule = definition.scoringRule as unknown as ScoringRule;
    const resultTemplate = definition.resultTemplate as unknown as ResultTemplate;

    validateAnswers(questionnaireSchema, mergedAnswers);

    const scoringResult = this.scoringEngine.compute(scoringRule, resultTemplate, mergedAnswers);

    const updated = await this.resultRepo.submit(id, customerId, {
      answers: mergedAnswers,
      score: scoringResult.score,
      riskLevel: scoringResult.riskLevel,
      definitionVersion: definition.version,
      resultBundle: {
        recommendations: scoringResult.recommendations,
        nextActions: scoringResult.nextActions,
        riskFactors: scoringResult.riskFactors,
        disclaimer: scoringResult.disclaimer,
      },
    });

    this.analytics.recordCompleted(customerId, result.assessmentType, scoringResult.riskLevel);
    return updated;
  }

  async getHistory(customerId: string, assessmentType?: string) {
    return this.resultRepo.findHistoryForCustomer(customerId, assessmentType);
  }

  async getById(id: string, customerId: string) {
    return this.resultRepo.findByIdForCustomer(id, customerId);
  }

  /**
   * 扫描长时间未完成的评估会话，标记为Abandoned并发送埋点事件。
   *
   * **重要的真实状态说明**：本方法本身已实现，但本Sprint**没有**接入任何
   * 定时任务调度机制（如`@nestjs/schedule`，该包未安装也未在package.json中声明）
   * 来周期性调用它——也就是说，"Assessment Abandoned"埋点目前只有
   * "如何判定/如何记录"的能力，没有"自动触发"的机制，需要后续Sprint
   * 引入定时任务基础设施后才能真正产生Abandoned事件数据。
   * 这一点已在assessment-engine-review-v1.md中如实登记，不在此处假装已完整闭环。
   */
  async sweepAbandoned(olderThanHours = 24): Promise<number> {
    const stale = await this.resultRepo.findStaleInProgress(olderThanHours);
    for (const session of stale) {
      this.analytics.recordAbandoned(session.customerId, session.assessmentType);
    }
    return stale.length;
  }
}
