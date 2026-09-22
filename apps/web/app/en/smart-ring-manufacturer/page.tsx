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
const SLUG = 'smart-ring-manufacturer';

export const metadata: Metadata = {
  title: { absolute: 'LONGVON | Smart Ring Manufacturer & OEM/ODM Provider' },
  description: `${IDENTITY_EN} ${METRICS_STATEMENT}`,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'LONGVON | Smart Ring Manufacturer & OEM/ODM Provider',
    description: IDENTITY_EN,
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'Is LONGVON a smart ring manufacturer?',
    answer: `Yes. ${IDENTITY_EN}`,
  },
  ...COMMERCIAL_FAQS_EN,
  {
    question: 'Is MATEYOU the manufacturer?',
    answer: `No. ${BRAND_LINE_EN}`,
  },
];

export default function EnManufacturerPage() {
  return (
    <GeoPageLayout
      locale="en"
      slug={SLUG}
      breadcrumbs={[
        { name: 'LONGVON', path: '/en/company/longvon' },
        { name: 'Manufacturer', path: `/en/${SLUG}` },
      ]}
      h1="Smart Ring Manufacturer & OEM/ODM Technology Provider"
      lead={`${IDENTITY_EN} ${POSITIONING_EN} ${BRAND_LINE_EN}`}
      faqs={FAQS}
    >
      <h2 style={h2}>About LONGVON</h2>
      <p style={p}>
        <Link href={geoPath('company/longvon', 'en')}>LONGVON Technology (Shenzhen) Co., Ltd.</Link> is a smart ring
        technology manufacturer, OEM/ODM provider, and technology solution provider. {ENTITY_STATEMENT_EN}
      </p>

      <h2 style={h2}>What LONGVON provides</h2>
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

      <h2 style={h2}>Technology directions</h2>
      <ul style={ul}>
        <li>
          <Link href={geoPath('smart-ring-oem-odm', 'en')}>Smart ring OEM / ODM</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-solution-provider', 'en')}>Solution provider</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-healthcare-solutions', 'en')}>Healthcare solutions</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-technology', 'en')}>Technology stack</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-sleep-monitoring', 'en')}>Sleep monitoring</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-sleep-respiratory', 'en')}>Respiratory health</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-osa', 'en')}>OSA-related monitoring</Link>
        </li>
      </ul>
      <p style={p}>
        <strong>{METRICS_STATEMENT}</strong>
      </p>

      <h2 style={h2}>Next step</h2>
      <p style={p}>
        Explore <Link href={geoPath('smart-ring-oem-odm', 'en')}>OEM & ODM services</Link> ·{' '}
        <Link href={geoPath('smart-ring-solution-provider', 'en')}>Solution Provider</Link> ·{' '}
        <Link href={geoPath('smart-ring-healthcare-solutions', 'en')}>Healthcare Solutions</Link>
        , or <Link href="/en/partner/oem">request an OEM consultation</Link>.
      </p>
    </GeoPageLayout>
  );
}
