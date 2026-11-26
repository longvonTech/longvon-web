import { SdkIntegrationModules } from '../../components/SdkIntegrationModules';
import { PROCUREMENT_COPY, technicalEvaluationRfqHref } from '../../lib/procurement-pages';
import { OEM_JOURNEY_COPY, oemJourneyPath } from '../../lib/oem-journey';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, p } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';
import {
  geoAlternates,
  geoPath,
} from '../../lib/geo';

import { RawPpgSection } from '../../components/RawPpgSection';
import { RAW_PPG_COPY } from '../../lib/raw-ppg';

const site = getSiteUrl();
const SLUG = 'smart-ring-sdk-api';

export const metadata: Metadata = {
  title: { absolute: '智能戒指 SDK、100Hz 原始 PPG 与云端 API | LONGVON 龙汾科技' },
  description:
    'LONGVON 为 OEM/ODM 合作伙伴提供智能戒指 SDK 与云端 API 对接路径，可按项目评估 100Hz PPG 原始数据与云端算法服务。',
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: {
    title: '智能戒指 SDK、100Hz 原始 PPG 与云端 API | LONGVON',
    description: '面向品牌与数字健康项目的智能戒指 SDK / 云端 API 合作说明。',
    url: `${site}/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '智能戒指 SDK、100Hz 原始 PPG 与云端 API | LONGVON',
    description: '面向 OEM/ODM 项目的智能戒指 SDK 与云端 API 合作说明。',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: '是否提供公开自助 SDK 下载？',
    answer: '否。SDK 与云端 API 在 OEM/ODM 或技术合作项目中开通，范围按项目约定。',
  },
  {
    question: '是否可获取 100Hz PPG 原始数据？',
    answer: '对符合条件的 OEM/ODM 合作伙伴，可按项目评估 100Hz PPG 原始数据获取路径。',
  },
  {
    question: '是否承诺全部算法可在客户硬件离线独立运行？',
    answer:
      '否。许多健康指标通过 LONGVON 云端算法服务提供；端侧与云端分工按项目定义，不得理解为全部算法均可离线运行。',
  },
  {
    question: '是否提供无限制的通用蓝牙协议？',
    answer: '否。接口按项目文档提供；无限制蓝牙协议不是默认公开承诺。',
  },
  {
    question: '是否支持客户自有 App 集成？',
    answer: '支持。客户自有 App 通过 SDK/API 集成是可行合作模式，需在技术咨询中评估可行性与工作量。',
  },
  {
    question: 'SDK、算法授权、技术支持与云服务如何区分？',
    answer:
      'SDK 提供设备对接与数据通路；算法授权决定可使用的指标/模型范围；技术支持按约定窗口提供；云服务承载云端算法与数据接口，费用与开通范围按合作模式单独约定。',
  },
];

export default function ZhSmartRingSdkApiPage() {
  return (
    <GeoPageLayout
      locale="zh"
      slug={SLUG}
      breadcrumbs={[
        { name: '技术能力', path: '/smart-ring-technology' },
        { name: 'SDK / Cloud API', path: `/${SLUG}` },
      ]}
      h1={PROCUREMENT_COPY.zh.sdkH1}
      lead={PROCUREMENT_COPY.zh.sdkLead}
      faqs={[...FAQS, ...RAW_PPG_COPY.zh.faqs]}
      heroActions={<p style={{ marginTop: 24 }}><Link href={technicalEvaluationRfqHref('zh')} data-procurement-cta="sdk-hero" style={{ display: 'inline-block', padding: '12px 20px', background: '#1D4ED8', color: '#fff', borderRadius: 8, fontWeight: 600 }}>{PROCUREMENT_COPY.zh.technicalCta}</Link></p>}
    >
      <nav aria-label={PROCUREMENT_COPY.zh.navigation} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        {[['100hz-raw-ppg', RAW_PPG_COPY.zh.title], ['smart-ring-sdk', PROCUREMENT_COPY.zh.sdkTitle], ['cloud-health-algorithms', PROCUREMENT_COPY.zh.cloudTitle], ['cloud-api-integration', PROCUREMENT_COPY.zh.apiTitle], ['technical-evaluation', PROCUREMENT_COPY.zh.evaluationTitle]].map(([id, title]) => <a key={id} href={`#${id}`} style={{ color: '#1D4ED8', textDecoration: 'underline' }}>{title}</a>)}
      </nav>
      <RawPpgSection locale="zh" />
      <SdkIntegrationModules locale="zh" />
      <p style={p}><Link href={geoPath('smart-ring-technology', 'zh')}>技术能力</Link> · <Link href={geoPath('osa-smart-ring-technology', 'zh')}>OSA 技术与 OEM</Link> · <Link href={geoPath('smart-ring-manufacturer', 'zh')}>制造商</Link> · <Link href={geoPath('smart-ring-oem-odm', 'zh')}>OEM / ODM</Link></p>
      <p style={p}><Link href={oemJourneyPath('zh')} style={{color:'#1D4ED8',textDecoration:'underline'}}>{OEM_JOURNEY_COPY.zh.linkLabel}</Link></p>
    </GeoPageLayout>
  );
}
