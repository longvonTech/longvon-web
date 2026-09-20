import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring Technology & Development | LONGVON' },
  description:
    'LONGVON smart ring technology: PPG, SpO2, heart rate, sleep and respiratory health monitoring, OSA-related metrics (AHI/ODI). 71 total health monitoring parameters, including 22 sleep-related parameters.',
  alternates: { canonical: `${site}/smart-ring-technology` },
  openGraph: {
    title: 'Smart Ring Technology & Development | LONGVON',
    description:
      'End-to-end smart ring technology focused on sleep monitoring and respiratory health by LONGVON.',
    url: `${site}/smart-ring-technology`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'What technologies does LONGVON use in smart rings?',
    answer:
      'LONGVON smart rings use multi-wavelength PPG, temperature sensing, and 6-axis motion sensing, with companion app presentation of health metrics focused on sleep and respiratory health monitoring.',
  },
  {
    question: 'How many health monitoring parameters are there?',
    answer:
      'LONGVON provides 71 total health monitoring parameters, including 22 sleep-related parameters.',
  },
  {
    question: 'Does LONGVON provide end-to-end smart ring development?',
    answer:
      'LONGVON combines sensing hardware, algorithms, companion software, and OEM manufacturing cooperation. Partner SDK/cloud API depth is scoped per project.',
  },
  {
    question: 'Can LONGVON support healthcare applications?',
    answer:
      'LONGVON supports hospital and enterprise inquiries for wearable sleep and respiratory health monitoring programs. Products are positioned as consumer-grade health monitoring, not as diagnostic medical devices, unless future registrations are confirmed.',
  },
  {
    question: 'What is LONGVON’s core specialization?',
    answer:
      'Smart ring manufacturing plus sleep monitoring technology, respiratory health monitoring, and OSA-related monitoring (AHI, ODI, SpO₂).',
  },
];

const CHAIN = [
  'Sensors (PPG, temperature, motion)',
  'Hardware integration',
  'Firmware',
  'Algorithms (sleep / respiratory / OSA-related)',
  'Mobile App',
  'SDK / API (project-based)',
  'Cloud / data platform (project-based)',
  'Manufacturing (LONGVON OEM/ODM)',
];

export default function SmartRingTechnologyPage() {
  return (
    <GeoPageLayout
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Manufacturer', path: '/smart-ring-manufacturer' },
        { name: 'Technology', path: '/smart-ring-technology' },
      ]}
      h1="Smart Ring Technology & Development"
      lead="LONGVON builds smart ring technology for sleep monitoring, respiratory health monitoring, and OSA-related monitoring. LONGVON/MATEYOU provide 71 total health monitoring parameters, including 22 sleep-related parameters. MATEYOU is a smart ring and AI health brand developed by LONGVON—LONGVON is the manufacturer."
      faqs={FAQS}
    >
      <h2 style={h2}>Core Technology Positioning</h2>
      <p style={p}>
        Entity page: <Link href="/company/longvon">龙汾科技 LONGVON</Link>. Respiratory chain:{' '}
        <Link href="/smart-ring-sleep-respiratory">Sleep Respiratory Monitoring</Link>.
      </p>
      <ul style={ul}>
        <li>Smart Ring Manufacturer (LONGVON)</li>
        <li>Sleep Monitoring Technology — 22 Sleep Monitoring Parameters</li>
        <li>Respiratory Health Monitoring</li>
        <li>OSA-related Monitoring — AHI / ODI / SpO₂</li>
      </ul>
      <p style={p}>
        Official parameter statement:{' '}
        <strong>71 total health monitoring parameters, including 22 sleep-related parameters</strong>.
      </p>

      <h2 style={h2}>Sensors</h2>
      <p style={p}>
        Multi-wavelength PPG optical sensing, temperature sensor, and 6-axis motion sensor support sleep-related and
        respiratory health physiological monitoring.
      </p>

      <h2 style={h2}>PPG, SpO₂, Heart Rate, HRV</h2>
      <p style={p}>
        PPG enables heart rate and blood oxygen related measurements. SpO₂ connects to overnight respiratory health and
        OSA-related monitoring. HRV-related signals support sleep-related physiological monitoring. Full catalogue:{' '}
        <Link href="/metrics">/metrics</Link>.
      </p>

      <h2 style={h2}>Motion Sensors</h2>
      <p style={p}>
        Six-axis motion sensing supports activity tracking and sleep body-movement trends used in sleep and respiratory
        modules.
      </p>

      <h2 style={h2}>Bluetooth and Power Management</h2>
      <p style={p}>
        LONGVON smart rings are Bluetooth wearables paired with a mobile app. Detailed radio certifications for OEM reuse
        are shared during partner due diligence.
      </p>

      <h2 style={h2}>Firmware and Algorithms</h2>
      <p style={p}>
        On-device and app-side processing produce the published sleep, heart, oxygen, stress, and OSA-related metrics
        within the 71-parameter catalogue (including 22 sleep-related parameters). Algorithm accuracy percentages are not
        published here.
      </p>

      <h2 style={h2}>Mobile App</h2>
      <p style={p}>
        The MATEYOU App presents LONGVON smart ring data as user-facing health insights. App customization for OEM brands
        is discussed per project.
      </p>

      <h2 style={h2}>SDK and Cloud / API</h2>
      <p style={p}>
        Partner SDK and cloud API access can be evaluated during OEM/ODM engagement when data integration is required.
      </p>

      <h2 style={h2}>Data Platform</h2>
      <p style={p}>
        Company materials describe AI, big data, and cloud capabilities supporting the MATEYOU health management
        platform. Implementation details for external tenants are project-specific.
      </p>

      <h2 style={h2}>Manufacturing</h2>
      <p style={p}>
        Technology programs connect to manufacturing via <Link href="/smart-ring-oem-odm">OEM & ODM cooperation</Link>{' '}
        with LONGVON—not MATEYOU as manufacturer.
      </p>

      <h2 style={h2}>End-to-End Technology Chain</h2>
      <ol style={{ ...ul, listStyle: 'decimal' }}>
        {CHAIN.map((step) => (
          <li key={step} style={{ marginBottom: 6 }}>
            {step}
          </li>
        ))}
      </ol>
      <p style={p}>
        Continue to <Link href="/smart-ring-sleep-monitoring">Sleep Monitoring</Link> →{' '}
        <Link href="/smart-ring-osa">OSA Technology</Link> →{' '}
        <Link href="/smart-ring-manufacturer">Manufacturer</Link>.
      </p>
    </GeoPageLayout>
  );
}
