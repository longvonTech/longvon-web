import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout } from '../../../components/GeoPageLayout';
import { ManufacturerBuyerContent } from '../../../components/ManufacturerBuyerContent';
import { OemJourneyCta } from '../../../components/OemJourneyCta';
import { getSiteUrl } from '../../../lib/site';
import { geoAlternates } from '../../../lib/geo';
import { OEM_JOURNEY_COPY } from '../../../lib/oem-journey';
import { PROCUREMENT_COPY } from '../../../lib/procurement-pages';
import { RAW_PPG_COPY, rawPpgSectionPath } from '../../../lib/raw-ppg';

const site = getSiteUrl();
const SLUG = 'smart-ring-manufacturer';
const c = PROCUREMENT_COPY.en;
export const metadata: Metadata = {
  title: { absolute: c.manufacturerTitle }, description: c.manufacturerLead,
  alternates: geoAlternates(site, SLUG, 'en'),
  openGraph: { title: c.manufacturerTitle, description: c.manufacturerLead, url: `${site}/en/${SLUG}`, siteName: 'LONGVON', locale: 'en_US', type: 'website' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};
const FAQS = [
  { question: c.faqIdentity, answer: c.faqIdentityAnswer },
  { question: c.faqScope, answer: OEM_JOURNEY_COPY.en.moq },
  { question: c.faqStack, answer: c.faqStackAnswer },
];
export default function ManufacturerPage() {
  return <GeoPageLayout locale="en" slug={SLUG}
    breadcrumbs={[{ name: 'LONGVON', path: '/en/company/longvon' }, { name: 'Manufacturer', path: `/en/${SLUG}` }]}
    h1={c.manufacturerH1} lead={c.manufacturerLead} faqs={FAQS}
    heroActions={<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 24 }}><OemJourneyCta locale="en" primary>{c.projectCta}</OemJourneyCta><Link href={rawPpgSectionPath('en')} style={{ color: '#1D4ED8', textDecoration: 'underline' }}>{RAW_PPG_COPY.en.linkLabel}</Link></div>}
  ><ManufacturerBuyerContent locale="en" /></GeoPageLayout>;
}
