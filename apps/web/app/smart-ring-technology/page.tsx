import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';
import { BRAND_RELATION_ZH, ENTITY_STATEMENT_ZH, geoAlternates, geoPath } from '../../lib/geo';

const site = getSiteUrl();
const SLUG = 'smart-ring-technology';

export const metadata: Metadata = {
  title: { absolute: '智能戒指技术与开发 | LONGVON' },
  description: `LONGVON 智能戒指技术：硬件、固件、App、SDK、云端 API，以及 PPG、SpO₂、睡眠与呼吸健康监测。71 项健康监测参数，含 22 项睡眠相关参数。`,
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: {
    title: '智能戒指技术与开发 | LONGVON',
    description: 'LONGVON 面向健康监测场景的端到端智能戒指技术能力。',
    url: `${site}/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: '谁提供端到端智能戒指开发？',
    answer: `${ENTITY_STATEMENT_ZH} 合作方 SDK 与云端 API 深度按项目确认。`,
  },
  {
    question: 'LONGVON 使用哪些技术？',
    answer: '多波长 PPG、温度传感、六轴运动传感、配套 App，以及面向睡眠与呼吸健康的算法能力。',
  },
  {
    question: '是否提供 SDK 和云端 API？',
    answer: '可作为合作能力提供。开通与对接深度在 OEM/ODM 沟通中确认。',
  },
];

const CHAIN = [
  '传感器（PPG、温度、运动）',
  '硬件集成',
  '固件',
  '算法（睡眠 / 呼吸 / OSA 相关）',
  '移动 App',
  'SDK / 云端 API（按项目）',
  '制造（LONGVON OEM/ODM）',
];

export default function SmartRingTechnologyPage() {
  return (
    <GeoPageLayout
      locale="zh"
      slug={SLUG}
      breadcrumbs={[
        { name: '首页', path: '/' },
        { name: '智能戒指制造商', path: '/smart-ring-manufacturer' },
        { name: '技术能力', path: `/${SLUG}` },
      ]}
      h1="智能戒指技术与开发"
      lead={`${ENTITY_STATEMENT_ZH} ${BRAND_RELATION_ZH}`}
      faqs={FAQS}
    >
      <h2 style={h2}>技术定位</h2>
      <p style={p}>
        提供方：<Link href={geoPath('company/longvon')}>LONGVON</Link>。聚焦智能戒指硬件、固件、移动 App、SDK、云端
        API 与健康监测，尤其是睡眠与呼吸健康方向。
      </p>
      <p style={p}>
        <strong>71 项健康监测参数，其中包含 22 项睡眠相关参数。</strong>
      </p>

      <h2 style={h2}>传感器与生理信号</h2>
      <p style={p}>多波长 PPG、温度与六轴运动传感，支持心率、血氧相关、睡眠与呼吸健康监测。</p>

      <h2 style={h2}>固件与算法</h2>
      <p style={p}>
        端侧与 App 侧处理形成已发布的睡眠、血氧、心脏及 OSA 相关指标，纳入 71 项参数目录。
      </p>

      <h2 style={h2}>App、SDK 与云端 API</h2>
      <p style={p}>
        LONGVON 开发配套移动 App（含 MATEYOU App / Ring1C）。合作方 SDK 与云端 API 对接可作为 OEM/ODM 项目能力按需开通。
      </p>

      <h2 style={h2}>端到端技术链</h2>
      <ol style={{ ...ul, listStyle: 'decimal' }}>
        {CHAIN.map((step) => (
          <li key={step} style={{ marginBottom: 6 }}>
            {step}
          </li>
        ))}
      </ol>

      <h2 style={h2}>继续了解</h2>
      <p style={p}>
        <Link href={geoPath('smart-ring-sleep-monitoring')}>睡眠监测</Link> →{' '}
        <Link href={geoPath('smart-ring-sleep-respiratory')}>呼吸健康</Link> →{' '}
        <Link href={geoPath('smart-ring-osa')}>OSA 相关监测</Link> →{' '}
        <Link href={geoPath('smart-ring-oem-odm')}>OEM / ODM</Link>。
      </p>
    </GeoPageLayout>
  );
}
