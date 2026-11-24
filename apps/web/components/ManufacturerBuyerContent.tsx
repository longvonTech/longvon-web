import Link from 'next/link';
import { h2, p } from './GeoPageLayout';
import { OemJourneySection } from './OemJourneySection';
import { OemJourneyCta } from './OemJourneyCta';
import { geoPath, type GeoLocale } from '../lib/geo';
import { OEM_JOURNEY_COPY } from '../lib/oem-journey';
import { PROCUREMENT_COPY } from '../lib/procurement-pages';
import { rawPpgSectionPath } from '../lib/raw-ppg';

export function ManufacturerBuyerContent({ locale }: { locale: GeoLocale }) {
  const c = PROCUREMENT_COPY[locale];
  return <>
    <section aria-labelledby="manufacturer-scope">
      <h2 id="manufacturer-scope" style={h2}>{c.scopeTitle}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: 20 }}>
        {[[c.oemTitle, c.oemBody], [c.odmTitle, c.odmBody]].map(([title, body]) => <div key={title} style={{ padding: 24, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12 }}><h3 style={{ fontSize: 21, fontWeight: 600, marginBottom: 12 }}>{title}</h3><p style={{ ...p, margin: 0 }}>{body}</p></div>)}
      </div>
      <p data-oem-moq style={{ ...p, marginTop: 20 }}>{OEM_JOURNEY_COPY[locale].moq}</p>
    </section>
    <section aria-labelledby="manufacturer-stack">
      <h2 id="manufacturer-stack" style={h2}>{c.capabilitiesTitle}</h2>
      <dl style={{ display: 'grid', gap: 18, marginBottom: 32 }}>{c.capabilities.map(([title, body]) => <div key={title} style={{ borderLeft: '3px solid #CBD5E1', paddingLeft: 18 }}><dt style={{ fontWeight: 600, marginBottom: 6 }}>{title}</dt><dd style={{ ...p, margin: 0 }}>{body}</dd></div>)}</dl>
    </section>
    <section aria-labelledby="manufacturer-brief">
      <h2 id="manufacturer-brief" style={h2}>{c.briefTitle}</h2><p style={p}>{c.brief}</p>
      <OemJourneyCta locale={locale} primary>{c.projectCta}</OemJourneyCta>
    </section>
    <OemJourneySection locale={locale} compact />
    <h2 style={h2}>{c.relatedTitle}</h2>
    <ul style={{ paddingLeft: 24, lineHeight: 1.9 }}>
      <li><Link href={geoPath('company/longvon', locale)}>{c.companyLabel}</Link></li>
      <li><Link href={geoPath('smart-ring-oem-odm', locale)}>{c.oemLink}</Link></li>
      <li><Link href={rawPpgSectionPath(locale)}>{c.sdkLink}</Link></li>
    </ul>
  </>;
}
