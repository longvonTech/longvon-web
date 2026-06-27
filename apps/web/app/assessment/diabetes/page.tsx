'use client';
import { useState } from 'react';
import Link from 'next/link';

const ACCENT = '#DC2626';
const ACCENT_LIGHT = '#FEF2F2';

const QUESTIONS = [
  {
    id: 'age',
    text: '您的年龄处于哪个范围？',
    options: [
      { label: '44 岁及以下', value: 0 },
      { label: '45 - 54 岁', value: 1 },
      { label: '55 - 64 岁', value: 2 },
      { label: '65 岁及以上', value: 3 },
    ],
  },
  {
    id: 'bmi',
    text: '您的 BMI（体重指数）处于哪个范围？',
    options: [
      { label: '24 以下（正常）', value: 0 },
      { label: '24.0 - 27.9（超重）', value: 1 },
      { label: '28.0 及以上（肥胖）', value: 2 },
    ],
  },
  {
    id: 'waist',
    text: '您的腰围是否偏大？（男性 ≥90cm / 女性 ≥85cm）',
    options: [
      { label: '否，在正常范围', value: 0 },
      { label: '是，偏大', value: 2 },
      { label: '不确定', value: 1 },
    ],
  },
  {
    id: 'family_history',
    text: '直系亲属中是否有 2 型糖尿病病史？',
    options: [
      { label: '没有', value: 0 },
      { label: '有 1 位', value: 1 },
      { label: '有 2 位及以上', value: 2 },
    ],
  },
  {
    id: 'activity',
    text: '您每周中等强度运动（如快走、游泳）的天数是？',
    options: [
      { label: '3 天以上', value: 0 },
      { label: '1 - 2 天', value: 1 },
      { label: '几乎不运动', value: 2 },
    ],
  },
  {
    id: 'high_sugar_diet',
    text: '您是否经常摄入含糖饮料或精制碳水（白米饭、甜点等）？',
    options: [
      { label: '很少或从不', value: 0 },
      { label: '每周 1 - 2 次', value: 1 },
      { label: '每周 3 次以上', value: 2 },
    ],
  },
  {
    id: 'blood_sugar_history',
    text: '您是否曾被提示血糖偏高，或体检发现空腹血糖异常？',
    options: [
      { label: '没有', value: 0 },
      { label: '有过，但未确诊', value: 1 },
      { label: '已确诊或正在用药', value: 2 },
    ],
  },
  {
    id: 'hypertension',
    text: '您是否有高血压，或正在服用降压药物？',
    options: [
      { label: '没有', value: 0 },
      { label: '有，但未用药', value: 1 },
      { label: '有，且正在用药', value: 2 },
    ],
  },
  {
    id: 'vegetables',
    text: '您是否几乎每天都吃蔬菜和水果？',
    options: [
      { label: '是，大多数日子如此', value: 0 },
      { label: '偶尔', value: 1 },
      { label: '很少', value: 2 },
    ],
  },
  {
    id: 'gestational_history',
    text: '（如适用）您是否有过妊娠糖尿病病史？',
    options: [
      { label: '不适用 / 没有', value: 0 },
      { label: '有过，已恢复', value: 1 },
      { label: '有过，或目前存在', value: 2 },
    ],
  },
];

const MAX_SCORE = 20;

const RISK = [
  { max: 4, level: 'low', label: '低风险', color: '#22C55E', bg: '#F0FDF4', desc: '当前糖尿病相关风险因素较少。建议保持均衡饮食、规律运动，并定期关注血糖相关指标。' },
  { max: 8, level: 'moderate', label: '中风险', color: '#F59E0B', bg: '#FFFBEB', desc: '您存在一定的糖尿病风险因素。建议改善饮食结构，增加运动频率，并在年度体检中关注血糖指标。' },
  { max: 13, level: 'high', label: '较高风险', color: '#F97316', bg: '#FFF7ED', desc: '您的糖尿病风险较高。建议尽快进行空腹血糖或糖化血红蛋白检测，并咨询医生评估具体情况。' },
  { max: MAX_SCORE, level: 'very_high', label: '高风险', color: '#EF4444', bg: '#FEF2F2', desc: '您的糖尿病风险较高。建议尽快预约医生进行专业血糖检测，不要自行判断或用药。' },
];

type Step = 'questions' | 'result' | 'lead';

