'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '../../../components/admin/AdminShell';

type Mode = 'api' | 'web_manual';
type ProviderName = 'gemini' | 'perplexity' | 'doubao';

type Rate = { numerator: number; denominator: number; rate: number | null };
type Distribution = Record<'0' | '1' | '2' | '3' | '4' | '5', number> & { sampleSize: number };
type ProviderMetrics = {
  provider: string;
  mode: Mode;
  coverage: Rate;
  sampleSize: number;
  mentionRate: Rate;
  accurateEntityRate: Rate;
  supplierCandidateRate: Rate;
  activeRecommendationRate: Rate;
  score4or5Rate: Rate;
  officialCitationRate: Rate;
  independentCitationRate: Rate;
  factualErrorRate: Rate;
  scoreDistribution: Distribution;
  categories: Array<{ category: string; label: string; coverage: Rate; sampleSize: number; mentionRate: Rate; score4or5Rate: Rate }>;
};
type CoverageQuery = {
  code: string;
  category: string;
  categoryLabel: string;
  text: string;
  latest: { id: string; version: number; reviewStatus: string; captureStatus: string; score: number | null; citationCount: number; countsTowardMetrics: boolean } | null;
  scored: { id: string; score: number | null; countsTowardMetrics: boolean } | null;
};
type Citation = { id?: string; title: string | null; url: string; snippet: string | null; position?: number };
type GeminiQuota = {
  used: number;
  remaining: number;
  cap: number;
  resetAt: string;
  monthBucket: string;
  model: string | null;
  groundingEnabled: boolean;
  groundingNote: string;
  billingNote: string;
  clientCanRaiseCap: false;
};
type ResultDetail = {
  id: string;
  provider: string;
  mode: Mode;
  origin: string;
  version: number;
  queryCode: string;
  queryText: string;
  modelLabel: string | null;
  capturedAt: string;
  locale: string | null;
  language: string | null;
  region: string | null;
  searchMode: string | null;
  notes: string | null;
  screenshotRef: string | null;
  captureStatus: string;
  reviewStatus: string;
  rawAnswer: string;
  immutable: boolean;
  citations: Citation[];
  review: null | {
    score: number | null;
    mention: boolean;
    identityCorrect: boolean;
    supplierCandidate: boolean;
    activeRecommendation: boolean;
    officialCitation: boolean;
    independentCitation: boolean;
    factualErrors: boolean;
    rationale: string;
    evaluator: string;
    reviewedAt: string;
  };
  history: Array<{ id: string; version: number; reviewStatus: string; captureStatus: string }>;
  audit: Array<{ id: string; action: string; actorLabel: string | null; createdAt: string }>;
};

const PROVIDERS: ProviderName[] = ['gemini', 'perplexity', 'doubao'];
const RUBRIC = [
  '0 No LONGVON mention',
  '1 Mentioned, but identity or facts are inaccurate',
  '2 Correctly mentioned or identified',
  '3 Included as a supplier candidate',
  '4 Actively recommended with matching rationale',
  '5 Actively recommended with the official website and an independent third-party citation',
];

const emptyFlags = {
  mention: false,
  identityCorrect: false,
  supplierCandidate: false,
  activeRecommendation: false,
  officialCitation: false,
  independentCitation: false,
  factualErrors: false,
};

function errorText(data: { message?: string | string[] }): string {
  if (Array.isArray(data.message)) return data.message.join(' ');
  return data.message || 'Request failed';
}

function pct(rate: Rate): string {
  if (rate.rate == null) return 'n/a';
  return `${Math.round(rate.rate * 1000) / 10}%`;
}

