'use client';
import { useState } from 'react';
import Link from 'next/link';

const QUESTIONS = [
  { id: 'upset',       text: '过去一个月，你是否因为一些意料之外的事情发生而感到心烦意乱？' },
  { id: 'control',     text: '过去一个月，你是否感到难以控制生活中的重要事情？' },
  { id: 'nervous',     text: '过去一个月，你是否感到紧张和压力大？' },
  { id: 'confident',   text: '过去一个月，你是否有信心处理自己的个人问题？' },
  { id: 'going_well',  text: '过去一个月，你是否感到事情进展顺利？' },
  { id: 'cope',        text: '过去一个月，你是否感到无法应对所有你必须做的事情？' },
  { id: 'anger',       text: '过去一个月，你是否能够控制生活中让你感到烦躁的事情？' },
  { id: 'top',         text: '过去一个月，你是否感到自己掌控一切？' },
];

const OPTIONS = [
  { label: '从不', value: 0 },
  { label: '偶尔', value: 1 },
  { label: '有时', value: 2 },
  { label: '经常', value: 3 },
  { label: '总是', value: 4 },
];

// 第4、5、7、8题为正向题，需反向计分
const REVERSE = ['confident', 'going_well', 'anger', 'top'];

const RISK = [
  { max: 13, level: 'low',      label: '压力较低',  color: '#22C55E', bg: '#F0FDF4', desc: '你的压力水平处于健康范围。继续保持良好的生活习惯，定期关注自己的心理状态。' },
  { max: 26, level: 'moderate', label: '中度压力',  color: '#F59E0B', bg: '#FFFBEB', desc: '你正承受一定程度的压力。建议关注压力来源，适当放松，保持规律作息与运动。' },
  { max: 40, level: 'high',     label: '压力较高',  color: '#EF4444', bg: '#FEF2F2', desc: '你的压力水平较高，长期高压可能影响身心健康。建议主动寻求支持，必要时咨询专业人士。' },
];

type Step = 'questions' | 'result' | 'lead';

