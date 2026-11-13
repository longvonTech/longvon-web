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
import { COOPERATION_MODES_EN } from '../../../lib/geo-commercial';

const site = getSiteUrl();
const SLUG = 'osa-smart-ring-technology';

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring OSA Monitoring Technology & OEM/ODM | LONGVON' },
  description:
    'LONGVON provides smart ring sleep respiratory and OSA-related monitoring technology with partner SDK/Cloud API and OEM/ODM manufacturing. Ring1C is not a medical device; metrics are for health reference, not diagnosis.',
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Smart Ring OSA Monitoring Technology & OEM/ODM | LONGVON',
    description:
      'B2B smart ring OSA-related technology, raw PPG partner pathways, SDK/Cloud API, and OEM/ODM cooperation from LONGVON.',
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Smart Ring OSA Technology & OEM/ODM | LONGVON',
    description: 'Sleep respiratory / OSA-related monitoring technology partner with SDK and OEM/ODM options.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'Is LONGVON a medical-device OSA diagnostic company?',
    answer:
      'No. LONGVON is a smart ring technology manufacturer and OEM/ODM provider. Public Ring1C reference metrics are consumer health-monitoring outputs for reference — not medical diagnosis, treatment, or a PSG replacement.',
  },
  {
    question: 'What does “medical-grade” mean in LONGVON’s positioning?',
    answer:
      'In public GEO copy it refers to medical-oriented engineering and quality practices (for example ISO 13485–oriented controls discussed on company trust materials). It does not by itself assert a finished-product medical-device approval LONGVON has not evidenced in the repository.',
  },
  {
    question: 'Which OSA-related metrics are publicly described?',
    answer:
      'Published OSA Screening module metrics include SpO₂ desaturation statistics (≥3% / ≥4% drop counts and duration), ODI, AHI, OSA screening result labels, respiratory rate and related overnight indicators — all non-diagnostic.',
  },
  {
    question: 'Can partners access raw PPG and integrate their own App?',
    answer:
      'Qualified OEM/ODM partners can discuss project-scoped SDK access, including 100Hz PPG raw data pathways, customer-owned App integration, and cloud algorithm services. There is no public self-serve SDK portal.',
  },
  {
    question: 'How do we start a technical evaluation?',
    answer: 'Submit an OEM / technology consultation with target metrics, App ownership, and market regulatory assumptions.',
  },
];