export default function GeoBenchmarkPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [mode, setMode] = useState<Mode>('web_manual');
  const [provider, setProvider] = useState<ProviderName>('gemini');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [providerStatus, setProviderStatus] = useState<Array<{ provider: string; configured: boolean; ready: boolean; model: string | null; setupMessage: string | null }>>([]);
  const [metrics, setMetrics] = useState<ProviderMetrics | null>(null);
  const [coverage, setCoverage] = useState<CoverageQuery[]>([]);
  const [selectedCode, setSelectedCode] = useState('Q001');
  const [detail, setDetail] = useState<ResultDetail | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmCost, setConfirmCost] = useState(false);
  const [geminiQuota, setGeminiQuota] = useState<GeminiQuota | null>(null);
  const [quotaNote, setQuotaNote] = useState('');
  const [capture, setCapture] = useState({
    rawAnswer: '',
    modelLabel: '',
    locale: '',
    language: '',
    region: '',
    searchMode: '',
    notes: '',
    screenshotRef: '',
    operatorLabel: 'geo-operator',
    captureStatus: 'complete',
    citations: [{ title: '', url: '', snippet: '' }],
  });
  const [correction, setCorrection] = useState({
    rawAnswer: '',
    captureStatus: 'complete',
    citations: [{ title: '', url: '', snippet: '' }],
  });
  const [review, setReview] = useState({
    reviewStatus: 'reviewed',
    score: '0',
    rationale: '',
    evaluator: 'geo-reviewer',
    ...emptyFlags,
  });

  async function call(path: string, init?: RequestInit) {
    const headers = new Headers(init?.headers);
    headers.set('x-admin-token', token);
    if (init?.body) headers.set('content-type', 'application/json');
    const response = await fetch(`/api/admin/geo/${path}`, { ...init, headers });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      router.push('/admin/login');
      throw new Error('Sign in required');
    }
    if (!response.ok) throw new Error(errorText(data));
    return data;
  }

  const loadId = useRef(0);
  const reload = useCallback(async (activeToken = token) => {
    const id = ++loadId.current;
    const params = new URLSearchParams({ provider, mode });
    if (category) params.set('category', category);
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const headers = { 'x-admin-token': activeToken };
    const [statusRes, metricsRes, coverageRes, quotaRes] = await Promise.all([
      fetch('/api/admin/geo/providers', { headers }),
      fetch(`/api/admin/geo/metrics?${params}`, { headers }),
      fetch(`/api/admin/geo/coverage?${params}`, { headers }),
      fetch('/api/admin/geo/gemini-quota', { headers }),
    ]);
    if (statusRes.status === 401 || metricsRes.status === 401 || quotaRes.status === 401) {
      router.push('/admin/login');
      return;
    }
    const statusJson = await statusRes.json();
    const metricsJson = await metricsRes.json();
    const coverageJson = await coverageRes.json();
    if (id !== loadId.current) return;
    if (!statusRes.ok) throw new Error(errorText(statusJson));
    if (!metricsRes.ok) throw new Error(errorText(metricsJson));
    if (!coverageRes.ok) throw new Error(errorText(coverageJson));
    setProviderStatus(statusJson.providers ?? []);
    if (quotaRes.ok) {
      setGeminiQuota(await quotaRes.json());
      setQuotaNote('');
    } else {
      setGeminiQuota(null);
      setQuotaNote('Gemini monthly usage could not be loaded. Official API runs stay gated by the server.');
    }
    const panel = (metricsJson.panels ?? []).find((item: { mode: Mode }) => item.mode === mode);
    setMetrics(panel?.providers?.find((item: ProviderMetrics) => item.provider === provider) ?? null);
    setCoverage(coverageJson.queries ?? []);
  }, [category, from, mode, provider, router, to, token]);

  useEffect(() => {
    const saved = localStorage.getItem('admin_token');
    if (!saved) {
      router.push('/admin/login');
      return;
    }
    setToken(saved);
  }, [router]);

  useEffect(() => {
    if (!token) return;
    reload(token).catch((err: Error) => setError(err.message));
  }, [token, reload]);

  async function openResult(id: string) {
    setError('');
    const data = await call(`results/${id}`);
    setDetail(data);
    const citations = data.citations?.length
      ? data.citations.map((item: Citation) => ({ title: item.title ?? '', url: item.url, snippet: item.snippet ?? '' }))
      : [{ title: '', url: '', snippet: '' }];
    if (data.mode === 'web_manual') {
      setCapture((current) => ({
        ...current,
        rawAnswer: data.rawAnswer ?? '',
        modelLabel: data.modelLabel ?? '',
        locale: data.locale ?? '',
        language: data.language ?? '',
        region: data.region ?? '',
        searchMode: data.searchMode ?? '',
        notes: data.notes ?? '',
        screenshotRef: data.screenshotRef ?? '',
        captureStatus: data.captureStatus === 'draft' ? 'draft' : 'complete',
        citations,
      }));
    }
    setCorrection({
      rawAnswer: data.rawAnswer ?? '',
      captureStatus: 'complete',
      citations,
    });
    setReview({
      reviewStatus: data.reviewStatus === 'pending' ? 'reviewed' : data.reviewStatus,
      score: String(data.review?.score ?? 0),
      rationale: data.review?.rationale ?? '',
      evaluator: data.review?.evaluator ?? 'geo-reviewer',
      mention: data.review?.mention ?? false,
      identityCorrect: data.review?.identityCorrect ?? false,
      supplierCandidate: data.review?.supplierCandidate ?? false,
      activeRecommendation: data.review?.activeRecommendation ?? false,
      officialCitation: data.review?.officialCitation ?? false,
      independentCitation: data.review?.independentCitation ?? false,
      factualErrors: data.review?.factualErrors ?? false,
    });
  }

  function citationPayload(citations: Array<{ title: string; url: string; snippet: string }>) {
    return citations.filter((item) => item.url.trim()).map((item) => ({
      title: item.title || undefined,
      url: item.url,
      snippet: item.snippet || undefined,
    }));
  }

  async function saveCapture() {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const body = {
        rawAnswer: capture.rawAnswer,
        captureStatus: capture.captureStatus,
        modelLabel: capture.modelLabel || undefined,
        locale: capture.locale || undefined,
        language: capture.language || undefined,
        region: capture.region || undefined,
        searchMode: capture.searchMode || undefined,
        notes: capture.notes || undefined,
        screenshotRef: capture.screenshotRef || undefined,
        operatorLabel: capture.operatorLabel,
        citations: citationPayload(capture.citations),
      };
      const updating = detail && !detail.immutable && detail.mode === 'web_manual' && detail.queryCode === selectedCode;
      const saved = updating
        ? await call(`results/${detail.id}`, { method: 'PATCH', body: JSON.stringify(body) })
        : await call('captures', {
            method: 'POST',
            body: JSON.stringify({ ...body, provider, queryCode: selectedCode }),
          });
      setMessage(updating
        ? `Updated ${saved.queryCode}. It stays out of the rates until a human reviews it.`
        : `Saved ${saved.queryCode} as ${saved.origin}. It is not scored until a human reviews it.`);
      await reload();
      await openResult(saved.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  async function saveCorrection() {
    if (!detail?.immutable) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const saved = await call(`results/${detail.id}/corrections`, {
        method: 'POST',
        body: JSON.stringify({
          rawAnswer: correction.rawAnswer,
          captureStatus: correction.captureStatus,
          operatorLabel: capture.operatorLabel,
          citations: citationPayload(correction.citations),
        }),
      });
      setMessage(`Saved ${saved.queryCode} version ${saved.version} as a new ${saved.origin} record. The previous raw answer stays locked.`);
      await reload();
      await openResult(saved.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Correction failed');
    } finally {
      setBusy(false);
    }
  }

  async function submitReview() {
    if (!detail) return;
    setBusy(true);
    setError('');
    try {
      await call(`results/${detail.id}/review`, {
        method: 'POST',
        body: JSON.stringify({
          reviewStatus: review.reviewStatus,
          score: review.reviewStatus === 'reviewed' ? Number(review.score) : undefined,
          rationale: review.rationale,
          evaluator: review.evaluator,
          mention: review.mention,
          identityCorrect: review.identityCorrect,
          supplierCandidate: review.supplierCandidate,
          activeRecommendation: review.activeRecommendation,
          officialCitation: review.officialCitation,
          independentCitation: review.independentCitation,
          factualErrors: review.factualErrors,
        }),
      });
      setMessage('Review saved. Only reviewed complete results enter the metrics.');
      await reload();
      await openResult(detail.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Review failed');
    } finally {
      setBusy(false);
    }
  }

  async function runQueries(codes: string[]) {
    if (!confirmCost) {
      setError('Confirm the paid API cost warning before sending. No request was sent.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await call('runs', {
        method: 'POST',
        body: JSON.stringify({
          provider,
          queryCodes: codes,
          confirmCost: true,
          operatorLabel: capture.operatorLabel,
        }),
      });
      const quotaText = result.geminiQuota
        ? ` Gemini official API quota: ${result.geminiQuota.used} used, ${result.geminiQuota.remaining} remaining, resets ${result.geminiQuota.resetAt}.`
        : '';
      const failureText = result.failures?.length ? ` ${result.failures.length} query request(s) were not sent or failed.` : '';
      setMessage(`API run ${result.status}. Stored ${result.resultIds.length} pending result(s). These rows measure ${provider} API behavior, not the consumer web product.${quotaText}${failureText}`);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Run failed');
    } finally {
      setConfirmCost(false);
      setBusy(false);
    }
  }

  async function download(format: 'json' | 'csv') {
    setError('');
    const params = new URLSearchParams({ format, provider, mode, operatorLabel: capture.operatorLabel });
    if (category) params.set('category', category);
    if (status) params.set('status', status);
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    try {
      const file = await call(`export?${params}`);
      const blob = new Blob([file.body], { type: file.mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.filename;
      link.click();
      URL.revokeObjectURL(url);
      setMessage(`Exported ${format.toUpperCase()}. The export was written to the audit log.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  }

  const selected = coverage.find((item) => item.code === selectedCode);
  const visibleCoverage = coverage.filter((item) => {
    if (!status) return true;
    if (status === 'draft') return item.latest?.captureStatus === 'draft';
    if (status === 'reviewed') {
      return item.latest?.reviewStatus === 'reviewed' && Boolean(item.latest.countsTowardMetrics);
    }
    return item.latest?.reviewStatus === status;
  });

  function updateCitation(index: number, key: 'title' | 'url' | 'snippet', value: string) {
    const citations = capture.citations.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item);
    setCapture({ ...capture, citations });
  }

  const activeProvider = providerStatus.find((item) => item.provider === provider);
  const activeModel = activeProvider?.model ?? (provider === 'gemini' ? 'gemini-3.8-flash' : 'server default');

  return (
    <AdminShell title="GEO Benchmark 01" subtitle="Gemini, Perplexity, and Doubao. API and official-web captures stay in separate panels.">
      <section style={card}>
        <p style={text}>
          API output measures provider API behavior. A manual capture is the consumer-product record. The two are never combined. Missing queries are left blank; they are not scored as zero. Drafts and unreviewed rows stay out of the rates.
        </p>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Reviewer fact guardrails</summary>
          <ul style={{ ...text, paddingLeft: 18 }}>
            <li>LONGVON / 龙汾科技（深圳）有限公司 is the manufacturer and OEM/ODM provider. MATEYOU is a product brand, not the manufacturer.</li>
            <li>Ring1C is a consumer smart ring and is not a registered medical device. Ring1 is a separate project. Do not mark an approval claim as correct unless the answer supplies evidence.</li>
            <li>Ring1 and Ring1C share a hardware platform and health-monitoring capabilities. Ring1C uses a ceramic outer ring. Ring1 uses a titanium-alloy outer ring.</li>
            <li>The published taxonomy is 7 functional units and 71 parameters.</li>
            <li>Keep OSA language at screening or risk screening. Screening is not diagnosis, treatment, clinical validation, or approval.</li>
            <li>Do not add certifications, clinical results, customers, capacity, patents, or approvals that the captured answer does not state.</li>
          </ul>
        </details>
      </section>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0' }}>
        {providerStatus.map((item) => (
          <span key={item.provider} style={pill} title={item.setupMessage ?? ''}>
            {item.provider}: {item.ready ? `ready (${item.model ?? 'provider default'})` : item.configured ? 'key set, model missing' : 'not configured'}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {(['web_manual', 'api'] as Mode[]).map((item) => (
          <button key={item} type="button" onClick={() => { setMode(item); setDetail(null); }} style={button(mode === item)}>{item === 'api' ? 'API panel' : 'Official web panel'}</button>
        ))}
        {PROVIDERS.map((item) => (
          <button key={item} type="button" onClick={() => setProvider(item)} style={button(provider === item)}>{item}</button>
        ))}
        <select value={category} onChange={(event) => setCategory(event.target.value)} style={field} aria-label="Category">
          <option value="">All categories</option>
          <option value="manufacturer_discovery">Manufacturer discovery</option>
          <option value="oem_odm">OEM/ODM</option>
          <option value="health_monitoring">Health monitoring</option>
          <option value="sdk_api">SDK/API</option>
          <option value="international_buyers">International buyers</option>
          <option value="competitive_comparison">Competitive comparison</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} style={field} aria-label="Status">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="excluded">Excluded</option>
          <option value="needs_recheck">Needs recheck</option>
          <option value="draft">Draft</option>
        </select>
        <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} style={field} aria-label="From date" />
        <input type="date" value={to} onChange={(event) => setTo(event.target.value)} style={field} aria-label="To date" />
        <button type="button" style={button(false)} onClick={() => download('csv')}>Export CSV</button>
        <button type="button" style={button(false)} onClick={() => download('json')}>Export JSON</button>
      </div>

      {error && <p role="alert" style={{ ...card, color: '#9f1239', background: '#fff1f2' }}>{error}</p>}
      {message && <p style={{ ...card, background: '#ecfdf5' }}>{message}</p>}

      {metrics && (
        <section style={card}>
          <h2 style={h2}>{provider} · {mode === 'api' ? 'API' : 'official web'}</h2>
          <p style={text}>Sample size {metrics.sampleSize}. Coverage {metrics.coverage.numerator}/{metrics.coverage.denominator}.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
            <Metric label="Mention" value={metrics.mentionRate} />
            <Metric label="Accurate entity" value={metrics.accurateEntityRate} />
            <Metric label="Supplier candidate" value={metrics.supplierCandidateRate} />
            <Metric label="Active recommendation" value={metrics.activeRecommendationRate} />
            <Metric label="Score 4–5" value={metrics.score4or5Rate} />
            <Metric label="Official citation" value={metrics.officialCitationRate} />
            <Metric label="Independent citation" value={metrics.independentCitationRate} />
            <Metric label="Factual error" value={metrics.factualErrorRate} />
          </div>
          <h3 style={h3}>Score distribution</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {(['0', '1', '2', '3', '4', '5'] as const).map((score) => (
              <div key={score} style={{ background: '#f5f5f7', borderRadius: 8, padding: 8 }}>
                <strong>{score}</strong>
                <div>{metrics.scoreDistribution[score]}</div>
              </div>
            ))}
          </div>
          <h3 style={h3}>Categories</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>{['Category', 'Coverage', 'Sample', 'Mention', 'Score 4–5'].map((label) => <th key={label} style={th}>{label}</th>)}</tr>
            </thead>
            <tbody>
              {metrics.categories.map((item) => (
                <tr key={item.category}>
                  <td style={td}>{item.label}</td>
                  <td style={td}>{item.coverage.numerator}/{item.coverage.denominator}</td>
                  <td style={td}>{item.sampleSize}</td>
                  <td style={td}>{item.mentionRate.numerator}/{item.mentionRate.denominator} ({pct(item.mentionRate)})</td>
                  <td style={td}>{item.score4or5Rate.numerator}/{item.score4or5Rate.denominator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginTop: 16 }}>
        <div style={card}>
          <h2 style={h2}>60-query coverage</h2>
          <div style={{ maxHeight: 520, overflow: 'auto' }}>
            {visibleCoverage.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setSelectedCode(item.code);
                  if (item.latest) {
                    openResult(item.latest.id).catch((err: Error) => setError(err.message));
                  } else {
                    setDetail(null);
                    setCapture((current) => ({
                      ...current,
                      rawAnswer: '',
                      modelLabel: '',
                      locale: '',
                      language: '',
                      region: '',
                      searchMode: '',
                      notes: '',
                      screenshotRef: '',
                      captureStatus: 'complete',
                      citations: [{ title: '', url: '', snippet: '' }],
                    }));
                  }
                }}
                style={{ display: 'block', width: '100%', textAlign: 'left', border: selectedCode === item.code ? '1px solid #0066CC' : '1px solid transparent', background: 'transparent', padding: 8, borderRadius: 8, cursor: 'pointer' }}
              >
                <strong>{item.code}</strong> {item.latest ? `${item.latest.reviewStatus}${item.latest.countsTowardMetrics ? ` · score ${item.latest.score}` : ''}` : 'not tested'}
                <div style={{ color: '#6e6e73', fontSize: 12 }}>{item.text}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={card}>
          {mode === 'api' ? (
            <>
              <h2 style={h2}>{provider === 'gemini' ? 'Gemini official API run' : 'Paid API run'}</h2>
              <p style={text}>
                Provider: <strong>{provider}</strong>. Model: <strong>{activeModel}</strong>.
                This sends the exact query, with no LONGVON priming, to the {provider} API.
                The stored rows measure API behavior. They are not consumer {provider} GEO visibility.
                Nothing is sent until you confirm.
              </p>
              {provider === 'gemini' ? (
                <div style={text}>
                  <p>
                    Shared monthly cap:{' '}
                    {geminiQuota
                      ? `${geminiQuota.used} used, ${geminiQuota.remaining} remaining of ${geminiQuota.cap}.`
                      : 'usage loads from the server.'}{' '}
                    Resets {geminiQuota ? geminiQuota.resetAt : 'at 00:00 UTC on the first day of the next month'}.
                  </p>
                  <p>{geminiQuota?.groundingNote ?? 'Google Search grounding stays off unless the server has verified free-tier eligibility. It is off.'}</p>
                  <p>{geminiQuota?.billingNote ?? 'Free-tier eligibility is controlled by Google. This application cap cannot guarantee a $0 Google bill, and this page does not check Google billing.'}</p>
                  <p>The cap is server configuration. This page cannot raise it.{quotaNote ? ` ${quotaNote}` : ''}</p>
                </div>
              ) : (
                <p style={text}>Every query can incur charges, including a single query.</p>
              )}
              <p style={text}>Selected: {selectedCode}. {selected?.text}</p>
              <label style={{ display: 'flex', gap: 8, margin: '12px 0', fontSize: 14 }}>
                <input type="checkbox" checked={confirmCost} onChange={(event) => setConfirmCost(event.target.checked)} />
                {provider === 'gemini'
                  ? `I confirm this Gemini API run for model ${activeModel}. I understand the monthly cap, that grounding is off, and that Google controls free-tier billing.`
                  : `I confirm this paid ${provider} API run for model ${activeModel}.`}
              </label>
              <button type="button" disabled={busy || !confirmCost || (provider === 'gemini' && !geminiQuota)} style={button(confirmCost && (provider !== 'gemini' || !!geminiQuota))} onClick={() => runQueries([selectedCode])}>
                Confirm and run {selectedCode}
              </button>
              <button type="button" disabled={busy || !confirmCost || coverage.length === 0 || (provider === 'gemini' && !geminiQuota)} style={button(confirmCost && coverage.length > 0 && (provider !== 'gemini' || !!geminiQuota))} onClick={() => runQueries(coverage.map((item) => item.code))}>
                Confirm and run {coverage.length} shown queries
              </button>
            </>
          ) : (
            <>
              <h2 style={h2}>Official web capture</h2>
              <p style={text}>
                This panel records a human paste from the consumer web product. It does not call the official API and it does not use the Gemini monthly API cap.
              </p>
              <ol style={{ ...text, paddingLeft: 18 }}>
                <li>Open a new chat in the official {provider} consumer product.</li>
                <li>Do not prime it with LONGVON or a supplier list.</li>
                <li>Submit the query exactly, then paste the full answer and every visible citation.</li>
                <li>Record the model label, locale, region, and search mode that were visible.</li>
                <li>Save a draft if the paste is incomplete. Drafts are not scored.</li>
              </ol>
              <p style={text}><strong>{selectedCode}</strong> {selected?.text}</p>
              <label style={label}>Raw answer<textarea value={capture.rawAnswer} onChange={(event) => setCapture({ ...capture, rawAnswer: event.target.value })} style={{ ...field, width: '100%', minHeight: 120 }} /></label>
              {capture.citations.map((citation, index) => (
                <div key={index} style={{ display: 'grid', gap: 6, marginBottom: 8 }}>
                  <input aria-label={`Citation ${index + 1} title`} placeholder="Citation title" value={citation.title} onChange={(event) => updateCitation(index, 'title', event.target.value)} style={field} />
                  <input aria-label={`Citation ${index + 1} URL`} placeholder="https:// citation URL" value={citation.url} onChange={(event) => updateCitation(index, 'url', event.target.value)} style={field} />
                  <input aria-label={`Citation ${index + 1} snippet`} placeholder="Snippet shown in the product" value={citation.snippet} onChange={(event) => updateCitation(index, 'snippet', event.target.value)} style={field} />
                </div>
              ))}
              <button type="button" style={button(false)} onClick={() => setCapture({ ...capture, citations: [...capture.citations, { title: '', url: '', snippet: '' }] })}>Add citation</button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                <input placeholder="Visible model or product" value={capture.modelLabel} onChange={(event) => setCapture({ ...capture, modelLabel: event.target.value })} style={field} />
                <input placeholder="Locale" value={capture.locale} onChange={(event) => setCapture({ ...capture, locale: event.target.value })} style={field} />
                <input placeholder="Language" value={capture.language} onChange={(event) => setCapture({ ...capture, language: event.target.value })} style={field} />
                <input placeholder="Region" value={capture.region} onChange={(event) => setCapture({ ...capture, region: event.target.value })} style={field} />
                <input placeholder="Search mode" value={capture.searchMode} onChange={(event) => setCapture({ ...capture, searchMode: event.target.value })} style={field} />
                <input placeholder="Screenshot path or URL" value={capture.screenshotRef} onChange={(event) => setCapture({ ...capture, screenshotRef: event.target.value })} style={field} />
              </div>
              <textarea placeholder="Notes. Use a role label, not an email or phone number." value={capture.notes} onChange={(event) => setCapture({ ...capture, notes: event.target.value })} style={{ ...field, width: '100%', marginTop: 8 }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <select value={capture.captureStatus} onChange={(event) => setCapture({ ...capture, captureStatus: event.target.value })} style={field} aria-label="Capture status">
                  <option value="complete">Complete</option>
                  <option value="draft">Draft</option>
                </select>
                <input aria-label="Operator role label" value={capture.operatorLabel} onChange={(event) => setCapture({ ...capture, operatorLabel: event.target.value })} style={field} />
                <button
                  type="button"
                  disabled={busy || Boolean(detail && detail.immutable && detail.mode === 'web_manual' && detail.queryCode === selectedCode)}
                  style={button(!(busy || (detail && detail.immutable && detail.mode === 'web_manual' && detail.queryCode === selectedCode)))}
                  onClick={saveCapture}
                >
                  {detail && !detail.immutable && detail.mode === 'web_manual' && detail.queryCode === selectedCode ? 'Update this capture' : 'Save new capture'}
                </button>
                {detail && detail.immutable && detail.mode === 'web_manual' && detail.queryCode === selectedCode && (
                  <p style={text}>This answer is locked. Use Save correction on the record below to store a new version.</p>
                )}
              </div>
            </>
          )}

          {detail && (
            <div style={{ marginTop: 20 }}>
              <h2 style={h2}>{detail.queryCode} · v{detail.version} · {detail.origin}</h2>
              <p style={text}>{detail.modelLabel || 'Model not recorded'} · {detail.reviewStatus} · {new Date(detail.capturedAt).toISOString()}</p>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', background: '#f5f5f7', padding: 12, borderRadius: 8 }}>{detail.rawAnswer || '[empty answer]'}</pre>
              <ul>
                {detail.citations.map((citation) => (
                  <li key={`${citation.position}-${citation.url}`} style={text}>
                    <a href={citation.url} target="_blank" rel="noreferrer" style={{ color: '#0066CC', textDecoration: 'underline' }}>{citation.title || citation.url}</a>
                    {citation.snippet ? ` — ${citation.snippet}` : ''}
                  </li>
                ))}
                {detail.citations.length === 0 && <li style={text}>No citations stored.</li>}
              </ul>
              <h3 style={h3}>Human score</h3>
              <p style={text}>{RUBRIC.join(' · ')}</p>
              <select value={review.reviewStatus} onChange={(event) => setReview({ ...review, reviewStatus: event.target.value })} style={field} aria-label="Review status">
                <option value="reviewed">Reviewed</option>
                <option value="needs_recheck">Needs recheck</option>
                <option value="excluded">Excluded</option>
              </select>
              <select value={review.score} onChange={(event) => setReview({ ...review, score: event.target.value })} style={field} aria-label="Score">
                {['0', '1', '2', '3', '4', '5'].map((score) => <option key={score} value={score}>{score}</option>)}
              </select>
              {Object.entries(emptyFlags).map(([key]) => (
                <label key={key} style={{ display: 'block', fontSize: 13, margin: '4px 0' }}>
                  <input type="checkbox" checked={Boolean(review[key as keyof typeof emptyFlags])} onChange={(event) => setReview({ ...review, [key]: event.target.checked })} /> {key}
                </label>
              ))}
              <textarea aria-label="Rationale" placeholder="Rationale" value={review.rationale} onChange={(event) => setReview({ ...review, rationale: event.target.value })} style={{ ...field, width: '100%', minHeight: 80 }} />
              <input aria-label="Evaluator role label" value={review.evaluator} onChange={(event) => setReview({ ...review, evaluator: event.target.value })} style={field} />
              <button type="button" disabled={busy} style={button(true)} onClick={submitReview}>Save review</button>
              <h3 style={h3}>Versions</h3>
              <ul>
                {(detail.history ?? []).map((item) => (
                  <li key={item.id} style={text}>
                    <button type="button" onClick={() => openResult(item.id).catch((err: Error) => setError(err.message))} style={button(item.id === detail.id)}>
                      v{item.version} · {item.reviewStatus} · {item.captureStatus}
                    </button>
                  </li>
                ))}
              </ul>
              {detail.immutable && (
                <div>
                  <h3 style={h3}>Correction</h3>
                  <p style={text}>The raw answer above stays locked. Saving a correction stores a new {detail.origin} version and leaves it pending until someone reviews it.</p>
                  <textarea aria-label="Corrected raw answer" value={correction.rawAnswer} onChange={(event) => setCorrection({ ...correction, rawAnswer: event.target.value })} style={{ ...field, width: '100%', minHeight: 100 }} />
                  {correction.citations.map((citation, index) => (
                    <div key={index} style={{ display: 'grid', gap: 6, marginBottom: 8 }}>
                      <input aria-label={`Correction citation ${index + 1} title`} placeholder="Citation title" value={citation.title} onChange={(event) => setCorrection({ ...correction, citations: correction.citations.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })} style={field} />
                      <input aria-label={`Correction citation ${index + 1} URL`} placeholder="https:// citation URL" value={citation.url} onChange={(event) => setCorrection({ ...correction, citations: correction.citations.map((item, itemIndex) => itemIndex === index ? { ...item, url: event.target.value } : item) })} style={field} />
                    </div>
                  ))}
                  <button type="button" style={button(false)} onClick={() => setCorrection({ ...correction, citations: [...correction.citations, { title: '', url: '', snippet: '' }] })}>Add correction citation</button>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <select aria-label="Correction capture status" value={correction.captureStatus} onChange={(event) => setCorrection({ ...correction, captureStatus: event.target.value })} style={field}>
                      <option value="complete">Complete</option>
                      <option value="draft">Draft</option>
                    </select>
                    <button type="button" disabled={busy} style={button(true)} onClick={saveCorrection}>Save correction</button>
                  </div>
                </div>
              )}
              <h3 style={h3}>Audit</h3>
              <ul>{detail.audit.map((event) => <li key={event.id} style={text}>{event.action} · {event.actorLabel || 'unlabeled'} · {new Date(event.createdAt).toISOString()}</li>)}</ul>
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: Rate }) {
  return (
    <div style={{ background: '#f5f5f7', borderRadius: 10, padding: 10 }}>
      <div style={{ fontSize: 12, color: '#6e6e73' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{pct(value)}</div>
      <div style={{ fontSize: 12 }}>{value.numerator}/{value.denominator}</div>
    </div>
  );
}

const card: CSSProperties = { background: '#fff', borderRadius: 16, padding: 16, marginTop: 12 };
const text: CSSProperties = { fontSize: 14, color: '#1d1d1f', lineHeight: 1.5 };
const h2: CSSProperties = { fontSize: 18, margin: '0 0 8px' };
const h3: CSSProperties = { fontSize: 15, margin: '16px 0 8px' };
const label: CSSProperties = { display: 'block', fontSize: 13, marginTop: 8 };
const field: CSSProperties = { border: '1px solid #e5e5ea', borderRadius: 8, padding: '8px 10px', fontSize: 14 };
const th: CSSProperties = { textAlign: 'left', borderBottom: '1px solid #e5e5ea', padding: 6 };
const td: CSSProperties = { borderBottom: '1px solid #f0f0f2', padding: 6 };
const pill: CSSProperties = { background: '#fff', borderRadius: 999, padding: '6px 10px', fontSize: 12 };

function button(active: boolean): CSSProperties {
  return {
    border: 0,
    borderRadius: 10,
    padding: '8px 12px',
    background: active ? '#1d1d1f' : '#e5e5ea',
    color: active ? '#fff' : '#1d1d1f',
    cursor: active ? 'pointer' : 'pointer',
  };
}
