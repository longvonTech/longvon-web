import type { SiteLocale } from './i18n-routes';
export type OemConversionName = 'oem_cta_click' | 'rfq_start' | 'rfq_submit_success';
const INTERESTS = new Set(['odm-sample-evaluation','odm-pilot-evaluation','odm-production-feasibility','100hz-raw-ppg']);
export function isSyntheticOemEvent(input: { hostname: string; search: string; contactName?: string; email?: string }): boolean {
  return ['localhost','127.0.0.1'].includes(input.hostname) || new URLSearchParams(input.search).has('test_run') || /\[TEST|SYNTHETIC/i.test(input.contactName || '') || /@(?:[^@]+\.)?example\.(?:invalid|com|org|net)$|\.(?:invalid|test|localhost|example)$/i.test(input.email || '');
}
/** Existing optional Baidu queue only; no new endpoint or PII. Tracking can never break RFQ submission. */
export function recordOemConversion(name: OemConversionName, locale: SiteLocale, keyword?: string | null, synthetic?: { contactName?: string; email?: string; honeypot?: string }): void {
  if (typeof window === 'undefined') return;
  try {
    if (synthetic?.honeypot?.trim()) return;
    const marked = isSyntheticOemEvent({ hostname: window.location.hostname, search: window.location.search, ...synthetic });
    if (marked) window.sessionStorage?.setItem('lv_oem_qa', '1');
    const isTest = marked || window.sessionStorage?.getItem('lv_oem_qa') === '1';
    const interest = keyword && INTERESTS.has(keyword) ? keyword : 'other';
    const detail = { name, locale, interest, is_test: isTest };
    window.dispatchEvent(new CustomEvent('longvon:oem-conversion', { detail }));
    if (!isTest) (window as Window & { _hmt?: unknown[][] })._hmt?.push(['_trackEvent', 'oem_conversion', name, `${locale}:${interest}`]);
  } catch { /* Optional analytics is never a dependency of conversion. */ }
}
