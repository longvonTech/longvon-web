import type { Metadata } from 'next';
import Link from 'next/link';
import { OrganizationSchema } from '../components/StructuredData';
import { getSiteUrl } from '../lib/site';

export const metadata: Metadata = {
  title: 'MATEYOU · AI数字健康平台 | Ring1C智能戒指',
  description: '搭载AI的数字健康平台，通过Ring1C智能戒指监测睡眠、OSA、HRV、压力、高原健康等六大风险，提供个性化健康自评与知识服务。',
  alternates: { canonical: getSiteUrl() },
  openGraph: {
    title: 'MATEYOU · AI数字健康平台',
    description: '六大健康风险自评 · Ring1C智能戒指 · AI健康知识库',
    url: getSiteUrl(),
    type: 'website',
  },
};

const HEALTH_CAPABILITIES = [
  { icon: '😴', title: '睡眠质量监测', desc: '持续监测睡眠分期与质量，生成睡眠风险参考评分' },
  { icon: '🔬', title: 'OSA风险筛查', desc: '基于STOP-BANG量表的打鼾与呼吸暂停风险自评工具' },
  { icon: '💓', title: 'HRV心率变异性', desc: '通过PPG传感器追踪心率变异性，辅助压力与恢复监测' },
  { icon: '🧠', title: '压力水平自评', desc: '多维度压力指标自评，提供生活方式调整建议参考' },
  { icon: '⛰️', title: '高原适应评估', desc: '旅行/工作前的高原健康风险参考评估' },
  { icon: '⚖️', title: '体重管理风险', desc: '生活方式因素综合评估，输出体重管理风险参考' },
];

const ASSESSMENT_TYPES = [
  { type: 'osa', label: 'OSA风险', icon: '🫁', color: '#E3F0FF' },
  { type: 'sleep', label: '睡眠自评', icon: '😴', color: '#EBF5FF' },
  { type: 'stress', label: '压力自评', icon: '🧠', color: '#FFF3E0' },
  { type: 'weight_loss', label: '减重风险', icon: '⚖️', color: '#F3E5F5' },
  { type: 'diabetes', label: '糖尿病风险', icon: '🩸', color: '#FCE4EC' },
  { type: 'altitude', label: '高原健康', icon: '⛰️', color: '#E8F5E9' },
];

const PARTNER_TYPES = [
  { href: '/partner/hospital', icon: '🏥', title: '医院合作', desc: '临床研究·设备引入·学术合作' },
  { href: '/partner/pharmacy', icon: '💊', title: '药房渠道', desc: '连锁药房·零售铺货·品牌陈列' },
  { href: '/partner/oem', icon: '🏭', title: 'OEM代工', desc: '产能合作·定制开发·品质保障' },
  { href: '/partner/distributor', icon: '🗺️', title: '区域代理', desc: '区域保护·渠道支持·市场推广' },
  { href: '/partner/enterprise', icon: '🏢', title: '企业采购', desc: '员工福利·团建健康·批量定制' },
];

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #EAF1FF 0%, #F5F0FF 100%)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#fff', borderRadius: 20, padding: '6px 16px', fontSize: 13, color: 'var(--color-brand)', fontWeight: 500, marginBottom: 24 }}>
            Ring1C · AI数字健康平台
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
            随时了解你的<br />
            <span style={{ color: 'var(--color-brand)' }}>身体健康状态</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--color-text-secondary)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            MATEYOU 通过 Ring1C 智能戒指持续监测生理数据，配合 AI 评估引擎，为您提供六大健康风险参考评估。
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/assessment" style={{
              padding: '14px 36px', background: 'var(--color-brand)', color: '#fff',
              borderRadius: 10, fontSize: 16, fontWeight: 600,
            }}>
              免费健康自评
            </Link>
            <Link href="/products/ring1c" style={{
              padding: '14px 36px', background: '#fff', color: 'var(--color-brand)',
              borderRadius: 10, fontSize: 16, fontWeight: 600, border: '1.5px solid var(--color-brand)',
            }}>
              了解 Ring1C
            </Link>
          </div>
        </div>
      </section>

      {/* ── Ring1C 产品亮点 ── */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700 }}>Ring1C 智能戒指</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 12 }}>消费级可穿戴健康监测设备，7×24小时伴您左右</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { icon: '📡', title: 'PPG光电传感', desc: '高精度光电血氧与心率监测' },
              { icon: '⏱️', title: '连续7日续航', desc: '单次充电持续7天数据采集' },
              { icon: '💧', title: 'IP68防水', desc: '日常洗手、游泳无忧' },
              { icon: '🔒', title: '数据加密存储', desc: '生理数据本地加密，隐私优先' },
            ].map(f => (
              <div key={f.title} style={{ padding: 24, borderRadius: 12, background: 'var(--color-surface-alt)', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link href="/products/ring1c" style={{
              padding: '12px 32px', background: 'var(--color-text-primary)', color: '#fff',
              borderRadius: 8, fontSize: 15, fontWeight: 500,
            }}>
              查看完整参数 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 核心健康能力 ── */}
      <section style={{ padding: '80px 24px', background: 'var(--color-surface-alt)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700 }}>六大健康监测能力</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 12 }}>
              覆盖中国人群高发健康关注场景，全部结果为风险参考，不构成医学诊断
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {HEALTH_CAPABILITIES.map(cap => (
              <div key={cap.title} style={{ padding: 24, background: '#fff', borderRadius: 12, border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{cap.icon}</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>{cap.title}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{cap.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 六大评估入口 ── */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700 }}>立即开始健康自评</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 12 }}>免费，无需登录，5分钟完成，结果仅供健康参考</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
            {ASSESSMENT_TYPES.map(a => (
              <Link key={a.type} href="/assessment" style={{
                padding: '24px 16px', background: a.color, borderRadius: 12,
                textAlign: 'center', display: 'block',
                border: '1px solid transparent',
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{a.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.label}</div>
              </Link>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 12, marginTop: 24 }}>
            ⚠️ 以上评估为健康风险自评工具，结果仅供参考，不构成医学诊断，不能替代专业医疗意见。
          </p>
        </div>
      </section>

      {/* ── 商业合作 ── */}
      <section style={{ padding: '80px 24px', background: 'var(--color-surface-alt)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700 }}>商业合作</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 12 }}>开放多元合作形式，共建数字健康生态</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {PARTNER_TYPES.map(p => (
              <Link key={p.href} href={p.href} style={{
                padding: 24, background: '#fff', borderRadius: 12,
                border: '1px solid var(--color-border)', display: 'block',
                transition: 'border-color 0.2s',
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{p.title}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>{p.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 底部 CTA ── */}
      <section style={{ padding: '80px 24px', background: 'var(--color-brand)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', color: '#fff' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>开启您的健康自知旅程</h2>
          <p style={{ opacity: 0.85, marginBottom: 36, lineHeight: 1.7 }}>
            免费完成六大健康风险自评，获取基于AI分析的个性化健康参考报告。
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/assessment" style={{
              padding: '14px 36px', background: '#fff', color: 'var(--color-brand)',
              borderRadius: 10, fontSize: 16, fontWeight: 700,
            }}>
              免费健康自评
            </Link>
            <Link href="/partner" style={{
              padding: '14px 36px', background: 'rgba(255,255,255,0.15)',
              color: '#fff', borderRadius: 10, fontSize: 16, fontWeight: 600,
              border: '1.5px solid rgba(255,255,255,0.4)',
            }}>
              了解合作方案
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
