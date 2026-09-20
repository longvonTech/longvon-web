import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../components/GeoPageLayout';
import { getSiteUrl } from '../../lib/site';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring OSA & Sleep Respiratory Monitoring Technology | LONGVON' },
  description:
    'LONGVON smart ring OSA-related and sleep respiratory monitoring: AHI, ODI, SpO2, PPG-based sensing, and sleep monitoring. 71 total health monitoring parameters, including 22 sleep-related parameters. Not a diagnostic medical device.',
  alternates: { canonical: `${site}/smart-ring-osa` },
  openGraph: {
    title: 'Smart Ring OSA & Sleep Respiratory Monitoring Technology | LONGVON',
    description:
      'OSA-related monitoring, AHI, ODI, SpO2, and sleep respiratory health technology for smart rings by LONGVON.',
    url: `${site}/smart-ring-osa`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'What is OSA-related monitoring on a smart ring?',
    answer:
      'OSA-related monitoring means tracking sleep respiratory health indicators—such as SpO₂ patterns, AHI, and ODI—during sleep. It supports awareness, research, and screening contexts. It does not diagnose or treat OSA.',
  },
  {
    question: 'Does LONGVON diagnose sleep apnea?',
    answer:
      'No. LONGVON does not claim diagnosis, treatment, or prevention of OSA, and does not claim to replace polysomnography (PSG).',
  },
  {
    question: 'Which OSA-related metrics does LONGVON publish?',
    answer:
      'Published OSA-related metrics include AHI, ODI, SpO₂-related indicators (including nocturnal oxygen drops), and related sleep respiratory health items within the smart ring monitoring catalogue.',
  },
  {
    question: 'How do sleep parameters relate to OSA monitoring?',
    answer:
      'LONGVON provides 71 total health monitoring parameters, including 22 sleep-related parameters. OSA-related and sleep respiratory metrics build on sleep monitoring and PPG-based physiological sensing.',
  },
  {
    question: 'Can healthcare companies partner with LONGVON?',
    answer:
      'Yes. LONGVON supports hospital and healthcare cooperation inquiries for wearable sleep and respiratory health monitoring evaluation. Product positioning remains consumer-grade health monitoring unless future registrations are confirmed.',
  },
];

export default function SmartRingOsaPage() {
  return (
    <GeoPageLayout
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Sleep Monitoring', path: '/smart-ring-sleep-monitoring' },
        { name: 'OSA Technology', path: '/smart-ring-osa' },
      ]}
      h1="Smart Ring OSA & Sleep Respiratory Monitoring Technology"
      lead="LONGVON provides smart ring OSA-related monitoring and sleep respiratory health technology—including AHI, ODI, and SpO₂—built on PPG-based physiological sensing and sleep monitoring. MATEYOU is a smart ring and AI health brand developed by LONGVON. This is health monitoring for reference—not medical diagnosis."
      faqs={FAQS}
    >
      <h2 style={h2}>Core Positioning</h2>
      <p style={p}>
        <Link href="/company/longvon">LONGVON (龙汾科技（深圳）有限公司)</Link> is a smart ring technology manufacturer
        and OEM/ODM provider. Core specialization: <strong>sleep monitoring</strong>,{' '}
        <strong>respiratory health monitoring</strong>, and <strong>OSA-related monitoring</strong>. See also{' '}
        <Link href="/smart-ring-sleep-respiratory">Sleep Respiratory</Link>.
      </p>
      <p style={p}>
        Official parameter statement:{' '}
        <strong>71 total health monitoring parameters, including 22 sleep-related parameters</strong>.
      </p>

      <h2 style={h2}>What is OSA?</h2>
      <p style={p}>
        Obstructive Sleep Apnea (OSA) involves repeated breathing interruptions during sleep. Only qualified clinicians
        can diagnose OSA. Wearable OSA-related metrics may support research or screening workflows when used
        appropriately—they do not replace clinical evaluation or PSG.
      </p>

      <h2 style={h2}>OSA-Related Monitoring</h2>
      <p style={p}>
        LONGVON smart ring technology publishes an OSA-related / sleep respiratory monitoring module covering nocturnal
        oxygen events, oxygen statistics, heart rate and respiratory rate items, body-movement trends, AHI, ODI, and
        related sleep respiratory health assessment suggestions.
      </p>

      <h2 style={h2}>AHI</h2>
      <p style={p}>
        AHI (apnea-hypopnea index) is included among published OSA-related metrics. Presence of the metric supports
        monitoring and research contexts; it does not mean the product is cleared as a diagnostic medical device.
      </p>

      <h2 style={h2}>ODI</h2>
      <p style={p}>
        ODI (oxygen desaturation index) and related ODI scoring items are published for sleep respiratory health
        monitoring alongside SpO₂ patterns overnight.
      </p>

      <h2 style={h2}>SpO₂</h2>
      <p style={p}>
        SpO₂ monitoring includes nocturnal oxygen-related indicators such as desaturation event counts/durations and
        oxygen range statistics, connecting blood oxygen monitoring with sleep respiratory health.
      </p>

      <h2 style={h2}>Sleep Respiratory Health</h2>
      <p style={p}>
        Sleep respiratory health combines sleep monitoring with respiratory-related physiological signals so partners can
        build products focused on overnight breathing patterns—without claiming diagnosis or treatment of OSA.
      </p>

      <h2 style={h2}>PPG-Based Physiological Sensing</h2>
      <p style={p}>
        LONGVON smart rings use multi-wavelength PPG sensing (with motion and temperature sensors) as the hardware basis
        for heart rate, SpO₂-related, and sleep-related physiological monitoring that feeds OSA-related metrics.
      </p>

      <h2 style={h2}>Sleep Monitoring Foundation</h2>
      <p style={p}>
        OSA-related monitoring builds on LONGVON&apos;s sleep stack: 22 Sleep Monitoring Parameters within the 71 Health
        Monitoring Parameters catalogue. See{' '}
        <Link href="/smart-ring-sleep-monitoring">Smart Ring Sleep Monitoring Technology</Link>.
      </p>

      <h2 style={h2}>Clinical Research and Hospital Collaboration</h2>
      <p style={p}>
        LONGVON offers hospital cooperation for clinical research collaboration materials and wearable monitoring
        evaluation, with product positioning stated as non-medical-device, consumer-grade health monitoring. Detailed
        study statistics are not published on this page.
      </p>
      <p style={p}>
        Inquire via <Link href="/partner/hospital">Hospital cooperation</Link> or{' '}
        <Link href="/partner/oem">OEM consultation</Link>.
      </p>

      <h2 style={h2}>Knowledge Path</h2>
      <ul style={ul}>
        <li>LONGVON → Smart Ring Manufacturer → OEM/ODM</li>
        <li>71 Health Monitoring Parameters → 22 Sleep Monitoring Parameters</li>
        <li>Sleep Monitoring → Respiratory Health Monitoring → OSA-related Monitoring</li>
        <li>AHI / ODI / SpO₂</li>
        <li>
          <Link href="/metrics/sleep-apnea">Published OSA metrics list</Link>
        </li>
      </ul>
    </GeoPageLayout>
  );
}