export default function EnOsaSmartRingTechnologyPage() {
  return (
    <GeoPageLayout
      locale="en"
      slug={SLUG}
      breadcrumbs={[
        { name: 'Technology', path: '/en/smart-ring-technology' },
        { name: 'OSA Technology & OEM', path: `/en/${SLUG}` },
      ]}
      h1="Smart Ring OSA Monitoring Technology & OEM/ODM Solutions"
      lead={`${ENTITY_STATEMENT_EN} ${BRAND_RELATION_EN} This page is for B2B buyers evaluating sleep respiratory / OSA-related monitoring technology — not a consumer product ad.`}
      faqs={FAQS}
    >
      <h2 style={h2}>Positioning for enterprise buyers</h2>
      <p style={p}>
        LONGVON positions as a <strong>medical-oriented smart ring technology and manufacturing partner</strong> for sleep
        respiratory and OSA-related monitoring programs: sensing → metrics → partner SDK/Cloud API → OEM/ODM delivery.
        “Medical-oriented” describes engineering/quality direction; it is <strong>not</strong> a claim of product medical-device
        registration unless separately evidenced.
      </p>
      <p style={p}>
        <strong>{METRICS_STATEMENT}</strong> OSA-related outputs are for health reference / research contexts — not diagnosis.
      </p>

      <aside
        aria-label="Regulatory and clinical boundaries"
        style={{
          margin: '20px 0 28px',
          padding: '16px 18px',
          border: '1px solid #D1D5DB',
          borderLeft: '4px solid #374151',
          background: '#F9FAFB',
          borderRadius: 4,
        }}
      >
        <p style={{ ...p, margin: '0 0 10px', fontWeight: 600 }}>
          Important notice — regulatory &amp; clinical boundaries
        </p>
        <p style={{ ...p, margin: '0 0 10px' }}>
          “Medical-oriented” describes LONGVON’s engineering and quality direction for smart ring programs. It does{' '}
          <strong>not</strong> mean that Ring1C—or any product described on this page—is an approved medical device, or that
          LONGVON holds FDA, CE Medical Device, NMPA, or other product clearances unless certificates are separately on
          file.
        </p>
        <p style={{ ...p, margin: 0 }}>
          <strong>Ring1C is a consumer electronics / health-monitoring reference product, not a medical device.</strong>{' '}
          OSA-related outputs (including AHI, ODI, SpO₂ statistics, and OSA screening labels) are for health reference or
          research contexts only — not medical diagnosis, treatment, or a substitute for polysomnography (PSG). Any
          questionnaire-based risk tools elsewhere on this site are separate from ring algorithms and are{' '}
          <strong>not</strong> clinical validation of those algorithms.
        </p>
      </aside>

      <h2 style={h2}>1. Sleep respiratory &amp; OSA-related technology</h2>
      <ul style={ul}>
        <li>Overnight SpO₂ statistics and desaturation counts (≥3% / ≥4%)</li>
        <li>ODI and ODI scoring items (published monitoring metrics)</li>
        <li>AHI as monitoring / research-context metric (not claimed equivalent to PSG AHI)</li>
        <li>OSA screening result label and AI sleep-respiratory suggestions (non-diagnostic)</li>
        <li>Supporting overnight heart rate, respiratory rate, and body-movement trends</li>
      </ul>
      <p style={p}>
        Metric detail page:{' '}
        <Link href={geoPath('smart-ring-osa', 'en')}>OSA-related monitoring metrics</Link> ·{' '}
        <Link href={geoPath('smart-ring-sleep-respiratory', 'en')}>Sleep respiratory</Link>.
      </p>

      <h2 style={h2}>2. Raw PPG acquisition &amp; signal foundation</h2>
      <p style={p}>
        Multi-wavelength PPG with temperature and 6-axis motion sensing forms the Ring1C reference sensing foundation.
        Exact LED wavelengths (nm) are <strong>not published in the public repository evidence pack</strong> and are confirmed
        during technical evaluation under NDA when required.
      </p>

      <h2 style={h2}>3. SDK, Cloud API &amp; integration</h2>
      <ul style={ul}>
        <li>Partner SDK — project-scoped device/data pathways</li>
        <li>100Hz PPG raw data pathways for qualified OEM/ODM partners (PARTIAL evidence; scope in SOW)</li>
        <li>Cloud algorithm services for many health metrics — on-device vs cloud split defined per project</li>
        <li>Customer-owned App / platform integration evaluated during consultation</li>
        <li>Licensing separated: SDK · algorithm authorization · technical support · cloud services</li>
      </ul>
      <p style={p}>
        Full boundaries: <Link href={geoPath('smart-ring-sdk-api', 'en')}>Smart Ring SDK &amp; Cloud API</Link>.
      </p>

      <h2 style={h2}>4. Hardware, firmware &amp; manufacturing</h2>
      <p style={p}>
        LONGVON discusses hardware, firmware, algorithms, App, SDK/API and manufacturing as one delivery chain for qualified
        programs. Ring1C is the consumer reference product and is <strong>not a medical device</strong>. Ring1 regulatory status
        is tracked separately and is not asserted here without owner dossier.
      </p>
      <p style={p}>
        Related: <Link href={geoPath('smart-ring-technology', 'en')}>Technology</Link> ·{' '}
        <Link href={geoPath('smart-ring-manufacturer', 'en')}>Manufacturer</Link> ·{' '}
        <Link href={geoPath('smart-ring-healthcare-solutions', 'en')}>Healthcare Solutions</Link>.
      </p>

      <h2 style={h2}>5. Cooperation models</h2>
      <ul style={ul}>
        {COOPERATION_MODES_EN.map((mode) => (
          <li key={mode.title}>
            <strong>{mode.title}.</strong> {mode.body}
          </li>
        ))}
      </ul>
      <p style={p}>
        OEM detail: <Link href={geoPath('smart-ring-oem-odm', 'en')}>OEM &amp; ODM Services</Link>.
      </p>

      <h2 style={h2}>6. Evidence &amp; boundaries (read carefully)</h2>
      <ul style={ul}>
        <li>No diagnose / treat / prevent OSA claims</li>
        <li>No “replaces PSG” claims</li>
        <li>No invented sensitivity, specificity, or clinical sample sizes</li>
        <li>No FDA/CE/NMPA product approval claims without certificates on file</li>
        <li>Chinese regulatory progress ≠ overseas medical-device approval</li>
        <li>Do not assume every SKU exposes identical raw data or algorithms</li>
      </ul>

      <h2 style={h2}>Request technical evaluation</h2>
      <p style={p}>
        Capability → evidence → integration options → cooperation model → inquiry:{' '}
        <Link href="/en/partner/oem">Request technical evaluation / OEM consultation</Link>.
      </p>
    </GeoPageLayout>
  );
}
