/**
 * 评估引擎的数据驱动契约类型。
 *
 * 这是TASK-105整个Sprint最重要的一份文件：OSA/Sleep/Stress/WeightLoss/Diabetes/
 * Altitude六大评估**不会**各自有一份独立的TypeScript实现，它们的全部差异
 * （问卷长什么样、怎么计分、结果文案怎么写）都通过本文件定义的JSON结构
 * 表达为Assessments表里的三个JSONB字段（questionnaire_schema/scoring_rule/
 * result_template），由唯一一套引擎代码（scoring-engine.service.ts）解释执行。
 * 呼应Sprint任务书"禁止为每个评估单独实现一套逻辑"这一架构原则。
 */

import { RiskLevel } from '../../common/risk-level.util';

// ---------------------------------------------------------
// questionnaire_schema：问卷结构定义
// ---------------------------------------------------------

export type QuestionType = 'single_choice' | 'multi_choice' | 'numeric' | 'boolean';

export interface QuestionOption {
  value: string;
  label: string;
}

export interface QuestionDefinition {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  options?: QuestionOption[]; // single_choice/multi_choice必填
  min?: number; // numeric类型可选的范围校验
  max?: number;
}

export interface QuestionnaireSchema {
  questions: QuestionDefinition[];
}

// ---------------------------------------------------------
// scoring_rule：计分与风险分级规则
// ---------------------------------------------------------

export interface OptionWeight {
  // 单选/多选题：每个选项对应的分值；数值题：每个区间对应的分值（见numericBands）
  [optionValue: string]: number;
}

export interface NumericBand {
  min: number; // 含
  max: number; // 含
  points: number;
}

export interface QuestionWeightRule {
  questionId: string;
  optionWeights?: OptionWeight; // single_choice/multi_choice用
  numericBands?: NumericBand[]; // numeric用
  booleanWeights?: { true: number; false: number }; // boolean用
}

export interface RiskBand {
  minScore: number; // 含
  maxScore: number; // 含
  riskLevel: RiskLevel; // 必须是risk-level.util.ts冻结的四档之一
}

export interface RiskFactorRule {
  questionId: string;
  // single_choice/multi_choice/boolean类型题目用：命中这些选项值即认为该因素成立
  triggerValues?: string[];
  // numeric类型题目用：数值落在该范围内即认为该因素成立（两个边界均为可选，缺省表示不限）
  numericThreshold?: { min?: number; max?: number };
  factorLabel: string; // 面向用户展示的风险因素描述（呼应TASK-105K的Key Findings）
}

export interface ScoringRule {
  questionWeights: QuestionWeightRule[];
  riskBands: RiskBand[];
  riskFactors: RiskFactorRule[];
}

// ---------------------------------------------------------
// result_template：结果文案模板（按风险等级区分文案，而不是按评估类型写死在代码里）
// ---------------------------------------------------------

export interface ResultTemplate {
  // 呼应TASK-105K"统一结果页模型"：Score/RiskLevel/KeyFindings/Recommendations/
  // Disclaimer/NextActions六个组成部分，全部评估类型共用同一个结构
  scoreLabel: string; // 例如"睡眠风险评分"，不同评估类型展示名不同，但结构相同
  recommendationsByRiskLevel: Record<RiskLevel, string[]>;
  nextActionsByRiskLevel: Record<RiskLevel, string[]>;
  disclaimer: string; // 固定免责声明文案，呼应TASK-105E等"禁止诊断结论"的合规要求
}

// ---------------------------------------------------------
// 提交答案的结构（来自客户端）
// ---------------------------------------------------------

export type AnswerValue = string | string[] | number | boolean;
export type Answers = Record<string, AnswerValue>; // key为questionId
