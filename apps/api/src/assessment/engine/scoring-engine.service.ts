import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RiskLevel, assertAllValidRiskLevels } from '../../common/risk-level.util';
import {
  Answers,
  AnswerValue,
  QuestionWeightRule,
  ResultTemplate,
  RiskFactorRule,
  ScoringRule,
} from './types';

export interface ScoringResult {
  score: number;
  riskLevel: RiskLevel;
  riskFactors: string[]; // 命中的风险因素描述文案列表
  recommendations: string[];
  nextActions: string[];
  disclaimer: string;
}

/**
 * 评估计分引擎——全平台唯一一套计分代码。
 *
 * 这不是"OSA引擎"或"Sleep引擎"，是同一个AssessmentEngineService处理全部六种评估类型，
 * 区别只在于传入的scoringRule/resultTemplate数据不同。未来新增第七种评估类型
 * （比如某天要加"心血管风险自评"），只需要在Assessments表新插入一行定义数据，
 * **不需要写一行新代码、不需要部署新版本**——这正是Sprint任务书"Assessment Engine
 * 必须是平台级能力"这一架构原则要求的具体效果。
 *
 * 规则引擎而非黑盒AI：本类的全部计算都是确定性的加权求和+区间映射，
 * 给定相同输入永远得到相同输出，且每一步（命中了哪些选项、加了多少分、
 * 落在哪个区间）都可以逐行打印出来供审核，呼应Sprint特别要求
 * "可审核/可追溯/可解释，禁止引入黑盒AI评分模型作为核心判定逻辑"。
 */
@Injectable()
export class ScoringEngineService {
  compute(
    scoringRule: ScoringRule,
    resultTemplate: ResultTemplate,
    answers: Answers,
  ): ScoringResult {
    // 防御性校验：即使是已存在于数据库中的评估定义，计算前依然再校验一次
    // riskBands的风险等级取值，防止后台管理端的Validation被绕过（如直接改库）
    // 而产生未冻结的风险等级字符串流入实际计算结果
    assertAllValidRiskLevels(scoringRule.riskBands.map((b) => b.riskLevel));

    const score = this.computeScore(scoringRule.questionWeights, answers);
    const riskLevel = this.mapScoreToRiskLevel(scoringRule, score);
    const riskFactors = this.computeRiskFactors(scoringRule.riskFactors, answers);

    return {
      score,
      riskLevel,
      riskFactors,
      recommendations: resultTemplate.recommendationsByRiskLevel[riskLevel] ?? [],
      nextActions: resultTemplate.nextActionsByRiskLevel[riskLevel] ?? [],
      disclaimer: resultTemplate.disclaimer,
    };
  }

  private computeScore(rules: QuestionWeightRule[], answers: Answers): number {
    let total = 0;
    for (const rule of rules) {
      const value = answers[rule.questionId];
      if (value === undefined || value === null) continue;
      total += this.scoreForQuestion(rule, value);
    }
    return total;
  }

  private scoreForQuestion(rule: QuestionWeightRule, value: AnswerValue): number {
    if (rule.optionWeights) {
      if (Array.isArray(value)) {
        // 多选题：每个命中的选项分值累加
        return value.reduce((sum, v) => sum + (rule.optionWeights?.[v] ?? 0), 0);
      }
      return rule.optionWeights[String(value)] ?? 0;
    }
    if (rule.numericBands && typeof value === 'number') {
      const band = rule.numericBands.find((b) => value >= b.min && value <= b.max);
      return band?.points ?? 0;
    }
    if (rule.booleanWeights && typeof value === 'boolean') {
      return value ? rule.booleanWeights.true : rule.booleanWeights.false;
    }
    return 0;
  }

  private mapScoreToRiskLevel(scoringRule: ScoringRule, score: number): RiskLevel {
    const band = scoringRule.riskBands.find((b) => score >= b.minScore && score <= b.maxScore);
    if (!band) {
      // riskBands应当覆盖全部可能分数区间，落到这里说明评估定义本身存在缺口
      // ——这是评估定义的数据质量问题，不应该被默默吞掉返回一个猜测的等级
      throw new InternalServerErrorException(
        `分数 ${score} 未落在任何已定义的风险区间内，评估定义的riskBands存在覆盖缺口`,
      );
    }
    return band.riskLevel;
  }

  private computeRiskFactors(rules: RiskFactorRule[], answers: Answers): string[] {
    const factors: string[] = [];
    for (const rule of rules) {
      const value = answers[rule.questionId];
      if (value === undefined || value === null) continue;

      let hit = false;
      if (rule.numericThreshold && typeof value === 'number') {
        const { min, max } = rule.numericThreshold;
        hit = (min === undefined || value >= min) && (max === undefined || value <= max);
      } else if (rule.triggerValues) {
        hit = Array.isArray(value)
          ? value.some((v) => rule.triggerValues!.includes(v))
          : rule.triggerValues.includes(String(value));
      }

      if (hit) factors.push(rule.factorLabel);
    }
    return factors;
  }
}
