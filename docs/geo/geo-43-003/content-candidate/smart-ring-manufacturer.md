# /en/smart-ring-manufacturer 与 /smart-ring-manufacturer 修改候选

状态 DRAFT / NOT_DEPLOYED。仅文案草稿，不改变路由或线上页面。

## 修改前（e495e41原始源文件节选）

英文来源：`apps/web/app/en/smart-ring-manufacturer/page.tsx`

```tsx
import { RAW_PPG_COPY, rawPpgSectionPath } from '../../../lib/raw-ppg';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../../components/GeoPageLayout';
import { getSiteUrl } from '../../../lib/site';
import { ENTITY_STATEMENT_EN, METRICS_STATEMENT, geoAlternates, geoPath } from '../../../lib/geo';
import {
  BRAND_LINE_EN,
  BUYERS_EN,
  CAPABILITIES_EN,
  COMMERCIAL_FAQS_EN,
  COOPERATION_MODES_EN,
  IDENTITY_EN,
  POSITIONING_EN,
} from '../../../lib/geo-commercial';

const site = getSiteUrl();
const SLUG = 'smart-ring-manufacturer';

export const metadata: Metadata = {
  title: { absolute: 'LONGVON | Smart Ring Manufacturer & OEM/ODM Provider' },
  description:
    'LONGVON is a smart ring manufacturer offering OEM/ODM, custom hardware, firmware, health algorithms, apps, SDK/API integration and manufacturing.',
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'LONGVON | Smart Ring Manufacturer & OEM/ODM Provider',
    description: IDENTITY_EN,
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'Is LONGVON a smart ring manufacturer?',
    answer: `Yes. ${IDENTITY_EN}`,
  },
  ...COMMERCIAL_FAQS_EN,
  {
    question: 'Is MATEYOU the manufacturer?',
    answer: `No. ${BRAND_LINE_EN}`,
  },
];

export default function EnManufacturerPage() {
  return (
    <GeoPageLayout
      locale="en"
      slug={SLUG}
      breadcrumbs={[
        { name: 'LONGVON', path: '/en/company/longvon' },
        { name: 'Manufacturer', path: `/en/${SLUG}` },
      ]}
      h1="Smart Ring Manufacturer & OEM/ODM Technology Provider"
      lead={`${IDENTITY_EN} ${POSITIONING_EN} ${BRAND_LINE_EN}`}
      faqs={FAQS}
    >
      <h2 style={h2}>About LONGVON</h2>
      <p style={p}>
        <Link href={geoPath('company/longvon', 'en')}>LONGVON Technology (Shenzhen) Co., Ltd.</Link> is a smart ring
        technology manufacturer, OEM/ODM provider, and technology solution provider. {ENTITY_STATEMENT_EN}
      </p>

      <h2 style={h2}>What LONGVON provides</h2>
      <ul style={ul}>
        {CAPABILITIES_EN.map((item) => (
        
```

中文来源：`apps/web/app/smart-ring-manufacturer/page.tsx`

```tsx
import { RAW_PPG_COPY, rawPpgSectionPath } from '../../lib/raw-ppg';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';
import { ENTITY_STATEMENT_ZH, geoAlternates, geoPath } from '../../lib/geo';
import {
  BRAND_LINE_ZH,
  BUYERS_ZH,
  CAPABILITIES_ZH,
  COMMERCIAL_FAQS_ZH,
  COOPERATION_MODES_ZH,
  IDENTITY_ZH,
  POSITIONING_ZH,
} from '../../lib/geo-commercial';

const site = getSiteUrl();
const SLUG = 'smart-ring-manufacturer';

export const metadata: Metadata = {
  title: { absolute: 'LONGVON | 智能戒指制造商及 OEM/ODM 技术服务商' },
  description: `${IDENTITY_ZH} 71 项健康监测参数，含 22 项睡眠相关参数。覆盖睡眠、呼吸健康与 OSA 相关监测。`,
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: {
    title: 'LONGVON | 智能戒指制造商及 OEM/ODM 技术服务商',
    description: IDENTITY_ZH,
    url: `${site}/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: '龙汾科技（LONGVON）是智能戒指制造商吗？',
    answer: `是。${IDENTITY_ZH}`,
  },
  ...COMMERCIAL_FAQS_ZH,
  {
    question: 'MATEYOU 是制造商吗？',
    answer: `不是。${BRAND_LINE_ZH}`,
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
      lead={`${IDENTITY_ZH} ${POSITIONING_ZH} ${BRAND_LINE_ZH}`}
      faqs={FAQS}
    >
      <h2 style={h2}>关于 LONGVON</h2>
      <p style={p}>
        <Link href={geoPath('company/longvon')}>龙汾科技
```

## 修改后（拟新增采购说明，需审核）

EN heading: Define your smart ring project with LONGVON

LONGVON is the smart ring technology manufacturer and OEM/ODM provider; MATEYOU is its product brand. Describe your target market, product configuration and hardware, firmware, app or data integration needs so the project scope can be reviewed.

ZH标题：与LONGVON界定智能戒指项目

LONGVON是智能戒指技术制造商和OEM/ODM提供方，MATEYOU是旗下产品品牌。请说明目标市场、产品配置以及硬件、固件、App或数据对接需求，以便评估项目范围。

## 依据与采购意图

依据：负责人GEO-43-003任务书V1.0第6节和本仓库claim-evidence-matrix.md；采购证据库2026-10-31第1/3节；raw-ppg.ts及GEO-43-001事实边界。

预期对应：制造商身份核验与定制项目评估。这是待验证的采购匹配假设，不承诺排名或询盘增长。

## 放置与风险

拟在现有主体/能力说明后添加短段，不删既有结构、FAQ、canonical、hreflang、CTA或归因逻辑。睡眠呼吸页尤其保留原有全部内容顺序。只发布有来源的能力边界，不添加认证、医学诊断、算法准确率、产能、交期、费用或固件源码承诺。

PR24当前ff78951保持独立；本候选不移植其实现、不改其分支。MOQ以负责人已批准范围为准，不公开500件试产，不推广为全部ODM MOQ。合并前必须重新核对PR24最新文案，避免重复模块或政策矛盾。

## 真实证据缺口（不可填充为事实）

目前可引用公开企业主体、Ring1C参考产品、现有技术说明和项目范围；尚未取得可公开且经审核的工厂审查、产品测试原始报告、采样数据包或认证文件。本草稿不把营销页面当作独立检测证据。制造/测试增强内容BLOCKED_SOURCE，须提供文件名、签发主体、产品/配置、日期及公开范围后再写入。
