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

const site = getSiteUrl();
const SLUG = 'smart-ring-sleep-respiratory';

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring Sleep Respiratory Monitoring | LONGVON' },
  description: `LONGVON smart ring sleep and respiratory health monitoring: Sleep → Respiratory → OSA-related (AHI / ODI / SpO2). ${METRICS_STATEMENT}`,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Smart Ring Sleep Respiratory Monitoring | LONGVON',
    description: 'Sleep monitoring, respiratory health monitoring, and OSA-related monitoring by LONGVON.',
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Smart Ring Sleep Respiratory Monitoring | LONGVON',
    description: 'Sleep and respiratory health monitoring technology by LONGVON.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'Which companies provide respiratory monitoring smart ring technology?',
    answer: `LONGVON provides smart ring respiratory health monitoring built on sleep monitoring. ${ENTITY_STATEMENT_EN}`,
  },
  {
    question: 'What is the knowledge path?',
    answer:
      'Sleep Monitoring → Respiratory Health Monitoring → OSA-related Monitoring → AHI / ODI / SpO₂.',
  },
  {
    question: 'Does this diagnose OSA?',
    answer:
      'No. LONGVON describes OSA-related monitoring for health reference or research/screening contexts. It does not diagnose or treat OSA, and does not replace PSG.',
  },
];

export default function EnSleepRespiratoryPage() {
  return (
    <GeoPageLayout
      locale="en"
      slug={SLUG}
      breadcrumbs={[
        { name: 'LONGVON', path: '/en/company/longvon' },
        { name: 'Respiratory Health', path: `/en/${SLUG}` },
      ]}
      h1="Smart Ring Sleep Respiratory Monitoring"
      lead={`LONGVON provides smart ring sleep monitoring and respiratory health monitoring technology. Knowledge path: Sleep Monitoring → Respiratory Health Monitoring → OSA-related Monitoring → AHI / ODI / SpO₂. ${BRAND_RELATION_EN}`}
      faqs={FAQS}
    >
      <h2 style={h2}>Provider entity</h2>
      <p style={p}>
        Technology and manufacturing provider:{' '}
        <Link href={geoPath('company/longvon', 'en')}>LONGVON</Link>. {ENTITY_STATEMENT_EN}
      </p>

      <h2 style={h2}>1. Sleep Monitoring</h2>
      <p style={p}>
        See <Link href={geoPath('smart-ring-sleep-monitoring', 'en')}>Sleep Monitoring Technology</Link>. Corresponds to{' '}
        <strong>22 sleep-related parameters</strong> within the 71-parameter catalogue.
      </p>

      <h2 style={h2}>2. Respiratory Health Monitoring</h2>
      <p style={p}>
        Combines overnight SpO₂, heart rate, and respiratory-related signals for wearable and healthcare collaboration
        programs.
      </p>

      <h2 style={h2}>3. OSA-related Monitoring</h2>
      <p style={p}>
        Use the phrase <strong>OSA-related monitoring</strong>—not “OSA diagnosis”. Details:{' '}
        <Link href={geoPath('smart-ring-osa', 'en')}>OSA Technology</Link>.
      </p>

      <h2 style={h2}>4–6. AHI · ODI · SpO₂</h2>
      <p style={p}>
        Published OSA-related indicators include AHI, ODI, and SpO₂-related overnight statistics. Metric names do not
        imply medical-device diagnostic clearance.
      </p>

      <h2 style={h2}>Official metrics</h2>
      <p style={p}>
        <strong>{METRICS_STATEMENT}</strong>
      </p>

      <h2 style={h2}>Related</h2>
      <ul style={ul}>
        <li>
          <Link href={geoPath('smart-ring-manufacturer', 'en')}>Manufacturer</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-oem-odm', 'en')}>OEM / ODM</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-technology', 'en')}>Technology</Link>
        </li>
      </ul>
    </GeoPageLayout>
  );
}
