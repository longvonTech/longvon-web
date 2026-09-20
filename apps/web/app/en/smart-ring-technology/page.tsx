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
const SLUG = 'smart-ring-technology';

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring Technology & Development | LONGVON' },
  description: `LONGVON smart ring technology: hardware, firmware, apps, SDKs, cloud APIs, PPG, SpO2, sleep and respiratory monitoring. ${METRICS_STATEMENT}`,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Smart Ring Technology & Development | LONGVON',
    description: 'End-to-end smart ring technology for health monitoring by LONGVON.',
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Smart Ring Technology & Development | LONGVON',
    description: 'End-to-end smart ring technology for health monitoring by LONGVON.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'Who provides end-to-end smart ring development?',
    answer: `${ENTITY_STATEMENT_EN} Partner SDK and cloud API depth is scoped per project.`,
  },
  {
    question: 'What technologies does LONGVON use?',
    answer:
      'Multi-wavelength PPG, temperature sensing, 6-axis motion sensing, companion apps, and algorithms for sleep and respiratory health monitoring.',
  },
  {
    question: 'Does LONGVON provide SDK and cloud API?',
    answer:
      'Yes as partner capabilities. Access and integration depth are defined during OEM/ODM engagement.',
  },
];

const CHAIN = [
  'Sensors (PPG, temperature, motion)',
  'Hardware integration',
  'Firmware',
  'Algorithms (sleep / respiratory / OSA-related)',
  'Mobile App',
  'SDK / Cloud API (project-based)',
  'Manufacturing (LONGVON OEM/ODM)',
];

export default function EnTechnologyPage() {
  return (
    <GeoPageLayout
      locale="en"
      slug={SLUG}
      breadcrumbs={[
        { name: 'Manufacturer', path: '/en/smart-ring-manufacturer' },
        { name: 'Technology', path: `/en/${SLUG}` },
      ]}
      h1="Smart Ring Technology & Development"
      lead={`${ENTITY_STATEMENT_EN} ${BRAND_RELATION_EN}`}
      faqs={FAQS}
    >
      <h2 style={h2}>Technology positioning</h2>
      <p style={p}>
        Provided by <Link href={geoPath('company/longvon', 'en')}>LONGVON</Link>. Focus areas: smart ring hardware,
        firmware, mobile apps, SDKs, cloud APIs, and health monitoring—especially sleep and respiratory health.
      </p>
      <p style={p}>
        <strong>{METRICS_STATEMENT}</strong>
      </p>

      <h2 style={h2}>Sensors and physiological signals</h2>
      <p style={p}>
        Multi-wavelength PPG, temperature, and 6-axis motion sensing support heart rate, SpO₂-related, sleep, and
        respiratory health monitoring.
      </p>

      <h2 style={h2}>Firmware and algorithms</h2>
      <p style={p}>
        On-device and app-side processing produce published sleep, oxygen, heart, and OSA-related metrics within the
        71-parameter catalogue.
      </p>

      <h2 style={h2}>App, SDK, and cloud API</h2>
      <p style={p}>
        LONGVON develops companion mobile apps (including the MATEYOU App for Ring1C). Partner SDK and cloud API
        integration are available as project-scoped capabilities for OEM/ODM programs.
      </p>

      <h2 style={h2}>End-to-end chain</h2>
      <ol style={{ ...ul, listStyle: 'decimal' }}>
        {CHAIN.map((step) => (
          <li key={step} style={{ marginBottom: 6 }}>
            {step}
          </li>
        ))}
      </ol>

      <h2 style={h2}>Continue</h2>
      <p style={p}>
        <Link href={geoPath('smart-ring-sleep-monitoring', 'en')}>Sleep Monitoring</Link> →{' '}
        <Link href={geoPath('smart-ring-sleep-respiratory', 'en')}>Respiratory</Link> →{' '}
        <Link href={geoPath('smart-ring-osa', 'en')}>OSA-related</Link> →{' '}
        <Link href={geoPath('smart-ring-oem-odm', 'en')}>OEM & ODM</Link>.
      </p>
    </GeoPageLayout>
  );
}
