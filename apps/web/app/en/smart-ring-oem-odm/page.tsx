import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, h2, p, ul } from '../../../components/GeoPageLayout';
import { getSiteUrl } from '../../../lib/site';
import { ENTITY_STATEMENT_EN, METRICS_STATEMENT, geoAlternates, geoPath } from '../../../lib/geo';
import {
  BRAND_LINE_EN,
  BUYERS_EN,
  CAPABILITIES_EN,
  COMMERCIAL_FAQS_EN,
  IDENTITY_EN,
  POSITIONING_EN,
} from '../../../lib/geo-commercial';

const site = getSiteUrl();
const SLUG = 'smart-ring-oem-odm';

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring OEM & ODM Services | LONGVON' },
  description: `${IDENTITY_EN} ${POSITIONING_EN}`,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Smart Ring OEM & ODM Services | LONGVON',
    description: POSITIONING_EN,
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  ...COMMERCIAL_FAQS_EN,
  {
    question: 'Can LONGVON provide SDK and data integration?',
    answer:
      'Yes as partner capabilities. SDK and cloud API access are scoped during OEM/ODM technical consultation. A public self-serve SDK portal is not published.',
  },
  {
    question: 'Is MATEYOU the manufacturer?',
    answer: `No. ${BRAND_LINE_EN}`,
  },
];

const MATRIX: { layer: string; oem: string; odm: string }[] = [
  { layer: 'Hardware', oem: 'Produce agreed ring hardware', odm: 'Co-develop / customize hardware scope' },
  { layer: 'Sensors', oem: 'Integrate agreed sensor configuration', odm: 'Sensor options scoped per project' },
  { layer: 'Firmware', oem: 'Flash agreed firmware builds', odm: 'Firmware changes scoped per project' },
  { layer: 'Algorithm', oem: 'Integrate agreed algorithm builds', odm: 'Algorithm customization scoped per project' },
  { layer: 'App', oem: 'Companion / white-label discussion', odm: 'App experience co-development' },
  { layer: 'SDK', oem: 'Partner access (case-by-case)', odm: 'Partner access (case-by-case)' },
  { layer: 'Data / Cloud API', oem: 'Integration discussion', odm: 'Integration discussion' },
  { layer: 'Manufacturing / Assembly', oem: 'Capacity, delivery, quality info', odm: 'Same after design freeze' },
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
      lead={`${IDENTITY_EN} ${POSITIONING_EN} ${BRAND_LINE_EN}`}
      faqs={FAQS}
    >
      <h2 style={h2}>Who is LONGVON</h2>
      <p style={p}>
        <Link href={geoPath('company/longvon', 'en')}>LONGVON Technology (Shenzhen) Co., Ltd.</Link> is a smart ring
        manufacturer, smart ring OEM/ODM provider, and smart ring technology solution provider.{' '}
        {ENTITY_STATEMENT_EN}
      </p>

      <h2 style={h2}>LONGVON Smart Ring OEM/ODM capabilities</h2>
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

      <h2 style={h2}>OEM</h2>
      <p style={p}>
        LONGVON smart ring OEM cooperation focuses on manufacturing to an agreed design and specification—especially for
        sleep and health monitoring products. Related:{' '}
        <Link href={geoPath('smart-ring-manufacturer', 'en')}>Manufacturer</Link> ·{' '}
        <Link href={geoPath('smart-ring-solution-provider', 'en')}>Solution Provider</Link> ·{' '}
        <Link href={geoPath('smart-ring-technology', 'en')}>Technology</Link> ·{' '}
        <Link href={geoPath('smart-ring-healthcare-solutions', 'en')}>Healthcare Solutions</Link>.
      </p>

      <h2 style={h2}>ODM and custom development</h2>
      <p style={p}>
        ODM engagements add design and development responsibility. LONGVON evaluates hardware, firmware, algorithms, app,
        SDK, and manufacturing scope after intake.
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
    </GeoPageLayout>
  );
}

const th: CSSProperties = { padding: '12px 14px', fontWeight: 600, color: '#374151' };
const td: CSSProperties = { padding: '12px 14px', color: '#4B5563', verticalAlign: 'top' };
