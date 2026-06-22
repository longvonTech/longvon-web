'use client';
import { useState } from 'react';
import Link from 'next/link';

const QUESTIONS = [
  { id: 'snoring',   text: '您打鼾声音很大吗？（比说话声更响，或隔着关闭的门都能听到）' },
  { id: 'tired',     text: '您白天经常感到疲倦、劳累或嗜睡吗？' },
  { id: 'observed',  text: '有人观察到您在睡眠中停止呼吸吗？' },
  { id: 'pressure',  text: '您是否有高血压，或正在接受高血压治疗？' },
  { id: 'bmi',       text: '您的BMI是否大于35？（BMI=体重kg÷身高m²）' },
  { id: 'age',       text: '您的年龄是否超过50岁？' },
  { id: 'neck',      text: '您的颈围是否大于40cm？' },
  { id: 'gender',    text: '您的性别是男性吗？' },
];

const RISK = [
  { max: 2, level: 'low',      label: '低风险',  color: '#22C55E', bg: '#F0FDF4', desc: '您目前的OSA风险较低。建议保持健康的生活方式，定期关注睡眠质量。' },
  { max: 4, level: 'moderate', label: '中风险',  color: '#F59E0B', bg: '#FFFBEB', desc: '您存在中等程度的OSA风险。建议改善睡眠环境，控制体重，必要时就医咨询。' },
  { max: 8, level: 'high',     label: '高风险',  color: '#EF4444', bg: '#FEF2F2', desc: '您的OSA风险较高，强烈建议尽快就医进行专业睡眠评估，如多导睡眠监测（PSG）。' },
];

type Step = 'questions' | 'result' | 'lead';

