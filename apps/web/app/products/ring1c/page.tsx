import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductSchema, BreadcrumbSchema } from '../../../components/StructuredData';
import { getSiteUrl } from '../../../lib/site';

export const metadata: Metadata = {
  title: 'Ring1C智能戒指 · 消费级健康监测可穿戴设备',
  description: 'Ring1C是MATEYOU旗下消费级智能戒指，集成PPG光电传感器，支持睡眠监测、心率HRV、血氧SpO2追踪，IP68防水，续航7天。非医疗器械，健康数据仅供参考。',
  alternates: { canonical: `${getSiteUrl()}/products/ring1c` },
  openGraph: {
    title: 'Ring1C智能戒指 | MATEYOU',
    description: '消费级健康监测智能戒指，7天续航，IP68防水，PPG传感器',
    url: `${getSiteUrl()}/products/ring1c`,
    type: 'website',
  },
};

const SPECS = [
  ['传感器', 'PPG光电传感器（血氧 + 心率 + HRV）'],
  ['续航', '7天（正常使用模式）'],
  ['充电', '磁吸无线充电，1.5小时充满'],
  ['防水', 'IP68（可游泳，水下30米）'],
  ['连接', 'Bluetooth 5.2'],
  ['兼容', 'iOS 14+ / Android 8+'],
  ['材质', '钛合金外壳，医用级硅胶内衬'],
  ['尺寸', 'S / M / L / XL（可试戴）'],
];

const FEATURES = [
  { icon: '📊', title: '睡眠分析', desc: '追踪深睡、浅睡、REM睡眠分期，生成睡眠质量参考评分', disclaimer: true },
  { icon: '❤️', title: 'HRV心率变异性', desc: '持续追踪心率变异性，辅助评估自主神经功能状态参考', disclaimer: true },
  { icon: '🫁', title: '血氧SpO2', desc: '基础血氧饱和度追踪，异常提醒仅供参考', disclaimer: true },
  { icon: '🧠', title: '压力指数参考', desc: '基于HRV数据生成压力水平参考指数', disclaimer: true },
  { icon: '📱', title: 'MATEYOU App', desc: '配套App同步查看全部健康数据与AI评估报告', disclaimer: false },
  { icon: '🔒', title: '本地数据加密', desc: '生理数据在设备端加密存储，隐私优先', disclaimer: false },
];

const FAQS = [
  {
    q: 'Ring1C是医疗器械吗？',
    a: 'Ring1C是消费级健康监测可穿戴设备，不是医疗器械。其监测数据和评估结果仅供日常健康参考，不能用于疾病诊断或治疗决策。如有健康疑虑，请咨询专业医疗机构。',
  },
  {
    q: '数据如何保护隐私？',
    a: '您的生理数据在设备端进行本地加密存储，同步到平台时采用端到端加密传输。我们严格遵守中国网络安全法和数据安全法，不会将您的个人健康数据用于商业目的或对外共享。',
  },
  {
    q: '如何下载配套App？',
    a: '配套的MATEYOU App将在产品发货时同步上线，支持iOS App Store和安卓各大应用商店下载，敬请期待。',
  },
  {
    q: '有哪些合作采购方式？',
    a: '我们支持医院合作、药房渠道铺货、OEM代工、区域代理和企业批量采购多种合作形式。请访问商业合作页面了解详情并提交意向登记。',
  },
];

export default function Ring1CPage() {
  const siteUrl = getSiteUrl();
  return (
    <>
      <ProductSchema
        name="Ring1C智能戒指"
        description="消费级健康监测智能戒指，集成PPG传感器，支持睡眠、HRV、血氧监测，IP68防水，续航7天"
        url={`${siteUrl}/products/ring1c`}
      />
      <BreadcrumbSchema items={[
        { name: '首页', url: siteUrl },
        { name: '产品介绍', url: `${siteUrl}/products/ring1c` },
      ]} />

      {/* Hero */}
      <section style={{ padding: '64px 24px 48px', background: 'linear-gradient(135deg, #F0F4FF 0%, #FFF 100%)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-brand)', fontWeight: 600, letterSpacing: 2, marginBottom: 16 }}>
              RING1C · 消费级健康监测
            </div>
            <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
              随时随地<br />守护你的健康
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>
              Ring1C 智能戒指搭载高精度PPG传感器，7×24小时持续追踪睡眠、心率、血氧等生理数据，配合MATEYOU AI评估引擎，提供个性化健康风险参考。
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/partner/enterprise" style={{
                padding: '12px 28px', background: 'var(--color-brand)', color: '#fff',
                borderRadius: 8, fontSize: 15, fontWeight: 600,
              }}>
                购买咨询
              </Link>
              <Link href="/assessment" style={{
                padding: '12px 28px', border: '1.5px solid var(--color-brand)',
                color: 'var(--color-brand)', borderRadius: 8, fontSize: 15, fontWeight: 600,
              }}>
                先做健康自评
              </Link>
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 16 }}>
              ⚠️ 非医疗器械，监测数据仅供健康参考，不构成医学诊断
            </p>
          </div>
          <div style={{ background: '#E8ECFF', borderRadius: 24, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>
            💍
          </div>
        </div>
      </section>

      {/* 功能 */}
      <section style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 700, marginBottom: 40 }}>核心功能</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ padding: 24, border: '1px solid var(--color-border)', borderRadius: 12 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>{f.title}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
                {f.disclaimer && (
                  <div style={{ marginTop: 8, fontSize: 11, color: 'var(--color-text-muted)' }}>*仅供健康参考，非医学诊断</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 参数 */}
      <section style={{ padding: '64px 24px', background: 'var(--color-surface-alt)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 700, marginBottom: 40 }}>产品参数</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {SPECS.map(([k, v], i) => (
                <tr key={k} style={{ background: i % 2 === 0 ? '#fff' : 'transparent' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--color-text-secondary)', width: '35%', fontSize: 14 }}>{k}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 700, marginBottom: 40 }}>常见问题</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FAQS.map(faq => (
              <div key={faq.q} style={{ padding: 20, border: '1px solid var(--color-border)', borderRadius: 10 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Q: {faq.q}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.7 }}>A: {faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 24px', background: 'var(--color-text-primary)', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>想了解更多或进行合作采购？</h2>
        <p style={{ opacity: 0.75, marginBottom: 32 }}>请通过合作页面提交意向，我们将在2个工作日内与您联系</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/partner" style={{
            padding: '13px 32px', background: 'var(--color-brand)', color: '#fff',
            borderRadius: 8, fontSize: 15, fontWeight: 600,
          }}>
            商业合作咨询
          </Link>
          <Link href="/assessment" style={{
            padding: '13px 32px', background: 'rgba(255,255,255,0.12)',
            color: '#fff', borderRadius: 8, fontSize: 15, fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.3)',
          }}>
            先免费做健康自评
          </Link>
        </div>
      </section>
    </>
  );
}
