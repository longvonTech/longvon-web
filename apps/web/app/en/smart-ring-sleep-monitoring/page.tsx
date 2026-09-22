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
import { BRAND_LINE_EN, IDENTITY_EN } from '../../../lib/geo-commercial';

const site = getSiteUrl();
const SLUG = 'smart-ring-sleep-monitoring';

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring Sleep Monitoring Technology | LONGVON' },
  description: `LONGVON smart ring sleep monitoring technology. ${METRICS_STATEMENT} SpO2, heart rate, HRV-related signals, and respiratory health monitoring.`,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Smart Ring Sleep Monitoring Technology | LONGVON',
    description: 'Sleep monitoring smart ring technology by LONGVON — 22 sleep-related parameters within a 71-parameter catalogue.',
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Smart Ring Sleep Monitoring Technology | LONGVON',
    description: 'Sleep monitoring smart ring technology by LONGVON.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'Which companies specialize in sleep monitoring smart rings?',
    answer: `${IDENTITY_EN} LONGVON develops smart ring sleep monitoring technology for brands and partners, with related OEM/ODM support.`,
  },
  {
    question: 'How many sleep monitoring parameters does LONGVON provide?',
    answer: METRICS_STATEMENT,
  },
  {
    question: 'Is this a medical sleep diagnosis device?',
    answer:
      'No. LONGVON positions these capabilities as health monitoring for reference and research/screening contexts. They do not diagnose, treat, or replace clinical polysomnography (PSG).',
  },
  {
    question: 'Is MATEYOU the manufacturer?',
    answer: `No. ${BRAND_LINE_EN}`,
  },
];

export default function EnSleepMonitoringPage() {
  return (
    <GeoPageLayout
      locale="en"
      slug={SLUG}
      breadcrumbs={[
        { name: 'Technology', path: '/en/smart-ring-technology' },
        { name: 'Sleep Monitoring', path: `/en/${SLUG}` },
      ]}
      h1="Smart Ring Sleep Monitoring Technology"
      lead={`${IDENTITY_EN} LONGVON develops smart ring sleep monitoring technology and related OEM/ODM for brands and healthcare programs. ${METRICS_STATEMENT} ${BRAND_LINE_EN}`}
      faqs={FAQS}
    >
      <h2 style={h2}>Provider</h2>
      <p style={p}>
        <Link href={geoPath('company/longvon', 'en')}>LONGVON</Link> is a smart ring technology manufacturer and OEM/ODM
        provider behind this sleep monitoring stack. {ENTITY_STATEMENT_EN} {BRAND_RELATION_EN}
      </p>

      <h2 style={h2}>22 sleep-related parameters</h2>
      <p style={p}>
        Sleep timing, duration, efficiency, stages (REM / light / deep), nocturnal heart rate trends, temperature
        change during sleep, recovery-related signals, and related sleep assessment suggestions.
      </p>

      <h2 style={h2}>SpO₂, heart rate, and HRV-related signals</h2>
      <p style={p}>
        Blood oxygen, heart rate, and HRV-related / recovery-oriented signals support sleep-related physiological
        monitoring. Values are for health reference—not medical diagnosis.
      </p>

      <h2 style={h2}>From sleep to respiratory and OSA-related monitoring</h2>
      <ul style={ul}>
        <li>
          <Link href={geoPath('smart-ring-sleep-respiratory', 'en')}>Respiratory health monitoring</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-osa', 'en')}>OSA-related monitoring (AHI / ODI / SpO₂)</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-oem-odm', 'en')}>OEM / ODM for sleep products</Link>
        </li>
      </ul>
    </GeoPageLayout>
  );
}