export default function OsaAssessment() {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [current, setCurrent] = useState(0);
  const [step, setStep] = useState<Step>('questions');
  const [leadForm, setLeadForm] = useState({ name: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [leadDone, setLeadDone] = useState(false);

  const score = Object.values(answers).filter(v => v === true).length;
  const risk = RISK.find(r => score <= r.max) ?? RISK[2];

  const answer = (val: boolean) => {
    const q = QUESTIONS[current];
    setAnswers(prev => ({ ...prev, [q.id]: val }));
    if (current < QUESTIONS.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setStep('result');
    }
  };

  const submitLead = async () => {
    if (!leadForm.name || !leadForm.phone) return;
    setSubmitting(true);
    try {
      await fetch('/api/partner-leads/osa-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: leadForm.name,
          phone: leadForm.phone,
          remark: `OSA自评结果：${risk.label}（${score}/8分）`,
          cooperationType: 'enterprise',
          sourcePage: '/assessment/osa',
          answers,
          score,
          riskLevel: risk.level,
        }),
      });
      setLeadDone(true);
    } catch {}
    setSubmitting(false);
  };

  if (step === 'questions') {
    const q = QUESTIONS[current];
    const progress = ((current) / QUESTIONS.length) * 100;
    return (
      <main style={{ minHeight: '100vh', background: '#F8FAFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <Link href="/assessment" style={{ color: '#6B7280', fontSize: 14 }}>← 返回</Link>
            <span style={{ fontSize: 14, color: '#6B7280' }}>OSA风险筛查</span>
          </div>
          {/* Progress */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#6B7280' }}>第 {current + 1} 题，共 {QUESTIONS.length} 题</span>
              <span style={{ fontSize: 13, color: '#2563EB', fontWeight: 600 }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: '#2563EB', borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
          </div>
          {/* Question */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', boxShadow: '0 2px 24px rgba(0,0,0,0.06)', marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2563EB', marginBottom: 20, letterSpacing: '0.05em' }}>STOP-BANG 量表</div>
            <p style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.6, color: '#1F2937', marginBottom: 36 }}>{q.text}</p>
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={() => answer(true)} style={{ flex: 1, padding: '16px', background: '#EFF6FF', border: '2px solid #BFDBFE', borderRadius: 12, fontSize: 16, fontWeight: 600, color: '#1D4ED8', cursor: 'pointer', transition: 'all 0.2s' }}>
                是
              </button>
              <button onClick={() => answer(false)} style={{ flex: 1, padding: '16px', background: '#F9FAFB', border: '2px solid #E5E7EB', borderRadius: 12, fontSize: 16, fontWeight: 600, color: '#374151', cursor: 'pointer', transition: 'all 0.2s' }}>
                否
              </button>
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', lineHeight: 1.6 }}>
            结果仅供健康参考，不构成医学诊断。如有健康疑虑请及时就医。
          </p>
        </div>
      </main>
    );
  }

  if (step === 'result') {
    return (
      <main style={{ minHeight: '100vh', background: '#F8FAFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          {/* Result Card */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', boxShadow: '0 2px 24px rgba(0,0,0,0.06)', marginBottom: 20 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🫁</div>
              <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>OSA风险筛查结果</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: risk.color, marginBottom: 8 }}>{risk.label}</div>
              <div style={{ display: 'inline-block', padding: '6px 20px', background: risk.bg, borderRadius: 20, fontSize: 14, color: risk.color, fontWeight: 600 }}>
                {score} / 8 分
              </div>
            </div>
            {/* Score bar */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ height: 12, background: '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(score / 8) * 100}%`, background: risk.color, borderRadius: 6 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#9CA3AF' }}>
                <span>低风险 (0-2)</span><span>中风险 (3-4)</span><span>高风险 (5+)</span>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginBottom: 28, padding: '16px', background: risk.bg, borderRadius: 12 }}>
              {risk.desc}
            </p>
            {/* Recommendations */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', marginBottom: 12 }}>建议行动：</div>
              {risk.level === 'low' && (
                <ul style={{ fontSize: 14, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
                  <li>保持规律作息，避免熬夜</li>
                  <li>控制体重，保持健康BMI</li>
                  <li>侧卧睡眠，避免饮酒</li>
                  <li>建议使用Ring1C持续监测夜间血氧</li>
                </ul>
              )}
              {risk.level === 'moderate' && (
                <ul style={{ fontSize: 14, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
                  <li>建议就医进行专业睡眠评估</li>
                  <li>积极控制体重和血压</li>
                  <li>戒烟戒酒，改善睡眠姿势</li>
                  <li>使用Ring1C监测夜间血氧和心率变化</li>
                </ul>
              )}
              {risk.level === 'high' && (
                <ul style={{ fontSize: 14, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
                  <li>强烈建议尽快就医，进行多导睡眠监测（PSG）</li>
                  <li>配合医生评估是否需要CPAP治疗</li>
                  <li>避免独自驾驶，警惕日间嗜睡</li>
                  <li>使用Ring1C实时监测夜间血氧预警</li>
                </ul>
              )}
            </div>
            <button onClick={() => setStep('lead')} style={{ width: '100%', padding: '16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
              获取个性化健康方案 →
            </button>
            <button onClick={() => { setAnswers({}); setCurrent(0); setStep('questions'); }} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#6B7280', border: 'none', fontSize: 14, cursor: 'pointer', marginTop: 8 }}>
              重新评估
            </button>
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', lineHeight: 1.6 }}>
            以上结果仅供健康参考，不构成医学诊断或治疗建议。
          </p>
        </div>
      </main>
    );
  }

  // Lead capture
  return (
    <main style={{ minHeight: '100vh', background: '#F8FAFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', boxShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>
          {leadDone ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>已收到您的信息</div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
                我们的健康顾问将在24小时内联系您，为您提供个性化的健康管理建议。
              </p>
              <Link href="/" style={{ display: 'block', padding: '14px', background: '#2563EB', color: '#fff', borderRadius: 12, fontSize: 15, fontWeight: 600, textAlign: 'center' }}>
                返回首页
              </Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>获取个性化健康方案</div>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
                  留下联系方式，我们的健康顾问将根据您的评估结果（{risk.label}，{score}分）提供专属建议
                </p>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>姓名</label>
                <input value={leadForm.name} onChange={e => setLeadForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="请输入您的姓名" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>手机号</label>
                <input value={leadForm.phone} onChange={e => setLeadForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="请输入手机号" type="tel" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button onClick={submitLead} disabled={submitting || !leadForm.name || !leadForm.phone}
                style={{ width: '100%', padding: '16px', background: submitting ? '#93C5FD' : '#2563EB', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
                {submitting ? '提交中...' : '获取专属健康方案'}
              </button>
              <button onClick={() => setStep('result')} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#9CA3AF', border: 'none', fontSize: 13, cursor: 'pointer', marginTop: 4 }}>
                暂不留资，查看结果
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
