/**
 * First-touch / latest-touch attribution for partner lead capture.
 * - First touch is locked on first browser visit (localStorage, 90d).
 * - First-party referrers (longvon.com / mateyou.net) never become "external first".
 * - Latest touch updates on each page view; never overwrites first.
 * - Forms may call capture again; refresh does not mint a new first touch.
 */

const STORAGE_KEY = 'lv_attr_v2';
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

const FIRST_PARTY_HOSTS = [
  'longvon.com',
  'www.longvon.com',
  'mateyou.net',
  'www.mateyou.net',
  'localhost',
  '127.0.0.1',
];

const AI_HOST_PATTERNS: { host: RegExp; label: string }[] = [
  { host: /(^|\.)chatgpt\.com$/i, label: 'chatgpt' },
  { host: /(^|\.)chat\.openai\.com$/i, label: 'chatgpt' },
  { host: /(^|\.)perplexity\.ai$/i, label: 'perplexity' },
  { host: /(^|\.)claude\.ai$/i, label: 'claude' },
  { host: /(^|\.)gemini\.google\.com$/i, label: 'gemini' },
  { host: /(^|\.)copilot\.microsoft\.com$/i, label: 'copilot' },
  { host: /(^|\.)you\.com$/i, label: 'you.com' },
  { host: /(^|\.)tongyi\.aliyun\.com$/i, label: 'qwen' },
  { host: /(^|\.)qianwen\.com$/i, label: 'qwen' },
  { host: /(^|\.)yiyan\.baidu\.com$/i, label: 'ernie' },
  { host: /(^|\.)xinghuo\.xfyun\.cn$/i, label: 'spark' },
  { host: /(^|\.)doubao\.com$/i, label: 'doubao' },
  { host: /(^|\.)kimi\.moonshot\.cn$/i, label: 'kimi' },
];

export type AttributionTouch = {
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  visitAt?: string;
  aiSource?: string;
};

export type StoredAttribution = {
  v: 2;
  first?: AttributionTouch;
  latest?: AttributionTouch;
  expiresAt: number;
};

export type LeadAttributionPayload = {
  /** @deprecated alias of first.landingPage — kept for existing columns */
  landingPage?: string;
  /** @deprecated alias of first.referrer */
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  aiSource?: string;
  firstLandingPage?: string;
  firstReferrer?: string;
  firstUtmSource?: string;
  firstUtmMedium?: string;
  firstUtmCampaign?: string;
  firstUtmContent?: string;
  firstUtmTerm?: string;
  firstVisitAt?: string;
  latestLandingPage?: string;
  latestReferrer?: string;
  latestUtmSource?: string;
  latestUtmMedium?: string;
  latestUtmCampaign?: string;
  latestVisitAt?: string;
  attributionChannel?: string;
  attributionConfidence?: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
};

function safeGetItem(storage: Storage, key: string): string | undefined {
  try {
    return storage.getItem(key) || undefined;
  } catch {
    return undefined;
  }
}

function safeSetItem(storage: Storage, key: string, value: string) {
  try {
    storage.setItem(key, value);
  } catch {
    /* private mode / blocked */
  }
}

function readStore(): StoredAttribution | null {
  if (typeof window === 'undefined') return null;
  const raw = safeGetItem(localStorage, STORAGE_KEY) || safeGetItem(sessionStorage, STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredAttribution;
    if (!parsed || parsed.v !== 2) return null;
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStore(data: StoredAttribution) {
  if (typeof window === 'undefined') return;
  const payload = JSON.stringify(data);
  safeSetItem(localStorage, STORAGE_KEY, payload);
  safeSetItem(sessionStorage, STORAGE_KEY, payload);
}

export function isFirstPartyReferrer(referrer: string | undefined): boolean {
  if (!referrer) return false;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '').toLowerCase();
    return FIRST_PARTY_HOSTS.some((h) => h.replace(/^www\./, '') === host || host.endsWith(`.${h.replace(/^www\./, '')}`));
  } catch {
    return false;
  }
}

export function clipReferrer(ref: string | undefined): string | undefined {
  if (!ref?.trim()) return undefined;
  try {
    const u = new URL(ref);
    return `${u.origin}${u.pathname}`.slice(0, 500);
  } catch {
    return ref.trim().slice(0, 500);
  }
}

