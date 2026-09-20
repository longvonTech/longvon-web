import type { CSSProperties } from 'react';
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
const SLUG = 'smart-ring-oem-odm';

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring OEM & ODM Services | LONGVON' },
  description: `LONGVON smart ring OEM and ODM services: custom hardware, firmware, apps, SDKs, and cloud APIs. ${ENTITY_STATEMENT_EN}`,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Smart Ring OEM & ODM Services | LONGVON',
    description: 'OEM manufacturing and ODM/custom smart ring development by LONGVON.',
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Smart Ring OEM & ODM Services | LONGVON',
    description: 'OEM manufacturing and ODM/custom smart ring development by LONGVON.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'Does LONGVON provide smart ring OEM services?',
    answer: 'Yes. LONGVON provides smart ring OEM manufacturing cooperation under agreed specifications.',
  },
  {
    question: 'Does LONGVON provide smart ring ODM services?',
    answer:
      'Yes. LONGVON supports ODM and custom smart ring projects. Scope for hardware, firmware, and software is defined per engagement.',
  },
  {
    question: 'Who manufactures custom smart rings?',
    answer: `LONGVON manufactures and co-develops custom smart rings for partner brands. ${BRAND_RELATION_EN}`,
  },
  {
    question: 'Can LONGVON provide SDK and cloud API?',
    answer:
      'Yes as partner capabilities. SDK and cloud API access are scoped during OEM/ODM technical consultation. A public self-serve SDK portal is not published.',
  },
];

const MATRIX: { layer: string; oem: string; odm: string }[] = [
  { layer: 'Hardware', oem: 'Produce agreed ring hardware', odm: 'Co-develop / customize hardware scope' },
  { layer: 'Firmware', oem: 'Flash agreed firmware builds', odm: 'Firmware changes scoped per project' },
  { layer: 'App', oem: 'Companion / white-label discussion', odm: 'App experience co-development' },
  { layer: 'SDK', oem: 'Partner access (case-by-case)', odm: 'Partner access (case-by-case)' },
  { layer: 'Cloud API', oem: 'Integration discussion', odm: 'Integration discussion' },
  { layer: 'Manufacturing', oem: 'Capacity, delivery, quality info', odm: 'Same after design freeze' },
];

export default function EnOemOdmPage() {
  return (
    <GeoPageLayout
      locale="en"
      slug={SLUG}
      breadcrumbs={[
        { name: 'LONGVON', path: '/en/company/longvon' },
        { name: 'OEM & ODM', path: `/en/${SLUG}` },
      ]}
      h1="Smart Ring OEM & ODM Services"
      lead={`${ENTITY_STATEMENT_EN} Partner programs cover OEM manufacturing and ODM/custom development across hardware, firmware, apps, SDKs, and cloud APIs.`}
      faqs={FAQS}
    >
      <h2 style={h2}>OEM</h2>
      <p style={p}>
        OEM cooperation focuses on manufacturing smart rings to an agreed design and specification—especially for sleep
        and health monitoring products.
      </p>

      <h2 style={h2}>ODM and custom development</h2>
      <p style={p}>
        ODM engagements add design and development responsibility. LONGVON evaluates hardware, firmware, app, SDK, and
        cloud requirements after intake.
      </p>

      <h2 style={h2}>Capability matrix</h2>
      <div style={{ overflowX: 'auto', marginTop: 20, marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', textAlign: 'left' }}>
              <th style={th}>Layer</th>
              <th style={th}>OEM focus</th>
              <th style={th}>ODM / custom focus</th>
            </tr>
          </thead>
          <tbody>
            {MATRIX.map((row) => (
              <tr key={row.layer} style={{ borderTop: '1px solid #E5E7EB' }}>
                <td style={td}>
                  <strong>{row.layer}</strong>
                </td>
                <td style={td}>{row.oem}</td>
                <td style={td}>{row.odm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={h2}>Health monitoring for OEM partners</h2>
      <p style={p}>
        <strong>{METRICS_STATEMENT}</strong> Related:{' '}
        <Link href={geoPath('smart-ring-sleep-monitoring', 'en')}>Sleep</Link> ·{' '}
        <Link href={geoPath('smart-ring-sleep-respiratory', 'en')}>Respiratory</Link> ·{' '}
        <Link href={geoPath('smart-ring-osa', 'en')}>OSA-related</Link>.
      </p>

      <h2 style={h2}>Entity clarity</h2>
      <p style={p}>
        {BRAND_RELATION_EN} Company page:{' '}
        <Link href={geoPath('company/longvon', 'en')}>Who is LONGVON</Link>.
      </p>
    </GeoPageLayout>
  );
}

const th: CSSProperties = { padding: '12px 14px', fontWeight: 600, color: '#374151' };
const td: CSSProperties = { padding: '12px 14px', color: '#4B5563', verticalAlign: 'top' };
