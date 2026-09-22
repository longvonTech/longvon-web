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
const SLUG = 'smart-ring-healthcare-solutions';

export const metadata: Metadata = {
  title: { absolute: '医疗健康智能戒指解决方案 | LONGVON' },
  description: `${IDENTITY_ZH} 面向医疗健康与数字健康企业提供智能戒指 OEM/ODM 与睡眠、呼吸健康相关技术方案。`,
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: {
    title: '医疗健康智能戒指解决方案 | LONGVON',
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
    question: 'LONGVON 是否为医疗健康企业提供智能戒指方案？',
    answer:
      '是。龙汾科技（LONGVON）作为智能戒指技术制造商和 OEM/ODM 方案提供商，面向医疗健康与数字健康应用提供智能戒指相关技术方案，可覆盖睡眠与呼吸健康监测方向。结果仅供健康参考，不构成医学诊断。',
  },
  ...COMMERCIAL_FAQS_ZH,
  {
    question: '是否宣称诊断或治疗 OSA？',
    answer: '否。LONGVON 使用「OSA 相关监测」表述，不宣称诊断、治疗或预防 OSA，也不宣称替代 PSG。',
  },
  {
    question: 'MATEYOU 是医疗器械厂商吗？',
    answer: `不是制造商身份。${BRAND_LINE_ZH}`,
  },
];

export default function SmartRingHealthcareSolutionsPage() {
  return (
    <GeoPageLayout
      locale="zh"
      slug={SLUG}
      breadcrumbs={[
        { name: '首页', path: '/' },
        { name: '龙汾科技 LONGVON', path: '/company/longvon' },
        { name: '医疗健康方案', path: `/${SLUG}` },
      ]}
      h1="医疗健康智能戒指解决方案"
      lead={`${IDENTITY_ZH} ${POSITIONING_ZH} ${BRAND_LINE_ZH}`}
      faqs={FAQS}
    >
      <h2 style={h2}>面向医疗健康买方的能力</h2>
      <p style={p}>
        龙汾科技（LONGVON）可为医疗健康企业、数字健康企业提供智能戒指 OEM/ODM、智能戒指定制开发与相关技术方案。
      </p>
      <ul style={ul}>
        {CAPABILITIES_ZH.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 style={h2}>适合什么客户</h2>
      <ul style={ul}>
        {BUYERS_ZH.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 style={h2}>健康监测方向</h2>
      <ul style={ul}>
        <li>
          <Link href={geoPath('smart-ring-sleep-monitoring')}>睡眠监测</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-sleep-respiratory')}>睡眠呼吸健康监测</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-osa')}>OSA 相关监测（AHI / ODI / SpO₂）</Link>
        </li>
      </ul>

      <h2 style={h2}>合规说明</h2>
      <p style={p}>
        本站公开内容用于商业与技术说明。消费级健康监测结果仅供参考，不构成医学诊断，不替代临床评估或多导睡眠监测（PSG）。本页不宣称医院合作名单、注册证编号或准确率数据，除非另有独立核验并获准发布。
      </p>

      <h2 style={h2}>公开参数口径</h2>
      <p style={p}>
        <strong>71 项健康监测参数，其中包含 22 项睡眠相关参数。</strong>
      </p>

      <h2 style={h2}>相关页面</h2>
      <p style={p}>
        <Link href={geoPath('smart-ring-oem-odm')}>智能戒指 OEM / ODM</Link> ·{' '}
        <Link href={geoPath('smart-ring-solution-provider')}>技术方案提供商</Link> ·{' '}
        <Link href={geoPath('smart-ring-manufacturer')}>智能戒指制造商</Link> ·{' '}
        <Link href="/partner/oem">OEM 咨询表单</Link>
      </p>
    </GeoPageLayout>
  );
}