export function detectAiLabel(utmSource: string | undefined, referrer: string | undefined): string | undefined {
  const utm = (utmSource || '').toLowerCase();
  if (utm.includes('chatgpt') || utm === 'openai') return 'chatgpt';
  if (utm.includes('perplexity')) return 'perplexity';
  if (utm.includes('claude')) return 'claude';
  if (utm.includes('gemini') || utm.includes('bard')) return 'gemini';
  if (utm.includes('copilot')) return 'copilot';
  if (utm.includes('qwen') || utm.includes('tongyi')) return 'qwen';
  if (utm.includes('doubao')) return 'doubao';
  if (utm.includes('kimi')) return 'kimi';
  if (utm.includes('ernie') || utm.includes('yiyan')) return 'ernie';

  if (!referrer) return undefined;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    for (const p of AI_HOST_PATTERNS) {
      if (p.host.test(host)) return p.label;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

function readUtmFromSearch(search: string): Partial<AttributionTouch> {
  const params = new URLSearchParams(search || '');
  return {
    utmSource: params.get('utm_source')?.slice(0, 100) || undefined,
    utmMedium: params.get('utm_medium')?.slice(0, 100) || undefined,
    utmCampaign: params.get('utm_campaign')?.slice(0, 100) || undefined,
    utmContent: params.get('utm_content')?.slice(0, 100) || undefined,
    utmTerm: params.get('utm_term')?.slice(0, 100) || undefined,
  };
}

function hasExternalSignal(touch: AttributionTouch | undefined): boolean {
  if (!touch) return false;
  if (touch.utmSource || touch.utmMedium || touch.utmCampaign || touch.utmContent || touch.utmTerm) return true;
  if (touch.referrer && !isFirstPartyReferrer(touch.referrer)) return true;
  return false;
}

export function classifyAttributionChannel(input: {
  utmSource?: string;
  utmMedium?: string;
  referrer?: string;
  aiSource?: string;
}): string {
  const utm = (input.utmSource || '').toLowerCase();
  const med = (input.utmMedium || '').toLowerCase();
  const ref = (input.referrer || '').toLowerCase();
  const ai = input.aiSource || detectAiLabel(input.utmSource, input.referrer);

  if (ai || med === 'ai_assistant' || /chatgpt|perplexity|claude|gemini|copilot|qwen|doubao|kimi|ernie/.test(utm)) {
    return 'AI Assistant';
  }
  if (/google|bing/.test(utm) || /google\.|bing\./.test(ref)) return 'Search Engine';
  if (/baidu|sogou|360|aiqicha/.test(utm) || /baidu\.|sogou\.|aiqicha\./.test(ref)) {
    return 'CN Search / Business Directory';
  }
  if (/linkedin/.test(utm) || /linkedin\./.test(ref)) return 'Social';
  if (/zhihu|csdn/.test(utm) || /zhihu\.|csdn\./.test(ref)) return 'Content';
  if (input.referrer && !isFirstPartyReferrer(input.referrer)) return 'Referral';
  if (input.referrer && isFirstPartyReferrer(input.referrer) && !utm) return 'Internal Navigation';
  if (!utm && !input.referrer) return 'Direct / Unknown';
  return 'Referral';
}

export function classifyAttributionConfidence(input: {
  utmSource?: string;
  referrer?: string;
}): 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN' {
  if (input.utmSource) return 'HIGH';
  if (input.referrer && !isFirstPartyReferrer(input.referrer)) return 'MEDIUM';
  if (input.referrer && isFirstPartyReferrer(input.referrer)) return 'LOW';
  if (!input.utmSource && !input.referrer) return 'UNKNOWN';
  return 'LOW';
}

function buildTouch(currentPath: string): AttributionTouch {
  const path = `${window.location.pathname}${window.location.search || ''}` || currentPath;
  const rawRef = document.referrer?.trim();
  const clipped = clipReferrer(rawRef);
  const utm = readUtmFromSearch(window.location.search || '');
  const externalRef = clipped && !isFirstPartyReferrer(clipped) ? clipped : undefined;
  const aiSource = detectAiLabel(utm.utmSource, externalRef || clipped);
  return {
    landingPage: path.slice(0, 500),
    referrer: externalRef,
    ...utm,
    visitAt: new Date().toISOString(),
    aiSource,
  };
}

/** Call as early as possible (root layout) and again on form mount — safe to repeat. */
export function captureLeadAttribution(currentPath: string): void {
  if (typeof window === 'undefined') return;

  const nowTouch = buildTouch(currentPath);
  const existing = readStore();
  const expiresAt = Date.now() + TTL_MS;

  let first = existing?.first;
  if (!first) {
    // First visit: lock first touch. First-party-only referrer stays empty (not "external").
    first = {
      landingPage: nowTouch.landingPage,
      referrer: nowTouch.referrer,
      utmSource: nowTouch.utmSource,
      utmMedium: nowTouch.utmMedium,
      utmCampaign: nowTouch.utmCampaign,
      utmContent: nowTouch.utmContent,
      utmTerm: nowTouch.utmTerm,
      visitAt: nowTouch.visitAt,
      aiSource: nowTouch.aiSource,
    };
  } else if (!hasExternalSignal(first) && hasExternalSignal(nowTouch)) {
    // Rare: first was blank direct, later got real external UTM/ref in same cookie window —
    // only fill empty external slots; never replace an already-set external first.
    first = {
      ...first,
      referrer: first.referrer || nowTouch.referrer,
      utmSource: first.utmSource || nowTouch.utmSource,
      utmMedium: first.utmMedium || nowTouch.utmMedium,
      utmCampaign: first.utmCampaign || nowTouch.utmCampaign,
      utmContent: first.utmContent || nowTouch.utmContent,
      utmTerm: first.utmTerm || nowTouch.utmTerm,
      aiSource: first.aiSource || nowTouch.aiSource,
    };
  }

  // Latest landing always current; keep last external referrer; UTM as a whole bundle
  // (never mix params from different campaigns across visits).
  const latest: AttributionTouch = {
    landingPage: nowTouch.landingPage,
    referrer: nowTouch.referrer || existing?.latest?.referrer,
    utmSource: existing?.latest?.utmSource,
    utmMedium: existing?.latest?.utmMedium,
    utmCampaign: existing?.latest?.utmCampaign,
    utmContent: existing?.latest?.utmContent,
    utmTerm: existing?.latest?.utmTerm,
    visitAt: nowTouch.visitAt,
    aiSource: nowTouch.aiSource || existing?.latest?.aiSource,
  };
  if (nowTouch.utmSource || nowTouch.utmMedium || nowTouch.utmCampaign) {
    latest.utmSource = nowTouch.utmSource;
    latest.utmMedium = nowTouch.utmMedium;
    latest.utmCampaign = nowTouch.utmCampaign;
    latest.utmContent = nowTouch.utmContent;
    latest.utmTerm = nowTouch.utmTerm;
  }

  writeStore({ v: 2, first, latest, expiresAt });
}

export function readLeadAttribution(currentPath: string): LeadAttributionPayload {
  if (typeof window === 'undefined') {
    return { landingPage: currentPath, firstLandingPage: currentPath };
  }
  captureLeadAttribution(currentPath);
  const store = readStore();
  const first = store?.first;
  const latest = store?.latest;
  const channel = classifyAttributionChannel({
    utmSource: first?.utmSource,
    utmMedium: first?.utmMedium,
    referrer: first?.referrer,
    aiSource: first?.aiSource,
  });
  const confidence = classifyAttributionConfidence({
    utmSource: first?.utmSource,
    referrer: first?.referrer,
  });

  // Existing DB columns: keep writing first-touch into landing/referrer/utm_* (improved by early capture).
  return {
    landingPage: first?.landingPage || currentPath,
    referrer: first?.referrer,
    utmSource: first?.utmSource || first?.aiSource,
    utmMedium: first?.utmMedium || (first?.aiSource ? 'ai_assistant' : undefined),
    utmCampaign: first?.utmCampaign,
    aiSource: first?.aiSource,
    firstLandingPage: first?.landingPage || currentPath,
    firstReferrer: first?.referrer,
    firstUtmSource: first?.utmSource,
    firstUtmMedium: first?.utmMedium,
    firstUtmCampaign: first?.utmCampaign,
    firstUtmContent: first?.utmContent,
    firstUtmTerm: first?.utmTerm,
    firstVisitAt: first?.visitAt,
    latestLandingPage: latest?.landingPage,
    latestReferrer: latest?.referrer,
    latestUtmSource: latest?.utmSource,
    latestUtmMedium: latest?.utmMedium,
    latestUtmCampaign: latest?.utmCampaign,
    latestVisitAt: latest?.visitAt,
    attributionChannel: channel,
    attributionConfidence: confidence,
  };
}

/** Test helper: clear stored attribution */
export function __resetLeadAttributionForTests() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
