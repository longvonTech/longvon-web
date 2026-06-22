'use client';
import { useState } from 'react';
import Link from 'next/link';

const QUESTIONS = [
  {
    id: 'bedtime', text: '过去一个月，您通常几点上床准备睡觉？',
    type: 'choice',
    options: [
      { label: '21:00之前', value: 0 },
      { label: '21:00 - 22:00', value: 0 },
      { label: '22:00 - 23:00', value: 1 },
      { label: '23:00 - 00:00', value: 2 },
      { label: '00:00之后', value: 3 },
    ]
  },
  {
    id: 'sleep_latency', text: '过去一个月，您通常需要多长时间才能入睡？',
    type: 'choice',
    options: [
      { label: '15分钟以内', value: 0 },
      { label: '16 - 30分钟', value: 1 },
      { label: '31 - 60分钟', value: 2 },
      { label: '超过60分钟', value: 3 },
    ]
  },
  {
    id: 'wake_time', text: '过去一个月，您通常几点起床？',
    type: 'choice',
    options: [
      { label: '6:00之前', value: 0 },
      { label: '6:00 - 7:00', value: 0 },
      { label: '7:00 - 8:00', value: 1 },
      { label: '8:00 - 9:00', value: 2 },
      { label: '9:00之后', value: 3 },
    ]
  },
  {
    id: 'sleep_hours', text: '过去一个月，您每晚实际睡眠时间大约是多少小时？',
    type: 'choice',
    options: [
      { label: '7小时以上', value: 0 },
      { label: '6 - 7小时', value: 1 },
      { label: '5 - 6小时', value: 2 },
      { label: '5小时以下', value: 3 },
    ]
  },
  {
    id: 'night_wake', text: '过去一个月，您夜间醒来或早醒的情况有多频繁？',
    type: 'choice',
    options: [
      { label: '每周不足1次', value: 0 },
      { label: '每周1 - 2次', value: 1 },
      { label: '每周3 - 4次', value: 2 },
      { label: '几乎每晚', value: 3 },
    ]
  },
  {
    id: 'sleep_quality', text: '过去一个月，您对自己整体睡眠质量的评价是？',
    type: 'choice',
    options: [
      { label: '很好', value: 0 },
      { label: '还好', value: 1 },
      { label: '较差', value: 2 },
      { label: '很差', value: 3 },
    ]
  },
  {
    id: 'daytime', text: '过去一个月，您白天感到困倦或难以保持精力的情况有多频繁？',
    type: 'choice',
    options: [
      { label: '每周不足1次', value: 0 },
      { label: '每周1 - 2次', value: 1 },
      { label: '每周3 - 4次', value: 2 },
      { label: '几乎每天', value: 3 },
    ]
  },
  {
    id: 'medication', text: '过去一个月，您是否需要借助药物（含安眠药）来帮助睡眠？',
    type: 'choice',
    options: [
      { label: '从未', value: 0 },
      { label: '偶尔（每月1-2次）', value: 1 },
      { label: '有时（每周1-2次）', value: 2 },
      { label: '经常（每周3次以上）', value: 3 },
    ]
  },
  {
    id: 'enthusiasm', text: '过去一个月，您做事情时是否难以保持足够的热情？',
    type: 'choice',
    options: [
      { label: '没有困难', value: 0 },
      { label: '偶有困难', value: 1 },
      { label: '有些困难', value: 2 },
      { label: '非常困难', value: 3 },
    ]
  },
  {
    id: 'snoring', text: '您的同住者是否反映您有打鼾或呼吸暂停的情况？',
    type: 'choice',
    options: [
      { label: '没有或独居', value: 0 },
      { label: '偶尔打鼾', value: 1 },
      { label: '经常打鼾', value: 2 },
      { label: '严重打鼾或呼吸暂停', value: 3 },
    ]
  },
];

const RISK = [
  { max: 4,  level: 'good',     label: '睡眠良好',  color: '#22C55E', bg: '#F0FDF4', desc: '您的睡眠质量良好，继续保持规律作息和健康的睡眠习惯。' },
  { max: 8,  level: 'mild',     label: '轻度问题',  color: '#F59E0B', bg: '#FFFBEB', desc: '您的睡眠质量存在轻度问题，建议关注睡眠卫生，改善作息规律。' },
  { max: 14, level: 'moderate', label: '中度问题',  color: '#F97316', bg: '#FFF7ED', desc: '您的睡眠存在中度问题，建议进行系统的睡眠改善，必要时寻求专业帮助。' },
  { max: 30, level: 'severe',   label: '重度问题',  color: '#EF4444', bg: '#FEF2F2', desc: '您的睡眠质量较差，强烈建议就医进行专业评估，了解是否存在睡眠障碍。' },
];

type Step = 'questions' | 'result' | 'lead';

