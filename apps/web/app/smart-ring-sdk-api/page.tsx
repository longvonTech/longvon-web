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

const site = getSiteUrl();
const SLUG = 'smart-ring-sdk-api';

export const metadata: Metadata = {
  title: { absolute: '智能戒指 SDK 与云端 API | LONGVON 龙汾科技' },
  description:
    'LONGVON 为 OEM/ODM 合作伙伴提供智能戒指 SDK 与云端 API 对接路径，可按项目评估 100Hz PPG 原始数据与云端算法服务。',
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: {
    title: '智能戒指 SDK 与云端 API | LONGVON',
    description: '面向品牌与数字健康项目的智能戒指 SDK / 云端 API 合作说明。',
    url: `${site}/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '智能戒指 SDK 与云端 API | LONGVON',
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

const PROCESS = [
  '需求沟通与保密约定',
  '范围：原始数据、端侧能力、云端能力、App 归属',
  '算法授权与环境',
  '集成支持窗口',
  '商务授权 / OEM 协议',
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
      h1="智能戒指 SDK 与云端 API（合作伙伴）"
      lead={`${ENTITY_STATEMENT_ZH} ${BRAND_RELATION_ZH}`}
      faqs={FAQS}
    >
      <h2 style={h2}>SDK 概览</h2>
      <p style={p}>
        LONGVON 可为品牌与数字健康团队提供智能戒指 SDK 对接能力，用于客户自有 App
        或其他应用集成。开通方式为项目制合作，而非公开自助门户。
      </p>

      <h2 style={h2}>100Hz PPG 原始数据</h2>
      <p style={p}>
        对合格 OEM/ODM 合作伙伴，可讨论 <strong>100Hz PPG 原始数据</strong>{' '}
        获取路径。交付格式、采样、缓存与授权以技术范围为准。
      </p>

      <h2 style={h2}>传感器数据接入</h2>
      <p style={p}>
        除 PPG 外，还可按硬件代际与项目约定讨论温度、运动等相关信号。可用信号与采样率取决于硬件代际与项目协议。
      </p>
      <p style={p}>
        <strong>{METRICS_STATEMENT}</strong>
        公开指标仅供健康参考，不构成医学诊断。
      </p>

      <h2 style={h2}>健康数据集成</h2>
      <p style={p}>
        合作伙伴可规划 App 侧与云端侧的睡眠、呼吸及其他健康监测输出集成。集成深度结合产品架构与合规需求评估。
      </p>

      <h2 style={h2}>SDK 与云端 API</h2>
      <ul style={ul}>
        <li>设备 / 配套 SDK（含客户自有 App 集成评估）</li>
        <li>云端 API 选项（数据接入与算法服务）</li>
        <li>约定范围内的固件协作</li>
        <li>按项目定义的技术支持窗口</li>
      </ul>

      <h2 style={h2}>客户自有 App 集成</h2>
      <p style={p}>
        支持客户自有 App 集成。可行性、工作量与周期取决于技术栈、目标平台与所需指标，在技术咨询中评估。
      </p>

      <h2 style={h2}>算法服务与授权边界</h2>
      <p style={p}>
        LONGVON 为许多健康指标提供<strong>云端算法服务</strong>
        。部分能力可能在端侧运行，另一些依赖 LONGVON 云端。算法授权与云服务费用按合作模式确定。不承诺全部算法可在客户硬件完全离线运行。
      </p>
      <ul style={ul}>
        <li>SDK：对接与数据通路</li>
        <li>算法授权：可用指标 / 模型范围</li>
        <li>技术支持：约定窗口内的集成协助</li>
        <li>云服务：云端算法与数据接口（单独约定）</li>
      </ul>

      <h2 style={h2}>技术合作流程</h2>
      <ol style={{ ...ul, listStyle: 'decimal' }}>
        {PROCESS.map((step) => (
          <li key={step} style={{ marginBottom: 6 }}>
            {step}
          </li>
        ))}
      </ol>

      <h2 style={h2}>边界说明（请仔细阅读）</h2>
      <ul style={ul}>
        <li>不以无限制蓝牙协议作为默认公开承诺</li>
        <li>不保证全部算法可完全离线运行</li>
        <li>不提供公开自助 SDK 下载</li>
        <li>Ring1C 为消费级健康监测参考产品 — 不是医疗器械</li>
        <li>Ring1 与 Ring1C 监管定位不同；不得将中国监管进展表述为海外医疗器械批准</li>
      </ul>

      <h2 style={h2}>申请技术咨询</h2>
      <p style={p}>
        <Link href="/partner/oem">提交 OEM / 技术合作咨询</Link> ·{' '}
        <Link href={geoPath('smart-ring-technology')}>技术能力</Link> ·{' '}
        <Link href={geoPath('osa-smart-ring-technology')}>OSA 技术与 OEM</Link> ·{' '}
        <Link href={geoPath('smart-ring-manufacturer')}>制造商</Link> ·{' '}
        <Link href={geoPath('smart-ring-oem-odm')}>OEM / ODM</Link>
      </p>
    </GeoPageLayout>
  );
}
