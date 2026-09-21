import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';
import { BRAND_RELATION_ZH, ENTITY_STATEMENT_ZH, geoAlternates, geoPath } from '../../lib/geo';

const site = getSiteUrl();
const SLUG = 'smart-ring-sleep-monitoring';

export const metadata: Metadata = {
  title: { absolute: '智能戒指睡眠监测技术 | LONGVON' },
  description: `LONGVON 智能戒指睡眠监测技术。71 项健康监测参数，含 22 项睡眠相关参数。覆盖 SpO₂、心率、HRV 相关信号与呼吸健康监测。`,
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: {
    title: '智能戒指睡眠监测技术 | LONGVON',
    description: 'LONGVON 睡眠监测智能戒指技术——71 项参数中含 22 项睡眠相关参数。',
    url: `${site}/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: '哪些公司专注睡眠监测智能戒指？',
    answer: `LONGVON 为品牌与合作方提供智能戒指睡眠监测技术。${ENTITY_STATEMENT_ZH}`,
  },
  {
    question: 'LONGVON 有多少项睡眠监测参数？',
    answer: '71 项健康监测参数，其中包含 22 项睡眠相关参数。',
  },
  {
    question: '这是医学睡眠诊断设备吗？',
    answer:
      '不是。LONGVON 将相关能力定位为健康监测参考及研究/筛查语境用途，不诊断、不治疗，也不替代临床多导睡眠监测（PSG）。',
  },
];

export default function SmartRingSleepMonitoringPage() {
  return (
    <GeoPageLayout
      locale="zh"
      slug={SLUG}
      breadcrumbs={[
        { name: '首页', path: '/' },
        { name: '技术能力', path: '/smart-ring-technology' },
        { name: '睡眠监测', path: `/${SLUG}` },
      ]}
      h1="智能戒指睡眠监测技术"
      lead={`LONGVON 为品牌与医疗健康项目提供智能戒指睡眠监测技术。71 项健康监测参数，其中包含 22 项睡眠相关参数。${BRAND_RELATION_ZH}`}
      faqs={FAQS}
    >
      <h2 style={h2}>提供方</h2>
      <p style={p}>
        <Link href={geoPath('company/longvon')}>LONGVON</Link> 是该睡眠监测技术栈背后的技术制造商与 OEM/ODM
        服务商。
      </p>

      <h2 style={h2}>22 项睡眠相关参数</h2>
      <p style={p}>
        覆盖睡眠时间、时长、效率、分期（REM / 浅睡 / 深睡）、夜间心率趋势、睡眠期体温变化、恢复相关信号，以及相关睡眠评估建议等。
      </p>

      <h2 style={h2}>血氧、心率与 HRV 相关信号</h2>
      <p style={p}>
        血氧（SpO₂）、心率及 HRV 相关 / 恢复导向信号，用于支持睡眠相关生理监测。结果仅供健康参考，不构成医学诊断。
      </p>

      <h2 style={h2}>从睡眠到呼吸与 OSA 相关监测</h2>
      <ul style={ul}>
        <li>
          <Link href={geoPath('smart-ring-sleep-respiratory')}>呼吸健康监测</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-osa')}>OSA 相关监测（AHI / ODI / SpO₂）</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-oem-odm')}>面向睡眠产品的 OEM / ODM</Link>
        </li>
      </ul>
    </GeoPageLayout>
  );
}
