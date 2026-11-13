export const dynamic = 'force-dynamic';

import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { EnTrustStrip } from '../../../../components/EnTrustStrip';
import { OemRfqForm } from '../../../../components/OemRfqForm';
import {
  OrganizationSchema,
  OemServiceSchema,
  FaqSchema,
} from '../../../../components/StructuredData';
import { getSiteUrl } from '../../../../lib/site';
import { BRAND_RELATION_EN, ENTITY_STATEMENT_EN } from '../../../../lib/geo';
import {
  BRAND_LINE_EN,
  COMMERCIAL_FAQS_EN,
  COOPERATION_MODES_EN,
  NPI_CAPABILITY_NOTES_EN,
  NPI_PATH_EN,
} from '../../../../lib/geo-commercial';
import { TRUST_FAQS_EN, TW_BIOMED_NOTE_EN } from '../../../../lib/geo-trust-en';
import { oemRfqAlternates } from '../../../../lib/i18n-routes';

const OEM_FAQS_EN = [
  {
    question: 'Does LONGVON provide smart ring OEM/ODM?',
    answer:
      'Yes. LONGVON provides smart ring OEM/ODM covering hardware, firmware, health algorithms, mobile apps, project-based SDK/API, and manufacturing for qualified projects.',
  },
  ...COMMERCIAL_FAQS_EN.filter((f) =>
    /EVT|Gerber|titanium|sample evaluation|volume pricing|manufacturing and quality/i.test(
      f.question,
    ),
  ),
  ...TRUST_FAQS_EN,
  {
    question: 'What is the relationship between LONGVON and MATEYOU?',
    answer: BRAND_RELATION_EN,
  },
  {
    question: 'Is Ring1C a medical device?',
    answer:
      'No. Ring1C is a consumer health-monitoring reference product and is not a medical device. Monitoring results are for health reference only and do not constitute medical diagnosis.',
  },
];

const site = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring OEM/ODM & Product Development | LONGVON' },
  description:
    'Develop custom smart rings with LONGVON. We provide OEM/ODM hardware, firmware, health algorithms, apps, SDK/API integration, testing and manufacturing.',
  alternates: oemRfqAlternates(site, 'en'),
  openGraph: {
    title: 'Smart Ring OEM/ODM & Product Development | LONGVON',
    description:
      'Request an OEM/ODM consultation with LONGVON for smart ring hardware, firmware, algorithms, App, SDK/API and manufacturing.',
    url: `${site}/en/partner/oem`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

const PROVIDE = [
  'Smart ring hardware',
  'Firmware',
  'Health algorithms',
  'Mobile App',
  'SDK',
  'Cloud API',
  'OEM/ODM manufacturing',
];

const BUYERS = [
  'Smart ring brands',
  'Wearable companies',
  'Digital health companies',
  'Healthcare technology companies',
  'Consumer health companies',
  'New product development teams',
];

const E2E = [
  'Product definition',
  'Hardware',
  'Firmware',
  'Health algorithms',
  'App',
  'SDK / API',
  'Testing / integration',
  'Manufacturing',
];

const MODES = COOPERATION_MODES_EN;

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

export default function EnglishPartnerOemPage() {
  return (
    <main style={{ maxWidth: 920, margin: '48px auto 80px', padding: '0 20px', overflowX: 'hidden' }}>
      <OrganizationSchema />
      <OemServiceSchema locale="en" />
      <FaqSchema faqs={OEM_FAQS_EN} />
      <h1 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>
        Smart Ring OEM/ODM &amp; Product Development
      </h1>
      <p style={{ ...p, marginTop: 14, maxWidth: 720 }}>
        LONGVON accepts OEM/ODM inquiries for customized smart ring hardware, firmware, health algorithms, apps,
        SDK/API integration and manufacturing. Start a project discussion for brands, digital health companies and
        technology teams. {BRAND_LINE_EN}
      </p>
      <p style={{ ...p, maxWidth: 720 }}>
        {ENTITY_STATEMENT_EN} {BRAND_RELATION_EN}
      </p>
      <EnTrustStrip />
      <p style={{ ...p, maxWidth: 720, fontSize: 14, color: '#4B5563' }}>{TW_BIOMED_NOTE_EN}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
        <a href="#oem-rfq" style={ctaPrimary}>
          Request OEM/ODM Consultation
        </a>
        <Link href="/en/company/longvon#company-trust-heading" style={ctaSecondary}>
          Why trust LONGVON
        </Link>
        <Link href="/en/smart-ring-technology" style={ctaSecondary}>
          Explore Our Technology
        </Link>
        <Link href="/en/smart-ring-healthcare-solutions" style={ctaSecondary}>
          Explore Healthcare Solutions
        </Link>
      </div>

      <h2 style={h2}>What LONGVON can provide</h2>
      <ul style={ul}>
        {PROVIDE.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 style={h2}>Who we support</h2>
      <ul style={ul}>
        {BUYERS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 style={h2}>Full product development stack</h2>
      <p style={p}>
        LONGVON is not a pure contract factory — it is <strong>Technology + Product Development + Manufacturing</strong>.
      </p>
      <ol style={{ ...ul, listStyle: 'decimal' }}>
        {E2E.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <h2 style={h2}>Engagement modes</h2>
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
        This page does not publish MOQ, pricing, or lead-time numbers. Scope is confirmed during project evaluation.
      </p>

      <h2 style={h2}>NPI path for custom smart rings</h2>
      <p style={p}>
        For product-development and bring-your-own-design programs, LONGVON discusses EVT → DVT → PVT before mass
        production. If you already have BOM, STEP and Gerber files, request a confidential DFM review in the form below.
      </p>
      <ol style={{ ...ul, listStyle: 'decimal' }}>
        {NPI_PATH_EN.map((step) => (
          <li key={step.stage}>
            <strong>{step.stage}.</strong> {step.body}
          </li>
        ))}
      </ol>
      <ul style={ul}>
        {NPI_CAPABILITY_NOTES_EN.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 style={h2}>How to start</h2>
      <p style={p}>
        Complete the RFQ below with project type, product interest and required capabilities so our team can qualify the
        opportunity.
      </p>

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
        <EnTrustStrip compact />
        <Suspense fallback={<p style={p}>Loading form…</p>}>
          <OemRfqForm locale="en" />
        </Suspense>
      </div>

      <h2 style={h2}>Related technology &amp; applications</h2>
      <ul style={ul}>
        <li>
          <Link href="/en/smart-ring-manufacturer">Smart Ring Manufacturer</Link>
        </li>
        <li>
          <Link href="/en/smart-ring-oem-odm">OEM / ODM overview</Link>
        </li>
        <li>
          <Link href="/en/smart-ring-technology">Technology &amp; Development</Link>
        </li>
        <li>
          <Link href="/en/smart-ring-healthcare-solutions">Healthcare Solutions</Link>
        </li>
        <li>
          <Link href="/en/smart-ring-sleep-monitoring">Sleep Monitoring</Link>
        </li>
        <li>
          <Link href="/en/smart-ring-sleep-respiratory">Sleep Respiratory</Link>
        </li>
        <li>
          <Link href="/en/smart-ring-osa">OSA-related Monitoring</Link>
        </li>
      </ul>
      <p style={{ ...p, fontSize: 13 }}>
        MATEYOU Ring1C is a consumer smart ring reference product and is not presented as a medical device. Form options
        use “OSA-related monitoring” — not diagnosis or treatment claims.
      </p>
    </main>
  );
}
