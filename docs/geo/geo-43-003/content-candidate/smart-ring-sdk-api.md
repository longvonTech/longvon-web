# /en/smart-ring-sdk-api 与 /smart-ring-sdk-api 修改候选

状态 DRAFT / NOT_DEPLOYED。仅文案草稿，不改变路由或线上页面。

## 修改前（e495e41原始源文件节选）

英文来源：`apps/web/app/en/smart-ring-sdk-api/page.tsx`

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../../components/GeoPageLayout';
import { getSiteUrl } from '../../../lib/site';
import {
  BRAND_RELATION_EN,
  ENTITY_STATEMENT_EN,
  METRICS_STATEMENT,
  geoAlternates,
  geoPath,
} from '../../../lib/geo';

import { RawPpgSection } from '../../../components/RawPpgSection';
import { RAW_PPG_COPY } from '../../../lib/raw-ppg';

const site = getSiteUrl();
const SLUG = 'smart-ring-sdk-api';

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring SDK, 100Hz Raw PPG & Cloud API | LONGVON' },
  description:
    'Integrate LONGVON smart ring hardware via project-scoped partner SDK and cloud API — including 100Hz PPG raw data pathways for qualified OEM/ODM partners.',
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Smart Ring SDK, 100Hz Raw PPG & Cloud API | LONGVON',
    description:
      'Project-scoped partner SDK, cloud API, and 100Hz PPG raw data pathways for qualified OEM/ODM smart ring programs by LONGVON.',
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Smart Ring SDK, 100Hz Raw PPG & Cloud API | LONGVON',
    description: 'Partner SDK and cloud API for LONGVON smart ring OEM/ODM projects.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'Does LONGVON provide a public self-serve SDK download?',
    answer:
      'No. SDK and cloud API access are enabled under OEM/ODM or technology partnerships. Scope is defined per project.',
  },
  {
    question: 'Can partners access 100Hz PPG raw data?',
    answer:
      'Yes, 100Hz PPG raw data access can be discussed for qualified OEM/ODM partners as part of the technical scope.',
  },
  {
    question: 'Do all health algorithms run fully offline on customer hardware?',
    answer:
      'No. LONGVON does not claim that all algorithms run independently on customer devices. Many health metrics are delivered through LONGVON cloud algorithm services; the on-device vs cloud split is defined per project.',
  },
  {
    question: 'Is an unrestricted Bluetooth protocol provided to every customer?'
```

中文来源：`apps/web/app/smart-ring-sdk-api/page.tsx`

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';
import {
  BRAND_RELATION_ZH,
  ENTITY_STATEMENT_ZH,
  METRICS_STATEMENT,
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

```

## 修改后（拟新增采购说明，需审核）

EN heading: Evaluate 100Hz raw PPG access for your integration project

For a project requiring 100Hz raw PPG, specify the intended use, model and configuration, optical channels, capture duration, timestamps and desired data delivery path. Partner SDK access and cloud API integration are defined per project; sampling rate alone does not guarantee continuous BLE streaming or unrestricted raw-data access.

ZH标题：面向集成项目评估100Hz原始PPG接入

如项目需要100Hz原始PPG，请说明用途、机型配置、光学通道、采集时长、时间戳及所需数据交付路径。合作伙伴SDK权限与云端API对接按项目界定；采样率不等于持续BLE传输或无限制原始数据访问承诺。

## 依据与采购意图

依据：负责人GEO-43-003任务书V1.0第6节和本仓库claim-evidence-matrix.md；采购证据库2026-10-31第1/3节；raw-ppg.ts及GEO-43-001事实边界。

预期对应：原始信号与SDK技术尽调，非通用下载流量。这是待验证的采购匹配假设，不承诺排名或询盘增长。

## 放置与风险

拟在现有主体/能力说明后添加短段，不删既有结构、FAQ、canonical、hreflang、CTA或归因逻辑。睡眠呼吸页尤其保留原有全部内容顺序。只发布有来源的能力边界，不添加认证、医学诊断、算法准确率、产能、交期、费用或固件源码承诺。

PR24当前ff78951保持独立；本候选不移植其实现、不改其分支。MOQ以负责人已批准范围为准，不公开500件试产，不推广为全部ODM MOQ。合并前必须重新核对PR24最新文案，避免重复模块或政策矛盾。

## 真实证据缺口（不可填充为事实）

目前可引用公开企业主体、Ring1C参考产品、现有技术说明和项目范围；尚未取得可公开且经审核的工厂审查、产品测试原始报告、采样数据包或认证文件。本草稿不把营销页面当作独立检测证据。制造/测试增强内容BLOCKED_SOURCE，须提供文件名、签发主体、产品/配置、日期及公开范围后再写入。
