/**
 * 会员能力矩阵（Tier Capability Matrix）。
 *
 * 这是TASK-106B/106C的核心产出，也是整个Membership Domain最重要的一个文件。
 *
 * 设计原则（呼应任务书"禁止硬编码权限判断""所有会员能力必须配置化""权限唯一来源"）：
 * ①任何模块需要判断"当前用户Tier能否使用某能力"时，必须从本文件import并调用
 *   `checkCapability()`，不得在Controller/Service内部自己写if(tier==='premium')的判断。
 * ②本文件是SSOT（Single Source of Truth），修改权限规则只改这一个地方。
 * ③能力集合以配置对象（CAPABILITY_MATRIX）而非多处散落的布尔判断表达——
 *   这使得"查看某个Tier能做什么"只需要读一张表，不需要全局搜索代码。
 *
 * 呼应TASK-106D：Assessment × Membership Integration的权限判断
 * 全部通过本文件的`assessment`能力键完成，不在AssessmentModule内部修改核心逻辑。
 */

export const TIERS = ['free', 'premium', 'pro', 'enterprise'] as const;
export type MembershipTier = (typeof TIERS)[number];

/**
 * 全平台能力键清单。
 * 新增能力时在此处声明键名，然后在CAPABILITY_MATRIX中为每个Tier配置true/false，
 * 不得在其他文件中出现"魔术字符串"能力键。
 */
export type CapabilityKey =
  // Assessment能力
  | 'assessment.basicResult' // 查看基础评估结果（风险等级+基础建议）
  | 'assessment.fullResult' // 查看完整建议（含nextActions）
  | 'assessment.trendAnalysis' // 查看历史趋势分析
  | 'assessment.enterpriseReport' // 企业服务入口（预留）
  // AI Assistant能力（预留，本Sprint不实现AI模块，但权限位预先占好）
  | 'ai.basicChat' // 基础AI健康问答
  | 'ai.deepAnalysis' // 深度分析对话
  // 报告能力
  | 'report.pdf' // 导出PDF报告
  | 'report.share' // 分享报告
  // CRM/企业能力
  | 'enterprise.teamManagement' // 企业团队管理（预留）
  | 'enterprise.bulkReport'; // 批量报告（预留）

export const CAPABILITY_MATRIX: Record<MembershipTier, Record<CapabilityKey, boolean>> = {
  free: {
    'assessment.basicResult': true,
    'assessment.fullResult': false,
    'assessment.trendAnalysis': false,
    'assessment.enterpriseReport': false,
    'ai.basicChat': false,
    'ai.deepAnalysis': false,
    'report.pdf': false,
    'report.share': false,
    'enterprise.teamManagement': false,
    'enterprise.bulkReport': false,
  },
  premium: {
    'assessment.basicResult': true,
    'assessment.fullResult': true,
    'assessment.trendAnalysis': false,
    'assessment.enterpriseReport': false,
    'ai.basicChat': true,
    'ai.deepAnalysis': false,
    'report.pdf': false,
    'report.share': true,
    'enterprise.teamManagement': false,
    'enterprise.bulkReport': false,
  },
  pro: {
    'assessment.basicResult': true,
    'assessment.fullResult': true,
    'assessment.trendAnalysis': true,
    'assessment.enterpriseReport': false,
    'ai.basicChat': true,
    'ai.deepAnalysis': true,
    'report.pdf': true,
    'report.share': true,
    'enterprise.teamManagement': false,
    'enterprise.bulkReport': false,
  },
  enterprise: {
    'assessment.basicResult': true,
    'assessment.fullResult': true,
    'assessment.trendAnalysis': true,
    'assessment.enterpriseReport': true,
    'ai.basicChat': true,
    'ai.deepAnalysis': true,
    'report.pdf': true,
    'report.share': true,
    'enterprise.teamManagement': true,
    'enterprise.bulkReport': true,
  },
};

/**
 * 唯一权限判断入口。
 * 返回true表示"该Tier拥有该能力"，false表示"不拥有/需要升级"。
 * 调用方不应自行比较tier字符串或查询矩阵，全部通过本函数。
 */
export function checkCapability(tier: MembershipTier, capability: CapabilityKey): boolean {
  return CAPABILITY_MATRIX[tier]?.[capability] ?? false;
}

/**
 * 返回某Tier拥有的全部能力键列表，用于Dashboard权益展示。
 */
export function listCapabilities(tier: MembershipTier): CapabilityKey[] {
  return (Object.keys(CAPABILITY_MATRIX[tier]) as CapabilityKey[]).filter(
    (key) => CAPABILITY_MATRIX[tier][key],
  );
}

/**
 * Tier层级比较：判断actualTier是否达到requiredTier或以上。
 * 用于"Premium以上可以..."类的范围判断，不要在业务代码里直接比较tier字符串。
 */
export function tierAtLeast(actualTier: MembershipTier, requiredTier: MembershipTier): boolean {
  return TIERS.indexOf(actualTier) >= TIERS.indexOf(requiredTier);
}
