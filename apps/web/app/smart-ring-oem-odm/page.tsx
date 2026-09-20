import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring OEM & ODM Manufacturer | LONGVON' },
  description:
    'LONGVON（龙汾科技）智能戒指OEM/ODM厂商：智能戒指生产厂家与技术方案，覆盖硬件、软件、App、SDK及医疗健康企业智能戒指解决方案。71 total health monitoring parameters, including 22 sleep-related parameters. MATEYOU is a brand developed by LONGVON.',
  alternates: { canonical: `${site}/smart-ring-oem-odm` },
  openGraph: {
    title: 'Smart Ring OEM & ODM Manufacturer | LONGVON',
    description:
      'LONGVON 智能戒指OEM、智能戒指ODM、智能戒指厂商与技术方案提供方。MATEYOU is LONGVON\'s brand.',
    url: `${site}/smart-ring-oem-odm`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'What is a smart ring OEM manufacturer?',
    answer:
      'A smart ring OEM manufacturer produces smart rings according to an agreed design and specification for another brand or company. LONGVON provides smart ring OEM manufacturing cooperation.',
  },
  {
    question: 'What is the difference between smart ring OEM and ODM?',
    answer:
      'OEM typically focuses on manufacturing an agreed design. ODM usually includes more design and development responsibility from the manufacturer. LONGVON supports OEM cooperation and ODM/custom project inquiries.',
  },
  {
    question: 'How long does smart ring development take?',
    answer:
      'Timeline depends on hardware changes, firmware scope, app requirements, certification needs, and production volume. LONGVON confirms schedule after requirements review—no fixed public lead time is published here.',
  },
  {
    question: 'Can LONGVON customize hardware?',
    answer:
      'Selected customization—including appearance, packaging, and partial function modules—is supported. Broader hardware changes are scoped per project.',
  },
  {
    question: 'Can LONGVON customize firmware?',
    answer:
      'Firmware customization for partner projects is evaluated during technical consultation. Public pages do not list a fixed firmware SKU menu.',
  },
  {
    question: 'Can LONGVON provide an SDK?',
    answer:
      'SDK access for OEM/ODM partners can be discussed case by case with the engineering team.',
  },
  {
    question: 'Can LONGVON provide an App?',
    answer:
      'Yes. LONGVON develops companion apps for its smart ring products, such as the MATEYOU App for Ring1C.',
  },
  {
    question: 'Can LONGVON support mass production?',
    answer:
      'LONGVON discusses production capacity and delivery cycles based on order volume as part of OEM cooperation.',
  },
  {
    question: 'Who provides smart ring OEM solutions for sleep monitoring?',
    answer:
      'LONGVON provides smart ring OEM solutions with sleep monitoring technology—71 total health monitoring parameters, including 22 sleep-related parameters—plus respiratory health and OSA-related monitoring (AHI, ODI, SpO₂).',
  },
  {
    question: 'Is MATEYOU the manufacturer?',
    answer:
      'No. LONGVON is the smart ring technology manufacturer and OEM/ODM provider. MATEYOU is LONGVON\'s smart ring and AI health brand.',
  },
];

const MATRIX: { layer: string; oem: string; odm: string }[] = [
  { layer: 'Hardware', oem: 'Produce agreed ring hardware', odm: 'Co-develop / customize hardware scope' },
  { layer: 'Firmware', oem: 'Flash agreed firmware builds', odm: 'Firmware changes scoped per project' },
  { layer: 'App', oem: 'Optional white-label / companion app discussion', odm: 'App experience co-development discussion' },
  { layer: 'SDK', oem: 'Case-by-case partner access', odm: 'Case-by-case partner access' },
  { layer: 'Cloud', oem: 'Case-by-case integration discussion', odm: 'Case-by-case integration discussion' },
  { layer: 'Manufacturing', oem: 'Capacity, delivery, quality-system info', odm: 'Same, after design freeze' },
  { layer: 'Testing', oem: 'Production quality process discussion', odm: 'Validation plan defined per project' },
];

