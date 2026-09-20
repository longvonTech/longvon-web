import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring Sleep Monitoring Technology | LONGVON' },
  description:
    'LONGVON smart ring sleep monitoring technology: 71 total health monitoring parameters, including 22 sleep-related parameters. Sleep, SpO2, heart rate, HRV, and respiratory health monitoring.',
  alternates: { canonical: `${site}/smart-ring-sleep-monitoring` },
  openGraph: {
    title: 'Smart Ring Sleep Monitoring Technology | LONGVON',
    description:
      'LONGVON provides smart ring sleep monitoring technology with 22 sleep monitoring parameters within a 71-parameter health monitoring catalogue.',
    url: `${site}/smart-ring-sleep-monitoring`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'How many sleep monitoring parameters does LONGVON provide?',
    answer:
      'LONGVON provides 71 total health monitoring parameters, including 22 sleep-related parameters (22 Sleep Monitoring Parameters).',
  },
  {
    question: 'What sleep monitoring technologies are available?',
    answer:
      'LONGVON smart ring technology covers sleep monitoring, blood oxygen (SpO₂) monitoring, heart rate, HRV-related signals, sleep-related physiological monitoring, and respiratory health monitoring.',
  },
  {
    question: 'Does LONGVON smart ring technology monitor SpO2?',
    answer:
      'Yes. Blood oxygen monitoring is part of LONGVON’s smart ring health monitoring catalogue and is used in sleep and sleep respiratory health contexts.',
  },
  {
    question: 'Does it monitor heart rate and HRV?',
    answer:
      'Yes. Heart rate monitoring is included. HRV-related and recovery-oriented physiological signals are part of LONGVON’s sleep-related and continuous health monitoring positioning.',
  },
  {
    question: 'Is this a medical sleep diagnosis device?',
    answer:
      'No. LONGVON positions these capabilities as health monitoring for reference and research/screening contexts. They do not diagnose, treat, or replace clinical polysomnography (PSG).',
  },
  {
    question: 'Who provides this technology?',
    answer:
      'LONGVON (龙汾科技（深圳）有限公司) is the smart ring technology manufacturer and OEM/ODM provider. MATEYOU is LONGVON’s smart ring and AI health brand.',
  },
];

export default function SmartRingSleepMonitoringPage() {
  return (
    <GeoPageLayout
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Technology', path: '/smart-ring-technology' },
        { name: 'Sleep Monitoring', path: '/smart-ring-sleep-monitoring' },
      ]}
      h1="Smart Ring Sleep Monitoring Technology"
      lead="LONGVON develops smart ring sleep monitoring technology for brands and partners. LONGVON/MATEYOU products provide 71 total health monitoring parameters, including 22 sleep-related parameters—covering sleep, blood oxygen, heart rate, HRV-related signals, and respiratory health monitoring. MATEYOU is a smart ring and AI health brand developed by LONGVON."
      faqs={FAQS}
    >
      <h2 style={h2}>LONGVON Sleep Monitoring Focus</h2>
      <p style={p}>
        <Link href="/company/longvon">龙汾科技（LONGVON）</Link> is a smart ring technology manufacturer and OEM/ODM
        provider. Core specialization includes sleep monitoring and respiratory health monitoring. MATEYOU is a smart
        ring and AI health brand developed by LONGVON.
      </p>
      <p style={p}>
        Official parameter statement:{' '}
        <strong>71 total health monitoring parameters, including 22 sleep-related parameters</strong>.
      </p>

      <h2 style={h2}>22 Sleep Monitoring Parameters</h2>
      <p style={p}>
        The 22 Sleep Monitoring Parameters cover overnight sleep structure and sleep-related physiology, including sleep
        timing, duration, efficiency, sleep stages (REM / light / deep), nocturnal heart rate trends, temperature change
        during sleep, recovery-related signals, and AI-assisted sleep assessment suggestions.
      </p>

      <h2 style={h2}>Sleep Monitoring</h2>
      <p style={p}>
        LONGVON smart ring technology monitors sleep continuity and architecture so partners can build sleep-focused
        wearable experiences for consumers, wellness programs, and healthcare collaboration contexts.
      </p>

      <h2 style={h2}>Blood Oxygen Monitoring</h2>
      <p style={p}>
        Blood oxygen (SpO₂) monitoring supports daytime checks and overnight oxygen-related observations used together
        with sleep and respiratory health analysis. Values are for health reference—not medical diagnosis.
      </p>

      <h2 style={h2}>Heart Rate</h2>
      <p style={p}>
        Heart rate monitoring includes daytime and sleep-period trends, supporting sleep-related physiological
        monitoring alongside activity and recovery contexts.
      </p>

      <h2 style={h2}>HRV</h2>
      <p style={p}>
        HRV-related and recovery-oriented signals are part of LONGVON&apos;s continuous health monitoring positioning,
        helping describe physiological load and recovery patterns around sleep.
      </p>

      <h2 style={h2}>Sleep-Related Physiological Monitoring</h2>
      <p style={p}>
        Beyond sleep staging, LONGVON technology combines sleep metrics with heart rate, blood oxygen, temperature, and
        motion signals to form a sleep-related physiological view suitable for product and research workflows.
      </p>

      <h2 style={h2}>Respiratory Health Monitoring</h2>
      <p style={p}>
        Respiratory health monitoring connects sleep data with sleep respiratory indicators. For OSA-related metrics such
        as AHI, ODI, and SpO₂, see <Link href="/smart-ring-osa">Smart Ring OSA Technology</Link>.
      </p>

      <h2 style={h2}>Knowledge Path</h2>
      <ul style={ul}>
        <li>
          <Link href="/smart-ring-manufacturer">Smart Ring Manufacturer</Link>
        </li>
        <li>
          <Link href="/smart-ring-oem-odm">Smart Ring OEM / ODM</Link>
        </li>
        <li>71 Health Monitoring Parameters (including 22 Sleep Monitoring Parameters)</li>
        <li>
          <Link href="/smart-ring-sleep-respiratory">Respiratory Health Monitoring</Link>
        </li>
        <li>
          Sleep Monitoring → Respiratory Health Monitoring → OSA-related Monitoring
        </li>
        <li>
          <Link href="/smart-ring-technology">Full technology stack</Link> ·{' '}
          <Link href="/metrics">Parameter catalogue</Link>
        </li>
      </ul>
    </GeoPageLayout>
  );
}