export default function DiabetesAssessment() {
  const [scores, setScores] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [step, setStep] = useState<Step>('questions');
  const [leadForm, setLeadForm] = useState({ name: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [leadDone, setLeadDone] = useState(false);

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const risk = RISK.find(r => totalScore <= r.max) ?? RISK[3];

  const answer = (score: number) => {
    const newScores = [...scores, score];
    setScores(newScores);
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
      await fetch('/api/assessment/diabetes-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: leadForm.name,
          phone: leadForm.phone,
          score: totalScore,
          riskLevel: risk.level,
        }),
      });
      setLeadDone(true);
    } catch {
      /* ignore */
    }
    setSubmitting(false);
  };

  if (step === 'questions') {
    const q = QUESTIONS[current];
    const progress = (current / QUESTIONS.length) * 100;
    return (
      <main style={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <Link href="/assessment" style={{ color: '#6B7280', fontSize: 14 }}>← 返回</Link>
            <span style={{ fontSize: 14, color: '#6B7280' }}>糖尿病风险自评</span>
          </div>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#6B7280' }}>第 {current + 1} 题，共 {QUESTIONS.length} 题</span>
              <span style={{ fontSize: 13, color: ACCENT, fontWeight: 600 }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: ACCENT, borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', boxShadow: '0 2px 24px rgba(0,0,0,0.06)', marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT, marginBottom: 20, letterSpacing: '0.05em' }}>糖尿病风险自评</div>
            <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.6, color: '#1F2937', marginBottom: 28 }}>{q.text}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => answer(opt.value)}
                  style={{ padding: '14px 20px', background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 15, color: '#374151', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = ACCENT_LIGHT; e.currentTarget.style.borderColor = '#FCA5A5'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>结果仅供健康参考，不构成医学诊断。糖尿病确诊需通过专业医疗机构的血糖检测完成。</p>
        </div>
      </main>
    );
  }

  if (step === 'result') {
    return (
      <main style={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', boxShadow: '0 2px 24px rgba(0,0,0,0.06)', marginBottom: 20 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🩸</div>
              <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>糖尿病风险自评结果</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: risk.color, marginBottom: 8 }}>{risk.label}</div>
              <div style={{ display: 'inline-block', padding: '6px 20px', background: risk.bg, borderRadius: 20, fontSize: 14, color: risk.color, fontWeight: 600 }}>
                {totalScore} / {MAX_SCORE} 分
              </div>
            </div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ height: 12, background: '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(totalScore / MAX_SCORE) * 100}%`, background: risk.color, borderRadius: 6 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#9CA3AF' }}>
                <span>低 (0-4)</span><span>中 (5-8)</span><span>较高 (9-13)</span><span>高 (14+)</span>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginBottom: 28, padding: '16px', background: risk.bg, borderRadius: 12 }}>
              {risk.desc}
            </p>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', marginBottom: 12 }}>改善建议：</div>
              <ul style={{ fontSize: 14, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
                {risk.level === 'low' && (
                  <>
                    <li>保持现有均衡饮食和规律运动习惯</li>
                    <li>年度体检中关注空腹血糖和糖化血红蛋白</li>
                    <li>使用 Ring1C 持续监测日常活动与代谢相关指标</li>
                  </>
                )}
                {(risk.level === 'moderate' || risk.level === 'high') && (
                  <>
                    <li>减少含糖饮料和精制碳水摄入</li>
                    <li>每周至少 150 分钟中等强度有氧运动</li>
                    <li>建议进行空腹血糖或糖化血红蛋白检测</li>
                    <li>使用 Ring1C 追踪 HRV 与活动量变化</li>
                  </>
                )}
                {risk.level === 'very_high' && (
                  <>
                    <li>建议尽快预约内分泌科或全科门诊</li>
                    <li>进行专业血糖检测，不要自行判断或用药</li>
                    <li>在医生指导下制定饮食与运动计划</li>
                    <li>使用 Ring1C 建立个人健康数据基线</li>
                  </>
                )}
              </ul>
            </div>
            <button type="button" onClick={() => setStep('lead')} style={{ width: '100%', padding: '16px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 980, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
              获取个性化健康管理方案 →
            </button>
            <button type="button" onClick={() => { setScores([]); setCurrent(0); setStep('questions'); }} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#6B7280', border: 'none', fontSize: 14, cursor: 'pointer', marginTop: 8 }}>
              重新评估
            </button>
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>以上结果仅供健康参考，不构成医学诊断或治疗建议。</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', boxShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>
          {leadDone ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>已收到您的信息</div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>我们的健康管理顾问将在 24 小时内联系您，提供个性化健康建议。</p>
              <Link href="/" style={{ display: 'block', padding: '14px', background: ACCENT, color: '#fff', borderRadius: 980, fontSize: 15, fontWeight: 600, textAlign: 'center' }}>返回首页</Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🩸</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>获取个性化健康管理方案</div>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>留下联系方式，顾问将根据您的评估结果（{risk.label}，{totalScore} 分）提供专属建议</p>
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
              <button type="button" onClick={submitLead} disabled={submitting || !leadForm.name || !leadForm.phone}
                style={{ width: '100%', padding: '16px', background: submitting ? '#FCA5A5' : ACCENT, color: '#fff', border: 'none', borderRadius: 980, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
                {submitting ? '提交中...' : '获取专属健康方案'}
              </button>
              <button type="button" onClick={() => setStep('result')} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#9CA3AF', border: 'none', fontSize: 13, cursor: 'pointer', marginTop: 4 }}>
                暂不留资，查看结果
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
