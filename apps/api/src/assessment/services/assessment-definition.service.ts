import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AssessmentDefinitionRepository, AssessmentDefinitionData } from '../repositories/assessment-definition.repository';
import { assertAllValidRiskLevels } from '../../common/risk-level.util';

/**
 * 评估定义的"配置管理能力"（TASK-105B）。
 * 创建定义时必须校验scoring_rule的riskBands只使用冻结的四档风险等级——
 * 这是"数据驱动不写死在代码"与"统一风险等级"两条要求的交汇点：
 * 正因为评估逻辑是数据驱动的，才更需要在数据写入时就做强校验，
 * 否则任何人都能通过后台管理界面悄悄引入一个'critical'等级，
 * 绕过代码层面本来想做的限制。
 */
@Injectable()
export class AssessmentDefinitionService {
  constructor(private readonly repo: AssessmentDefinitionRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  async findLatestByType(type: string) {
    const definition = await this.repo.findLatestByType(type);
    if (!definition) {
      throw new NotFoundException(`评估类型"${type}"尚未配置任何定义版本`);
    }
    return definition;
  }

  async findById(id: string) {
    const definition = await this.repo.findById(id);
    if (!definition) throw new NotFoundException('评估定义不存在');
    return definition;
  }

  create(data: AssessmentDefinitionData) {
    this.validateDefinition(data);
    return this.repo.create(data);
  }

  markReviewed(id: string, reviewerId: string) {
    return this.repo.markReviewed(id, reviewerId);
  }

  private validateDefinition(data: AssessmentDefinitionData): void {
    try {
      assertAllValidRiskLevels(data.scoringRule.riskBands.map((b) => b.riskLevel));
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }

    // 校验questionnaire_schema中的题目ID与scoring_rule中引用的questionId一一对应，
    // 防止评估定义出现"问卷里没有这道题，但计分规则却引用了它"这类数据不一致
    const questionIds = new Set(data.questionnaireSchema.questions.map((q) => q.id));
    for (const rule of data.scoringRule.questionWeights) {
      if (!questionIds.has(rule.questionId)) {
        throw new BadRequestException(
          `scoring_rule引用了questionnaire_schema中不存在的题目ID："${rule.questionId}"`,
        );
      }
    }
    for (const rule of data.scoringRule.riskFactors) {
      if (!questionIds.has(rule.questionId)) {
        throw new BadRequestException(
          `riskFactors引用了questionnaire_schema中不存在的题目ID："${rule.questionId}"`,
        );
      }
    }

    // riskBands必须覆盖从0到合理上限的连续区间，不留空隙——
    // 否则会在真正计分时（ScoringEngineService.mapScoreToRiskLevel）才报错，
    // 这类问题应该在定义创建时就被发现
    const sortedBands = [...data.scoringRule.riskBands].sort((a, b) => a.minScore - b.minScore);
    for (let i = 0; i < sortedBands.length - 1; i++) {
      if (sortedBands[i].maxScore + 1 !== sortedBands[i + 1].minScore) {
        throw new BadRequestException(
          `riskBands存在区间空隙或重叠：[${sortedBands[i].minScore}-${sortedBands[i].maxScore}] 与 [${sortedBands[i + 1].minScore}-${sortedBands[i + 1].maxScore}]`,
        );
      }
    }
  }
}
