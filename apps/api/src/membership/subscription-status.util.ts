/**
 * 订阅状态机定义。
 * 呼应TASK-106E"订阅状态机"与physical-database-freeze-v1.md的CHECK约束。
 *
 * 状态流转图：
 *
 *   ┌─────────┐   续费成功    ┌─────────┐
 *   │  active  │ ──────────▶ │  active  │（自循环）
 *   └──────────┘             └──────────┘
 *        │  支付失败/逾期          │  用户主动取消
 *        ▼                        ▼
 *   ┌──────────┐            ┌──────────┐
 *   │ past_due │            │ canceled │（终态之一）
 *   └──────────┘            └──────────┘
 *        │ 逾期超时未恢复          ▲
 *        ▼                        │
 *   ┌──────────┐                  │（已取消订阅不可直接恢复，需要重新订阅）
 *   │ expired  │（终态之一）
 *   └──────────┘
 *
 * 说明：
 * - 本Sprint不接入真实支付网关（呼应禁止事项），因此active→past_due这条转移
 *   目前只能由后台手动触发（模拟支付失败场景），不会由真实支付回调触发。
 * - canceled/expired均为终态：一旦进入这两个状态，不允许直接迁移到其他状态，
 *   用户如需重新获得会员权益，必须发起新的订阅记录（而不是复用旧记录改状态），
 *   呼应Orders表的独立订单记录设计。
 */

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'expired';
export const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  'active',
  'past_due',
  'canceled',
  'expired',
];

const ALLOWED_TRANSITIONS: Record<SubscriptionStatus, SubscriptionStatus[]> = {
  active: ['past_due', 'canceled'],
  past_due: ['active', 'expired'], // active: 逾期后补缴成功; expired: 逾期超时
  canceled: [], // 终态
  expired: [], // 终态
};

export function isValidSubscriptionTransition(
  from: SubscriptionStatus,
  to: SubscriptionStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isTerminalSubscriptionStatus(status: SubscriptionStatus): boolean {
  return ALLOWED_TRANSITIONS[status].length === 0;
}
