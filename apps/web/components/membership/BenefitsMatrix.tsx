'use client';

import type { MembershipTier } from '../../lib/membership-api';

/**
 * Benefits Matrix（权益对比表）——呼应TASK-106F。
 * 合规要求同PaywallOverlay：全部文案为功能性描述，无医疗/疗效/诊断类承诺。
 */
const BENEFIT_ROWS: { label: string; free: boolean; premium: boolean; pro: boolean; enterprise: boolean }[] = [
  { label: '六大健康风险自评', free: true, premium: true, pro: true, enterprise: true },
  { label: '基础评估结果（风险等级）', free: true, premium: true, pro: true, enterprise: true },
  { label: '完整评估建议', free: false, premium: true, pro: true, enterprise: true },
  { label: '历史趋势分析', free: false, premium: false, pro: true, enterprise: true },
  { label: '导出PDF报告', free: false, premium: false, pro: true, enterprise: true },
  { label: '分享评估报告', free: false, premium: true, pro: true, enterprise: true },
  { label: 'AI健康问答（即将上线）', free: false, premium: true, pro: true, enterprise: true },
  { label: '深度AI分析（即将上线）', free: false, premium: false, pro: true, enterprise: true },
  { label: '企业团队管理', free: false, premium: false, pro: false, enterprise: true },
  { label: '专属客户经理', free: false, premium: false, pro: false, enterprise: true },
];

interface Props {
  currentTier?: MembershipTier;
}

export function BenefitsMatrix({ currentTier = 'free' }: Props) {
  const TIERS: MembershipTier[] = ['free', 'premium', 'pro', 'enterprise'];
  const TIER_LABELS = { free: '免费版', premium: 'Premium', pro: 'Pro', enterprise: '企业版' };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            <th style={{ ...headerStyle, textAlign: 'left' }}>权益</th>
            {TIERS.map((tier) => (
              <th key={tier} style={{
                ...headerStyle,
                background: tier === currentTier ? '#e8f0fe' : '#f8f9fa',
              }}>
                {TIER_LABELS[tier]}
                {tier === currentTier && <div style={{ fontSize: 11, color: '#0066cc' }}>当前档位</div>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BENEFIT_ROWS.map((row, i) => (
            <tr key={row.label} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
              <td style={cellStyle}>{row.label}</td>
              {TIERS.map((tier) => (
                <td key={tier} style={{ ...cellStyle, textAlign: 'center' }}>
                  {row[tier] ? <span style={{ color: '#2e7d32' }}>✓</span> : <span style={{ color: '#ccc' }}>—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  padding: '10px 14px',
  background: '#f8f9fa',
  fontWeight: 600,
  textAlign: 'center',
  borderBottom: '2px solid #eee',
};

const cellStyle: React.CSSProperties = {
  padding: '9px 14px',
  borderBottom: '1px solid #f0f0f0',
};
