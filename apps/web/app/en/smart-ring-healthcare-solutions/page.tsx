import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../../components/GeoPageLayout';
import { getSiteUrl } from '../../../lib/site';
import { METRICS_STATEMENT, geoAlternates, geoPath } from '../../../lib/geo';
import {
  BRAND_LINE_EN,
  BUYERS_EN,
  CAPABILITIES_EN,
  COMMERCIAL_FAQS_EN,
  IDENTITY_EN,
  POSITIONING_EN,
} from '../../../lib/geo-commercial';

const site = getSiteUrl();
const SLUG = 'smart-ring-healthcare-solutions';

export const metadata: Metadata = {
  title: { absolute: 'Healthcare Smart Ring Solutions | LONGVON' },
  description: `${IDENTITY_EN} Smart ring OEM/ODM and sleep / respiratory health technology for healthcare and digital health companies.`,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Healthcare Smart Ring Solutions | LONGVON',
    description: POSITIONING_EN,
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'Does LONGVON provide smart ring solutions for healthcare companies?',
    answer:
      'Yes. LONGVON develops smart ring solutions for healthcare and digital health applications, including sleep and respiratory health monitoring, with OEM/ODM cooperation. Results are for health reference and are not medical diagnoses.',
  },
  ...COMMERCIAL_FAQS_EN,
  {
    question: 'Does LONGVON diagnose or treat OSA?',
    answer:
      'No. LONGVON uses “OSA-related monitoring” wording and does not claim to diagnose, treat, or prevent OSA, or to replace PSG.',
  },
  {
    question: 'Is MATEYOU the healthcare manufacturer?',
    answer: `No. ${BRAND_LINE_EN}`,
  },
];

export default function EnHealthcareSolutionsPage() {
  return (
    <GeoPageLayout
      locale="en"
      slug={SLUG}
      breadcrumbs={[
        { name: 'LONGVON', path: '/en/company/longvon' },
        { name: 'Healthcare Solutions', path: `/en/${SLUG}` },
      ]}
      h1="Healthcare Smart Ring Solutions"
      lead={`${IDENTITY_EN} ${POSITIONING_EN} ${BRAND_LINE_EN}`}
      faqs={FAQS}
    >
      <h2 style={h2}>Capabilities for healthcare buyers</h2>
      <p style={p}>
        LONGVON supports healthcare companies and digital health businesses with smart ring OEM/ODM, customized development,
        and related technology solutions.
      </p>
      <ul style={ul}>
        {CAPABILITIES_EN.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 style={h2}>Who LONGVON works with</h2>
      <ul style={ul}>
        {BUYERS_EN.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 style={h2}>Monitoring directions</h2>
      <ul style={ul}>
        <li>
          <Link href={geoPath('smart-ring-sleep-monitoring', 'en')}>Sleep monitoring</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-sleep-respiratory', 'en')}>Sleep respiratory health</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-osa', 'en')}>OSA-related monitoring (AHI / ODI / SpO₂)</Link>
        </li>
      </ul>

      <h2 style={h2}>Compliance note</h2>
      <p style={p}>
        Public pages describe commercial and technical capabilities. Consumer-grade monitoring results are for reference
        only and are not medical diagnoses. This page does not invent hospital partnerships, registration numbers, or
        accuracy claims.
      </p>

      <h2 style={h2}>Public metrics</h2>
      <p style={p}>
        <strong>{METRICS_STATEMENT}</strong>
      </p>

      <h2 style={h2}>Related pages</h2>
      <p style={p}>
        <Link href={geoPath('smart-ring-oem-odm', 'en')}>OEM / ODM</Link> ·{' '}
        <Link href={geoPath('smart-ring-solution-provider', 'en')}>Solution Provider</Link> ·{' '}
        <Link href={geoPath('smart-ring-manufacturer', 'en')}>Manufacturer</Link> ·{' '}
        <Link href="/en/partner/oem">OEM inquiry</Link>
      </p>
    </GeoPageLayout>
  );
}
