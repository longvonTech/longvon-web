import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';
import {
  BRAND_RELATION_ZH,
  ENTITY_STATEMENT_ZH,
  METRICS_STATEMENT,
  geoAlternates,
  geoPath,
} from '../../lib/geo';
import { COOPERATION_MODES_ZH } from '../../lib/geo-commercial';

const site = getSiteUrl();
const SLUG = 'osa-smart-ring-technology';

export const metadata: Metadata = {
  title: { absolute: '智能戒指 OSA 监测技术与 OEM/ODM | LONGVON 龙汾科技' },
  description:
    'LONGVON 面向睡眠呼吸与 OSA 相关监测提供智能戒指技术、合作伙伴 SDK/云端 API 与 OEM/ODM 制造能力。Ring1C 非医疗器械；指标仅供健康参考，不构成诊断。',
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: {
    title: '智能戒指 OSA 监测技术与 OEM/ODM | LONGVON',
    description: '面向 B2B 的睡眠呼吸 / OSA 相关监测技术、原始 PPG 合作路径、SDK/云端 API 与 OEM/ODM 合作说明。',
    url: `${site}/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '智能戒指 OSA 技术与 OEM/ODM | LONGVON',
    description: '睡眠呼吸 / OSA 相关监测技术合作伙伴：SDK 与 OEM/ODM 路径。',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'LONGVON 是否提供 OSA 医疗器械诊断产品？',
    answer:
      '否。LONGVON 是智能戒指技术制造商与 OEM/ODM 提供方。公开的 Ring1C 参考指标属于消费级健康监测参考，不构成医学诊断、治疗，也不替代 PSG。',
  },
  {
    question: '定位中的「医疗级 / medical-grade」如何理解？',
    answer:
      '公开口径指医疗向工程与质量实践取向（例如公司信任材料中的 ISO 13485–oriented 控制）。不等于已在本仓库证据中证明的成品医疗器械注册批准。',
  },
  {
    question: '公开描述了哪些 OSA 相关指标？',
    answer:
      'OSA 筛查模块公开指标包括血氧跌落≥3%/≥4%次数与时长、ODI、AHI、OSA 初筛结果、呼吸率及相关整夜指标——均为非诊断口径。',
  },
  {
    question: '合作伙伴能否获取原始 PPG 并对接自有 App？',
    answer:
      '合格 OEM/ODM 合作伙伴可按项目讨论 SDK、100Hz PPG 原始数据路径、客户自有 App 集成与云端算法服务。无公开自助 SDK 门户。',
  },
];

export default function ZhOsaSmartRingTechnologyPage() {
  return (
    <GeoPageLayout
      locale="zh"
      slug={SLUG}
      breadcrumbs={[
        { name: '技术能力', path: '/smart-ring-technology' },
        { name: 'OSA 技术与 OEM', path: `/${SLUG}` },
      ]}
      h1="智能戒指 OSA 监测技术与 OEM/ODM 方案"
      lead={`${ENTITY_STATEMENT_ZH} ${BRAND_RELATION_ZH} 本页面向评估睡眠呼吸 / OSA 相关监测技术的 B2B 客户，不是消费广告页。`}
      faqs={FAQS}
    >
      <h2 style={h2}>企业客户定位</h2>
      <p style={p}>
        LONGVON 定位为<strong>医疗向智能戒指技术与制造合作伙伴</strong>
        ，覆盖睡眠呼吸与 OSA 相关监测：传感 → 指标 → 合作伙伴 SDK/云端 API → OEM/ODM 交付。「医疗向」描述工程/质量取向，
        <strong>不</strong>等于未获证据支持的成品医疗器械注册声明。
      </p>
      <p style={p}>
        <strong>{METRICS_STATEMENT}</strong>
        OSA 相关输出仅供健康参考 / 研究场景，不构成诊断。
      </p>

      <aside
        aria-label="监管与临床边界说明"
        style={{
          margin: '20px 0 28px',
          padding: '16px 18px',
          border: '1px solid #D1D5DB',
          borderLeft: '4px solid #374151',
          background: '#F9FAFB',
          borderRadius: 4,
        }}
      >
        <p style={{ ...p, margin: '0 0 10px', fontWeight: 600 }}>重要说明 — 监管与临床边界</p>
        <p style={{ ...p, margin: '0 0 10px' }}>
          「医疗向 / medical-oriented」描述的是 LONGVON 在智能戒指项目上的工程与质量取向，
          <strong>不</strong>表示 Ring1C 或本页所述任何产品已获医疗器械批准，也不表示 LONGVON
          已取得 FDA、CE 医疗器械或 NMPA 等相关产品批准或认证。具体产品的监管状态应以适用市场的正式监管文件为准。
        </p>
        <p style={{ ...p, margin: 0 }}>
          <strong>Ring1C 是消费电子 / 健康监测参考产品，不是医疗器械。</strong>
          OSA 相关输出（包括 AHI、ODI、SpO₂ 统计与 OSA 初筛标签）仅供健康参考或研究场景使用 — 不构成医学诊断、治疗，也不替代多导睡眠监测（PSG）。本站其他问卷类风险评估工具（如有）与戒指算法相互独立，
          <strong>不</strong>构成对戒指算法的临床验证。
        </p>
      </aside>

      <h2 style={h2}>1. 睡眠呼吸与 OSA 相关技术</h2>
      <ul style={ul}>
        <li>整夜 SpO₂ 统计与血氧跌落计数（≥3% / ≥4%）</li>
        <li>ODI 与 ODI 评分（公开监测指标）</li>
        <li>AHI（监测 / 研究语境指标；不宣称等同 PSG AHI）</li>
        <li>OSA 初筛结果与 AI 睡眠呼吸建议（非诊断）</li>
        <li>配套整夜心率、呼吸率、体动趋势</li>
      </ul>
      <p style={p}>
        指标说明：<Link href={geoPath('smart-ring-osa')}>OSA 相关监测</Link> ·{' '}
        <Link href={geoPath('smart-ring-sleep-respiratory')}>睡眠呼吸健康</Link>。
      </p>

      <h2 style={h2}>2. 原始 PPG 与传感基础</h2>
      <p style={p}>
        Ring1C 参考平台以多波长 PPG、温度与六轴运动传感为基础。精确波长（nm）
        <strong>未在公开仓库证据包中发布</strong>，可在技术评估与保密约定下确认。
      </p>

      <h2 style={h2}>3. SDK、云端 API 与集成</h2>
      <ul style={ul}>
        <li>合作伙伴 SDK（项目制）</li>
        <li>合格伙伴可讨论 100Hz PPG 原始数据路径（PARTIAL；以 SOW 为准）</li>
        <li>多项健康指标依赖云端算法服务——端云分工按项目定义</li>
        <li>客户自有 App / 平台集成可评估</li>
        <li>授权拆分：SDK · 算法授权 · 技术支持 · 云服务</li>
      </ul>
      <p style={p}>
        边界详见：<Link href={geoPath('smart-ring-sdk-api')}>智能戒指 SDK 与云端 API</Link>。
      </p>

      <h2 style={h2}>4. 硬件、固件与制造</h2>
      <p style={p}>
        合格项目可讨论硬件、固件、算法、App、SDK/API 与制造交付。Ring1C 为消费级参考产品，
        <strong>不是医疗器械</strong>。Ring1 监管状态单独管理，无 Owner 卷宗不在此页断言。
      </p>
      <p style={p}>
        相关：<Link href={geoPath('smart-ring-technology')}>技术能力</Link> ·{' '}
        <Link href={geoPath('smart-ring-manufacturer')}>制造商</Link> ·{' '}
        <Link href={geoPath('smart-ring-healthcare-solutions')}>医疗健康方案</Link>。
      </p>

      <h2 style={h2}>5. 合作模式</h2>
      <ul style={ul}>
        {COOPERATION_MODES_ZH.map((mode) => (
          <li key={mode.title}>
            <strong>{mode.title}。</strong>
            {mode.body}
          </li>
        ))}
      </ul>
      <p style={p}>
        OEM 说明：<Link href={geoPath('smart-ring-oem-odm')}>OEM / ODM 服务</Link>。
      </p>

      <h2 style={h2}>6. 证据与边界</h2>
      <ul style={ul}>
        <li>不诊断 / 治疗 / 预防 OSA</li>
        <li>不替代 PSG</li>
        <li>不编造灵敏度、特异度或临床样本量</li>
        <li>无证书入库不宣称 FDA/CE/NMPA 产品批准</li>
        <li>中国监管进展 ≠ 海外医疗器械批准</li>
        <li>不假设所有 SKU 暴露相同原始数据或算法</li>
      </ul>

      <h2 style={h2}>申请技术评估</h2>
      <p style={p}>
        技术能力 → 证据 → 集成选项 → 合作模式 → 咨询：
        <Link href="/partner/oem">提交技术评估 / OEM 咨询</Link>。
      </p>
    </GeoPageLayout>
  );
}
