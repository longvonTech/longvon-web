import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteUrl } from '../../lib/site';
import { siteAlternates } from '../../lib/i18n-routes';

export const metadata: Metadata = {
  title: { absolute: '关于龙汾科技 | LONGVON' },
  description:
    '龙汾科技（深圳）有限公司（LONGVON）是智能戒指技术厂商与OEM/ODM提供商。MATEYOU是LONGVON打造的智能戒指及AI健康品牌。',
  alternates: siteAlternates(getSiteUrl(), '/about', 'zh'),
};

export default function AboutPage() {
  return (
    <div style={{ background:'#fff', color:'#1D1D1F', fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif' }}>

      {/* ── HERO ─────────────────────────────────── */}
      <section style={{ background:'#000', padding:'120px 24px 100px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
        <div style={{ position:'relative', zIndex:2, maxWidth:860, margin:'0 auto' }}>
          <p style={{ fontSize:13, fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase', color:'#4B5563', marginBottom:24 }}>About LONGVON</p>
          <h1 style={{ fontSize:'clamp(36px,6vw,68px)', fontWeight:700, letterSpacing:'-0.03em', lineHeight:1.08, color:'#fff', marginBottom:28 }}>
            用AI重构健康管理，<br />
            <span style={{ color:'#60A5FA' }}>让每个人拥有专属的<br />数字健康伙伴</span>
          </h1>
          <p style={{ fontSize:'clamp(15px,1.8vw,18px)', color:'#6B7280', lineHeight:1.8, maxWidth:680, margin:'0 auto 40px' }}>
            LONGVON is a smart ring technology manufacturer and OEM/ODM provider. MATEYOU is a smart ring and AI health brand developed by LONGVON.
          </p>
          <p style={{ fontSize:'clamp(14px,1.6vw,17px)', color:'#4B5563', lineHeight:1.8, maxWidth:680, margin:'0 auto' }}>
            龙汾科技（LONGVON）是智能戒指技术厂商与 OEM/ODM 提供商；MATEYOU 是龙汾科技打造的智能戒指及 AI 健康品牌。
          </p>
        </div>
      </section>

      {/* ── 企业定位标签 ──────────────────────────── */}
      <section style={{ background:'#0A0A0A', padding:'40px 24px', borderTop:'1px solid #1C1C1E' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center' }}>
          {[
            '智能戒指技术厂商',
            '智能戒指 OEM / ODM 提供商',
            '睡眠与呼吸健康监测技术',
            'AI 健康管理平台运营',
          ].map(tag => (
            <span key={tag} style={{ padding:'8px 20px', background:'rgba(37,99,235,0.1)', color:'#60A5FA', borderRadius:980, fontSize:14, fontWeight:500, border:'1px solid rgba(37,99,235,0.2)' }}>
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ── 数字实力 ──────────────────────────────── */}
      <section style={{ background:'#F9FAFB', padding:'80px 24px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:2 }}>
            {[
              { num:'2017', label:'成立时间', sub:'Founded' },
              { num:'71', label:'健康监测参数', sub:'Public metric set' },
              { num:'OSA', label:'风险筛查', sub:'Consumer function' },
              { num:'戒指', label:'智能戒指与健康监测', sub:'Smart ring monitoring' },
              { num:'合作', label:'个人与机构', sub:'Partnerships' },
              { num:'参考', label:'日常健康参考', sub:'Daily health reference' },
            ].map((item, i) => (
              <div key={i} style={{ background:'#fff', padding:'28px 16px', textAlign:'center',
                borderRadius: i===0 ? '16px 0 0 16px' : i===5 ? '0 16px 16px 0' : 0,
                borderRight: i<5 ? '1px solid #F3F4F6' : 'none' }}>
                <div style={{ fontSize:'clamp(16px,2vw,24px)', fontWeight:800, color:'#1D1D1F', marginBottom:6 }}>{item.num}</div>
                <div style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:3 }}>{item.label}</div>
                <div style={{ fontSize:11, color:'#9CA3AF' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 公司介绍 ──────────────────────────────── */}
      <section style={{ padding:'100px 24px', background:'#fff' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <p style={{ fontSize:13, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#9CA3AF', marginBottom:20 }}>Company</p>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:32 }}>龙汾科技</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <p style={{ fontSize:17, color:'#374151', lineHeight:1.85 }}>
              龙汾科技（深圳）有限公司成立于2017年。龙汾科技（LONGVON）是智能戒指技术厂商及 OEM/ODM 提供商。MATEYOU 是产品品牌，不是制造商。公开产品 MATEYOU Ring1C 是消费级智能戒指，具备 OSA 风险筛查，不是注册医疗器械；筛查结果仅供健康参考，不是临床诊断，也不能替代医生评估。公司材料述及的资质名称（国家高新技术企业、深圳市专精特新中小企业、深圳市创新型中小企业）以可公开核验的证书为准。完整实体说明见{' '}
              <Link href="/company/longvon" style={{ color:'#2563EB' }}>龙汾科技 LONGVON 企业页</Link>。
            </p>
            <p style={{ fontSize:17, color:'#374151', lineHeight:1.85 }}>
              公司聚焦人工智能与健康领域融合创新，致力于构建覆盖个人、家庭、医疗机构及健康服务机构的AI健康管理基础设施，让专业健康服务能力更好地延伸到日常生活之中。
            </p>
            <p style={{ fontSize:17, color:'#374151', lineHeight:1.85 }}>
              依托人工智能、大数据、云计算与智能可穿戴设备，龙汾科技打造了 MATEYOU AI 健康参考平台，用于数据采集与趋势查看。平台不提供疾病治疗或临床诊断。
            </p>
          </div>
        </div>
      </section>

      {/* ── 我们相信 ──────────────────────────────── */}
      <section style={{ background:'#0A0A0A', padding:'100px 24px' }}>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:13, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#4B5563', marginBottom:24 }}>We Believe</p>
          <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:700, letterSpacing:'-0.025em', color:'#fff', marginBottom:28 }}>
            我们相信
          </h2>
          <p style={{ fontSize:'clamp(20px,2.8vw,28px)', color:'#60A5FA', fontWeight:600, lineHeight:1.5, marginBottom:40, maxWidth:640, margin:'0 auto 40px' }}>
            未来每个人都将拥有一个专属的 AI 健康助手。
          </p>
          <div style={{ maxWidth:560, margin:'0 auto', textAlign:'left' }}>
            <p style={{ fontSize:17, color:'#6B7280', lineHeight:1.9, marginBottom:16 }}>
              它旨在持续记录身体数据变化，提示潜在健康风险参考，并提供个性化健康建议。这些建议不是临床诊断。如需医学判断，应咨询医生或专业健康服务。
            </p>
            <p style={{ fontSize:17, color:'#6B7280', lineHeight:1.9 }}>
              龙汾科技正在构建这样一个以数据为基础、以AI为核心、以健康服务为价值的智慧健康生态。
            </p>
          </div>
        </div>
      </section>

      {/* ── 我们在做什么 ──────────────────────────── */}
      <section style={{ padding:'100px 24px', background:'#fff' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <p style={{ fontSize:13, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#9CA3AF', marginBottom:20 }}>What We Do</p>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:700, letterSpacing:'-0.02em' }}>我们在做什么</h2>
          </div>
          <div className="about-what-grid">
            {[
              {
                imgSlot: 'about-what-ai-platform',
                imgPath: '/images/about/what-ai-platform.jpg',
                bg: '#EFF6FF',
                title:'AI健康管理平台',
                desc:'通过多维健康数据，为用户提供健康数据查看、OSA 风险筛查参考与趋势分析。结果仅供健康参考，不构成临床诊断或医疗预警。',
              },
              {
                imgSlot: 'about-what-terminal',
                imgPath: '/images/about/what-terminal.jpg',
                bg: '#F5F3FF',
                title:'智能健康终端',
                desc:'以MATEYOU Ring1C AI智能戒指为核心入口，持续采集睡眠、血氧、心率、HRV、压力、活动等关键健康指标，建立个人健康数字画像。',
              },
              {
                imgSlot: 'about-what-medical',
                imgPath: '/images/about/what-medical.jpg',
                bg: '#ECFDF5',
                title:'健康管理服务',
                desc:'围绕睡眠与呼吸健康，提供 OSA 风险筛查、监测和健康参考评估。不提供疾病治疗或临床随访，也不是注册医疗器械服务。',
              },
              {
                imgSlot: 'about-what-family',
                imgPath: '/images/about/what-family.jpg',
                bg: '#FFFBEB',
                title:'家庭健康管理网络',
                desc:'连接个人、家庭成员、医生及健康管理师，让健康管理从单一用户延伸至家庭关爱和长期健康陪伴。',
              },
            ].map(item => (
              <div key={item.title} className="about-what-card">
                <div style={{ position:'relative', height:180, background:item.bg, overflow:'hidden', flexShrink:0 }}>
                  <img
                    src={item.imgPath}
                    alt={item.title}
                    style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
                  />
                  <div style={{ position:'absolute', bottom:8, right:8, background:'rgba(0,0,0,0.35)', borderRadius:6, padding:'2px 8px', fontSize:10, color:'rgba(255,255,255,0.75)', fontFamily:'monospace' }}>
                    {item.imgSlot}
                  </div>
                </div>
                <div style={{ padding:'24px 20px 28px', flex:1, display:'flex', flexDirection:'column' }}>
                  <h3 style={{ fontSize:17, fontWeight:700, color:'#1D1D1F', marginBottom:10 }}>{item.title}</h3>
                  <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.75, margin:0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          .about-what-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .about-what-card {
            display: flex;
            flex-direction: column;
            background: #fff;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid #E5E7EB;
            box-shadow: 0 1px 3px rgba(0,0,0,0.06);
            height: 100%;
          }
        `}</style>
      </section>

      {/* ── 我们的愿景 ────────────────────────────── */}
      <section style={{ background:'#000', padding:'100px 24px', textAlign:'center' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <p style={{ fontSize:13, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#4B5563', marginBottom:24 }}>Vision</p>
          <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:700, letterSpacing:'-0.025em', color:'#fff', marginBottom:20 }}>
            我们的愿景
          </h2>
          <p style={{ fontSize:'clamp(18px,2.5vw,26px)', color:'#2563EB', fontWeight:700, marginBottom:40 }}>
            成为值得信赖的 AI 健康管理平台合作伙伴
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:56, textAlign:'left', maxWidth:600, margin:'0 auto 56px' }}>
            {[
              '通过"AI + 医疗健康 + 智能终端"的深度融合，构建覆盖院内、院外及家庭场景的智慧健康生态。',
              '让每个人都拥有自己的数字健康档案、AI健康助手和持续健康管理服务。',
              '让健康管理从被动治疗走向主动预防。',
              '让科技成为更好的健康陪伴。',
            ].map((line, i) => (
              <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#2563EB', flexShrink:0, marginTop:8 }} />
                <p style={{ fontSize:17, color:'#9CA3AF', lineHeight:1.75, margin:0 }}>{line}</p>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/partner" style={{ padding:'16px 40px', background:'#2563EB', color:'#fff', borderRadius:980, fontSize:16, fontWeight:600 }}>
              了解合作方案
            </Link>
            <Link href="/products/ring1c" style={{ padding:'16px 40px', background:'rgba(255,255,255,0.08)', color:'#fff', borderRadius:980, fontSize:16, fontWeight:600, border:'1px solid rgba(255,255,255,0.12)' }}>
              查看产品介绍
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
