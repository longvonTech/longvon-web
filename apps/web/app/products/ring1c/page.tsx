export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteUrl } from '../../../lib/site';

export const metadata: Metadata = {
  title: 'Ring1C · 个人健康智能系统',
  description: 'MATEYOU Ring1C 智能戒指，约4g超轻氧化锆陶瓷外壳，71+健康指标，7天续航，IP68防水，多波长PPG传感器。',
  alternates: { canonical: `${getSiteUrl()}/products/ring1c` },
};

const eye: React.CSSProperties = { fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6E6E73', marginBottom: 16 };
const h2s: React.CSSProperties = { fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#1D1D1F', marginBottom: 20 };
const body: React.CSSProperties = { fontSize: 18, color: '#6E6E73', lineHeight: 1.65 };
const inner: React.CSSProperties = { maxWidth: 980, margin: '0 auto' };

const COLORS = [
  { id: 'white', label: '极地白', img: '/images/ring1c/White-45-Left.jpg', bg: '#F5F5F7' },
  { id: 'pink',  label: '樱粉色', img: '/images/ring1c/Pink-45-Left.jpg',  bg: '#FFF0F5' },
  { id: 'blue',  label: '星空蓝', img: '/images/ring1c/Blue-45-Left.jpg',  bg: '#EFF4FF' },
  { id: 'black', label: '曜石黑', img: '/images/ring1c/Black-45-Left.jpg', bg: '#1D1D1F' },
];

const FEATURES = [
  { icon: '😴', title: '睡眠智能引擎', sub: 'Sleep Intelligence', desc: '持续追踪深睡、浅睡、REM睡眠分期，生成个性化睡眠质量参考评分，每天早晨给你清晰的睡眠洞察。' },
  { icon: '💓', title: '心脏智能引擎', sub: 'Heart Intelligence', desc: '每天超过10万次心跳，全程追踪HRV心率变异性，识别静息心率趋势，了解心脏健康基线。' },
  { icon: '🫁', title: 'OSA风险筛查', sub: 'Sleep Apnea Screening', desc: '基于STOP-BANG量表，结合夜间血氧与心率数据，提供睡眠呼吸暂停风险参考评分。' },
  { icon: '🧠', title: '压力智能引擎', sub: 'Stress Intelligence', desc: '基于HRV数据实时生成压力指数参考，帮助你识别高压时刻，做出更好的恢复决策。' },
  { icon: '🩸', title: '血氧监测', sub: 'SpO₂ Monitoring', desc: '持续追踪血氧饱和度，夜间异常趋势参考提醒，关注你的呼吸健康状态。' },
  { icon: '⚡', title: 'AI健康教练', sub: 'AI Health Coach', desc: '基于个人健康基线，AI持续学习你的身体规律，提供个性化的健康行为参考建议。' },
];

const SPECS = [
  ['重量', '约 4g'],
  ['外壳材质', '氧化锆陶瓷'],
  ['内衬结构', '医疗级材质'],
  ['传感器', '多波长PPG + 温度 + 六轴运动'],
  ['健康指标', '71+ 项'],
  ['续航', '最长 7 天'],
  ['充电方式', '无线磁吸充电盒'],
  ['防水等级', 'IP68（可游泳）'],
  ['连接', 'Bluetooth 5.2'],
  ['兼容', 'iOS 14+ / Android 8+'],
  ['尺寸', 'XS / S / M / L / XL'],
  ['颜色', '极地白 / 樱粉色 / 星空蓝 / 曜石黑'],
];

export default function Ring1CPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: '#fbfbfd', padding: '80px 24px 0' }}>
        <div style={{ ...inner, textAlign: 'center', paddingBottom: 60 }}>
          <p style={eye}>Ring1C · Personal Health Intelligence System</p>
          <h1 style={{ fontSize: 'clamp(44px,6vw,72px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#1D1D1F', marginBottom: 24 }}>
            健康的未来，<br />戴在指尖
          </h1>
          <p style={{ fontSize: 20, color: '#6E6E73', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.65 }}>
            强大的健康科技，应该融入日常生活——无感佩戴，静默守护，持续洞察。
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <Link href="/partner" style={{ padding: '14px 36px', background: '#1D1D1F', color: '#fff', borderRadius: 980, fontSize: 16, fontWeight: 600 }}>
              商业合作咨询
            </Link>
            <Link href="/assessment" style={{ padding: '14px 36px', background: 'transparent', color: '#0066CC', borderRadius: 980, fontSize: 16, fontWeight: 600, border: '1.5px solid rgba(0,102,204,0.3)' }}>
              先做健康自评
            </Link>
          </div>
        </div>

        {/* 四色展示 */}
        <div style={{ ...inner }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {COLORS.map(c => (
              <div key={c.id} style={{ borderRadius: 20, background: c.bg, padding: '40px 20px 24px', textAlign: 'center' }}>
                <img src={c.img} alt={`Ring1C ${c.label}`} style={{ width: '100%', height: 200, objectFit: 'contain' }} />
                <p style={{ fontSize: 14, fontWeight: 500, color: c.id === 'black' ? '#fff' : '#1D1D1F', marginTop: 16 }}>{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 71+ */}
      <section style={{ background: '#1D1D1F', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ ...eye, color: '#6E6E73' }}>健康数据平台</p>
          <p style={{ fontSize: 'clamp(72px,11vw,128px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1, margin: '12px 0 4px' }}>
            71<span style={{ color: '#0066CC' }}>+</span>
          </p>
          <p style={{ fontSize: 20, color: '#AEAEB2', marginBottom: 16 }}>健康监测指标</p>
          <p style={{ fontSize: 15, color: '#6E6E73', lineHeight: 1.7 }}>
            数据不等于知识，知识不等于行动。<br />Ring1C 的 AI 层连接三者，让健康数据真正改变你的生活。
          </p>
        </div>
      </section>

      {/* 六大功能 */}
      <section style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={inner}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={eye}>核心健康能力</p>
            <h2 style={h2s}>全方位健康智能监测</h2>
            <p style={{ ...body, maxWidth: 500, margin: '0 auto' }}>覆盖中国人群高发健康关注场景，全部结果为风险参考，不构成医学诊断</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ padding: 32, borderRadius: 20, background: '#F5F5F7' }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#AEAEB2', textTransform: 'uppercase', marginBottom: 6 }}>{f.sub}</p>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1D1D1F', marginBottom: 12 }}>{f.title}</h3>
                <p style={{ fontSize: 15, color: '#6E6E73', lineHeight: 1.65 }}>{f.desc}</p>
                <p style={{ fontSize: 11, color: '#AEAEB2', marginTop: 12 }}>*仅供健康参考，非医学诊断</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 设计细节 */}
      <section style={{ padding: '100px 24px', background: '#F5F5F7' }}>
        <div style={{ ...inner, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p style={eye}>极致工艺</p>
            <h2 style={h2s}>4克的重量，<br />承载健康的力量</h2>
            <p style={body}>氧化锆陶瓷外壳，坚硬而温润；医疗级内衬结构，贴合肤感。Ring1C 在追求极致轻薄的同时，不妥协于材质与工艺。</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 36 }}>
              {[['约 4g', '超轻设计'], ['IP68', '可游泳防水'], ['7天', '单次续航'], ['氧化锆', '陶瓷外壳']].map(([v, l]) => (
                <div key={v} style={{ padding: '20px', background: '#fff', borderRadius: 16 }}>
                  <p style={{ fontSize: 28, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.02em', marginBottom: 4 }}>{v}</p>
                  <p style={{ fontSize: 13, color: '#6E6E73' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <img src="/images/ring1c/White.jpg" alt="Ring1C 白色正面" style={{ width: '100%', borderRadius: 16, background: '#fff' }} />
            <img src="/images/ring1c/Pink.jpg" alt="Ring1C 粉色正面" style={{ width: '100%', borderRadius: 16, background: '#FFF0F5' }} />
            <img src="/images/ring1c/Blue.jpg" alt="Ring1C 蓝色正面" style={{ width: '100%', borderRadius: 16, background: '#EFF4FF' }} />
            <img src="/images/ring1c/Black.jpg" alt="Ring1C 黑色正面" style={{ width: '100%', borderRadius: 16, background: '#1D1D1F' }} />
          </div>
        </div>
      </section>

      {/* 参数表 */}
      <section style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ ...inner, maxWidth: 720 }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={eye}>技术规格</p>
            <h2 style={h2s}>完整产品参数</h2>
          </div>
          {SPECS.map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', borderBottom: `1px solid ${i === SPECS.length - 1 ? 'transparent' : '#F0F0F0'}` }}>
              <span style={{ fontSize: 15, color: '#6E6E73' }}>{k}</span>
              <span style={{ fontSize: 15, fontWeight: 500, color: '#1D1D1F', textAlign: 'right', maxWidth: 280 }}>{v}</span>
            </div>
          ))}
          <p style={{ fontSize: 12, color: '#AEAEB2', marginTop: 24, textAlign: 'center' }}>
            *Ring1C 为消费级健康监测设备，不属于医疗器械。所有健康数据仅供参考，不构成医学诊断或治疗建议。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 24px', background: '#F5F5F7' }}>
        <div style={{ ...inner, maxWidth: 720 }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={eye}>常见问题</p>
            <h2 style={h2s}>你可能想知道</h2>
          </div>
          {[
            ['Ring1C 是医疗器械吗？', 'Ring1C 是消费级健康监测可穿戴设备，不是医疗器械。所有监测数据和评估结果仅供日常健康参考，不能用于疾病诊断或治疗决策。如有健康疑虑，请咨询专业医疗机构。'],
            ['数据如何保护隐私？', '你的生理数据在设备端进行本地加密存储，同步到平台时采用端到端加密传输。我们严格遵守中国网络安全法和数据安全法，不将个人健康数据用于商业目的。'],
            ['支持哪些合作形式？', '我们支持医院合作、药房渠道、OEM代工、区域代理和企业批量采购多种合作形式。请访问商业合作页面了解详情并提交意向登记。'],
            ['如何下载配套App？', 'MATEYOU App 即将上线，支持 iOS App Store 和安卓各大应用商店下载。敬请期待。'],
          ].map(([q, a]) => (
            <div key={q} style={{ padding: '28px 0', borderBottom: '1px solid #E8E8E8' }}>
              <p style={{ fontWeight: 600, fontSize: 16, color: '#1D1D1F', marginBottom: 10 }}>{q}</p>
              <p style={{ fontSize: 15, color: '#6E6E73', lineHeight: 1.7 }}>{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', background: '#1D1D1F', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ ...h2s, color: '#fff', marginBottom: 16 }}>准备好开始合作了吗？</h2>
          <p style={{ fontSize: 18, color: '#6E6E73', marginBottom: 40, lineHeight: 1.65 }}>
            无论是医院引入、渠道合作还是企业采购，我们期待与你共建健康生态。
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/partner" style={{ padding: '15px 44px', background: '#0066CC', color: '#fff', borderRadius: 980, fontSize: 17, fontWeight: 600 }}>
              提交合作申请
            </Link>
            <Link href="/assessment" style={{ padding: '15px 44px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 980, fontSize: 17, fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)' }}>
              先做健康自评
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
