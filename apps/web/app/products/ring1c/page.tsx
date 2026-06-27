export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SizeGuide } from './SizeGuide';
import { getSiteUrl } from '../../../lib/site';
import { HEALTH_METRIC_CATEGORIES, TOTAL_HEALTH_METRICS } from '../../../lib/health-metrics';

export const metadata: Metadata = {
  title: 'Ring1C · 个人健康智能系统 · MATEYOU',
  description: 'MATEYOU Ring1C 智能健康戒指，7大AI健康引擎，71+健康监测指标，睡眠呼吸暂停筛查。',
  alternates: { canonical: `${getSiteUrl()}/products/ring1c` },
};

function Img({ slot, alt, style }: { slot: string; alt: string; style?: React.CSSProperties }) {
  return (
    <div style={{ background:'#1C1C1E', borderRadius:20, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', ...style }}>
      <div style={{ textAlign:'center', padding:40 }}>
        <div style={{ fontSize:40, marginBottom:12, opacity:0.3 }}>🖼</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.2)', fontFamily:'monospace' }}>{slot}</div>
      </div>
    </div>
  );
}

const ENGINES = HEALTH_METRIC_CATEGORIES;

const FEATURES = [
  {
    slug: 'sleep-apnea',
    tag:'OSA Screening', title:'9亿人不知道\n自己停止过呼吸。', desc:'Ring1C 提供20项睡眠呼吸暂停专项监测，包含AHI、ODI、血氧跌落分析等专业参数，结合AI智能评估，帮你第一时间发现潜在风险。',
    slot:'ring1c-feature-osa', color:'#BF5AF2',
  },
  {
    slug: 'sleep-quality',
    tag:'Sleep Intelligence', title:'睡眠的22个维度\n全都看见。', desc:'Ring1C 对你整夜的睡眠进行22项深度监测，从入睡到起床，从心率到体温，从睡眠效率到AI建议，帮你真正读懂自己的睡眠。',
    slot:'ring1c-feature-sleep', color:'#0A84FF',
  },
  {
    slug: 'stress',
    tag:'Stress Intelligence', title:'压力不是敌人。\n读懂它才是。', desc:'24小时压力趋势监测，全天压力与恢复度量化分析，帮你识别高压时刻与最佳恢复窗口。',
    slot:'ring1c-feature-stress', color:'#FF9F0A',
  },
];

export default function Ring1CPage() {
  return (
    <div style={{ background:'#000', color:'#fff', fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif' }}>

      {/* ── HERO ─────────────────────────────────── */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'120px 24px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
        <img src="/images/ring1c/Black-45-Left.jpg" alt="" style={{ position:'absolute', right:0, top:'50%', transform:'translateY(-50%)', height:'90%', objectFit:'contain', opacity:0.15, pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:2 }}>
          <p style={{ fontSize:14, fontWeight:500, letterSpacing:'0.15em', color:'#86868B', marginBottom:32, textTransform:'uppercase' }}>MATEYOU Ring1C</p>
          <h1 style={{ fontSize:'clamp(48px,8vw,96px)', fontWeight:700, letterSpacing:'-0.03em', lineHeight:1.0, margin:'0 0 24px', background:'linear-gradient(180deg,#fff 60%,rgba(255,255,255,0.4))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            个人健康<br />智能系统。
          </h1>
          <p style={{ fontSize:'clamp(18px,2.5vw,24px)', color:'#86868B', lineHeight:1.6, maxWidth:560, margin:'0 auto 48px', fontWeight:300 }}>
            7大AI健康引擎。71+监测指标。<br />专为守护你和家人的健康而生。
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/assessment" style={{ padding:'16px 40px', background:'#0A84FF', color:'#fff', borderRadius:980, fontSize:17, fontWeight:600, letterSpacing:'-0.01em' }}>
              免费健康自评
            </Link>
            <Link href="/partner" style={{ padding:'16px 40px', background:'rgba(255,255,255,0.08)', color:'#fff', borderRadius:980, fontSize:17, fontWeight:600, border:'1px solid rgba(255,255,255,0.12)' }}>
              了解合作方案
            </Link>
          </div>
        </div>
        <div style={{ position:'absolute', bottom:48, left:'50%', transform:'translateX(-50%)', textAlign:'center', opacity:0.3 }}>
          <div style={{ width:1, height:48, background:'linear-gradient(to bottom,transparent,#fff)', margin:'0 auto' }} />
        </div>
      </section>

      {/* ── 产品主图 ──────────────────────────────── */}
      <section style={{ background:'#000', padding:'0 24px 120px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <Img slot="ring1c-hero-main" alt="Ring1C 产品主图" style={{ height:'clamp(400px,60vw,700px)', width:'100%' }} />
        </div>
      </section>

      {/* ── 四色展示 ──────────────────────────────── */}
      <section style={{ background:'#000', padding:'0 24px 160px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:14, color:'#86868B', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:24 }}>Colors</p>
          <h2 style={{ fontSize:'clamp(36px,5vw,64px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:80 }}>
            四种配色。<br />一种态度。
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:2 }}>
            {[
              { id:'white', label:'极地白', bg:'#E8E8ED', img:'/images/ring1c/White-45-Left.jpg', tc:'#1D1D1F' },
              { id:'pink',  label:'樱粉色', bg:'#F9D0DB', img:'/images/ring1c/Pink-45-Left.jpg',  tc:'#1D1D1F' },
              { id:'blue',  label:'星空蓝', bg:'#1A2F5A', img:'/images/ring1c/Blue-45-Left.jpg',  tc:'#fff' },
              { id:'black', label:'曜石黑', bg:'#1C1C1E', img:'/images/ring1c/Black-45-Left.jpg', tc:'#fff' },
            ].map((c, i) => (
              <div key={c.id} style={{ background:c.bg, padding:'48px 32px', display:'flex', flexDirection:'column', alignItems:'center', borderRadius: i===0 ? '20px 0 0 20px' : i===3 ? '0 20px 20px 0' : 0 }}>
                <img src={c.img} alt={c.label} style={{ width:'100%', maxWidth:200, objectFit:'contain', marginBottom:28 }} />
                <span style={{ fontSize:17, fontWeight:600, color:c.tc }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 71+ 指标 ──────────────────────────────── */}
      <section style={{ background:'#000', padding:'0 24px 160px', textAlign:'center' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <p style={{ fontSize:14, color:'#86868B', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:24 }}>Health Metrics</p>
          <h2 style={{ fontSize:'clamp(80px,15vw,180px)', fontWeight:700, letterSpacing:'-0.04em', lineHeight:0.9, background:'linear-gradient(180deg,#fff 0%,rgba(255,255,255,0.2) 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:0 }}>
            71+
          </h2>
          <p style={{ fontSize:'clamp(24px,4vw,48px)', fontWeight:600, color:'rgba(255,255,255,0.9)', marginTop:8, marginBottom:24 }}>健康监测指标</p>
          <p style={{ fontSize:19, color:'#86868B', lineHeight:1.6, marginBottom:72 }}>覆盖 {TOTAL_HEALTH_METRICS} 项监测参数，七大功能模块完整对照规格书</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center' }}>
            {ENGINES.map(e => (
              <Link key={e.slug} href={`/metrics/${e.slug}`} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'16px 24px', display:'flex', alignItems:'center', gap:12, backdropFilter:'blur(10px)' }}>
                <span style={{ fontSize:24 }}>{e.emoji}</span>
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontSize:15, fontWeight:600, color:'#fff' }}>{e.title}</div>
                  <div style={{ fontSize:12, color:e.color, marginTop:2 }}>{e.count}项参数 →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7大功能详解 ───────────────────────────── */}
      {FEATURES.map((f, idx) => {
        const metrics = HEALTH_METRIC_CATEGORIES.find(c => c.slug === f.slug)?.parameters ?? [];
        return (
        <section key={f.tag} style={{ background: idx % 2 === 0 ? '#000' : '#0A0A0A', padding:'0 24px 160px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:80, alignItems:'center' }}>
              <div style={{ order: idx % 2 === 1 ? 2 : 1 }}>
                <p style={{ fontSize:12, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:f.color, marginBottom:20 }}>{f.tag}</p>
                <h2 style={{ fontSize:'clamp(32px,4vw,52px)', fontWeight:700, letterSpacing:'-0.025em', lineHeight:1.1, marginBottom:24, whiteSpace:'pre-line' }}>{f.title}</h2>
                <p style={{ fontSize:17, color:'#86868B', lineHeight:1.7, marginBottom:36 }}>{f.desc}</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:36 }}>
                  {metrics.slice(0, 8).map(m => (
                    <span key={m} style={{ fontSize:13, padding:'6px 14px', background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.7)', borderRadius:20, border:'1px solid rgba(255,255,255,0.08)' }}>{m}</span>
                  ))}
                  {metrics.length > 8 && (
                    <span style={{ fontSize:13, padding:'6px 14px', color:f.color }}>+{metrics.length - 8} 项…</span>
                  )}
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>
                  <Link href={`/metrics/${f.slug}`} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:17, color:f.color, fontWeight:600 }}>
                    查看全部 {metrics.length} 项参数 →
                  </Link>
                  {f.tag === 'OSA Screening' && (
                    <Link href="/assessment/osa" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:17, color:'rgba(255,255,255,0.6)', fontWeight:600 }}>
                      免费 OSA 筛查 →
                    </Link>
                  )}
                </div>
              </div>
              <div style={{ order: idx % 2 === 1 ? 1 : 2 }}>
                <Img slot={f.slot} alt={f.tag} style={{ height:'clamp(300px,40vw,480px)' }} />
              </div>
            </div>
          </div>
        </section>
      );})}

      {/* ── App展示 ───────────────────────────────── */}
      <section style={{ background:'#000', padding:'0 24px 160px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:14, color:'#86868B', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:24 }}>MATEYOU App</p>
          <h2 style={{ fontSize:'clamp(36px,5vw,64px)', fontWeight:700, letterSpacing:'-0.025em', marginBottom:24 }}>
            数据很复杂。<br />读懂它不难。
          </h2>
          <p style={{ fontSize:19, color:'#86868B', marginBottom:80 }}>MATEYOU App 将71+项健康数据转化为你能看懂的洞察</p>
          <div style={{ marginBottom:32 }}>
            <Img slot="app-mockup-main" alt="App主界面" style={{ height:'clamp(400px,55vw,640px)', width:'100%' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12 }}>
            {[
              { slot:'app-screen-home',     label:'健康总览' },
              { slot:'app-screen-sleep',    label:'睡眠分析' },
              { slot:'app-screen-heart',    label:'心脏健康' },
              { slot:'app-screen-osa',      label:'OSA筛查' },
              { slot:'app-screen-stress',   label:'压力管理' },
              { slot:'app-screen-activity', label:'运动记录' },
            ].map(s => (
              <div key={s.slot}>
                <Img slot={s.slot} alt={s.label} style={{ height:280, marginBottom:12 }} />
                <p style={{ fontSize:14, color:'#86868B' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 工艺 ──────────────────────────────────── */}
      <section style={{ background:'#000', padding:'0 24px 160px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:80 }}>
            <p style={{ fontSize:14, color:'#86868B', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:24 }}>Craftsmanship</p>
            <h2 style={{ fontSize:'clamp(36px,5vw,64px)', fontWeight:700, letterSpacing:'-0.025em', marginBottom:16 }}>约4g。<br />氧化锆陶瓷。</h2>
            <p style={{ fontSize:19, color:'#86868B' }}>工业级精密制造，医疗级材质标准</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
            {[
              { slot:'ring1c-craft-ceramic',  label:'氧化锆陶瓷', sub:'莫氏硬度 8.5，媲美蓝宝石' },
              { slot:'ring1c-craft-sensor',   label:'多波长PPG',  sub:'精密排布，贴合手指弧度' },
              { slot:'ring1c-craft-charging', label:'无线磁吸充电', sub:'60分钟充满，续航7天' },
            ].map(c => (
              <div key={c.slot} style={{ background:'#111', borderRadius:24, overflow:'hidden', padding:'0 0 24px' }}>
                <Img slot={c.slot} alt={c.label} style={{ height:240, borderRadius:0 }} />
                <div style={{ padding:'24px 24px 0' }}>
                  <div style={{ fontSize:19, fontWeight:600, marginBottom:6 }}>{c.label}</div>
                  <div style={{ fontSize:14, color:'#86868B' }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SizeGuide />

      {/* ── 规格参数 ──────────────────────────────── */}
      <section style={{ background:'#111', padding:'120px 24px' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <h2 style={{ fontSize:'clamp(32px,5vw,52px)', fontWeight:700, letterSpacing:'-0.025em', marginBottom:64, textAlign:'center' }}>产品规格</h2>
          {[
            ['重量','4g'],['外壳','高性能氧化锆陶瓷材质'],['内衬','医用级抗过敏高分子聚合物材质'],
            ['传感器','多波长PPG感应器 + 医用级温感器 + 6轴运动感应器'],['健康指标','71+ 项'],
            ['续航','7 - 10 天'],['充电','专用无线充电仓'],['防水','IP68（可游泳）'],
            ['蓝牙','Bluetooth 5.2'],['兼容','iOS 14+ / Android 8+'],
            ['尺寸','US 6 / US 7 / US 8 / US 9 / US 10 / US 11 / US 12 / US 13'],['配色','极地白 / 樱粉色 / 星空蓝 / 曜石黑'],
          ].map(([k, v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'20px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize:17, color:'#86868B' }}>{k}</span>
              <span style={{ fontSize:17, color:'#fff', fontWeight:500, textAlign:'right', maxWidth:'60%' }}>{v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <section style={{ background:'#000', padding:'160px 24px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(10,132,255,0.12) 0%, transparent 70%)' }} />
        <div style={{ position:'relative', zIndex:2 }}>
          <h2 style={{ fontSize:'clamp(40px,6vw,72px)', fontWeight:700, letterSpacing:'-0.03em', lineHeight:1.05, marginBottom:24 }}>
            把关爱，<br />戴在手上。
          </h2>
          <p style={{ fontSize:21, color:'#86868B', marginBottom:56, fontWeight:300 }}>先从免费健康自评开始。</p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/assessment" style={{ padding:'18px 48px', background:'#0A84FF', color:'#fff', borderRadius:980, fontSize:17, fontWeight:600 }}>
              免费健康自评
            </Link>
            <Link href="/partner" style={{ padding:'18px 48px', background:'rgba(255,255,255,0.08)', color:'#fff', borderRadius:980, fontSize:17, fontWeight:600, border:'1px solid rgba(255,255,255,0.1)' }}>
              商业合作咨询
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
