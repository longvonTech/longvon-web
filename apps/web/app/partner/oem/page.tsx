export const dynamic = 'force-dynamic';

import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { OemRfqForm } from '../../../components/OemRfqForm';
import {
  FaqSchema,
  OrganizationSchema,
  OemServiceSchema,
} from '../../../components/StructuredData';
import { getSiteUrl } from '../../../lib/site';
import { BRAND_RELATION_ZH, ENTITY_STATEMENT_ZH } from '../../../lib/geo';
import {
  BRAND_LINE_ZH,
  COMMERCIAL_FAQS_ZH,
  IDENTITY_ZH,
  WHY_DIFF_ZH,
} from '../../../lib/geo-commercial';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: '智能戒指 OEM/ODM 合作 | LONGVON' },
  description:
    '龙汾科技（LONGVON）面向智能戒指硬件、固件、健康算法、App、SDK/API 集成及 OEM/ODM 制造提供项目咨询与合作。提交 RFQ，开始智能戒指产品开发讨论。',
  alternates: { canonical: `${site}/partner/oem` },
  openGraph: {
    title: '智能戒指 OEM/ODM 合作 | LONGVON',
    description:
      'LONGVON 提供智能戒指 OEM/ODM 项目咨询：硬件、固件、健康算法、App、SDK/API 与制造。',
    url: `${site}/partner/oem`,
    siteName: 'LONGVON',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

const OEM_FAQS = [
  ...COMMERCIAL_FAQS_ZH.slice(0, 8),
  {
    question: 'OEM 和 ODM 有什么区别？',
    answer:
      'OEM 通常侧重按约定设计进行制造；ODM 通常包含更多设计与开发责任。LONGVON 同时支持智能戒指 OEM 合作与 ODM/定制咨询。',
  },
];

const PROVIDE = [
  '智能戒指硬件',
  '固件',
  '健康算法',
  '移动 App',
  'SDK',
  '云端 API',
  'OEM/ODM 制造',
];

const BUYERS = [
  '智能戒指品牌',
  '可穿戴产品企业',
  '数字健康企业',
  '医疗健康科技企业',
  '消费健康企业',
  '新产品开发团队',
];

const E2E = [
  '产品定义',
  '硬件',
  '固件',
  '健康算法',
  'App',
  'SDK / API',
  '测试 / 集成',
  '生产制造',
];

const MODES = [
  {
    title: '标准 OEM',
    body: '基于现有产品平台进行品牌、包装或项目级调整。',
  },
  {
    title: '小批量 / 评估',
    body: '用于样品验证、市场测试或技术评估。',
  },
  {
    title: '定制 OEM/ODM',
    body: '按项目需求进行硬件、固件、算法、App、SDK/API 等定制讨论。',
  },
  {
    title: '端到端产品开发',
    body: '从产品需求到量产，提供完整技术开发与制造支持讨论。',
  },
];

const h2: CSSProperties = {
  fontSize: 22,
  fontWeight: 650,
  letterSpacing: '-0.02em',
  margin: '40px 0 12px',
  color: '#111827',
};

const p: CSSProperties = {
  fontSize: 15,
  lineHeight: 1.7,
  color: '#4B5563',
  margin: '0 0 12px',
};

const ul: CSSProperties = {
  margin: '0 0 8px',
  paddingLeft: 20,
  color: '#374151',
  fontSize: 15,
  lineHeight: 1.7,
};

const card: CSSProperties = {
  padding: 16,
  background: '#F8FAFC',
  border: '1px solid #E5E7EB',
  borderRadius: 12,
};

const ctaPrimary: CSSProperties = {
  display: 'inline-block',
  padding: '14px 28px',
  background: '#2563EB',
  color: '#fff',
  borderRadius: 980,
  fontSize: 15,
  fontWeight: 600,
  textDecoration: 'none',
};

const ctaSecondary: CSSProperties = {
  display: 'inline-block',
  padding: '14px 28px',
  background: '#fff',
  color: '#1D1D1F',
  borderRadius: 980,
  fontSize: 15,
  fontWeight: 600,
  border: '1px solid #E5E7EB',
  textDecoration: 'none',
};

export default function OemPartnerPage() {
  return (
    <main style={{ maxWidth: 920, margin: '48px auto 80px', padding: '0 20px', overflowX: 'hidden' }}>
      <OrganizationSchema />
      <OemServiceSchema />
      <FaqSchema faqs={OEM_FAQS} />
      <h1 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>
        智能戒指 OEM/ODM 合作
      </h1>
      <p style={{ ...p, marginTop: 14, maxWidth: 720 }}>
        {IDENTITY_ZH} 面向智能戒指硬件、固件、健康算法、App、SDK/API 集成及 OEM/ODM
        制造提供项目咨询与合作。帮助品牌方、数字健康企业与技术公司启动定制化智能戒指产品开发。
        {BRAND_LINE_ZH}
      </p>
      <p style={{ ...p, maxWidth: 720 }}>
        {ENTITY_STATEMENT_ZH} {BRAND_RELATION_ZH} {WHY_DIFF_ZH}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
        <a href="#oem-rfq" style={ctaPrimary}>
          提交 OEM/ODM 项目需求
        </a>
        <Link href="/smart-ring-technology" style={ctaSecondary}>
          了解技术能力
        </Link>
        <Link href="/smart-ring-healthcare-solutions" style={ctaSecondary}>
          了解医疗健康方案
        </Link>
      </div>

      <h2 style={h2}>LONGVON 可以提供</h2>
      <ul style={ul}>
        {PROVIDE.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 style={h2}>可以服务</h2>
      <ul style={ul}>
        {BUYERS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 style={h2}>完整产品开发能力</h2>
      <p style={p}>
        {WHY_DIFF_ZH}（Technology + Product Development + Manufacturing）。
      </p>
      <ol style={{ ...ul, listStyle: 'decimal' }}>
        {E2E.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <h2 style={h2}>合作模式</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
        }}
      >
        {MODES.map((m) => (
          <div key={m.title} style={card}>
            <div style={{ fontWeight: 650, marginBottom: 6 }}>{m.title}</div>
            <div style={{ color: '#4B5563', fontSize: 14, lineHeight: 1.55 }}>{m.body}</div>
          </div>
        ))}
      </div>
      <p style={{ ...p, marginTop: 14, fontSize: 13 }}>
        本页不公布 MOQ、价格或交期数字。具体以项目评估结果为准。
      </p>

      <h2 style={h2}>常见问题</h2>
      <dl style={{ margin: '0 0 8px' }}>
        {OEM_FAQS.map((faq) => (
          <div key={faq.question} style={{ marginBottom: 16 }}>
            <dt style={{ fontSize: 15, fontWeight: 650, color: '#111827', marginBottom: 4 }}>
              {faq.question}
            </dt>
            <dd style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: '#4B5563' }}>{faq.answer}</dd>
          </div>
        ))}
      </dl>

      <h2 style={h2}>下一步</h2>
      <p style={p}>填写下方 RFQ，说明项目类型、产品方向与所需能力，便于销售判断是否值得跟进。</p>

      <div
        id="oem-rfq"
        style={{
          marginTop: 28,
          padding: '28px 20px',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          background: '#fff',
          scrollMarginTop: 24,
        }}
      >
        <Suspense fallback={<p style={p}>加载表单…</p>}>
          <OemRfqForm locale="zh" />
        </Suspense>
      </div>

      <h2 style={h2}>相关技术与应用</h2>
      <ul style={ul}>
        <li>
          <Link href="/company/longvon">龙汾科技（LONGVON）公司实体</Link>
        </li>
        <li>
          <Link href="/smart-ring-manufacturer">智能戒指制造商</Link>
        </li>
        <li>
          <Link href="/smart-ring-oem-odm">OEM / ODM 能力说明</Link>
        </li>
        <li>
          <Link href="/smart-ring-solution-provider">技术方案提供商</Link>
        </li>
        <li>
          <Link href="/smart-ring-technology">技术与开发</Link>
        </li>
        <li>
          <Link href="/smart-ring-healthcare-solutions">医疗健康方案</Link>
        </li>
        <li>
          <Link href="/smart-ring-sleep-monitoring">睡眠监测</Link>
        </li>
        <li>
          <Link href="/smart-ring-sleep-respiratory">睡眠呼吸健康</Link>
        </li>
        <li>
          <Link href="/smart-ring-osa">OSA 相关监测</Link>
        </li>
      </ul>
      <p style={{ ...p, fontSize: 13 }}>
        MATEYOU Ring1C 为消费级智能戒指参考产品，本页面不将其作为医疗器械进行描述。表单中的 OSA
        选项使用「OSA 相关监测」表述，不构成诊断或治疗声明。
      </p>
    </main>
  );
}
