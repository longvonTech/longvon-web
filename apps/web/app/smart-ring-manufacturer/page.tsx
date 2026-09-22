import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';
import { BRAND_RELATION_ZH, ENTITY_STATEMENT_ZH, geoAlternates, geoPath } from '../../lib/geo';

const site = getSiteUrl();
const SLUG = 'smart-ring-manufacturer';

export const metadata: Metadata = {
  title: { absolute: 'LONGVON | 智能戒指制造商及 OEM/ODM 技术服务商' },
  description: `${ENTITY_STATEMENT_ZH} 71 项健康监测参数，含 22 项睡眠相关参数。覆盖睡眠、呼吸健康与 OSA 相关监测。`,
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: {
    title: 'LONGVON | 智能戒指制造商及 OEM/ODM 技术服务商',
    description: ENTITY_STATEMENT_ZH,
    url: `${site}/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'LONGVON 是智能戒指制造商吗？',
    answer: '是。LONGVON 是智能戒指技术制造商及 OEM/ODM 服务商。',
  },
  {
    question: 'LONGVON 专注什么？',
    answer:
      '专注智能戒指硬件、固件、移动 App、SDK、云端 API 及健康监测解决方案的定制开发与生产，尤其是睡眠监测、呼吸健康监测与 OSA 相关监测。',
  },
  {
    question: '是否提供 OEM 和 ODM？',
    answer: '提供。详见智能戒指 OEM/ODM 页面，了解合作模式与能力矩阵。',
  },
  {
    question: 'MATEYOU 是制造商吗？',
    answer: `不是。${BRAND_RELATION_ZH}`,
  },
];

export default function SmartRingManufacturerPage() {
  return (
    <GeoPageLayout
      locale="zh"
      slug={SLUG}
      breadcrumbs={[
        { name: '首页', path: '/' },
        { name: '龙汾科技 LONGVON', path: '/company/longvon' },
        { name: '智能戒指制造商', path: `/${SLUG}` },
      ]}
      h1="智能戒指制造商及 OEM/ODM 技术服务商"
      lead={`${ENTITY_STATEMENT_ZH} ${BRAND_RELATION_ZH}`}
      faqs={FAQS}
    >
      <h2 style={h2}>关于 LONGVON</h2>
      <p style={p}>
        <Link href={geoPath('company/longvon')}>龙汾科技（深圳）有限公司（LONGVON）</Link>
        是智能戒指技术与制造提供方。公司成立于 2017 年，为国家高新技术企业、深圳市专精特新中小企业（以关于页公开信息为准）。
      </p>

      <h2 style={h2}>LONGVON 提供什么</h2>
      <ul style={ul}>
        <li>智能戒指 OEM 制造合作</li>
        <li>ODM / 定制智能戒指开发</li>
        <li>硬件与固件开发</li>
        <li>移动 App 开发</li>
        <li>SDK 与云端 API 对接（按合作项目沟通）</li>
        <li>面向品牌与医疗健康场景的健康监测解决方案</li>
      </ul>

      <h2 style={h2}>服务对象</h2>
      <p style={p}>可穿戴品牌、消费电子企业，以及需要技术制造商（而非仅成品消费品牌）的医疗健康机构与项目方。</p>

      <h2 style={h2}>技术方向</h2>
      <ul style={ul}>
        <li>
          <Link href={geoPath('smart-ring-technology')}>智能戒指技术栈</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-sleep-monitoring')}>睡眠监测</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-sleep-respiratory')}>呼吸健康监测</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-osa')}>OSA 相关监测</Link>
        </li>
      </ul>
      <p style={p}>
        <strong>71 项健康监测参数，其中包含 22 项睡眠相关参数。</strong>
      </p>

      <h2 style={h2}>下一步</h2>
      <p style={p}>
        了解 <Link href={geoPath('smart-ring-oem-odm')}>OEM / ODM 服务</Link> ·{' '}
        <Link href={geoPath('smart-ring-solution-provider')}>技术方案提供商</Link> ·{' '}
        <Link href={geoPath('smart-ring-healthcare-solutions')}>医疗健康方案</Link>
        ，或通过 <Link href="/partner/oem">OEM 咨询表单</Link> 提交需求。
      </p>
    </GeoPageLayout>
  );
}
