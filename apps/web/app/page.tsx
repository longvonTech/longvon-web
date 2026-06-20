export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RingColorSwitcher } from '../components/RingColorSwitcher';
import { OrganizationSchema } from '../components/StructuredData';
import { getSiteUrl } from '../lib/site';

export const metadata: Metadata = {
  title: 'MATEYOU Ring1C · AI健康智能戒指',
  description: '不只是智能戒指。MATEYOU Ring1C 是你的个人健康智能系统。71+ 健康指标，睡眠、心脏、压力、血氧、OSA 风险全面监测。',
  alternates: { canonical: getSiteUrl() },
};

const eyebrow: React.CSSProperties = { fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6E6E73', marginBottom: 16 };
const h2style: React.CSSProperties = { fontSize: 'clamp(36px,5vw,56px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#1D1D1F', marginBottom: 20 };
const bodystyle: React.CSSProperties = { fontSize: 19, color: '#6E6E73', lineHeight: 1.6 };
const inner: React.CSSProperties = { maxWidth: 980, margin: '0 auto' };

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />

      <section style={{ background: '#fbfbfd', padding: '80px 24px 60px', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ ...inner, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <p style={eyebrow}>Ring1C · AI健康智能系统</p>
            <h1 style={{ fontSize: 'clamp(42px,5.5vw,68px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#1D1D1F', marginBottom: 24 }}>
              健康智能，<br /><span style={{ color: '#0066CC' }}>静默守护</span>
            </h1>
            <p style={{ fontSize: 20, color: '#6E6E73', lineHeight: 1.65, marginBottom: 40, maxWidth: 440 }}>
              不只是智能戒指。MATEYOU Ring1C 是你的个人健康智能系统——为睡眠而生，为恢复而建，由人工智能驱动。
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/partner" style={{ padding: '14px 32px', background: '#1D1D1F', color: '#fff', borderRadius: 980, fontSize: 16, fontWeight: 600 }}>
                了解合作方案
              </Link>
              <Link href="/products/ring1c" style={{ padding: '14px 32px', background: 'transparent', color: '#0066CC', borderRadius: 980, fontSize: 16, fontWeight: 600, border: '1.5px solid rgba(0,102,204,0.3)' }}>
                产品详情
              </Link>
            </div>
            <p style={{ fontSize: 12, color: '#AEAEB2', marginTop: 20 }}>消费级健康监测设备 · 结果仅供参考 · 非医疗诊断</p>
          </div>
          <RingColorSwitcher />
        </div>
      </section>

      <section style={{ background: '#1D1D1F', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ ...eyebrow, color: '#6E6E73' }}>健康智能平台</p>
          <p style={{ fontSize: 'clamp(80px,12vw,140px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1, margin: '16px 0 8px' }}>
            71<span style={{ color: '#0066CC' }}>+</span>
          </p>
          <p style={{ fontSize: 22, color: '#AEAEB2', marginBottom: 40 }}>健康监测指标，持续追踪，静默运行</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['睡眠智能','心脏智能','血氧监测','压力指数','运动追踪','OSA风险筛查'].map(f => (
              <span key={f} style={{ padding: '8px 18px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 980, fontSize: 14, color: '#AEAEB2' }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ ...inner, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p style={eyebrow}>睡眠智能引擎</p>
            <h2 style={h2style}>睡眠，<br />是身体愈合的时刻</h2>
            <p style={bodystyle}>Ring1C 持续追踪睡眠分期、深睡时长与睡眠周期，生成个性化睡眠质量参考评分。发现影响你休息质量的关键因素，每天早晨给你一个清晰的睡眠洞察。</p>
            <Link href="/assessment" style={{ display: 'inline-block', marginTop: 28, fontSize: 16, color: '#0066CC', fontWeight: 500 }}>免费做睡眠风险自评 →</Link>
          </div>
          <div style={{ position: 'relative', height: 380, borderRadius: 24, overflow: 'hidden', background: '#F5F5F7' }}>
            <img src="/images/ring1c/White-45-Right.jpg" alt="Ring1C 睡眠监测" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 24px', background: '#F5F5F7' }}>
        <div style={{ ...inner, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div style={{ position: 'relative', height: 380, borderRadius: 24, overflow: 'hidden', background: '#fff' }}>
            <img src="/images/ring1c/Blue-45-Left.jpg" alt="Ring1C OSA监测" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <p style={eyebrow}>OSA 风险筛查</p>
            <h2 style={h2style}>数百万人在睡眠中停止呼吸，却浑然不觉</h2>
            <p style={bodystyle}>Ring1C 内置基于 STOP-BANG 量表的 OSA 风险评估，结合夜间血氧与心率数据，提供睡眠呼吸暂停风险参考评分。</p>
            <p style={{ fontSize: 13, color: '#AEAEB2', marginTop: 12 }}>*结果仅供参考，不构成医学诊断</p>
            <Link href="/assessment" style={{ display: 'inline-block', marginTop: 20, fontSize: 16, color: '#0066CC', fontWeight: 500 }}>做OSA风险自评 →</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={inner}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {[
              { color: '#FFF0F0', img: '/images/ring1c/Pink-45-Left.jpg', eye: '心脏智能引擎', h3: '心脏从不停歇', alt: 'Ring1C心率', body: '每天超过 10 万次心跳，Ring1C 追踪 HRV 心率变异性，识别静息心率趋势，帮你了解心脏健康基线与压力恢复状态。' },
              { color: '#EEF4FA', img: '/images/ring1c/Black-45-Right.jpg', eye: '压力智能引擎', h3: '压力不是你的敌人', alt: 'Ring1C压力', body: '压力是身体的信号。Ring1C 基于 HRV 数据生成压力指数参考，帮你识别高压时刻，做出更好的恢复决策。' },
            ].map(c => (
              <div key={c.h3} style={{ borderRadius: 24, overflow: 'hidden', background: c.color }}>
                <div style={{ position: 'relative', height: 280 }}>
                  <img src={c.img} alt={c.alt} style={{width:'100%',height:'100%', objectFit: 'contain', padding: '24px' }} />
                </div>
                <div style={{ padding: '24px 32px 36px' }}>
                  <p style={{ ...eyebrow, marginBottom: 10 }}>{c.eye}</p>
                  <h3 style={{ fontSize: 26, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.01em', marginBottom: 12 }}>{c.h3}</h3>
                  <p style={{ fontSize: 15, color: '#6E6E73', lineHeight: 1.65 }}>{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 24px', background: '#1D1D1F' }}>
        <div style={{ ...inner, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p style={{ ...eyebrow, color: '#6E6E73' }}>产品设计</p>
            <h2 style={{ ...h2style, color: '#fff' }}>极致轻薄，<br />高端工艺</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[['约 4g','超轻设计，佩戴忘我'],['氧化锆陶瓷外壳','高端材质，触感温润'],['医疗级内衬结构','贴合肤感，长期佩戴无压力'],['IP68 防水','游泳、洗澡全程无忧'],['7天续航','单次充电持续一周'],['无线磁吸充电','随附充电盒，随时补电']].map(([t,d]) => (
                <div key={t} style={{ padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 600, color: '#fff', fontSize: 15 }}>{t}</span>
                  <span style={{ fontSize: 13, color: '#6E6E73', textAlign: 'right', maxWidth: 200 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', height: 440 }}>
            <img src="/images/ring1c/Black.jpg" alt="Ring1C 黑色" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 24px', background: '#F5F5F7' }}>
        <div style={{ ...inner, textAlign: 'center' }}>
          <p style={eyebrow}>商业合作</p>
          <h2 style={h2style}>共建数字健康生态</h2>
          <p style={{ ...bodystyle, maxWidth: 560, margin: '0 auto 48px' }}>面向医院、药房、OEM代工、区域代理及企业客户开放多元合作形式。</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 48 }}>
            {[
              { href: '/partner/hospital', icon: '🏥', title: '医院合作', sub: '临床研究 · 设备引入' },
              { href: '/partner/pharmacy', icon: '💊', title: '药房渠道', sub: '铺货 · 品牌陈列' },
              { href: '/partner/oem', icon: '🏭', title: 'OEM代工', sub: '产能 · 定制开发' },
              { href: '/partner/distributor', icon: '🗺️', title: '区域代理', sub: '区域保护 · 渠道' },
              { href: '/partner/enterprise', icon: '🏢', title: '企业采购', sub: '员工福利 · 批量' },
            ].map(p => (
              <Link key={p.href} href={p.href} style={{ background: '#fff', borderRadius: 20, padding: '28px 16px', display: 'block', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{p.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#1D1D1F', marginBottom: 6 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: '#AEAEB2' }}>{p.sub}</div>
              </Link>
            ))}
          </div>
          <Link href="/partner" style={{ display: 'inline-block', padding: '16px 44px', background: '#0066CC', color: '#fff', borderRadius: 980, fontSize: 17, fontWeight: 600 }}>
            提交合作申请
          </Link>
        </div>
      </section>
    </>
  );
}
