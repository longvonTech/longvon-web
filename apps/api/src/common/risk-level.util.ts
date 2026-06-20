/**
 * 全平台风险等级唯一权威定义。
 * 唯一来源依据：/docs/governance/risk-level-freeze-v1.md（TASK-030A冻结）。
 *
 * 任何模块（Assessment/Health Domain等）需要表达风险等级时，必须从本文件
 * import RiskLevel类型与RISK_LEVELS常量，不得在各自模块内重新定义一套
 * （哪怕只是为了"方便"加一个本地的字符串字面量类型）。
 * 这是TASK-105D"统一风险等级引擎"在代码层面的具体落地——
 * "引擎"不只是一个计算分数到等级的函数，更重要的是"全平台只有一处定义"，
 * 防止某个评估模块的开发者在压力大的时候手滑写出'critical'/'warning'这类
 * 未经冻结的等级字符串。
 */

export const RISK_LEVELS = ['low', 'moderate', 'high', 'very_high'] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export function isValidRiskLevel(value: unknown): value is RiskLevel {
  return typeof value === 'string' && (RISK_LEVELS as readonly string[]).includes(value);
}

/**
 * 校验一组候选风险等级字符串（通常来自某个评估定义的scoring_rule.riskBands），
 * 一旦出现冻结清单之外的值，直接抛错而不是静默忽略或自动纠正——
 * 这类错误应该在"创建/编辑评估定义"时就被拦截，而不是留到真正给用户计算结果时才发现。
 */
export function assertAllValidRiskLevels(values: string[]): void {
  const invalid = values.filter((v) => !isValidRiskLevel(v));
  if (invalid.length > 0) {
    throw new Error(
      `检测到未冻结的风险等级取值：${invalid.join(', ')}。允许的取值仅限：${RISK_LEVELS.join(' | ')}`,
    );
  }
}
