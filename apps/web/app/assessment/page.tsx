import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: '六大健康风险自评 · 免费健康评估',
  description: '免费完成OSA风险、睡眠质量、压力水平、减重风险、糖尿病风险、高原健康六大自评，获取AI分析的个性化健康参考报告。结果仅供参考，非医学诊断。',
  alternates: { canonical: `${getSiteUrl()}/assessment` },
};

const ASSESSMENTS = [
  {
    type: 'osa',
    icon: '🫁',
    title: 'OSA风险筛查',
    desc: '基于STOP-BANG量表，评估打鼾与睡眠呼吸暂停风险',
    duration: '约3分钟',
    questions: '8题',
    color: '#E3F0FF',
  },
  {
    type: 'sleep',
    icon: '😴',
    title: '睡眠质量自评',
    desc: '多维度评估睡眠习惯与睡眠质量风险参考',
    duration: '约4分钟',
    questions: '10题',
    color: '#EBF5FF',
  },
  {
    type: 'stress',
    icon: '🧠',
    title: '压力水平自评',
    desc: '评估近期压力水平，获取生活方式调整建议参考',
    duration: '约3分钟',
    questions: '8题',
    color: '#FFF3E0',
  },
  {
    type: 'weight_loss',
    icon: '⚖️',
    title: '减重风险评估',
    desc: '综合生活方式因素，评估体重管理相关风险',
    duration: '约5分钟',
    questions: '12题',
    color: '#F3E5F5',
  },
  {
    type: 'diabetes',
    icon: '🩸',
    title: '糖尿病风险自评',
    desc: '基于生活方式与基础指标的糖尿病风险参考评估',
    duration: '约4分钟',
    questions: '10题',
    color: '#FCE4EC',
  },
  {
    type: 'altitude',
    icon: '⛰️',
    title: '高原健康评估',
    desc: '旅行或工作前的高原适应风险参考评估',
    duration: '约3分钟',
    questions: '7题',
    color: '#E8F5E9',
  },
];

export default function AssessmentPage() {
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>六大健康风险自评</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
          免费、匿名、5分钟内完成。全部评估结果为风险参考，不构成医学诊断，不能替代专业医疗意见。
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {ASSESSMENTS.map(a => (
          <div key={a.type} style={{
            padding: 28, borderRadius: 14, background: a.color,
            border: '1px solid transparent', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{a.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{a.title}</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.6, flex: 1 }}>{a.desc}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16, marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', background: '#fff', padding: '2px 8px', borderRadius: 4 }}>{a.duration}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', background: '#fff', padding: '2px 8px', borderRadius: 4 }}>{a.questions}</span>
            </div>
            {/* 评估交互需要登录态，本Sprint先跳转到会员页引导注册 */}
            <Link href="/membership" style={{
              display: 'block', textAlign: 'center',
              padding: '10px', background: 'var(--color-brand)', color: '#fff',
              borderRadius: 8, fontSize: 14, fontWeight: 600,
            }}>
              开始自评
            </Link>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 48, padding: 20, background: '#FFF8E1',
        borderRadius: 10, border: '1px solid #FFE082',
      }}>
        <p style={{ fontSize: 13, color: '#7B6000', lineHeight: 1.7 }}>
          <strong>重要声明：</strong>以上全部评估工具为健康风险自评参考，结果仅供个人健康参考使用，
          不构成任何医学诊断意见，不能替代医疗机构的专业诊断和治疗。
          如您对评估结果有任何疑虑或出现健康症状，请及时就医。
        </p>
      </div>
    </main>
  );
}
