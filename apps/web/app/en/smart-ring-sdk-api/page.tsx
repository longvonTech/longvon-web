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
const SLUG = 'smart-ring-sdk-api';

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring SDK & Cloud API | LONGVON' },
  description:
    'Integrate LONGVON smart ring hardware via project-scoped partner SDK and cloud API — including 100Hz PPG raw data pathways for qualified OEM/ODM partners.',
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Smart Ring SDK & Cloud API | LONGVON',
    description:
      'Project-scoped partner SDK, cloud API, and 100Hz PPG raw data pathways for qualified OEM/ODM smart ring programs by LONGVON.',
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Smart Ring SDK & Cloud API | LONGVON',
    description: 'Partner SDK and cloud API for LONGVON smart ring OEM/ODM projects.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const FAQS = [
  {
    question: 'Does LONGVON provide a public self-serve SDK download?',
    answer:
      'No. SDK and cloud API access are enabled under OEM/ODM or technology partnerships. Scope is defined per project.',
  },
  {
    question: 'Can partners access 100Hz PPG raw data?',
    answer:
      'Yes, 100Hz PPG raw data access can be discussed for qualified OEM/ODM partners as part of the technical scope.',
  },
  {
    question: 'Do all health algorithms run fully offline on customer hardware?',
    answer:
      'No. LONGVON does not claim that all algorithms run independently on customer devices. Many health metrics are delivered through LONGVON cloud algorithm services; the on-device vs cloud split is defined per project.',
  },
  {
    question: 'Is an unrestricted Bluetooth protocol provided to every customer?',
    answer:
      'No. Interfaces are provided as documented for the agreed project. Unrestricted Bluetooth protocol access is not a default public offer.',
  },
  {
    question: 'Can we use our own App?',
    answer:
      'Yes. Customer-owned App integration via SDK/API is a supported model and is evaluated during technical consultation.',
  },
  {
    question: 'How are SDK, algorithm licensing, technical support, and cloud services separated?',
    answer:
      'SDK covers device connectivity and data pathways; algorithm licensing defines which metrics/models are authorized; technical support is provided in agreed windows; cloud services host cloud algorithms and data APIs and are scoped/priced separately under the cooperation model.',
  },
];

const PROCESS = [
  'Discovery & NDA',
  'Scope: raw data needs, on-device features, cloud features, App ownership',
  'Algorithm authorization and environments',
  'Integration support windows',
  'Commercial license / OEM agreement',
];

export default function EnSmartRingSdkApiPage() {
  return (
    <GeoPageLayout
      locale="en"
      slug={SLUG}
      breadcrumbs={[
        { name: 'Technology', path: '/en/smart-ring-technology' },
        { name: 'SDK & Cloud API', path: `/en/${SLUG}` },
      ]}
      h1="Smart Ring SDK & Cloud API for OEM Partners"
      lead={`${ENTITY_STATEMENT_EN} ${BRAND_RELATION_EN}`}
      faqs={FAQS}
    >
      <h2 style={h2}>Smart Ring SDK overview</h2>
      <p style={p}>
        LONGVON enables partner SDK access so brands and digital-health teams can integrate smart ring hardware with
        their own applications. Access is project-scoped — not a public self-serve portal.
      </p>

      <h2 style={h2}>100Hz PPG raw data</h2>
      <p style={p}>
        For qualified OEM/ODM partners, LONGVON can support pathways to <strong>100Hz PPG raw data</strong> access.
        Exact delivery format, sampling, buffering, and licensing are defined in the technical statement of work.
      </p>

      <h2 style={h2}>Sensor data access</h2>
      <p style={p}>
        Beyond PPG, partner programs may include temperature and motion-related signals used in LONGVON smart ring
        platforms. Available signals and rates depend on the hardware generation and project agreement.
      </p>
      <p style={p}>
        <strong>{METRICS_STATEMENT}</strong> Published metrics remain for health reference and are not medical
        diagnoses.
      </p>

      <h2 style={h2}>Health data integration</h2>
      <p style={p}>
        Partners can plan App-side and cloud-side integration for sleep, respiratory, and other health-monitoring
        outputs. Integration depth is evaluated with your product architecture and compliance needs.
      </p>

      <h2 style={h2}>SDK &amp; Cloud API</h2>
      <ul style={ul}>
        <li>Device / companion SDK for partner or customer-owned Apps</li>
        <li>Cloud API options for data access and algorithm services</li>
        <li>Firmware cooperation within agreed scope</li>
        <li>Technical support windows defined per engagement</li>
      </ul>

      <h2 style={h2}>Customer-owned App integration</h2>
      <p style={p}>
        Customer-owned App integration is supported. Feasibility, effort, and timelines depend on your stack, target
        platforms, and required metrics — assessed during technical consultation.
      </p>

      <h2 style={h2}>Algorithm services</h2>
      <p style={p}>
        LONGVON provides <strong>cloud algorithm services</strong> for many health metrics. Some features may run
        on-device; others require LONGVON cloud. Algorithm authorization and cloud service fees are set by the
        cooperation model. We do <strong>not</strong> claim that all algorithms can run fully offline on customer
        hardware.
      </p>

      <h2 style={h2}>Technical cooperation process</h2>
      <ol style={{ ...ul, listStyle: 'decimal' }}>
        {PROCESS.map((step) => (
          <li key={step} style={{ marginBottom: 6 }}>
            {step}
          </li>
        ))}
      </ol>

      <h2 style={h2}>Licensing components</h2>
      <ul style={ul}>
        <li>SDK — connectivity and data pathways</li>
        <li>Algorithm licensing — authorized metrics / models</li>
        <li>Technical support — agreed integration windows</li>
        <li>Cloud services — cloud algorithms and data APIs (separately scoped)</li>
      </ul>

      <h2 style={h2}>Boundaries (read carefully)</h2>
      <ul style={ul}>
        <li>No unrestricted Bluetooth protocol as a default public promise</li>
        <li>No guarantee that every algorithm runs fully offline</li>
        <li>No public self-serve SDK download</li>
        <li>Ring1C remains a consumer health-monitoring product — not a medical device</li>
        <li>Ring1 and Ring1C share relevant sensor/chipset/algorithm capability only as supported by product documentation; regulatory positioning differs</li>
        <li>Chinese regulatory progress is never presented as overseas medical-device approval</li>
      </ul>

      <h2 style={h2}>Request technical consultation</h2>
      <p style={p}>
        Start with an OEM/ODM technical inquiry:{' '}
        <Link href="/en/partner/oem">Request OEM / technology consultation</Link>. Related pages:{' '}
        <Link href={geoPath('smart-ring-technology', 'en')}>Technology</Link> ·{' '}
        <Link href={geoPath('smart-ring-manufacturer', 'en')}>Manufacturer</Link> ·{' '}
        <Link href={geoPath('smart-ring-oem-odm', 'en')}>OEM &amp; ODM</Link>.
      </p>
    </GeoPageLayout>
  );
}
