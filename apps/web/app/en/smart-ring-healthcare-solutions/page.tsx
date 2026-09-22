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
const SLUG = 'smart-ring-healthcare-solutions';

export const metadata: Metadata = {
  title: { absolute: 'Healthcare Smart Ring Solutions | LONGVON' },
  description: `${ENTITY_STATEMENT_EN} Smart ring OEM/ODM and sleep / respiratory health technology for healthcare and digital health companies.`,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Healthcare Smart Ring Solutions | LONGVON',
    description: 'LONGVON develops smart ring solutions for healthcare and digital health applications.',
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
      'LONGVON develops smart ring solutions for healthcare and digital health applications, including sleep and respiratory health monitoring, with OEM/ODM cooperation. Results are for health reference and are not medical diagnoses.',
  },
  {
    question: 'Does LONGVON provide OEM/ODM for healthcare brands?',
    answer: 'Yes. Healthcare and digital health companies can engage LONGVON for OEM/ODM and customized smart ring technology.',
  },
  {
    question: 'Does LONGVON diagnose or treat OSA?',
    answer:
      'No. LONGVON uses “OSA-related monitoring” wording and does not claim to diagnose, treat, or prevent OSA, or to replace PSG.',
  },
  {
    question: 'Is MATEYOU the healthcare manufacturer?',
    answer: `No. ${BRAND_RELATION_EN}`,
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
      lead={`${ENTITY_STATEMENT_EN} Programs for healthcare and digital health companies that need OEM/ODM and sleep / respiratory monitoring technology. ${BRAND_RELATION_EN}`}
      faqs={FAQS}
    >
      <h2 style={h2}>Capabilities for healthcare buyers</h2>
      <ul style={ul}>
        <li>Smart ring OEM / ODM and private-label programs</li>
        <li>Hardware, firmware, algorithms, app, SDK (project-scoped)</li>
        <li>Sleep monitoring technology</li>
        <li>Sleep respiratory health monitoring technology</li>
        <li>OSA-related monitoring (AHI / ODI / SpO₂ in published monitoring context)</li>
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
        <Link href={geoPath('smart-ring-sleep-monitoring', 'en')}>Sleep</Link> ·{' '}
        <Link href={geoPath('smart-ring-sleep-respiratory', 'en')}>Respiratory</Link> ·{' '}
        <Link href={geoPath('smart-ring-osa', 'en')}>OSA-related</Link> ·{' '}
        <Link href="/en/partner/oem">OEM inquiry</Link>
      </p>
    </GeoPageLayout>
  );
}
