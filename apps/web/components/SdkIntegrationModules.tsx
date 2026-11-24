import Link from 'next/link';
import { h2, p, ul } from './GeoPageLayout';
import type { GeoLocale } from '../lib/geo';
import { RAW_PPG_COPY } from '../lib/raw-ppg';
import { PROCUREMENT_COPY, technicalEvaluationRfqHref } from '../lib/procurement-pages';

export function SdkIntegrationModules({ locale }: { locale: GeoLocale }) {
  const c = PROCUREMENT_COPY[locale];
  const raw = RAW_PPG_COPY[locale];
  return <>
    <section id="smart-ring-sdk" aria-labelledby="sdk-module-title" style={{ scrollMarginTop: 80 }}>
      <h2 id="sdk-module-title" style={h2}>{c.sdkTitle}</h2><p style={p}>{c.sdkBody}</p><p style={p}>{c.bleBoundary}</p>
    </section>
    <section id="cloud-health-algorithms" aria-labelledby="cloud-module-title" style={{ scrollMarginTop: 80 }}>
      <h2 id="cloud-module-title" style={h2}>{c.cloudTitle}</h2><p style={p}>{c.cloudBody}</p><p style={p}>{c.healthBoundary}</p>
    </section>
    <section id="cloud-api-integration" aria-labelledby="api-module-title" style={{ scrollMarginTop: 80 }}>
      <h2 id="api-module-title" style={h2}>{c.apiTitle}</h2><p style={p}>{c.apiBody}</p>
      <h3 style={{ fontSize: 21, marginBottom: 12 }}>{c.licensingTitle}</h3><ul style={ul}>{c.licensing.map(x => <li key={x}>{x}</li>)}</ul>
    </section>
    <section id="technical-evaluation" aria-labelledby="evaluation-module-title" style={{ scrollMarginTop: 80 }}>
      <h2 id="evaluation-module-title" style={h2}>{c.evaluationTitle}</h2><p style={p}>{c.evaluationIntro}</p>
      <h3 style={{ fontSize: 21, marginBottom: 12 }}>{raw.scopeTitle}</h3><p style={p}>{raw.scopeIntro}</p>
      <ul style={ul}>{raw.scope.map(x => <li key={x.title} style={{ marginBottom: 10 }}><strong>{x.title}: </strong>{x.body}</li>)}</ul>
      <ol style={{ ...ul, listStyle: 'decimal' }}>{raw.process.map(x => <li key={x}>{x}</li>)}</ol>
      <Link href={technicalEvaluationRfqHref(locale)} data-procurement-cta="sdk-evaluation" style={{ display: 'inline-block', padding: '12px 20px', background: '#1D4ED8', color: '#fff', borderRadius: 8, fontWeight: 600 }}>{c.technicalCta}</Link>
      <p style={{ ...p, marginTop: 16, fontSize: 14 }}>{raw.ctaNote}</p>
    </section>
  </>;
}
