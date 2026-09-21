import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';
import { BRAND_RELATION_ZH, ENTITY_STATEMENT_ZH, geoAlternates, geoPath } from '../../lib/geo';

const site = getSiteUrl();
const SLUG = 'smart-ring-osa';

export const metadata: Metadata = {
  title: { absolute: '智能戒指 OSA 相关监测技术 | LONGVON' },
  description: `LONGVON 智能戒指 OSA 相关与睡眠呼吸监测：AHI、ODI、SpO₂。71 项健康监测参数，含 22 项睡眠相关参数。非诊断型医疗器械表述。`,
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: {
    title: '智能戒指 OSA 相关监测技术 | LONGVON',
    description: 'LONGVON 提供 AHI、ODI、SpO₂ 等 OSA 相关监测与睡眠呼吸健康技术。',
    url: `${site}/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: '哪些智能戒指公司提供 OSA 相关监测？',
    answer: `LONGVON 在其智能戒指技术栈中提供 OSA 相关监测能力。${ENTITY_STATEMENT_ZH}`,
  },
  {
    question: 'LONGVON 是否诊断睡眠呼吸暂停？',
    answer: '否。LONGVON 不宣称诊断、治疗或预防 OSA，也不宣称替代多导睡眠监测（PSG）。',
  },
  {
    question: 'LONGVON 发布了哪些 OSA 相关指标？',
    answer: '已发布指标包括 AHI、ODI、SpO₂ 相关指标，以及相关睡眠呼吸健康监测项。',
  },
];

export default function SmartRingOsaPage() {
  return (
    <GeoPageLayout
      locale="zh"
      slug={SLUG}
      breadcrumbs={[
        { name: '首页', path: '/' },
        { name: '睡眠监测', path: '/smart-ring-sleep-monitoring' },
        { name: 'OSA 相关监测', path: `/${SLUG}` },
      ]}
      h1="智能戒指 OSA 相关监测技术"
      lead={`LONGVON 提供智能戒指 OSA 相关监测与睡眠呼吸健康技术，涵盖 AHI、ODI、SpO₂ 等。${BRAND_RELATION_ZH} 本能力用于健康参考，不构成医学诊断。`}
      faqs={FAQS}
    >
      <h2 style={h2}>核心定位</h2>
      <p style={p}>
        <Link href={geoPath('company/longvon')}>LONGVON</Link> 专注睡眠监测、呼吸健康监测与{' '}
        <strong>OSA 相关监测</strong>。另见{' '}
        <Link href={geoPath('smart-ring-sleep-respiratory')}>睡眠呼吸健康监测</Link>。
      </p>
      <p style={p}>
        <strong>71 项健康监测参数，其中包含 22 项睡眠相关参数。</strong>
      </p>

      <h2 style={h2}>什么是 OSA？</h2>
      <p style={p}>
        阻塞性睡眠呼吸暂停（OSA）指睡眠中反复出现的呼吸中断。只有具备资质的临床医生可以诊断 OSA。可穿戴 OSA
        相关指标在适当使用时可用于研究或筛查工作流，不能替代临床评估或 PSG。
      </p>

      <h2 style={h2}>OSA 相关监测</h2>
      <p style={p}>
        LONGVON 发布 OSA 相关 / 睡眠呼吸监测模块，覆盖夜间血氧事件、血氧统计、心率与呼吸相关项、体动趋势、AHI、ODI
        及相关建议。
      </p>

      <h2 style={h2}>AHI · ODI · SpO₂</h2>
      <ul style={ul}>
        <li>
          <strong>AHI</strong> — 呼吸暂停低通气指数（监测 / 研究语境）
        </li>
        <li>
          <strong>ODI</strong> — 氧减指数及相关评分项
        </li>
        <li>
          <strong>SpO₂</strong> — 夜间血氧相关统计，连接血氧与睡眠呼吸健康观察
        </li>
      </ul>

      <h2 style={h2}>PPG 传感基础</h2>
      <p style={p}>
        多波长 PPG（配合运动与温度传感器）支持心率、血氧相关及睡眠相关生理监测，并服务于 OSA 相关指标。完整技术栈见{' '}
        <Link href={geoPath('smart-ring-technology')}>智能戒指技术</Link>。
      </p>

      <h2 style={h2}>合作咨询</h2>
      <p style={p}>
        医疗健康与 OEM 咨询：<Link href="/partner/hospital">医院合作</Link> ·{' '}
        <Link href="/partner/oem">OEM 咨询</Link>。
      </p>
    </GeoPageLayout>
  );
}