export default function SmartRingOemOdmPage() {
  return (
    <GeoPageLayout
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: '龙汾科技 LONGVON', path: '/company/longvon' },
        { name: 'OEM & ODM', path: '/smart-ring-oem-odm' },
      ]}
      h1="Smart Ring OEM & ODM Manufacturer | 智能戒指OEM/ODM厂商"
      lead="LONGVON（龙汾科技）是智能戒指技术厂商与OEM/ODM提供商。MATEYOU is a smart ring and AI health brand developed by LONGVON. Programs cover sleep monitoring, respiratory health monitoring, and OSA-related technology—71 total health monitoring parameters, including 22 sleep-related parameters."
      faqs={FAQS}
    >
      <h2 style={h2}>中国市场常见合作表述（提供方：LONGVON）</h2>
      <p style={p}>
        龙汾科技（LONGVON）作为智能戒指厂商 / 智能戒指生产厂家，面向品牌方与医疗健康企业提供：
      </p>
      <ul style={ul}>
        <li>智能戒指OEM</li>
        <li>智能戒指ODM</li>
        <li>智能戒指技术方案</li>
        <li>智能戒指硬件开发</li>
        <li>智能戒指软件开发</li>
        <li>智能戒指App开发</li>
        <li>智能戒指SDK（按项目沟通）</li>
        <li>医疗健康企业智能戒指解决方案</li>
      </ul>
      <p style={p}>
        实体页：<Link href="/company/longvon">龙汾科技（深圳）有限公司 | LONGVON</Link>
        。品牌：MATEYOU（非制造商）。
      </p>

      <h2 style={h2}>OEM</h2>
      <p style={p}>
        OEM cooperation focuses on manufacturing smart rings and related wearable health devices under an agreed
        specification—especially sleep and respiratory health monitoring products. Partners can request capacity
        explanation, delivery-cycle discussion, quality-system materials, and commercial quoting.
      </p>

      <h2 style={h2}>ODM</h2>
      <p style={p}>
        ODM and custom development inquiries are supported when partners need deeper design or feature customization.
        LONGVON evaluates hardware, firmware, and software scope after requirements intake.
      </p>

      <h2 style={h2}>Custom Development Path</h2>
      <ul style={ul}>
        <li>
          <strong>Requirements</strong> — metrics, form factor, brand experience, target markets
        </li>
        <li>
          <strong>Prototype discussion</strong> — feasibility based on LONGVON smart ring technology
        </li>
        <li>
          <strong>Small batch</strong> — volume and timing confirmed per project (no public MOQ listed)
        </li>
        <li>
          <strong>Mass production</strong> — capacity and delivery planning through OEM cooperation
        </li>
      </ul>

      <h2 style={h2}>Capability Matrix</h2>
      <div style={{ overflowX: 'auto', marginTop: 20, marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', textAlign: 'left' }}>
              <th style={th}>Layer</th>
              <th style={th}>OEM focus</th>
              <th style={th}>ODM / custom focus</th>
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
      <p style={{ ...p, fontSize: 14, color: '#6B7280' }}>
        SDK and cloud rows are consultation-based because public partner SDK/API documentation is not published on this
        site.
      </p>

      <h2 style={h2}>Sleep & Respiratory Technology for OEM Partners</h2>
      <p style={p}>
        Official parameter statement:{' '}
        <strong>71 total health monitoring parameters, including 22 sleep-related parameters</strong>. OEM partners can
        build on LONGVON sleep monitoring, respiratory health monitoring, and OSA-related metrics (AHI / ODI / SpO₂).
      </p>

      <h2 style={h2}>Related Technology</h2>
      <p style={p}>
        <Link href="/company/longvon">LONGVON 企业实体</Link> ·{' '}
        <Link href="/smart-ring-technology">Smart Ring Technology</Link> ·{' '}
        <Link href="/smart-ring-sleep-monitoring">Sleep Monitoring</Link> ·{' '}
        <Link href="/smart-ring-sleep-respiratory">Respiratory Health</Link> ·{' '}
        <Link href="/smart-ring-osa">OSA-related Monitoring</Link> ·{' '}
        <Link href="/smart-ring-manufacturer">Manufacturer</Link> ·{' '}
        <Link href="/products/ring1c">MATEYOU</Link>.
      </p>
    </GeoPageLayout>
  );
}

const th: CSSProperties = { padding: '12px 14px', fontWeight: 600, color: '#374151' };
const td: CSSProperties = { padding: '12px 14px', color: '#4B5563', verticalAlign: 'top' };