export default function StressAssessment() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [step, setStep] = useState<Step>('questions');
  const [leadForm, setLeadForm] = useState({ name: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [leadDone, setLeadDone] = useState(false);

  const totalScore = Object.entries(answers).reduce((sum, [id, val]) => {
    return sum + (REVERSE.includes(id) ? 4 - val : val);
  }, 0);
  const risk = RISK.find(r => totalScore <= r.max) ?? RISK[2];

  const answer = (val: number) => {
    const q = QUESTIONS[current];
    setAnswers(prev => ({ ...prev, [q.id]: val }));
    if (current < QUESTIONS.length - 1) setCurrent(c => c + 1);
    else setStep('result');
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
          assessmentType: 'stress',
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
      <main style={{ minHeight:'100vh', background:'#FFF8F0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px' }}>
        <div style={{ width:'100%', maxWidth:560 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
            <Link href="/assessment" style={{ color:'#6B7280', fontSize:14 }}>← 返回</Link>
            <span style={{ fontSize:14, color:'#6B7280' }}>压力水平自评</span>
          </div>
          <div style={{ marginBottom:32 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:13, color:'#6B7280' }}>第 {current+1} 题，共 {QUESTIONS.length} 题</span>
              <span style={{ fontSize:13, color:'#D97706', fontWeight:600 }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height:6, background:'#E5E7EB', borderRadius:3 }}>
              <div style={{ height:'100%', width:`${progress}%`, background:'#D97706', borderRadius:3, transition:'width 0.3s' }} />
            </div>
          </div>
          <div style={{ background:'#fff', borderRadius:20, padding:'40px 36px', boxShadow:'0 2px 24px rgba(0,0,0,0.06)', marginBottom:24 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#D97706', marginBottom:20, letterSpacing:'0.05em' }}>PSS 感知压力量表</div>
            <p style={{ fontSize:18, fontWeight:600, lineHeight:1.6, color:'#1F2937', marginBottom:32 }}>{q.text}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
              {OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => answer(opt.value)}
                  style={{ padding:'12px 4px', background:'#F9FAFB', border:'1.5px solid #E5E7EB', borderRadius:12, fontSize:13, color:'#374151', cursor:'pointer', textAlign:'center', transition:'all 0.15s', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='#FFF7ED'; (e.currentTarget as HTMLElement).style.borderColor='#FDE68A'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='#F9FAFB'; (e.currentTarget as HTMLElement).style.borderColor='#E5E7EB'; }}>
                  <span style={{ fontSize:11, color:'#9CA3AF' }}>{opt.value}</span>
                  <span style={{ fontWeight:500 }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <p style={{ fontSize:12, color:'#9CA3AF', textAlign:'center' }}>结果仅供健康参考，不构成医学诊断。</p>
        </div>
      </main>
    );
  }

  if (step === 'result') {
    return (
      <main style={{ minHeight:'100vh', background:'#FFF8F0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px' }}>
        <div style={{ width:'100%', maxWidth:560 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:'40px 36px', boxShadow:'0 2px 24px rgba(0,0,0,0.06)', marginBottom:20 }}>
            <div style={{ textAlign:'center', marginBottom:32 }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🧠</div>
              <div style={{ fontSize:14, color:'#6B7280', marginBottom:8 }}>压力水平自评结果</div>
              <div style={{ fontSize:36, fontWeight:800, color:risk.color, marginBottom:8 }}>{risk.label}</div>
              <div style={{ display:'inline-block', padding:'6px 20px', background:risk.bg, borderRadius:20, fontSize:14, color:risk.color, fontWeight:600 }}>
                {totalScore} / 40 分
              </div>
            </div>
            <div style={{ marginBottom:28 }}>
              <div style={{ height:12, background:'#E5E7EB', borderRadius:6, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${(totalScore/40)*100}%`, background:risk.color, borderRadius:6 }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontSize:11, color:'#9CA3AF' }}>
                <span>低压力 (0-13)</span><span>中度压力 (14-26)</span><span>高压力 (27+)</span>
              </div>
            </div>
            <p style={{ fontSize:15, color:'#374151', lineHeight:1.7, marginBottom:28, padding:'16px', background:risk.bg, borderRadius:12 }}>
              {risk.desc}
            </p>
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:14, fontWeight:600, color:'#1F2937', marginBottom:12 }}>缓解建议：</div>
              {risk.level === 'low' && (
                <ul style={{ fontSize:14, color:'#374151', lineHeight:2, paddingLeft:20 }}>
                  <li>保持规律运动，每周至少150分钟中等强度活动</li>
                  <li>保持良好的社交连接，与家人朋友定期交流</li>
                  <li>使用Ring1C监测HRV，了解身体压力状态</li>
                </ul>
              )}
              {risk.level === 'moderate' && (
                <ul style={{ fontSize:14, color:'#374151', lineHeight:2, paddingLeft:20 }}>
                  <li>识别主要压力来源，制定改善计划</li>
                  <li>练习冥想或深呼吸，每天10-15分钟</li>
                  <li>保证7-8小时高质量睡眠</li>
                  <li>使用Ring1C监测夜间HRV和恢复度指标</li>
                </ul>
              )}
              {risk.level === 'high' && (
                <ul style={{ fontSize:14, color:'#374151', lineHeight:2, paddingLeft:20 }}>
                  <li>建议寻求专业心理咨询或医疗支持</li>
                  <li>立即减少非必要的工作与社会压力</li>
                  <li>建立规律作息，确保充足睡眠</li>
                  <li>使用Ring1C实时监测压力指数与身体恢复状态</li>
                </ul>
              )}
            </div>
            <button onClick={() => setStep('lead')} style={{ width:'100%', padding:'16px', background:'#D97706', color:'#fff', border:'none', borderRadius:12, fontSize:16, fontWeight:600, cursor:'pointer' }}>
              获取个性化压力管理方案 →
            </button>
            <button onClick={() => { setAnswers({}); setCurrent(0); setStep('questions'); }} style={{ width:'100%', padding:'12px', background:'transparent', color:'#6B7280', border:'none', fontSize:14, cursor:'pointer', marginTop:8 }}>
              重新评估
            </button>
          </div>
          <p style={{ fontSize:12, color:'#9CA3AF', textAlign:'center' }}>以上结果仅供健康参考，不构成医学诊断或治疗建议。</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight:'100vh', background:'#FFF8F0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ width:'100%', maxWidth:480 }}>
        <div style={{ background:'#fff', borderRadius:20, padding:'40px 36px', boxShadow:'0 2px 24px rgba(0,0,0,0.06)' }}>
          {leadDone ? (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
              <div style={{ fontSize:20, fontWeight:700, marginBottom:12 }}>已收到您的信息</div>
              <p style={{ color:'#6B7280', fontSize:14, lineHeight:1.7, marginBottom:28 }}>健康顾问将在24小时内联系您，提供个性化压力管理建议。</p>
              <Link href="/" style={{ display:'block', padding:'14px', background:'#D97706', color:'#fff', borderRadius:12, fontSize:15, fontWeight:600, textAlign:'center' }}>返回首页</Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign:'center', marginBottom:28 }}>
                <div style={{ fontSize:24, marginBottom:8 }}>🧠</div>
                <div style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>获取个性化压力管理方案</div>
                <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.6 }}>留下联系方式，健康顾问将根据您的评估结果（{risk.label}，{totalScore}分）提供专属建议</p>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>姓名</label>
                <input value={leadForm.name} onChange={e => setLeadForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="请输入您的姓名" style={{ width:'100%', padding:'12px 16px', border:'1.5px solid #E5E7EB', borderRadius:10, fontSize:15, outline:'none', boxSizing:'border-box' as any }} />
              </div>
              <div style={{ marginBottom:24 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>手机号</label>
                <input value={leadForm.phone} onChange={e => setLeadForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="请输入手机号" type="tel" style={{ width:'100%', padding:'12px 16px', border:'1.5px solid #E5E7EB', borderRadius:10, fontSize:15, outline:'none', boxSizing:'border-box' as any }} />
              </div>
              <button onClick={submitLead} disabled={submitting || !leadForm.name || !leadForm.phone}
                style={{ width:'100%', padding:'16px', background: submitting ? '#FCD34D' : '#D97706', color:'#fff', border:'none', borderRadius:12, fontSize:16, fontWeight:600, cursor:'pointer' }}>
                {submitting ? '提交中...' : '获取专属方案'}
              </button>
              <button onClick={() => setStep('result')} style={{ width:'100%', padding:'12px', background:'transparent', color:'#9CA3AF', border:'none', fontSize:13, cursor:'pointer', marginTop:4 }}>
                暂不留资，查看结果
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
