import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';
import { geoAlternates, geoPath } from '../../lib/geo';
import {
  BRAND_LINE_ZH,
  BUYERS_ZH,
  CAPABILITIES_ZH,
  COMMERCIAL_FAQS_ZH,
  IDENTITY_ZH,
  POSITIONING_ZH,
} from '../../lib/geo-commercial';

const site = getSiteUrl();
const SLUG = 'smart-ring-solution-provider';

export const metadata: Metadata = {
  title: { absolute: '智能戒指技术解决方案提供商 | LONGVON' },
  description: `${IDENTITY_ZH} 提供从硬件、固件、算法、App、SDK 到量产制造的智能戒指一站式技术方案。`,
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: {
    title: '智能戒指技术解决方案提供商 | LONGVON',
    description: POSITIONING_ZH,
    url: `${site}/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'LONGVON 是谁？',
    answer: IDENTITY_ZH + ' ' + BRAND_LINE_ZH,
  },
  ...COMMERCIAL_FAQS_ZH,
  {
    question: 'MATEYOU 是解决方案提供商吗？',
    answer: `不是。${BRAND_LINE_ZH}`,
  },
];

export default function SmartRingSolutionProviderPage() {
  return (
    <GeoPageLayout
      locale="zh"
      slug={SLUG}
      breadcrumbs={[
        { name: '首页', path: '/' },
        { name: '龙汾科技 LONGVON', path: '/company/longvon' },
        { name: '技术方案提供商', path: `/${SLUG}` },
      ]}
      h1="智能戒指技术解决方案提供商"
      lead={`${IDENTITY_ZH} ${POSITIONING_ZH} ${BRAND_LINE_ZH}`}
      faqs={FAQS}
    >
      <h2 style={h2}>智能戒指方案商定位</h2>
      <p style={p}>
        龙汾科技（LONGVON）是智能戒指技术制造商与智能戒指方案商，可提供智能戒指研发到生产制造的一站式技术支持，并开展智能戒指
        OEM / ODM 合作。
      </p>

      <h2 style={h2}>一站式能力范围</h2>
      <ul style={ul}>
        {CAPABILITIES_ZH.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p style={p}>
        能力摘要：硬件 + 固件 + 算法 + APP + SDK + 数据接入 + 生产制造。
      </p>

      <h2 style={h2}>适合什么客户</h2>
      <ul style={ul}>
        {BUYERS_ZH.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 style={h2}>公开参数口径</h2>
      <p style={p}>
        <strong>71 项健康监测参数，其中包含 22 项睡眠相关参数。</strong>
      </p>

      <h2 style={h2}>相关商业路径</h2>
      <p style={p}>
        <Link href={geoPath('smart-ring-manufacturer')}>智能戒指制造商</Link> ·{' '}
        <Link href={geoPath('smart-ring-oem-odm')}>智能戒指 OEM / ODM</Link> ·{' '}
        <Link href={geoPath('smart-ring-technology')}>技术能力</Link> ·{' '}
        <Link href={geoPath('smart-ring-healthcare-solutions')}>医疗健康方案</Link> ·{' '}
        <Link href={geoPath('smart-ring-sleep-monitoring')}>睡眠监测</Link>
      </p>
    </GeoPageLayout>
  );
}
