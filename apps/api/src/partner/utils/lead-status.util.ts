/**
 * Lead状态机定义。
 * 呼应TASK-104D"严格状态机，禁止跳转非法状态"——本文件是唯一权威的状态转移规则来源，
 * LeadService对状态变更的校验直接调用本文件的isValidTransition()，不在Service里
 * 另写一套if/else判断逻辑，避免规则散落在多处导致后续不一致。
 *
 * 状态流转图（文本版，正式状态流转图见partner-domain-review-v1.md）：
 *
 *   new ──────┬───────────────────────────────┐
 *    │        │                               │
 *    ▼        ▼                               ▼
 * contacted ─────────┐                       lost（终态）
 *    │                │                        ▲
 *    ▼                ▼                        │
 * qualified ──────────┼────────────────────────┤
 *    │                                          │
 *    ▼                                          │
 * converted（终态）                              │
 *
 * 设计取舍（本Sprint的刻意简化，已在partner-domain-review-v1.md登记）：
 * converted/lost均为终态，不支持"重新打开已流失线索"这类高级CRM场景，
 * 呼应TASK-104E"暂不实现高级CRM"的范围声明——重新打开是一个真实存在的业务需求，
 * 但属于"高级CRM工作流"而非"基础CRM能力"，留待后续Sprint按实际运营反馈决定是否引入。
 */

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'converted', 'lost'];

const ALLOWED_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  new: ['contacted', 'lost'],
  contacted: ['qualified', 'lost'],
  qualified: ['converted', 'lost'],
  converted: [], // 终态
  lost: [], // 终态
};

export function isValidTransition(from: LeadStatus, to: LeadStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getAllowedNextStatuses(from: LeadStatus): LeadStatus[] {
  return ALLOWED_TRANSITIONS[from] ?? [];
}

export function isTerminalStatus(status: LeadStatus): boolean {
  return ALLOWED_TRANSITIONS[status].length === 0;
}
