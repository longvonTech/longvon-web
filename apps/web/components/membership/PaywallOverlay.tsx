'use client';

/**
 * Paywall Overlay组件——呼应TASK-106F/membership-ux-v1.md。
 *
 * 合规检查（TASK-106K"会员宣传文案"要求）：
 * 本组件的全部文案禁止包含：
 * ①医疗承诺（如"可以预防疾病""帮你治好xx"）
 * ②疗效承诺（如"改善睡眠质量XX%"）
 * ③诊断能力宣传（如"精准诊断你的健康状态"）
 * 允许：功能性权益描述（如"查看完整评估建议""解锁趋势分析"），
 * 这类描述说明的是平台功能，不构成医疗或疗效承诺。
 */

interface Props {
  requiredTier: 'premium' | 'pro' | 'enterprise';
  featureName: string;
  onUpgrade?: () => void;
}

const UPGRADE_BENEFITS: Record<string, string[]> = {
  premium: ['查看完整评估建议', '分享评估报告', '基础AI健康问答（即将上线）'],
  pro: ['查看历史趋势分析', '导出PDF报告', '深度AI分析对话（即将上线）'],
  enterprise: ['企业团队管理', '批量报告导出', '专属客户经理'],
};

const TIER_MONTHLY_PRICE: Record<string, number> = {
  premium: 29,
  pro: 68,
  enterprise: 0, // 面议
};

export function PaywallOverlay({ requiredTier, featureName, onUpgrade }: Props) {
  const benefits = UPGRADE_BENEFITS[requiredTier] ?? [];
  const price = TIER_MONTHLY_PRICE[requiredTier];

  return (
    <div style={{
      position: 'relative',
      padding: 32,
      background: '#f8f9ff',
      borderRadius: 12,
      border: '1px solid #e0e4f0',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
      <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>
        {featureName}
      </h3>
      <p style={{ color: '#666', marginBottom: 20, fontSize: 14 }}>
        该功能需要升级至 {requiredTier === 'enterprise' ? '企业版' : requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} 才能使用
      </p>

      <ul style={{ textAlign: 'left', maxWidth: 260, margin: '0 auto 24px', padding: 0, listStyle: 'none' }}>
        {benefits.map((b) => (
          <li key={b} style={{ padding: '4px 0', fontSize: 14, color: '#444' }}>
            ✓ {b}
          </li>
        ))}
      </ul>

      {price > 0 ? (
        <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>
          ¥{price}/月起
        </p>
      ) : (
        <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>企业版请联系我们获取报价</p>
      )}

      <button
        onClick={onUpgrade}
        style={{
          padding: '10px 28px',
          background: '#0066cc',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 15,
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        升级{requiredTier === 'enterprise' ? '了解详情' : '解锁此功能'}
      </button>
    </div>
  );
}
