export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RingColorSwitcher } from '../components/RingColorSwitcher';
import { HeroSection } from '../components/HeroSection';
import { OrganizationSchema } from '../components/StructuredData';
import { getSiteUrl } from '../lib/site';

export const metadata: Metadata = {
  title: 'MATEYOU Ring1C · AI健康智能戒指',
  description: '不只是智能戒指。MATEYOU Ring1C 是你的个人健康智能系统。71+ 健康指标，睡眠、心脏、压力、血氧、OSA 风险全面监测。',
  alternates: { canonical: getSiteUrl() },
};

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .h1{animation:fadeUp 1s ease forwards}
        .h2{animation:fadeUp 1s ease 0.2s forwards;opacity:0}
        .h3{animation:fadeUp 1s ease 0.4s forwards;opacity:0}
      `}</style>

      <HeroSection />

      <section style={{ background:'#0A0A0A', padding:'120px 24px', textAlign:'center' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <p style={{ fontSize:13, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#4B5563', marginBottom:16 }}>Health Intelligence Platform</p>
          <p style={{ fontSize:'clamp(100px,16vw,160px)', fontWeight:800, letterSpacing:'-0.05em', color:'#fff', lineHeight:1, margin:'0 0 8px' }}>71<span style={{ color:'#3B82F6' }}>+</span></p>
          <p style={{ fontSize:24, color:'#9CA3AF', marginBottom:48 }}>健康监测指标，持续追踪</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            {['睡眠智能','心脏智能','血氧监测','压力指数','运动追踪','OSA风险筛查'].map(f => (
              <span key={f} style={{ padding:'8px 20px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:980, fontSize:14, color:'#9CA3AF', background:'rgba(255,255,255,0.04)' }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', minHeight:'auto' }}>
        <div style={{ position:'relative', minHeight:500 }}>
          <img src="/images/ring1c/White-45-Right.jpg" alt="睡眠监测" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        </div>
        <div style={{ background:'#fff', display:'flex', alignItems:'center', padding:'clamp(32px,6vw,80px) clamp(20px,5vw,64px)' }}>
          <div>
            <p style={{ fontSize:12, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#9CA3AF', marginBottom:20 }}>Sleep Intelligence</p>
            <h2 style={{ fontSize:'clamp(26px,4vw,52px)', fontWeight:800, letterSpacing:'-0.02em', lineHeight:1.1, color:'#1D1D1F', marginBottom:24 }}>睡眠，<br />是身体愈合的时刻</h2>
            <p style={{ fontSize:18, color:'#6B7280', lineHeight:1.7, marginBottom:36 }}>Ring1C 持续追踪深睡、浅睡、REM 睡眠分期，生成个性化睡眠质量参考评分。每天早晨，给你一个清晰的睡眠洞察。</p>
            <Link href="/assessment" style={{ fontSize:16, color:'#2563EB', fontWeight:600 }}>免费做睡眠风险自评 →</Link>
          </div>
        </div>
      </section>

      <section style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', minHeight:'auto' }}>
        <div style={{ background:'#0F172A', display:'flex', alignItems:'center', padding:'clamp(32px,6vw,80px) clamp(20px,5vw,64px)' }}>
          <div>
            <p style={{ fontSize:12, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#3B82F6', marginBottom:20 }}>Sleep Apnea Screening</p>
            <h2 style={{ fontSize:'clamp(26px,4vw,52px)', fontWeight:800, letterSpacing:'-0.02em', lineHeight:1.1, color:'#fff', marginBottom:24 }}>数百万人在睡眠中<br />停止呼吸，却浑然不觉</h2>
            <p style={{ fontSize:18, color:'#94A3B8', lineHeight:1.7, marginBottom:12 }}>Ring1C 内置基于 STOP-BANG 量表的 OSA 风险评估，结合夜间血氧与心率数据，提供睡眠呼吸暂停风险参考评分。</p>
            <p style={{ fontSize:12, color:'#475569', marginBottom:36 }}>*结果仅供参考，不构成医学诊断</p>
            <Link href="/assessment" style={{ fontSize:16, color:'#60A5FA', fontWeight:600 }}>做 OSA 风险自评 →</Link>
          </div>
        </div>
        <div style={{ position:'relative', minHeight:500 }}>
          <img src="/images/ring1c/Blue-45-Left.jpg" alt="OSA监测" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        </div>
      </section>

      <section style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', minHeight:'auto' }}>
        <div style={{ position:'relative', overflow:'hidden' }}>
          <img src="/images/ring1c/Pink-45-Left.jpg" alt="心率" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.2) 50%,transparent 100%)' }} />
          <div style={{ position:'absolute', bottom:48, left:48, right:48 }}>
            <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', marginBottom:12 }}>Heart Intelligence</p>
            <h3 style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:12, letterSpacing:'-0.01em' }}>心脏从不停歇</h3>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>每天超过 10 万次心跳，全程追踪 HRV 心率变异性，了解心脏健康基线。</p>
          </div>
        </div>
        <div style={{ position:'relative', overflow:'hidden' }}>
          <img src="/images/ring1c/Black-45-Right.jpg" alt="压力" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.3) 50%,transparent 100%)' }} />
          <div style={{ position:'absolute', bottom:48, left:48, right:48 }}>
            <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', marginBottom:12 }}>Stress Intelligence</p>
            <h3 style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:12, letterSpacing:'-0.01em' }}>压力不是你的敌人</h3>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>基于 HRV 数据实时生成压力指数参考，识别高压时刻，做出更好的恢复决策。</p>
          </div>
        </div>
      </section>

      <section style={{ background:'#0A0A0A', padding:'clamp(60px,8vw,120px) 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'clamp(32px,5vw,80px)', alignItems:'center' }}>
          <div>
            <p style={{ fontSize:12, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#4B5563', marginBottom:20 }}>Product Design</p>
            <h2 style={{ fontSize:'clamp(26px,4vw,52px)', fontWeight:800, letterSpacing:'-0.02em', lineHeight:1.1, color:'#fff', marginBottom:48 }}>极致轻薄，<br />高端工艺</h2>
            {[['约 4g','超轻设计，佩戴忘我'],['氧化锆陶瓷','高端外壳，触感温润'],['IP68','游泳洗澡全程无忧'],['7天续航','单次充电持续一周'],['多波长PPG','高精度生理数据采集']].map(([v,d]) => (
              <div key={v} style={{ display:'flex', justifyContent:'space-between', padding:'16px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize:16, fontWeight:600, color:'#fff' }}>{v}</span>
                <span style={{ fontSize:14, color:'#6B7280' }}>{d}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'center' }}>
            <img src="/images/ring1c/Black.jpg" alt="Ring1C 曜石黑" style={{ width:'100%', maxWidth:420, objectFit:'contain' }} />
          </div>
        </div>
      </section>

      <section style={{ background:'#fff', padding:'clamp(60px,8vw,120px) 24px' }}>
        <div style={{ maxWidth:980, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:12, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#9CA3AF', marginBottom:20 }}>Business Partnership</p>
          <h2 style={{ fontSize:'clamp(40px,5vw,64px)', fontWeight:800, letterSpacing:'-0.03em', color:'#1D1D1F', marginBottom:20 }}>共建数字健康生态</h2>
          <p style={{ fontSize:20, color:'#6B7280', maxWidth:500, margin:'0 auto 60px' }}>面向医院、药房、OEM代工、区域代理及企业客户开放多元合作形式</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16, marginBottom:56 }}>
            {[{href:'/partner/hospital',icon:'🏥',title:'医院合作',sub:'临床研究·设备引入'},{href:'/partner/pharmacy',icon:'💊',title:'药房渠道',sub:'铺货·品牌陈列'},{href:'/partner/oem',icon:'🏭',title:'OEM代工',sub:'产能·定制开发'},{href:'/partner/distributor',icon:'🗺️',title:'区域代理',sub:'区域保护·渠道'},{href:'/partner/enterprise',icon:'🏢',title:'企业采购',sub:'员工福利·批量'}].map(p => (
              <Link key={p.href} href={p.href} style={{ background:'#F9FAFB', borderRadius:20, padding:'28px 16px', display:'block', border:'1px solid #F3F4F6' }}>
                <div style={{ fontSize:32, marginBottom:12 }}>{p.icon}</div>
                <div style={{ fontWeight:600, fontSize:15, color:'#1D1D1F', marginBottom:6 }}>{p.title}</div>
                <div style={{ fontSize:12, color:'#9CA3AF' }}>{p.sub}</div>
              </Link>
            ))}
          </div>
          <Link href="/partner" style={{ display:'inline-block', padding:'17px 52px', background:'#1D1D1F', color:'#fff', borderRadius:980, fontSize:17, fontWeight:700 }}>提交合作申请</Link>
        </div>
      </section>
    </>
  );
}
