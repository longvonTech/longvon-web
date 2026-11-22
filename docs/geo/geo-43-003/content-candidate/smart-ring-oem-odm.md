# /en/smart-ring-oem-odm 与 /smart-ring-oem-odm 修改候选

状态 DRAFT / NOT_DEPLOYED。仅文案草稿，不改变路由或线上页面。

## 修改前（e495e41原始源文件节选）

英文来源：`apps/web/app/en/smart-ring-oem-odm/page.tsx`

```tsx
import { RAW_PPG_COPY, rawPpgSectionPath } from '../../../lib/raw-ppg';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../../components/GeoPageLayout';
import { OemEntityGraphSchema } from '../../../components/StructuredData';
import { getSiteUrl } from '../../../lib/site';
import { ENTITY_STATEMENT_EN, METRICS_STATEMENT, geoAlternates, geoPath } from '../../../lib/geo';
import {
  BRAND_LINE_EN,
  BUYERS_EN,
  CAPABILITIES_EN,
  COMMERCIAL_FAQS_EN,
  COOPERATION_MODES_EN,
  IDENTITY_EN,
  NPI_CAPABILITY_NOTES_EN,
  NPI_PATH_EN,
  POSITIONING_EN,
} from '../../../lib/geo-commercial';
import { TRUST_CAPABILITY_BULLETS_EN, TRUST_FAQS_EN, TW_BIOMED_NOTE_EN } from '../../../lib/geo-trust-en';

const site = getSiteUrl();
const SLUG = 'smart-ring-oem-odm';

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring OEM & ODM Services | LONGVON' },
  description: `${IDENTITY_EN} ${POSITIONING_EN}`,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Smart Ring OEM & ODM Services | LONGVON',
    description: POSITIONING_EN,
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  ...COMMERCIAL_FAQS_EN,
  ...TRUST_FAQS_EN,
  {
    question: 'Can LONGVON provide SDK and data integration?',
    answer:
      'Yes as partner capabilities. SDK and cloud API access are scoped during OEM/ODM technical consultation. A public self-serve SDK portal is not published.',
  },
  {
    question: 'Is MATEYOU the manufacturer?',
    answer: `No. ${BRAND_LINE_EN}`,
  },
];

const MATRIX: { layer: string; oem: string; odm: string }[] = [
  { layer: 'Hardware', oem: 'Produce agreed ring hardware', odm: 'Co-develop / customize hardware scope' },
  { layer: 'Sensors', oem: 'Integrate agreed sensor configuration', odm: 'Sensor options scoped per project' },
  { layer: 'Firmware', oem: 'Flash agreed firmware builds', odm: 'Firmware changes scoped per project' },
  { layer: 'Algorithm', oem: 'Integrate agreed algorithm builds', odm: 'Algorithm customization scoped per project' },
  { layer: 'App', oem: 'Co
```

中文来源：`apps/web/app/smart-ring-oem-odm/page.tsx`

```tsx
import { RAW_PPG_COPY, rawPpgSectionPath } from '../../lib/raw-ppg';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';
import { BRAND_RELATION_ZH, ENTITY_STATEMENT_ZH, geoAlternates, geoPath } from '../../lib/geo';
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
const SLUG = 'smart-ring-oem-odm';

export const metadata: Metadata = {
  title: { absolute: '智能戒指 OEM / ODM 服务 | LONGVON' },
  description: `${IDENTITY_ZH} 覆盖硬件、固件、算法、App、SDK 与生产制造。${ENTITY_STATEMENT_ZH}`,
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: {
    title: '智能戒指 OEM / ODM 服务 | LONGVON',
    description: POSITIONING_ZH,
    url: `${site}/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  ...COMMERCIAL_FAQS_ZH,
  {
    question: 'OEM 和 ODM 有什么区别？',
    answer:
      'OEM 通常侧重按约定设计进行制造；ODM 通常包含更多设计与开发责任。LONGVON 同时支持智能戒指 OEM 合作与 ODM/定制咨询。',
  },
  {
    question: '能否提供 SDK 和数据接入？',
    answer: '可作为合作能力提供。具体开通与对接深度在 OEM/ODM 技术沟通中确认，本站不提供公开自助 SDK 门户。',
  },
  {
    question: 'MATEYOU 是制造商吗？',
    answer: `不是。${BRAND_LINE_ZH}`,
  },
];

const MATRIX: { layer: string; oem: string; odm: string }[] = [
  { layer: '硬件', oem: '按约定规格生产', odm: '共同开发 / 定制硬件范围' },
  { layer: '传感器', oem: '按约定方案集成', odm: '按项目评估传感器方案' },
  { layer: '固件', oem: '烧录约定固件版本', odm: '按项目评估固件变更' },
  { layer: '算法', oem: '按约定算法版本集成', odm: '按项目评估算法定制范围' },
  { layer: 'App', 
```

## 修改后（拟新增采购说明，需审核）

EN heading: Separate platform OEM evaluation from custom ODM development

For Ring1/Ring1C existing-platform standard OEM, the MOQ is 1,000 pieces; configuration and quotation require separate confirmation. Custom ODM quantities and commercial terms are evaluated separately. Sample requests and volume forecasts do not constitute confirmed orders.

ZH标题：区分现有平台OEM评估与定制ODM开发

Ring1/Ring1C现有平台标准OEM MOQ为1,000件，配置与报价另行确认。定制ODM数量和商务条件单独评估。样品申请和采购预测不构成已确认订单。

## 依据与采购意图

依据：负责人GEO-43-003任务书V1.0第6节和本仓库claim-evidence-matrix.md；采购证据库2026-10-31第1/3节；raw-ppg.ts及GEO-43-001事实边界。

预期对应：平台OEM询盘与定制ODM资格区分。这是待验证的采购匹配假设，不承诺排名或询盘增长。

## 放置与风险

拟在现有主体/能力说明后添加短段，不删既有结构、FAQ、canonical、hreflang、CTA或归因逻辑。睡眠呼吸页尤其保留原有全部内容顺序。只发布有来源的能力边界，不添加认证、医学诊断、算法准确率、产能、交期、费用或固件源码承诺。

PR24当前ff78951保持独立；本候选不移植其实现、不改其分支。MOQ以负责人已批准范围为准，不公开500件试产，不推广为全部ODM MOQ。合并前必须重新核对PR24最新文案，避免重复模块或政策矛盾。

## 真实证据缺口（不可填充为事实）

目前可引用公开企业主体、Ring1C参考产品、现有技术说明和项目范围；尚未取得可公开且经审核的工厂审查、产品测试原始报告、采样数据包或认证文件。本草稿不把营销页面当作独立检测证据。制造/测试增强内容BLOCKED_SOURCE，须提供文件名、签发主体、产品/配置、日期及公开范围后再写入。
