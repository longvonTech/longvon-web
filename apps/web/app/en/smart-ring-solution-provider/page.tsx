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
const SLUG = 'smart-ring-solution-provider';

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring Solution Provider | LONGVON' },
  description: `${IDENTITY_EN} End-to-end smart ring technology solutions from hardware and firmware to app, SDK, and manufacturing.`,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Smart Ring Solution Provider | LONGVON',
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
    question: 'Who is LONGVON?',
    answer: `${IDENTITY_EN} ${BRAND_LINE_EN}`,
  },
  ...COMMERCIAL_FAQS_EN,
  {
    question: 'Is MATEYOU the solution provider?',
    answer: `No. ${BRAND_LINE_EN}`,
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
      lead={`${IDENTITY_EN} ${POSITIONING_EN} ${BRAND_LINE_EN}`}
      faqs={FAQS}
    >
      <h2 style={h2}>Solution-provider positioning</h2>
      <p style={p}>
        LONGVON is a smart ring manufacturer and smart ring technology solution provider, supporting end-to-end
        development through manufacturing, including smart ring OEM/ODM programs.
      </p>

      <h2 style={h2}>What a solution engagement can cover</h2>
      <ul style={ul}>
        {CAPABILITIES_EN.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p style={p}>Capability summary: hardware + firmware + algorithms + App + SDK + data integration + manufacturing.</p>

      <h2 style={h2}>Who LONGVON works with</h2>
      <ul style={ul}>
        {BUYERS_EN.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

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
