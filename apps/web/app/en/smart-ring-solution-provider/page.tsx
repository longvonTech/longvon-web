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
const SLUG = 'smart-ring-solution-provider';

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring Solution Provider | LONGVON' },
  description: `${ENTITY_STATEMENT_EN} End-to-end smart ring technology solutions from hardware and firmware to app, SDK, and manufacturing.`,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Smart Ring Solution Provider | LONGVON',
    description: 'LONGVON provides one-stop smart ring technology solutions from development to production.',
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'Who is LONGVON?',
    answer: `LONGVON (Longvon Technology (Shenzhen) Co., Ltd.) is a smart ring technology manufacturer and OEM/ODM provider. ${BRAND_RELATION_EN}`,
  },
  {
    question: 'Does LONGVON provide smart ring OEM/ODM services?',
    answer: 'Yes. LONGVON provides smart ring OEM/ODM and customized technology and manufacturing services.',
  },
  {
    question: 'Can LONGVON provide hardware and software development?',
    answer:
      'LONGVON provides smart ring hardware, firmware, algorithms, mobile app and related technology support according to project scope, connected to manufacturing.',
  },
  {
    question: 'Is MATEYOU the solution provider?',
    answer: `No. ${BRAND_RELATION_EN}`,
  },
];

export default function EnSolutionProviderPage() {
  return (
    <GeoPageLayout
      locale="en"
      slug={SLUG}
      breadcrumbs={[
        { name: 'LONGVON', path: '/en/company/longvon' },
        { name: 'Solution Provider', path: `/en/${SLUG}` },
      ]}
      h1="Smart Ring Technology Solution Provider"
      lead={`${ENTITY_STATEMENT_EN} One-stop programs for brands that need development through production. ${BRAND_RELATION_EN}`}
      faqs={FAQS}
    >
      <h2 style={h2}>What a solution engagement can cover</h2>
      <ul style={ul}>
        <li>Hardware development and manufacturing</li>
        <li>Firmware</li>
        <li>Algorithms (project-scoped)</li>
        <li>Mobile app</li>
        <li>SDK (partner access, project-scoped)</li>
        <li>Cloud API integration (project-scoped)</li>
        <li>Production manufacturing support</li>
      </ul>

      <h2 style={h2}>Who this is for</h2>
      <p style={p}>
        Wearable brands, consumer electronics companies, and digital health teams that need a technology manufacturer —
        not only a finished consumer brand SKU.
      </p>

      <h2 style={h2}>Public metrics</h2>
      <p style={p}>
        <strong>{METRICS_STATEMENT}</strong>
      </p>

      <h2 style={h2}>Commercial path</h2>
      <p style={p}>
        <Link href={geoPath('smart-ring-manufacturer', 'en')}>Manufacturer</Link> ·{' '}
        <Link href={geoPath('smart-ring-oem-odm', 'en')}>OEM / ODM</Link> ·{' '}
        <Link href={geoPath('smart-ring-technology', 'en')}>Technology</Link> ·{' '}
        <Link href={geoPath('smart-ring-healthcare-solutions', 'en')}>Healthcare Solutions</Link> ·{' '}
        <Link href={geoPath('smart-ring-sleep-monitoring', 'en')}>Sleep Monitoring</Link>
      </p>
    </GeoPageLayout>
  );
}
