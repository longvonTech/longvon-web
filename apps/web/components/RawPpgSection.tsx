import Link from 'next/link';
import { h2, p } from './GeoPageLayout';
import type { GeoLocale } from '../lib/geo';
import { RAW_PPG_ANCHOR, RAW_PPG_COPY, rawPpgRfqHref } from '../lib/raw-ppg';

/** Server-rendered buyer guide. No new data API, entitlement or device specification. */
export function RawPpgSection({ locale }: { locale: GeoLocale }) {
  const copy = RAW_PPG_COPY[locale];
  return (
    <section id={RAW_PPG_ANCHOR} aria-labelledby="raw-ppg-title" style={{ scrollMarginTop: 80 }}>
      <h2 id="raw-ppg-title" style={h2}>{copy.title}</h2>
      <p style={p}>{copy.intro}</p>
      <p style={{ ...p, marginTop: 24 }}><Link href={rawPpgRfqHref(locale)} data-raw-ppg-cta="primary" style={{ display: 'inline-block', background: '#1D4ED8', color: '#fff', padding: '12px 20px', borderRadius: 8, fontWeight: 600 }}>{copy.cta}</Link></p>
      <h3 style={{ margin: '32px 0 12px', fontSize: 21 }}>{copy.meaningTitle}</h3>
      <p style={p}>{copy.meaning}</p>
      <aside style={{ ...p, padding: 18, background: '#F1F5F9', borderRadius: 8 }}>{copy.caution}</aside>
      <p style={p}><Link href={rawPpgRfqHref(locale)} data-raw-ppg-cta="scope">{copy.cta}</Link></p>
      <p style={{ ...p, fontSize: 14 }}>{copy.ctaNote}</p>
    </section>
  );
}
