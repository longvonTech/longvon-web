/**
 * Lead来源分类规则。呼应TASK-104F"Lead来源统计"，分类结果用于
 * Lead Source Dashboard基础版。
 *
 * 范围边界（重要）：AI Assistant与Assessment两个分类本Sprint被明确排除范围，
 * 因此这两类的判断逻辑虽然写在这里（检查conversationId/assessmentResultId是否非空），
 * 但实际数据中不会出现——本Sprint没有任何代码路径会创建带有这两个字段的Lead
 * （AI Assistant/Assessment模块都不存在）。这里提前写好判断逻辑而不是等那两个
 * 模块上线后再补，是因为Lead表结构本身已经包含这两个外键字段（早期ERD设计），
 * 分类逻辑提前就位，后续两个模块上线时不需要再改一次Dashboard的统计代码。
 */

export type LeadSourceCategory =
  | 'seo'
  | 'direct'
  | 'referral'
  | 'campaign'
  | 'ai_assistant' // 预留
  | 'assessment'; // 预留

const SEARCH_ENGINE_SOURCES = ['baidu', 'google', 'bing', 'sogou', '360'];

export function classifyLeadSource(lead: {
  utmSource: string | null;
  utmMedium: string | null;
  sourcePage: string | null;
  conversationId: string | null;
  assessmentResultId: string | null;
}): LeadSourceCategory {
  if (lead.assessmentResultId) return 'assessment';
  if (lead.conversationId) return 'ai_assistant';

  const utmSource = lead.utmSource?.toLowerCase() ?? '';
  const utmMedium = lead.utmMedium?.toLowerCase() ?? '';

  // Campaign：有utm_medium且明确是付费/营销活动类型的来源
  if (utmMedium && ['cpc', 'email', 'social', 'display'].includes(utmMedium)) {
    return 'campaign';
  }

  // SEO：来源是搜索引擎，且不是付费campaign（自然搜索结果点击）
  if (SEARCH_ENGINE_SOURCES.some((engine) => utmSource.includes(engine))) {
    return 'seo';
  }

  // Direct：没有任何utm参数，且source_page为空或就是落地页本身（用户直接输入网址/收藏访问）
  if (!utmSource && !lead.sourcePage) {
    return 'direct';
  }

  // 剩余情况（有source_page但不匹配以上规则，如来自其他网站的外链点击）归为Referral
  return 'referral';
}