export default function SleepAssessment() {
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
      await fetch('/api/partner-leads/osa-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: leadForm.name,
          phone: leadForm.phone,
          score: totalScore,
          riskLevel: risk.level,
          assessmentType: 'sleep',
        }),
      });
      setLeadDone(true);
    } catch {}
    setSubmitting(false);
  };

  if (step === 'questions') {
    const q = QUESTIONS[current];
    const progress = (current / QUESTIONS.length) * 100;
    return (
      <main style={{ minHeight: '100vh', background: '#F8FAFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <Link href="/assessment" style={{ color: '#6B7280', fontSize: 14 }}>← 返回</Link>
            <span style={{ fontSize: 14, color: '#6B7280' }}>睡眠质量自评</span>
          </div>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#6B7280' }}>第 {current + 1} 题，共 {QUESTIONS.length} 题</span>
              <span style={{ fontSize: 13, color: '#2563EB', fontWeight: 600 }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: '#2563EB', borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', boxShadow: '0 2px 24px rgba(0,0,0,0.06)', marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2563EB', marginBottom: 20, letterSpacing: '0.05em' }}>PSQI 睡眠质量指数</div>
            <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.6, color: '#1F2937', marginBottom: 28 }}>{q.text}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => answer(opt.value)}
                  style={{ padding: '14px 20px', background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 15, color: '#374151', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.background = '#EFF6FF'; (e.target as HTMLElement).style.borderColor = '#BFDBFE'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.background = '#F9FAFB'; (e.target as HTMLElement).style.borderColor = '#E5E7EB'; }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>结果仅供健康参考，不构成医学诊断。</p>
        </div>
      </main>
    );
  }

  if (step === 'result') {
    return (
      <main style={{ minHeight: '100vh', background: '#F8FAFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', boxShadow: '0 2px 24px rgba(0,0,0,0.06)', marginBottom: 20 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>😴</div>
              <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>睡眠质量自评结果</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: risk.color, marginBottom: 8 }}>{risk.label}</div>
              <div style={{ display: 'inline-block', padding: '6px 20px', background: risk.bg, borderRadius: 20, fontSize: 14, color: risk.color, fontWeight: 600 }}>
                {totalScore} / 30 分
              </div>
            </div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ height: 12, background: '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(totalScore / 30) * 100}%`, background: risk.color, borderRadius: 6 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#9CA3AF' }}>
                <span>良好 (0-4)</span><span>轻度 (5-8)</span><span>中度 (9-14)</span><span>重度 (15+)</span>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginBottom: 28, padding: '16px', background: risk.bg, borderRadius: 12 }}>
              {risk.desc}
            </p>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', marginBottom: 12 }}>改善建议：</div>
              {risk.level === 'good' && (
                <ul style={{ fontSize: 14, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
                  <li>保持固定的睡眠时间，包括周末</li>
                  <li>睡前避免使用手机和电子设备</li>
                  <li>使用Ring1C持续监测睡眠分期和HRV</li>
                </ul>
              )}
              {risk.level === 'mild' && (
                <ul style={{ fontSize: 14, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
                  <li>建立规律的睡前放松程序</li>
                  <li>保持卧室黑暗、安静、凉爽</li>
                  <li>避免睡前4小时摄入咖啡因</li>
                  <li>使用Ring1C监测夜间心率变异性</li>
                </ul>
              )}
              {(risk.level === 'moderate' || risk.level === 'severe') && (
                <ul style={{ fontSize: 14, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
                  <li>建议就医进行专业睡眠评估</li>
                  <li>考虑认知行为治疗失眠（CBT-I）</li>
                  <li>排查睡眠呼吸暂停等潜在问题</li>
                  <li>使用Ring1C实时监测夜间血氧和心率</li>
                </ul>
              )}
            </div>
            <button onClick={() => setStep('lead')} style={{ width: '100%', padding: '16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
              获取个性化睡眠改善方案 →
            </button>
            <button onClick={() => { setScores([]); setCurrent(0); setStep('questions'); }} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#6B7280', border: 'none', fontSize: 14, cursor: 'pointer', marginTop: 8 }}>
              重新评估
            </button>
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>以上结果仅供健康参考，不构成医学诊断或治疗建议。</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', boxShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>
          {leadDone ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>已收到您的信息</div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>我们的睡眠健康顾问将在24小时内联系您，提供个性化睡眠改善建议。</p>
              <Link href="/" style={{ display: 'block', padding: '14px', background: '#2563EB', color: '#fff', borderRadius: 12, fontSize: 15, fontWeight: 600, textAlign: 'center' }}>返回首页</Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>😴</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>获取个性化睡眠改善方案</div>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>留下联系方式，睡眠健康顾问将根据您的评估结果（{risk.label}，{totalScore}分）提供专属建议</p>
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
                {submitting ? '提交中...' : '获取专属睡眠方案'}
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
