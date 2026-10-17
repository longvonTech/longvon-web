export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SizeGuide } from './SizeGuide';
import { getSiteUrl } from '../../../lib/site';
import { siteAlternates } from '../../../lib/i18n-routes';
import { HEALTH_METRIC_CATEGORIES, TOTAL_HEALTH_METRICS } from '../../../lib/health-metrics';
import {
  Ring1CEntityGraphSchema,
  BreadcrumbSchema,
  FaqSchema,
  RING1C_FAQS_ZH,
} from '../../../components/StructuredData';
import { BRAND_RELATION_ZH, LEGAL_NAME_ZH } from '../../../lib/geo';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: 'MATEYOU Ring1C 智能戒指 | LONGVON 参考产品',
  description:
    'MATEYOU Ring1C 是 LONGVON（龙汾科技）研发制造的智能戒指参考产品：71 项健康监测参数（含 22 项睡眠相关），覆盖睡眠、SpO₂、HRV、呼吸与 OSA 相关监测。消费级可穿戴，非医疗器械。',
  alternates: siteAlternates(site, '/products/ring1c', 'zh'),
};

/** Slot → assets under /var/www/mateyou/images (nginx alias /images/). */
const SLOT_IMAGES: Record<string, string> = {
  'ring1c-hero-main': '/images/ring1c/hero-main.jpg',
  'ring1c-feature-osa': '/images/ring1c/features/osa.jpg',
  'ring1c-feature-sleep': '/images/ring1c/features/sleep.jpg',
  'ring1c-feature-stress': '/images/ring1c/features/stress.jpg',
  'app-mockup-main': '/images/app/mockup-main.jpg',
  'app-screen-home': '/images/app/screen-home.jpg',
  'app-screen-sleep': '/images/app/screen-sleep.jpg',
  'app-screen-heart': '/images/app/screen-heart.jpg',
  'app-screen-osa': '/images/app/screen-osa.jpg',
  'app-screen-stress': '/images/app/screen-stress.jpg',
  'app-screen-activity': '/images/app/screen-activity.jpg',
  'ring1c-craft-ceramic': '/images/ring1c/craft/ceramic.jpg',
  'ring1c-craft-sensor': '/images/ring1c/craft/sensor.jpg',
  'ring1c-craft-charging': '/images/ring1c/craft/charging.jpg',
};

