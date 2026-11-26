import type { Metadata } from 'next';
import Link from 'next/link';
import { GeoPageLayout } from '../../components/GeoPageLayout';
import { ManufacturerBuyerContent } from '../../components/ManufacturerBuyerContent';
import { OemJourneyCta } from '../../components/OemJourneyCta';
import { getSiteUrl } from '../../lib/site';
import { geoAlternates } from '../../lib/geo';
import { OEM_JOURNEY_COPY } from '../../lib/oem-journey';
import { PROCUREMENT_COPY } from '../../lib/procurement-pages';
import { RAW_PPG_COPY, rawPpgSectionPath } from '../../lib/raw-ppg';

const site = getSiteUrl();
const SLUG = 'smart-ring-manufacturer';
const c = PROCUREMENT_COPY.zh;
export const metadata: Metadata = {
  title: { absolute: c.manufacturerTitle }, description: c.manufacturerLead,
  alternates: geoAlternates(site, SLUG, 'zh'),
  openGraph: { title: c.manufacturerTitle, description: c.manufacturerLead, url: `${site}/${SLUG}`, siteName: 'LONGVON', locale: 'zh_CN', type: 'website' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};
const FAQS = [
  { question: c.faqIdentity, answer: c.faqIdentityAnswer },
  { question: c.faqScope, answer: OEM_JOURNEY_COPY.zh.moq },
  { question: c.faqStack, answer: c.faqStackAnswer },
];
export default function ManufacturerPage() {
  return <GeoPageLayout locale="zh" slug={SLUG}
    breadcrumbs={[{ name: 'LONGVON', path: '/company/longvon' }, { name: '智能戒指制造商', path: `/${SLUG}` }]}
    h1={c.manufacturerH1} lead={c.manufacturerLead} faqs={FAQS}
    heroActions={<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 24 }}><OemJourneyCta locale="zh" primary>{c.projectCta}</OemJourneyCta><Link href={rawPpgSectionPath('zh')} style={{ color: '#1D4ED8', textDecoration: 'underline' }}>{RAW_PPG_COPY.zh.linkLabel}</Link></div>}
  ><ManufacturerBuyerContent locale="zh" /></GeoPageLayout>;
}
