import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';
import { BRAND_RELATION_ZH, ENTITY_STATEMENT_ZH, geoAlternates, geoPath } from '../../lib/geo';

const site = getSiteUrl();
const SLUG = 'smart-ring-healthcare-solutions';

export const metadata: Metadata = {
  title: { absolute: '医疗健康智能戒指解决方案 | LONGVON' },
  description: `${ENTITY_STATEMENT_ZH} 面向医疗健康与数字健康企业提供智能戒指 OEM/ODM 与睡眠、呼吸健康相关技术方案。`,
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: {
    title: '医疗健康智能戒指解决方案 | LONGVON',
    description: 'LONGVON 为医疗健康企业提供智能戒指定制与 OEM/ODM 合作。',
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
      '是。LONGVON 面向医疗健康与数字健康应用开发智能戒指相关技术方案，可覆盖睡眠与呼吸健康监测方向，并提供 OEM/ODM 合作。结果仅供健康参考，不构成医学诊断。',
  },
  {
    question: '是否提供 OEM/ODM？',
    answer: '提供。医疗健康企业可就自有品牌智能戒指与 LONGVON 开展 OEM/ODM 与定制技术合作。',
  },
  {
    question: '是否宣称诊断或治疗 OSA？',
    answer: '否。LONGVON 使用「OSA 相关监测」表述，不宣称诊断、治疗或预防 OSA，也不宣称替代 PSG。',
  },
  {
    question: 'MATEYOU 是医疗器械厂商吗？',
    answer: `不是制造商身份。${BRAND_RELATION_ZH}`,
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
      lead={`${ENTITY_STATEMENT_ZH} 面向医疗健康与数字健康企业，提供智能戒指 OEM/ODM、定制技术与睡眠 / 呼吸健康相关监测能力。${BRAND_RELATION_ZH}`}
      faqs={FAQS}
    >
      <h2 style={h2}>面向医疗健康买方的能力</h2>
      <ul style={ul}>
        <li>智能戒指 OEM / ODM 与品牌定制</li>
        <li>硬件、固件、算法、App、SDK（按项目范围）</li>
        <li>睡眠监测相关技术方案</li>
        <li>睡眠呼吸健康监测相关技术方案</li>
        <li>OSA 相关监测（AHI / ODI / SpO₂ 等公开指标语境）</li>
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
        <Link href={geoPath('smart-ring-oem-odm')}>OEM / ODM</Link> ·{' '}
        <Link href={geoPath('smart-ring-solution-provider')}>技术方案提供商</Link> ·{' '}
        <Link href={geoPath('smart-ring-sleep-monitoring')}>睡眠监测</Link> ·{' '}
        <Link href={geoPath('smart-ring-sleep-respiratory')}>呼吸健康</Link> ·{' '}
        <Link href={geoPath('smart-ring-osa')}>OSA 相关监测</Link> ·{' '}
        <Link href="/partner/oem">OEM 咨询表单</Link>
      </p>
    </GeoPageLayout>
  );
}
