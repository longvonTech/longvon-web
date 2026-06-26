export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: '六大健康风险自评 · 免费健康评估',
  description: '免费完成OSA风险、睡眠质量、压力水平、减重风险、糖尿病风险、高原健康六大自评，获取个性化健康参考报告。',
  alternates: { canonical: `${getSiteUrl()}/assessment` },
};

const ASSESSMENTS = [
  {
    type: 'osa',
    href: '/assessment/osa',
    imgSlot: 'assessment-osa',
    imgPath: '/images/assessment/osa.jpg',
    icon: '🫁',
    title: 'OSA风险筛查',
    desc: '基于STOP-BANG量表，评估打鼾与睡眠呼吸暂停风险',
    duration: '约3分钟',
    questions: '8题',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    type: 'sleep',
    href: '/assessment/sleep',
    imgSlot: 'assessment-sleep',
    imgPath: '/images/assessment/sleep.jpg',
    icon: '😴',
    title: '睡眠质量自评',
    desc: '多维度评估睡眠习惯与睡眠质量风险参考',
    duration: '约4分钟',
    questions: '10题',
    color: '#0891B2',
    bg: '#ECFEFF',
  },
  {
    type: 'stress',
    href: '/assessment/stress',
    imgSlot: 'assessment-stress',
    imgPath: '/images/assessment/stress.jpg',
    icon: '🧠',
    title: '压力水平自评',
    desc: '评估近期压力水平，获取生活方式调整建议参考',
    duration: '约3分钟',
    questions: '8题',
    color: '#D97706',
    bg: '#FFFBEB',
  },
  {
    type: 'weight_loss',
    href: '/assessment/weight-loss',
    imgSlot: 'assessment-weight',
    imgPath: '/images/assessment/weight.jpg',
    icon: '⚖️',
    title: '减重风险评估',
    desc: '综合生活方式因素，评估体重管理相关风险',
    duration: '约5分钟',
    questions: '12题',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    type: 'diabetes',
    href: '/membership',
    imgSlot: 'assessment-diabetes',
    imgPath: '/images/assessment/diabetes.jpg',
    icon: '🩸',
    title: '糖尿病风险自评',
    desc: '基于生活方式与基础指标的糖尿病风险参考评估',
    duration: '约4分钟',
    questions: '10题',
    color: '#DC2626',
    bg: '#FEF2F2',
  },
  {
    type: 'altitude',
    href: '/membership',
    imgSlot: 'assessment-altitude',
    imgPath: '/images/assessment/altitude.jpg',
    icon: '⛰️',
    title: '高原健康评估',
    desc: '旅行或工作前的高原适应风险参考评估',
    duration: '约3分钟',
    questions: '7题',
    color: '#059669',
    bg: '#ECFDF5',
  },
];

export default function AssessmentPage() {
  return (
    <main style={{ background: '#F8FAFF', minHeight: '100vh' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 16 }}>
            HEALTH ASSESSMENT
          </p>
          <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#1D1D1F', marginBottom: 16 }}>
            六大健康风险自评
          </h1>
          <p style={{ fontSize: 17, color: '#6B7280', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            免费、匿名、5分钟内完成。结果仅供健康参考，不构成医学诊断。
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {ASSESSMENTS.map(a => (
            <div key={a.type} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: 180, background: a.bg, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 56 }}>{a.icon}</span>
                </div>
                <img
                  src={a.imgPath}
                  alt={a.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.3)', borderRadius: 6, padding: '2px 8px', fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
                  {a.imgSlot}
                </div>
              </div>

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1D1D1F', marginBottom: 8 }}>{a.title}</h2>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, flex: 1, marginBottom: 16 }}>{a.desc}</p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  <span style={{ fontSize: 12, color: '#6B7280', background: '#F3F4F6', padding: '4px 10px', borderRadius: 6 }}>{a.duration}</span>
                  <span style={{ fontSize: 12, color: '#6B7280', background: '#F3F4F6', padding: '4px 10px', borderRadius: 6 }}>{a.questions}</span>
                </div>
                <Link href={a.href} style={{
                  display: 'block', textAlign: 'center',
                  padding: '12px', background: a.color, color: '#fff',
                  borderRadius: 12, fontSize: 15, fontWeight: 600,
                }}>
                  开始自评
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, padding: '20px 24px', background: '#FFF8E1', borderRadius: 14, border: '1px solid #FFE082' }}>
          <p style={{ fontSize: 13, color: '#7B6000', lineHeight: 1.7 }}>
            <strong>重要声明：</strong>以上全部评估工具为健康风险自评参考，结果仅供个人健康参考使用，
            不构成任何医学诊断意见，不能替代医疗机构的专业诊断和治疗。
            如您对评估结果有任何疑虑或出现健康症状，请及时就医。
          </p>
        </div>
      </div>
    </main>
  );
}
