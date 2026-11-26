import { SdkIntegrationModules } from '../../../components/SdkIntegrationModules';
import { PROCUREMENT_COPY, technicalEvaluationRfqHref } from '../../../lib/procurement-pages';
import { OEM_JOURNEY_COPY, oemJourneyPath } from '../../../lib/oem-journey';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout, p } from '../../../components/GeoPageLayout';
import { getSiteUrl } from '../../../lib/site';
import {
  geoAlternates,
  geoPath,
} from '../../../lib/geo';

import { RawPpgSection } from '../../../components/RawPpgSection';
import { RAW_PPG_COPY } from '../../../lib/raw-ppg';

const site = getSiteUrl();
const SLUG = 'smart-ring-sdk-api';

export const metadata: Metadata = {
  title: { absolute: 'Smart Ring SDK, 100Hz Raw PPG & Cloud API | LONGVON' },
  description:
    'Integrate LONGVON smart ring hardware via project-scoped partner SDK and cloud API — including 100Hz PPG raw data pathways for qualified OEM/ODM partners.',
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: {
    title: 'Smart Ring SDK, 100Hz Raw PPG & Cloud API | LONGVON',
    description:
      'Project-scoped partner SDK, cloud API, and 100Hz PPG raw data pathways for qualified OEM/ODM smart ring programs by LONGVON.',
    url: `${site}/en/${SLUG}`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Smart Ring SDK, 100Hz Raw PPG & Cloud API | LONGVON',
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

export default function EnSmartRingSdkApiPage() {
  return (
    <GeoPageLayout
      locale="en"
      slug={SLUG}
      breadcrumbs={[
        { name: 'Technology', path: '/en/smart-ring-technology' },
        { name: 'SDK & Cloud API', path: `/en/${SLUG}` },
      ]}
      h1={PROCUREMENT_COPY.en.sdkH1}
      lead={PROCUREMENT_COPY.en.sdkLead}
      faqs={[...FAQS, ...RAW_PPG_COPY.en.faqs]}
      heroActions={<p style={{ marginTop: 24 }}><Link href={technicalEvaluationRfqHref('en')} data-procurement-cta="sdk-hero" style={{ display: 'inline-block', padding: '12px 20px', background: '#1D4ED8', color: '#fff', borderRadius: 8, fontWeight: 600 }}>{PROCUREMENT_COPY.en.technicalCta}</Link></p>}
    >
      <nav aria-label={PROCUREMENT_COPY.en.navigation} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        {[['100hz-raw-ppg', RAW_PPG_COPY.en.title], ['smart-ring-sdk', PROCUREMENT_COPY.en.sdkTitle], ['cloud-health-algorithms', PROCUREMENT_COPY.en.cloudTitle], ['cloud-api-integration', PROCUREMENT_COPY.en.apiTitle], ['technical-evaluation', PROCUREMENT_COPY.en.evaluationTitle]].map(([id, title]) => <a key={id} href={`#${id}`} style={{ color: '#1D4ED8', textDecoration: 'underline' }}>{title}</a>)}
      </nav>
      <RawPpgSection locale="en" />
      <SdkIntegrationModules locale="en" />
      <p style={p}><Link href={geoPath('smart-ring-technology', 'en')}>Technology</Link> · <Link href={geoPath('osa-smart-ring-technology', 'en')}>OSA Technology & OEM</Link> · <Link href={geoPath('smart-ring-manufacturer', 'en')}>Manufacturer</Link> · <Link href={geoPath('smart-ring-oem-odm', 'en')}>OEM / ODM</Link></p>
      <p style={p}><Link href={oemJourneyPath('en')} style={{color:'#1D4ED8',textDecoration:'underline'}}>{OEM_JOURNEY_COPY.en.linkLabel}</Link></p>
    </GeoPageLayout>
  );
}
