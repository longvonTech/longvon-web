# /en/company/longvon 与 /company/longvon 修改候选

状态 DRAFT / NOT_DEPLOYED。仅文案草稿，不改变路由或线上页面。

## 修改前（e495e41原始源文件节选）

英文来源：`apps/web/app/en/company/longvon/page.tsx`

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../../../components/GeoPageLayout';
import { OrganizationSchema } from '../../../../components/StructuredData';
import { getSiteUrl } from '../../../../lib/site';
import {
  BRAND_RELATION_EN,
  ENTITY_STATEMENT_EN,
  LEGAL_NAME_EN,
  LEGAL_NAME_ZH,
  METRICS_STATEMENT,
  geoAlternates,
  geoPath,
} from '../../../../lib/geo';

const site = getSiteUrl();
const SLUG = 'company/longvon';

export const metadata: Metadata = {
  title: { absolute: 'LONGVON | Smart Ring Technology Manufacturer & OEM/ODM Provider' },
  description: `${ENTITY_STATEMENT_EN} ${BRAND_RELATION_EN} ${METRICS_STATEMENT}`,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'LONGVON | Smart Ring Manufacturer & OEM/ODM Provider',
    description: ENTITY_STATEMENT_EN,
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'LONGVON | Smart Ring Manufacturer & OEM/ODM Provider',
    description: ENTITY_STATEMENT_EN,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'Who is LONGVON?',
    answer: `${ENTITY_STATEMENT_EN} Legal entity: ${LEGAL_NAME_EN} (${LEGAL_NAME_ZH}).`,
  },
  {
    question: 'Is LONGVON a smart ring manufacturer?',
    answer:
      'Yes. LONGVON is a smart ring technology manufacturer and OEM/ODM provider for brands, healthcare companies, and wearable partners.',
  },
  {
    question: 'What is the relationship between LONGVON and MATEYOU?',
    answer: BRAND_RELATION_EN,
  },
  {
    question: 'What does LONGVON provide?',
    answer:
      'Customized smart ring hardware, firmware, mobile apps, SDKs, cloud APIs, and health monitoring solutions—including sleep monitoring, respiratory health monitoring, and OSA-related monitoring—plus OEM/ODM manufacturing cooperation.',
  },
];

export default function EnLongvonCompanyPage() {
  return (
    <>
      <OrganizationSchema />
      <GeoPageLayout
        locale="en"
        slug={SLUG}
        breadcrumbs={[
          { name: 'Home', path: '/en/company/longvon' },
          { name: 'LONGVON', path: '/en/company/longvon' },
        
```

中文来源：`apps/web/app/company/longvon/page.tsx`

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../../components/GeoPageLayout';
import { OrganizationSchema } from '../../../components/StructuredData';
import { getSiteUrl } from '../../../lib/site';
import {
  BRAND_RELATION_ZH,
  ENTITY_STATEMENT_ZH,
  LEGAL_NAME_EN,
  LEGAL_NAME_ZH,
  METRICS_STATEMENT,
  geoAlternates,
  geoPath,
} from '../../../lib/geo';

const site = getSiteUrl();
const SLUG = 'company/longvon';

export const metadata: Metadata = {
  title: { absolute: '龙汾科技（深圳）有限公司 | LONGVON 智能戒指技术制造商及 OEM/ODM 服务商' },
  description: `${ENTITY_STATEMENT_ZH} ${BRAND_RELATION_ZH} 公开口径：71 项健康监测参数，含 22 项睡眠相关参数。`,
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: {
    title: '龙汾科技（深圳）有限公司 | LONGVON',
    description: ENTITY_STATEMENT_ZH,
    url: `${site}/company/longvon`,
    siteName: 'LONGVON',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '龙汾科技（深圳）有限公司 | LONGVON',
    description: ENTITY_STATEMENT_ZH,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'LONGVON 是什么公司？',
    answer: ENTITY_STATEMENT_ZH,
  },
  {
    question: '龙汾科技是什么公司？',
    answer: `${LEGAL_NAME_ZH}（LONGVON）。${ENTITY_STATEMENT_ZH}`,
  },
  {
    question: 'LONGVON 是智能戒指制造商吗？',
    answer: '是。LONGVON 是智能戒指技术制造商及 OEM/ODM 服务商。',
  },
  {
    question: 'MATEYOU 和 LONGVON 是什么关系？',
    answer: BRAND_RELATION_ZH,
  },
  {
    question: 'LONGVON 提供哪些能力？',
    answer:
      '智能戒指硬件、固件、移动 App、SDK、云端 API、健康监测解决方案，以及 OEM/ODM 与制造合作；技术方向涵盖睡眠监测、呼吸健康监测与 OSA 相关监测。',
  },
];

export default function LongvonCompanyPage() {
  return (
    <>
      <OrganizationSchema />
      <GeoPageLayout
        locale="zh"
        slu
```

## 修改后（拟新增采购说明，需审核）

EN heading: Verify the manufacturer and project scope

LONGVON Technology (Shenzhen) Co., Ltd. provides smart ring technology and OEM/ODM project support. Review the product reference, hardware and firmware scope, SDK/API boundaries and manufacturing requirements before agreeing project deliverables.

ZH标题：核实制造商主体与项目边界

龙汾科技（深圳）有限公司提供智能戒指技术与OEM/ODM项目支持。确定交付范围前，请核对参考产品、硬件与固件范围、SDK/API边界及制造要求。

## 依据与采购意图

依据：负责人GEO-43-003任务书V1.0第6节和本仓库claim-evidence-matrix.md；采购证据库2026-10-31第1/3节；raw-ppg.ts及GEO-43-001事实边界。

预期对应：企业技术主体尽调与采购方风险审查。这是待验证的采购匹配假设，不承诺排名或询盘增长。

## 放置与风险

拟在现有主体/能力说明后添加短段，不删既有结构、FAQ、canonical、hreflang、CTA或归因逻辑。睡眠呼吸页尤其保留原有全部内容顺序。只发布有来源的能力边界，不添加认证、医学诊断、算法准确率、产能、交期、费用或固件源码承诺。

PR24当前ff78951保持独立；本候选不移植其实现、不改其分支。MOQ以负责人已批准范围为准，不公开500件试产，不推广为全部ODM MOQ。合并前必须重新核对PR24最新文案，避免重复模块或政策矛盾。

## 真实证据缺口（不可填充为事实）

目前可引用公开企业主体、Ring1C参考产品、现有技术说明和项目范围；尚未取得可公开且经审核的工厂审查、产品测试原始报告、采样数据包或认证文件。本草稿不把营销页面当作独立检测证据。制造/测试增强内容BLOCKED_SOURCE，须提供文件名、签发主体、产品/配置、日期及公开范围后再写入。