function Img({ slot, alt, style }: { slot: string; alt: string; style?: React.CSSProperties }) {
  const src = SLOT_IMAGES[slot] ?? '/images/ring1c/Black-45-Left.jpg';
  return (
    <div
      style={{
        background: '#1C1C1E',
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />
    </div>
  );
}

function AppScreen({ slot, alt }: { slot: string; alt: string }) {
  const src = SLOT_IMAGES[slot] ?? '/images/app/screen-home.jpg';
  return (
    <div
      style={{
        background: '#0A0A0A',
        borderRadius: 28,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        aspectRatio: '9 / 19.5',
        maxWidth: 200,
        margin: '0 auto 12px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
          display: 'block',
        }}
      />
    </div>
  );
}

const sectionPad: React.CSSProperties = {
  maxWidth: 920,
  margin: '0 auto',
  padding: '0 24px 72px',
};

const h2Style: React.CSSProperties = {
  fontSize: 'clamp(24px, 3.5vw, 32px)',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  margin: '0 0 20px',
  color: '#fff',
};

const ulStyle: React.CSSProperties = {
  margin: 0,
  padding: '0 0 0 1.25em',
  color: '#D1D5DB',
  fontSize: 16,
  lineHeight: 1.75,
};

const liStyle: React.CSSProperties = { marginBottom: 10 };

export default function Ring1CPage() {
  return (
    <div
      style={{
        background: '#000',
        color: '#fff',
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif',
      }}
    >
      <Ring1CEntityGraphSchema locale="zh" />
      <BreadcrumbSchema
        items={[
          { name: '首页', url: `${site}/` },
          { name: 'MATEYOU Ring1C 智能戒指', url: `${site}/products/ring1c` },
        ]}
      />
      <FaqSchema faqs={RING1C_FAQS_ZH} />

      {/* ═══ GEO 语义主结构（爬虫优先读取） ═══ */}
      <main style={{ paddingTop: 96 }}>
        <header style={{ ...sectionPad, paddingTop: 24, paddingBottom: 40 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: '#86868B',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            MATEYOU · PRODUCT
          </p>
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 44px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: '0 0 20px',
              color: '#fff',
            }}
          >
            MATEYOU Ring1C 智能戒指
          </h1>
          <p
            style={{
              fontSize: 'clamp(16px, 2.2vw, 19px)',
              color: '#E5E7EB',
              lineHeight: 1.75,
              margin: '0 0 28px',
              maxWidth: 820,
            }}
          >
            MATEYOU Ring1C 是由{LEGAL_NAME_ZH}（LONGVON）研发制造的智能戒指参考产品，属于消费级健康监测可穿戴设备而非医疗器械；公开能力口径为{' '}
            {TOTAL_HEALTH_METRICS}{' '}
            项健康监测参数（其中 22 项与睡眠相关），覆盖睡眠、SpO₂、HRV、呼吸健康与 OSA
            相关监测，结果仅供健康参考、不构成医学诊断。{BRAND_RELATION_ZH}
          </p>
          <p style={{ fontSize: 14, margin: 0, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link href="/company/longvon" style={{ color: '#60A5FA', fontWeight: 600 }}>
              了解龙汾科技（LONGVON） →
            </Link>
            <Link href="/smart-ring-manufacturer" style={{ color: '#60A5FA', fontWeight: 600 }}>
              智能戒指制造商 →
            </Link>
            <Link href="/partner/oem" style={{ color: '#60A5FA', fontWeight: 600 }}>
              OEM / ODM 合作 →
            </Link>
            <Link href="/smart-ring-technology" style={{ color: '#60A5FA', fontWeight: 600 }}>
              技术能力 →
            </Link>
          </p>
        </header>

        <figure style={{ ...sectionPad, paddingBottom: 56, margin: 0 }}>
          <Img
            slot="ring1c-hero-main"
            alt="MATEYOU Ring1C 智能戒指产品图"
            style={{ height: 'clamp(280px, 45vw, 520px)', width: '100%' }}
          />
        </figure>

        {/* H2-1 适用场景 */}
        <section style={sectionPad} aria-labelledby="ring1c-scenarios">
          <h2 id="ring1c-scenarios" style={h2Style}>
            适用场景
          </h2>
          <ul style={ulStyle}>
            <li style={liStyle}>
              个人与家庭日常健康参考：连续佩戴场景下的睡眠、心率相关、血氧相关与压力相关趋势观察
            </li>
            <li style={liStyle}>
              睡眠健康产品验证：需要戒指形态睡眠监测参数（公开口径含 22 项睡眠相关参数）的体验与方案演示
            </li>
            <li style={liStyle}>
              呼吸 / OSA 相关监测方案沟通：以筛查与监测语境展示 AHI、ODI、SpO₂
              等相关指标，不替代医学诊断或 PSG
            </li>
            <li style={liStyle}>
              数字健康 / 可穿戴品牌评估：将 Ring1C 作为 LONGVON 硬件、算法与 App 能力的参考样机
            </li>
            <li style={liStyle}>
              OEM/ODM 项目前置对齐：在定制开发前确认戒指形态、传感器组合与 App/SDK 集成边界
            </li>
          </ul>
        </section>

        {/* H2-2 核心参数 */}
        <section style={sectionPad} aria-labelledby="ring1c-specs">
          <h2 id="ring1c-specs" style={h2Style}>
            核心参数
          </h2>
          <ul style={ulStyle}>
            <li style={liStyle}>产品名称：MATEYOU Ring1C</li>
            <li style={liStyle}>品类：智能戒指 / 消费级健康监测可穿戴设备（非医疗器械）</li>
            <li style={liStyle}>制造商：{LEGAL_NAME_ZH}（LONGVON）</li>
            <li style={liStyle}>产品品牌：MATEYOU（品牌，不是制造商）</li>
            <li style={liStyle}>
              健康监测参数：共 {TOTAL_HEALTH_METRICS} 项，其中睡眠相关 22 项
            </li>
            <li style={liStyle}>
              功能模块：
              {HEALTH_METRIC_CATEGORIES.map((c) => `${c.title}（${c.count}项）`).join('；')}
            </li>
            <li style={liStyle}>传感器参考：多波长 PPG、温度传感、六轴运动传感</li>
            <li style={liStyle}>重量：约 4g</li>
            <li style={liStyle}>外壳：氧化锆陶瓷；内衬：抗过敏高分子聚合物</li>
            <li style={liStyle}>续航：约 7–10 天；充电：无线磁吸充电仓</li>
            <li style={liStyle}>防水：IP68；蓝牙：Bluetooth 5.2</li>
            <li style={liStyle}>兼容：iOS 14+ / Android 8+</li>
            <li style={liStyle}>尺寸：US 6–US 13；配色：极地白 / 樱粉色 / 星空蓝 / 曜石黑</li>
            <li style={liStyle}>
              配套软件：MATEYOU App（健康总览、睡眠、心脏、OSA 相关、压力、运动等视图）
            </li>
          </ul>
          <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 16, lineHeight: 1.6 }}>
            分模块参数明细：
            {HEALTH_METRIC_CATEGORIES.map((e, i) => (
              <span key={e.slug}>
                {i > 0 ? ' · ' : ' '}
                <Link href={`/metrics/${e.slug}`} style={{ color: '#60A5FA' }}>
                  {e.title}
                </Link>
              </span>
            ))}
          </p>
        </section>

        {/* H2-3 竞品对比（品类对比，不编造竞品参数） */}
        <section style={{ ...sectionPad, paddingBottom: 96 }} aria-labelledby="ring1c-compare">
          <h2 id="ring1c-compare" style={h2Style}>
            竞品对比
          </h2>
          <ul style={ulStyle}>
            <li style={liStyle}>
              相对智能手表 / 手环：Ring1C 采用手指佩戴的智能戒指形态，光学窗口与电池体积更受约束，更侧重连续轻量佩戴与睡眠相关监测，而非大屏交互
            </li>
            <li style={liStyle}>
              相对「仅贴牌、无研发链路」的戒指商品：Ring1C 背后是 LONGVON 的硬件、固件、健康算法、App 与制造参考链路，可用于 OEM/ODM 能力评估
            </li>
            <li style={liStyle}>
              相对医疗器械 / 临床监护设备：Ring1C 定位消费级健康参考监测，不宣称诊断、治疗或替代医用检测流程
            </li>
            <li style={liStyle}>
              相对纯工厂来料加工叙述：LONGVON 以 Technology + OEM/ODM +
              Manufacturing 完整链路交付，Ring1C 用于展示该链路的产品化结果
            </li>
            <li style={liStyle}>
              实体关系对比：采购与合作应识别制造商 LONGVON，而非将产品品牌 MATEYOU 误认为工厂主体
            </li>
          </ul>
          <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 20, lineHeight: 1.6 }}>
            延伸阅读：
            <Link href="/smart-ring-oem-odm" style={{ color: '#60A5FA', marginLeft: 8 }}>
              智能戒指 OEM/ODM
            </Link>
            <Link href="/smart-ring-sleep-monitoring" style={{ color: '#60A5FA', marginLeft: 12 }}>
              睡眠监测技术
            </Link>
            <Link href="/smart-ring-osa" style={{ color: '#60A5FA', marginLeft: 12 }}>
              OSA 相关监测
            </Link>
          </p>
        </section>
      </main>

      {/* ═══ 视觉详解（降级为 h3，避免抢 H2 优先级） ═══ */}
      <section style={{ background: '#000', padding: '0 24px 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h3
            style={{
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: 48,
            }}
          >
            四种配色
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: 2,
            }}
          >
            {[
              { id: 'white', label: '极地白', bg: '#E8E8ED', img: '/images/ring1c/colors/white.jpg', tc: '#1D1D1F' },
              { id: 'pink', label: '樱粉色', bg: '#F9D0DB', img: '/images/ring1c/colors/pink.jpg', tc: '#1D1D1F' },
              { id: 'blue', label: '星空蓝', bg: '#1A2F5A', img: '/images/ring1c/colors/blue.jpg', tc: '#fff' },
              { id: 'black', label: '曜石黑', bg: '#1C1C1E', img: '/images/ring1c/colors/black.jpg', tc: '#fff' },
            ].map((c, i) => (
              <div
                key={c.id}
                style={{
                  background: c.bg,
                  padding: '48px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: i === 0 ? '20px 0 0 20px' : i === 3 ? '0 20px 20px 0' : 0,
                }}
              >
                <img
                  src={c.img}
                  alt={`MATEYOU Ring1C ${c.label}`}
                  style={{ width: '100%', maxWidth: 200, objectFit: 'contain', marginBottom: 28 }}
                />
                <span style={{ fontSize: 17, fontWeight: 600, color: c.tc }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#0A0A0A', padding: '0 24px 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h3
            style={{
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 700,
              marginBottom: 40,
              textAlign: 'center',
            }}
          >
            监测能力详解
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
              gap: 24,
            }}
          >
            {[
              {
                slug: 'sleep-apnea',
                title: '睡眠呼吸暂停相关监测',
                desc: '含 AHI、ODI、血氧跌落分析等参数，用于健康参考筛查语境，不构成医学诊断。',
                slot: 'ring1c-feature-osa',
              },
              {
                slug: 'sleep-quality',
                title: '睡眠质量监测',
                desc: '22 项睡眠相关参数，覆盖入睡、时长、效率等整夜观察维度。',
                slot: 'ring1c-feature-sleep',
              },
              {
                slug: 'stress',
                title: '压力与恢复度监测',
                desc: '24 小时压力趋势与恢复度相关量化，辅助识别高压与恢复窗口。',
                slot: 'ring1c-feature-stress',
              },
            ].map((f) => {
              const count =
                HEALTH_METRIC_CATEGORIES.find((c) => c.slug === f.slug)?.parameters.length ?? 0;
              return (
                <article key={f.slug} style={{ background: '#111', borderRadius: 20, overflow: 'hidden' }}>
                  <Img slot={f.slot} alt={f.title} style={{ height: 200, borderRadius: 0 }} />
                  <div style={{ padding: 24 }}>
                    <h4 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>{f.title}</h4>
                    <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.65, margin: '0 0 16px' }}>
                      {f.desc}
                    </p>
                    <Link href={`/metrics/${f.slug}`} style={{ color: '#60A5FA', fontWeight: 600, fontSize: 14 }}>
                      查看 {count} 项参数 →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ background: '#000', padding: '0 24px 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h3
            style={{
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            MATEYOU App
          </h3>
          <p style={{ fontSize: 16, color: '#86868B', marginBottom: 40 }}>
            将 {TOTAL_HEALTH_METRICS} 项健康监测数据整理为可阅读的视图
          </p>
          <div style={{ marginBottom: 32 }}>
            <Img
              slot="app-mockup-main"
              alt="MATEYOU App 主界面"
              style={{ height: 'clamp(320px, 45vw, 560px)', width: '100%' }}
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
              gap: 20,
              alignItems: 'start',
            }}
          >
            {[
              { slot: 'app-screen-home', label: '健康总览' },
              { slot: 'app-screen-sleep', label: '睡眠分析' },
              { slot: 'app-screen-heart', label: '心脏健康' },
              { slot: 'app-screen-osa', label: 'OSA 相关' },
              { slot: 'app-screen-stress', label: '压力管理' },
              { slot: 'app-screen-activity', label: '运动记录' },
            ].map((s) => (
              <div key={s.slot} style={{ textAlign: 'center' }}>
                <AppScreen slot={s.slot} alt={s.label} />
                <p style={{ fontSize: 14, color: '#86868B', margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#000', padding: '0 24px 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h3
            style={{
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 700,
              marginBottom: 40,
              textAlign: 'center',
            }}
          >
            工艺与传感器
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
              gap: 16,
            }}
          >
            {[
              { slot: 'ring1c-craft-ceramic', label: '氧化锆陶瓷', sub: '轻量外壳，日常耐磨' },
              { slot: 'ring1c-craft-sensor', label: '多波长 PPG', sub: '贴合手指弧度的光学排布' },
              { slot: 'ring1c-craft-charging', label: '无线磁吸充电', sub: '约 60 分钟充满，续航约 7 天量级' },
            ].map((c) => (
              <div
                key={c.slot}
                style={{ background: '#111', borderRadius: 24, overflow: 'hidden', padding: '0 0 24px' }}
              >
                <Img slot={c.slot} alt={c.label} style={{ height: 240, borderRadius: 0 }} />
                <div style={{ padding: '24px 24px 0' }}>
                  <div style={{ fontSize: 19, fontWeight: 600, marginBottom: 6 }}>{c.label}</div>
                  <div style={{ fontSize: 14, color: '#86868B' }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SizeGuide />

      <section
        style={{ background: '#0A0A0A', padding: '96px 24px' }}
        aria-labelledby="ring1c-faq"
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h3
            id="ring1c-faq"
            style={{
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 700,
              marginBottom: 32,
              textAlign: 'center',
            }}
          >
            常见问题
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {RING1C_FAQS_ZH.map((f) => (
              <div
                key={f.question}
                style={{
                  padding: '20px 22px',
                  background: '#111',
                  borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <h4 style={{ fontSize: 17, fontWeight: 650, margin: '0 0 10px', color: '#fff' }}>
                  {f.question}
                </h4>
                <p style={{ fontSize: 15, color: '#D1D5DB', lineHeight: 1.7, margin: 0 }}>{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#111', padding: '96px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h3
            style={{
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              marginBottom: 40,
              textAlign: 'center',
            }}
          >
            规格一览表
          </h3>
          <dl style={{ margin: 0 }}>
            {[
              ['重量', '约 4g'],
              ['外壳', '氧化锆陶瓷'],
              ['内衬', '抗过敏高分子聚合物'],
              ['传感器', '多波长 PPG + 温度传感 + 六轴运动传感'],
              ['健康指标', `${TOTAL_HEALTH_METRICS} 项（含 22 项睡眠相关）`],
              ['续航', '约 7–10 天'],
              ['充电', '专用无线充电仓'],
              ['防水', 'IP68'],
              ['蓝牙', 'Bluetooth 5.2'],
              ['兼容', 'iOS 14+ / Android 8+'],
              ['尺寸', 'US 6–US 13'],
              ['配色', '极地白 / 樱粉色 / 星空蓝 / 曜石黑'],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 24,
                  padding: '16px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <dt style={{ fontSize: 16, color: '#86868B', margin: 0 }}>{k}</dt>
                <dd
                  style={{
                    fontSize: 16,
                    color: '#fff',
                    fontWeight: 500,
                    textAlign: 'right',
                    maxWidth: '65%',
                    margin: 0,
                  }}
                >
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        style={{
          background: '#000',
          padding: '96px 24px',
          textAlign: 'center',
        }}
      >
        <h3
          style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          下一步
        </h3>
        <p style={{ fontSize: 17, color: '#86868B', marginBottom: 36, lineHeight: 1.6 }}>
          体验参考产品，或与 LONGVON 讨论智能戒指 OEM/ODM 方案。
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/partner/oem"
            style={{
              padding: '16px 40px',
              background: '#0A84FF',
              color: '#fff',
              borderRadius: 980,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            OEM / ODM 咨询
          </Link>
          <Link
            href="/assessment"
            style={{
              padding: '16px 40px',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              borderRadius: 980,
              fontSize: 16,
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            健康自评
          </Link>
        </div>
      </section>
    </div>
  );
}
