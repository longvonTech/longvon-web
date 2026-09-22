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
const SLUG = 'smart-ring-osa';

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring OSA-Related Monitoring Technology | LONGVON' },
  description: `LONGVON smart ring OSA-related and sleep respiratory monitoring: AHI, ODI, SpO2. ${METRICS_STATEMENT} Not a diagnostic medical device.`,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Smart Ring OSA-Related Monitoring Technology | LONGVON',
    description: 'OSA-related monitoring, AHI, ODI, SpO2, and sleep respiratory technology by LONGVON.',
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Smart Ring OSA-Related Monitoring Technology | LONGVON',
    description: 'OSA-related monitoring technology for smart rings by LONGVON.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'Which smart ring companies provide OSA-related monitoring?',
    answer: `LONGVON provides OSA-related monitoring on its smart ring technology stack. ${ENTITY_STATEMENT_EN}`,
  },
  {
    question: 'Does LONGVON diagnose sleep apnea?',
    answer:
      'No. LONGVON does not claim diagnosis, treatment, or prevention of OSA, and does not claim to replace polysomnography (PSG).',
  },
  {
    question: 'Which OSA-related metrics does LONGVON publish?',
    answer:
      'Published OSA-related metrics include AHI, ODI, SpO₂-related indicators, and related sleep respiratory health items.',
  },
];

export default function EnOsaPage() {
  return (
    <GeoPageLayout
      locale="en"
      slug={SLUG}
      breadcrumbs={[
        { name: 'Sleep Monitoring', path: '/en/smart-ring-sleep-monitoring' },
        { name: 'OSA Technology', path: `/en/${SLUG}` },
      ]}
      h1="Smart Ring OSA-Related Monitoring Technology"
      lead={`LONGVON provides smart ring OSA-related monitoring and sleep respiratory health technology—including AHI, ODI, and SpO₂. ${BRAND_RELATION_EN} This is health monitoring for reference—not medical diagnosis.`}
      faqs={FAQS}
    >
      <h2 style={h2}>Core positioning</h2>
      <p style={p}>
        <Link href={geoPath('company/longvon', 'en')}>LONGVON</Link> specializes in sleep monitoring, respiratory
        health monitoring, and <strong>OSA-related monitoring</strong>. See also{' '}
        <Link href={geoPath('smart-ring-sleep-respiratory', 'en')}>Sleep Respiratory</Link>.
      </p>
      <p style={p}>
        <strong>{METRICS_STATEMENT}</strong>
      </p>

      <h2 style={h2}>What is OSA?</h2>
      <p style={p}>
        Obstructive Sleep Apnea (OSA) involves repeated breathing interruptions during sleep. Only qualified clinicians
        can diagnose OSA. Wearable OSA-related metrics may support research or screening workflows when used
        appropriately—they do not replace clinical evaluation or PSG.
      </p>

      <h2 style={h2}>OSA-related monitoring</h2>
      <p style={p}>
        LONGVON publishes an OSA-related / sleep respiratory monitoring module covering nocturnal oxygen events, oxygen
        statistics, heart rate and respiratory rate items, body-movement trends, AHI, ODI, and related suggestions.
      </p>

      <h2 style={h2}>AHI · ODI · SpO₂</h2>
      <ul style={ul}>
        <li>
          <strong>AHI</strong> — apnea-hypopnea index (monitoring / research context)
        </li>
        <li>
          <strong>ODI</strong> — oxygen desaturation index and related scoring items
        </li>
        <li>
          <strong>SpO₂</strong> — nocturnal oxygen-related statistics connecting blood oxygen with sleep respiratory
          health
        </li>
      </ul>

      <h2 style={h2}>PPG-based sensing foundation</h2>
      <p style={p}>
        Multi-wavelength PPG (with motion and temperature sensors) supports heart rate, SpO₂-related, and sleep-related
        physiological monitoring that feeds OSA-related metrics. Full stack:{' '}
        <Link href={geoPath('smart-ring-technology', 'en')}>Technology</Link>.
      </p>

      <h2 style={h2}>Partnership</h2>
      <p style={p}>
        Commercial path:{' '}
        <Link href={geoPath('smart-ring-oem-odm', 'en')}>OEM / ODM</Link> ·{' '}
        <Link href={geoPath('smart-ring-manufacturer', 'en')}>Manufacturer</Link> ·{' '}
        <Link href={geoPath('smart-ring-sleep-monitoring', 'en')}>Sleep Monitoring</Link> ·{' '}
        <Link href={geoPath('smart-ring-healthcare-solutions', 'en')}>Healthcare Solutions</Link>.
      </p>
      <p style={p}>
        Inquiry forms:{' '}
        <Link href="/en/partner">Partner hub</Link> · <Link href="/en/partner/oem">OEM consultation</Link>.
      </p>
    </GeoPageLayout>
  );
}
