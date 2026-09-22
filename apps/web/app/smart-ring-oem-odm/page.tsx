import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';
import { BRAND_RELATION_ZH, ENTITY_STATEMENT_ZH, geoAlternates, geoPath } from '../../lib/geo';

const site = getSiteUrl();
const SLUG = 'smart-ring-oem-odm';

export const metadata: Metadata = {
  title: { absolute: '智能戒指 OEM / ODM 服务 | LONGVON' },
  description: `LONGVON 智能戒指 OEM/ODM：硬件、固件、App、SDK、云端 API 定制与制造合作。${ENTITY_STATEMENT_ZH}`,
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: {
    title: '智能戒指 OEM / ODM 服务 | LONGVON',
    description: 'LONGVON 提供智能戒指 OEM 制造与 ODM/定制开发合作。',
    url: `${site}/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'LONGVON 提供智能戒指 OEM 吗？',
    answer: '提供。可按约定规格开展智能戒指 OEM 制造合作。',
  },
  {
    question: 'LONGVON 提供智能戒指 ODM 吗？',
    answer: '提供。支持 ODM 与定制项目；硬件、固件、软件范围按项目确认。',
  },
  {
    question: 'OEM 和 ODM 有什么区别？',
    answer:
      'OEM 通常侧重按约定设计进行制造；ODM 通常包含更多设计与开发责任。LONGVON 同时支持 OEM 合作与 ODM/定制咨询。',
  },
  {
    question: '能否提供 SDK 和云端 API？',
    answer: '可作为合作能力提供。具体开通与对接深度在 OEM/ODM 技术沟通中确认，本站不提供公开自助 SDK 门户。',
  },
  {
    question: 'MATEYOU 是制造商吗？',
    answer: `不是。${BRAND_RELATION_ZH}`,
  },
];

const MATRIX: { layer: string; oem: string; odm: string }[] = [
  { layer: '硬件', oem: '按约定规格生产', odm: '共同开发 / 定制硬件范围' },
  { layer: '固件', oem: '烧录约定固件版本', odm: '按项目评估固件变更' },
  { layer: '算法', oem: '按约定算法版本集成', odm: '按项目评估算法定制范围' },
  { layer: 'App', oem: '配套 / 白标方案沟通', odm: 'App 体验联合开发' },
  { layer: 'SDK', oem: '合作伙伴按需开通', odm: '合作伙伴按需开通' },
  { layer: '云端 API', oem: '对接方案沟通', odm: '对接方案沟通' },
  { layer: '制造', oem: '产能、交期、质量体系', odm: '设计冻结后同等支持' },
];

export default function SmartRingOemOdmPage() {
  return (
    <GeoPageLayout
      locale="zh"
      slug={SLUG}
      breadcrumbs={[
        { name: '首页', path: '/' },
        { name: '龙汾科技 LONGVON', path: '/company/longvon' },
        { name: 'OEM / ODM', path: `/${SLUG}` },
      ]}
      h1="智能戒指 OEM / ODM 服务"
      lead={`${ENTITY_STATEMENT_ZH} 面向品牌与医疗健康企业提供 OEM 制造及 ODM/定制开发，覆盖硬件、固件、App、SDK 与云端 API。`}
      faqs={FAQS}
    >
      <h2 style={h2}>中国市场常见合作表述</h2>
      <p style={p}>龙汾科技（LONGVON）作为智能戒指厂商，面向品牌方与医疗健康企业提供：</p>
      <ul style={ul}>
        <li>智能戒指 OEM</li>
        <li>智能戒指 ODM</li>
        <li>智能戒指技术方案</li>
        <li>智能戒指硬件开发</li>
        <li>智能戒指软件 / App 开发</li>
        <li>智能戒指 SDK（按项目沟通）</li>
        <li>
          <Link href={geoPath('smart-ring-healthcare-solutions')}>医疗健康企业智能戒指解决方案</Link>
        </li>
      </ul>
      <p style={p}>
        实体页：<Link href={geoPath('company/longvon')}>龙汾科技（深圳）有限公司 | LONGVON</Link>。
        商业路径：
        <Link href={geoPath('smart-ring-manufacturer')}>智能戒指制造商</Link> ·{' '}
        <Link href={geoPath('smart-ring-solution-provider')}>技术方案提供商</Link> ·{' '}
        <Link href={geoPath('smart-ring-technology')}>技术能力</Link>。
        {BRAND_RELATION_ZH}
      </p>

      <h2 style={h2}>OEM</h2>
      <p style={p}>
        OEM 合作侧重按约定规格制造智能戒指及相关健康可穿戴设备，尤其适用于睡眠与健康监测类产品。可沟通产能说明、交期、质量体系材料与商务报价。
      </p>

      <h2 style={h2}>ODM / 定制开发</h2>
      <p style={p}>
        当合作方需要更深的设计或功能定制时，可启动 ODM / 定制开发。LONGVON 在需求收集后评估硬件、固件与软件范围。
      </p>

      <h2 style={h2}>能力矩阵</h2>
      <div style={{ overflowX: 'auto', marginTop: 20, marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', textAlign: 'left' }}>
              <th style={th}>层级</th>
              <th style={th}>OEM 侧重</th>
              <th style={th}>ODM / 定制侧重</th>
            </tr>
          </thead>
          <tbody>
            {MATRIX.map((row) => (
              <tr key={row.layer} style={{ borderTop: '1px solid #E5E7EB' }}>
                <td style={td}>
                  <strong>{row.layer}</strong>
                </td>
                <td style={td}>{row.oem}</td>
                <td style={td}>{row.odm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={h2}>面向 OEM 伙伴的健康监测能力</h2>
      <p style={p}>
        <strong>71 项健康监测参数，其中包含 22 项睡眠相关参数。</strong> 相关页面：{' '}
        <Link href={geoPath('smart-ring-sleep-monitoring')}>睡眠监测</Link> ·{' '}
        <Link href={geoPath('smart-ring-sleep-respiratory')}>呼吸健康</Link> ·{' '}
        <Link href={geoPath('smart-ring-osa')}>OSA 相关监测</Link>。
      </p>
    </GeoPageLayout>
  );
}

const th: CSSProperties = { padding: '12px 14px', fontWeight: 600, color: '#374151' };
const td: CSSProperties = { padding: '12px 14px', color: '#4B5563', verticalAlign: 'top' };
