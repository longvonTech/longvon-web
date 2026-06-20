'use client';

/**
 * Customer Dashboard——呼应TASK-106G。
 * 本页面为Client Component（需要用访问令牌调用API），
 * 实际项目中会从Cookie/sessionStorage取accessToken，
 * 本Sprint用占位演示数据确保页面能正确渲染，
 * 真实Token传递机制在Auth集成Sprint实现。
 *
 * 合规检查（TASK-106K）：
 * 展示会员Tier/权益/升级CTA，无任何医疗/疗效/诊断类文案 ✓
 */

import { useState, useEffect } from 'react';
import { PaywallOverlay } from '../../components/membership/PaywallOverlay';
import type { MembershipDashboard } from '../../lib/membership-api';

// 占位演示数据——真实数据从API取（需要auth，本Sprint先用演示数据）
const DEMO_DATA: MembershipDashboard = {
  tier: 'free',
  tierDisplayName: '免费版',
  expiresAt: null,
  paymentStatus: 'none',
  subscription: null,
  capabilities: ['assessment.basicResult'],
  upgradeOptions: [
    { tier: 'premium', displayName: 'Premium', monthlyPrice: 29, yearlyPrice: 288 },
    { tier: 'pro', displayName: 'Pro', monthlyPrice: 68, yearlyPrice: 648 },
  ],
};

export default function DashboardPage() {
  const [data] = useState<MembershipDashboard>(DEMO_DATA);
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <main style={{ maxWidth: 760, margin: '60px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 600 }}>我的健康中心</h1>

      {/* 会员状态卡片 */}
      <div style={{
        marginTop: 28,
        padding: 24,
        background: '#f8f9ff',
        borderRadius: 12,
        border: '1px solid #e0e4f0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: '#888' }}>当前会员等级</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{data.tierDisplayName}</div>
            {data.expiresAt && (
              <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                有效期至 {new Date(data.expiresAt).toLocaleDateString('zh-CN')}
              </div>
            )}
          </div>
          {data.tier === 'free' && (
            <button
              onClick={() => setShowPaywall(true)}
              style={{
                padding: '9px 20px',
                background: '#0066cc',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              升级会员
            </button>
          )}
        </div>
      </div>

      {/* 权益列表 */}
      <div style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>当前权益</h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li style={capItem}>✓ 六大健康风险自评（每类）</li>
          <li style={capItem}>✓ 基础评估结果查看</li>
          {data.capabilities.includes('assessment.fullResult') && (
            <li style={capItem}>✓ 完整评估建议</li>
          )}
          {data.capabilities.includes('assessment.trendAnalysis') && (
            <li style={capItem}>✓ 历史趋势分析</li>
          )}
          {data.capabilities.includes('report.pdf') && (
            <li style={capItem}>✓ PDF报告导出</li>
          )}
        </ul>
      </div>

      {/* 未解锁能力引导 */}
      {data.tier === 'free' && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>解锁更多功能</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={featureCard} onClick={() => setShowPaywall(true)}>
              <div style={{ fontWeight: 500 }}>📋 完整评估建议</div>
              <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>需要 Premium</div>
            </div>
            <div style={featureCard} onClick={() => setShowPaywall(true)}>
              <div style={{ fontWeight: 500 }}>📈 历史趋势分析</div>
              <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>需要 Pro</div>
            </div>
          </div>
        </div>
      )}

      {/* Paywall */}
      {showPaywall && (
        <div style={{ marginTop: 32 }}>
          <PaywallOverlay
            requiredTier="premium"
            featureName="完整评估建议"
            onUpgrade={() => alert('支付功能将在后续版本开放，如需了解企业版请访问商业合作页面')}
          />
        </div>
      )}

      {/* 订阅历史 */}
      {data.subscription && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>当前订阅</h2>
          <div style={{ padding: 16, border: '1px solid #eee', borderRadius: 8, fontSize: 14, color: '#555' }}>
            <div>计划：{data.subscription.planTier} · {data.subscription.billingCycle === 'monthly' ? '月付' : '年付'}</div>
            <div style={{ marginTop: 4 }}>状态：{data.subscription.status}</div>
            <div style={{ marginTop: 4 }}>
              到期时间：{new Date(data.subscription.currentPeriodEnd).toLocaleDateString('zh-CN')}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const capItem: React.CSSProperties = {
  padding: '8px 12px',
  background: '#f0fff4',
  borderRadius: 6,
  fontSize: 14,
  color: '#2e7d32',
};

const featureCard: React.CSSProperties = {
  padding: 16,
  border: '1px solid #e0e4f0',
  borderRadius: 8,
  cursor: 'pointer',
  background: '#fff',
};
