import Link from 'next/link';
import type { GeoLocale } from '../lib/geo';
import { h2, p, ul } from './GeoPageLayout';
import { OEM_JOURNEY_ANCHOR, OEM_JOURNEY_COPY, oemJourneyPath } from '../lib/oem-journey';
import { OemJourneyCta } from './OemJourneyCta';
export function OemJourneySection({ locale, compact = false }: { locale: GeoLocale; compact?: boolean }) {
  const c=OEM_JOURNEY_COPY[locale];
  if(compact)return <section aria-label={c.compactTitle} style={{padding:'24px 0'}}><h2 style={h2}>{c.compactTitle}</h2><p style={p}>{c.compact}</p><p style={p}><Link href={oemJourneyPath(locale)} style={{color:'#1D4ED8',textDecoration:'underline'}}>{c.linkLabel}</Link></p></section>;
  return <section id={OEM_JOURNEY_ANCHOR} aria-labelledby="oem-journey-title" style={{scrollMarginTop:80}}>
    <h2 id="oem-journey-title" style={h2}>{c.title}</h2><p style={p}>{c.intro}</p>
    <ol style={{listStyle:'decimal',paddingLeft:24}}>{c.stages.map((s,i)=><li key={s.title} style={{padding:'16px 0',borderBottom:'1px solid #E2E8F0'}}><h3 style={{fontSize:21,fontWeight:600,marginBottom:12}}>{s.title}</h3><p style={p}>{s.input}</p><p style={p}>{s.output}</p><p style={{...p,fontSize:14}}>{s.gate}</p><OemJourneyCta locale={locale} stage={i as 0|1|2}>{s.cta}</OemJourneyCta></li>)}</ol>
    <h3 style={{fontSize:21,margin:'28px 0 12px'}}>{c.moqTitle}</h3><p style={p}>{c.moq}</p>
    <h3 style={{fontSize:21,margin:'28px 0 12px'}}>{c.customizationTitle}</h3><ul style={{...ul,listStyle:'disc'}}>{c.customization.map(x=><li key={x}>{x}</li>)}</ul>
    <h3 style={{fontSize:21,margin:'28px 0 12px'}}>{c.briefTitle}</h3><p style={p}>{c.brief}</p><OemJourneyCta locale={locale} primary>{c.cta}</OemJourneyCta>
  </section>;
}
