'use client';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { GeoLocale } from '../lib/geo';
import { oemJourneyRfqHref, OEM_INTERESTS } from '../lib/oem-journey';
import { recordOemConversion } from '../lib/oem-conversion';
export function OemJourneyCta({ locale, stage = 0, children, primary = false }: { locale: GeoLocale; stage?: 0 | 1 | 2; children: string; primary?: boolean }) {
  const style: CSSProperties = primary ? { display:'inline-block',padding:'12px 20px',background:'#1D4ED8',color:'#fff',borderRadius:8,fontWeight:600 } : { fontWeight:600, color:'#1D4ED8', textDecoration:'underline', textUnderlineOffset:3 };
  return <Link href={oemJourneyRfqHref(locale,stage)} data-oem-stage={stage} style={style} onClick={()=>recordOemConversion('oem_cta_click',locale,OEM_INTERESTS[stage])}>{children}</Link>;
}
