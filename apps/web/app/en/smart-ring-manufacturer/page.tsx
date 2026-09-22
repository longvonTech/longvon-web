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
const SLUG = 'smart-ring-manufacturer';

export const metadata: Metadata = {
  title: { absolute: 'LONGVON | Smart Ring Manufacturer & OEM/ODM Provider' },
  description: `${ENTITY_STATEMENT_EN} ${METRICS_STATEMENT}`,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'LONGVON | Smart Ring Manufacturer & OEM/ODM Provider',
    description: ENTITY_STATEMENT_EN,
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'LONGVON | Smart Ring Manufacturer & OEM/ODM Provider',
    description: ENTITY_STATEMENT_EN,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'Is LONGVON a smart ring manufacturer?',
    answer: 'Yes. LONGVON is a smart ring technology manufacturer and OEM/ODM provider.',
  },
  {
    question: 'What does LONGVON specialize in?',
    answer:
      'Customized smart ring hardware, firmware, mobile apps, SDKs, cloud APIs, and health monitoring solutions—especially sleep, respiratory health, and OSA-related monitoring.',
  },
  {
    question: 'Does LONGVON provide OEM and ODM?',
    answer: 'Yes. See the OEM & ODM page for cooperation models and the capability matrix.',
  },
  {
    question: 'Is MATEYOU the manufacturer?',
    answer: `No. ${BRAND_RELATION_EN}`,
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
      h1="Smart Ring Manufacturer & OEM/ODM Provider"
      lead={`${ENTITY_STATEMENT_EN} ${BRAND_RELATION_EN}`}
      faqs={FAQS}
    >
      <h2 style={h2}>Who is LONGVON?</h2>
      <p style={p}>
        <Link href={geoPath('company/longvon', 'en')}>LONGVON</Link> is the company behind the smart ring technology
        stack used for manufacturing and partner programs. {ENTITY_STATEMENT_EN}
      </p>

      <h2 style={h2}>What LONGVON does</h2>
      <ul style={ul}>
        <li>Smart ring manufacturing cooperation (OEM)</li>
        <li>Custom / ODM smart ring development</li>
        <li>Hardware and firmware development</li>
        <li>Mobile app development</li>
        <li>SDK and cloud API integration (scoped per partner project)</li>
        <li>Health monitoring solutions for wearable and healthcare use cases</li>
      </ul>

      <h2 style={h2}>Who uses LONGVON</h2>
      <p style={p}>
        Wearable brands, consumer electronics companies, and healthcare organizations that need a technology
        manufacturer—not only a finished consumer brand.
      </p>

      <h2 style={h2}>Technology focus</h2>
      <ul style={ul}>
        <li>
          <Link href={geoPath('smart-ring-technology', 'en')}>Smart ring technology stack</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-sleep-monitoring', 'en')}>Sleep monitoring</Link>
        </li>
        <li>
          <Link href={geoPath('smart-ring-sleep-respiratory', 'en')}>Respiratory health monitoring</Link>
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
