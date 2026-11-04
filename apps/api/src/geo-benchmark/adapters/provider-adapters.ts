import { PROVIDERS, type ProviderId } from '../query-bank';
import { redactJson, truncateText } from '../domain/redact';

export type ProviderReadiness = {
  provider: ProviderId;
  configured: boolean;
  ready: boolean;
  model: string | null;
  endpointHost: string;
  setupMessage: string | null;
  measures: 'api_behavior_not_consumer_geo';
};

export type ProviderCitation = {
  title: string | null;
  url: string;
  snippet: string | null;
  providerMetadata: Record<string, unknown> | null;
};

export type ParsedProviderAnswer = {
  rawAnswer: string;
  modelLabel: string | null;
  citations: ProviderCitation[];
  providerMetadata: Record<string, unknown>;
  rawResponse: unknown;
};

export type ProviderRequest = {
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
};

export type FetchLike = (
  url: string,
  init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal },
) => Promise<{ ok: boolean; status: number; text: () => Promise<string> }>;

export class ProviderNotReadyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderNotReadyError';
  }
}

export class ProviderHttpError extends Error {
  readonly status: number;
  readonly redactedBody: unknown;

  constructor(message: string, status: number, redactedBody: unknown) {
    super(message);
    this.name = 'ProviderHttpError';
    this.status = status;
    this.redactedBody = redactedBody;
  }
}

const GEMINI_HOST = 'generativelanguage.googleapis.com';
const PERPLEXITY_HOST = 'api.perplexity.ai';
const DOUBAO_DEFAULT_BASE = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value : null;
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function envValue(env: NodeJS.ProcessEnv, name: string): string | null {
  const value = env[name]?.trim();
  return value ? value : null;
}

export function secretValues(env: NodeJS.ProcessEnv): string[] {
  return ['GEMINI_API_KEY', 'PERPLEXITY_API_KEY', 'DOUBAO_API_KEY', 'ARK_API_KEY']
    .map((name) => envValue(env, name))
    .filter((value): value is string => !!value && value.length >= 8);
}

export function providerReadiness(
  provider: ProviderId,
  env: NodeJS.ProcessEnv = process.env,
): ProviderReadiness {
  if (provider === 'gemini') {
    const key = envValue(env, 'GEMINI_API_KEY');
    const model = envValue(env, 'GEMINI_MODEL') ?? DEFAULT_GEMINI_MODEL;
    return {
      provider,
      configured: !!key,
      ready: !!key,
      model,
      endpointHost: GEMINI_HOST,
      setupMessage: key
        ? null
        : 'Gemini is not configured. Set GEMINI_API_KEY on the API server. Optional: GEMINI_MODEL (default gemini-2.5-flash). No request was sent.',
      measures: 'api_behavior_not_consumer_geo',
    };
  }
  if (provider === 'perplexity') {
    const key = envValue(env, 'PERPLEXITY_API_KEY');
    const model = envValue(env, 'PERPLEXITY_MODEL');
    return {
      provider,
      configured: !!key,
      ready: !!key,
      model,
      endpointHost: PERPLEXITY_HOST,
      setupMessage: key
        ? null
        : 'Perplexity is not configured. Set PERPLEXITY_API_KEY on the API server. Optional: PERPLEXITY_MODEL. No request was sent.',
      measures: 'api_behavior_not_consumer_geo',
    };
  }
  const key = envValue(env, 'DOUBAO_API_KEY') ?? envValue(env, 'ARK_API_KEY');
  const model = envValue(env, 'DOUBAO_MODEL');
  const base = envValue(env, 'DOUBAO_API_BASE') ?? DOUBAO_DEFAULT_BASE;
  const ready = !!key && !!model;
  let setupMessage: string | null = null;
  if (!key) {
    setupMessage =
      'Doubao is not configured. Set DOUBAO_API_KEY (or ARK_API_KEY) and DOUBAO_MODEL on the API server. Optional: DOUBAO_API_BASE. No request was sent.';
  } else if (!model) {
    setupMessage =
      'Doubao has an API key but no model. Set DOUBAO_MODEL to the Volcengine Ark model ID or endpoint ID. No request was sent.';
  }
  return {
    provider,
    configured: !!key,
    ready,
    model,
    endpointHost: hostOf(base),
    setupMessage,
    measures: 'api_behavior_not_consumer_geo',
  };
}

export function listProviderReadiness(env: NodeJS.ProcessEnv = process.env): ProviderReadiness[] {
  return PROVIDERS.map((provider) => providerReadiness(provider, env));
}

export function buildProviderRequest(
  provider: ProviderId,
  env: NodeJS.ProcessEnv,
  queryText: string,
): ProviderRequest {
  const readiness = providerReadiness(provider, env);
  if (!readiness.ready) {
    throw new ProviderNotReadyError(readiness.setupMessage ?? 'Provider is not configured.');
  }
  if (provider === 'gemini') {
    const key = envValue(env, 'GEMINI_API_KEY') as string;
    const model = readiness.model as string;
    return {
      url: `https://${GEMINI_HOST}/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': key,
      },
      body: {
        contents: [{ role: 'user', parts: [{ text: queryText }] }],
        tools: [{ google_search: {} }],
      },
    };
  }
  if (provider === 'perplexity') {
    const key = envValue(env, 'PERPLEXITY_API_KEY') as string;
    const body: Record<string, unknown> = {
      input: queryText,
      tools: [{ type: 'web_search' }],
    };
    if (readiness.model) body.model = readiness.model;
    return {
      url: `https://${PERPLEXITY_HOST}/v1/agent`,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${key}`,
      },
      body,
    };
  }
  const key = (envValue(env, 'DOUBAO_API_KEY') ?? envValue(env, 'ARK_API_KEY')) as string;
  const base = envValue(env, 'DOUBAO_API_BASE') ?? DOUBAO_DEFAULT_BASE;
  return {
    url: base,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${key}`,
    },
    body: {
      model: readiness.model,
      messages: [{ role: 'user', content: queryText }],
      web_search_options: {},
    },
  };
}

function pushCitation(
  list: ProviderCitation[],
  seen: Set<string>,
  citation: {
    url?: unknown;
    title?: unknown;
    snippet?: unknown;
    metadata?: Record<string, unknown> | null;
  },
) {
  const url = asString(citation.url);
  if (!url) return;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return;
  if (seen.has(url)) return;
  seen.add(url);
  list.push({
    title: asString(citation.title),
    url,
    snippet: asString(citation.snippet),
    providerMetadata: citation.metadata ?? null,
  });
}

function parseGemini(payload: unknown, requestedModel: string | null): ParsedProviderAnswer {
  const root = isRecord(payload) ? payload : {};
  const candidates = Array.isArray(root.candidates) ? root.candidates : [];
  const candidate = isRecord(candidates[0]) ? candidates[0] : {};
  const content = isRecord(candidate.content) ? candidate.content : {};
  const parts = Array.isArray(content.parts) ? content.parts : [];
  const texts = parts
    .map((part) => (isRecord(part) ? asString(part.text) : null))
    .filter((item): item is string => !!item);
  const grounding = isRecord(candidate.groundingMetadata) ? candidate.groundingMetadata : {};
  const chunks = Array.isArray(grounding.groundingChunks) ? grounding.groundingChunks : [];
  const supports = Array.isArray(grounding.groundingSupports) ? grounding.groundingSupports : [];
  const snippetsByChunk = new Map<number, string[]>();
  for (const support of supports) {
    if (!isRecord(support)) continue;
    const segment = isRecord(support.segment) ? asString(support.segment.text) : null;
    const indices = Array.isArray(support.groundingChunkIndices)
      ? support.groundingChunkIndices
      : [];
    if (!segment) continue;
    for (const index of indices) {
      if (typeof index !== 'number') continue;
      const current = snippetsByChunk.get(index) ?? [];
      current.push(segment);
      snippetsByChunk.set(index, current);
    }
  }
  const citations: ProviderCitation[] = [];
  const seen = new Set<string>();
  chunks.forEach((chunk, index) => {
    if (!isRecord(chunk) || !isRecord(chunk.web)) return;
    const snippet = snippetsByChunk.get(index)?.join(' ') ?? null;
    pushCitation(citations, seen, {
      url: chunk.web.uri,
      title: chunk.web.title,
      snippet,
      metadata: { source: 'groundingChunks' },
    });
  });
  const citationMetadata = isRecord(candidate.citationMetadata) ? candidate.citationMetadata : {};
  const sources = Array.isArray(citationMetadata.citationSources)
    ? citationMetadata.citationSources
    : [];
  for (const source of sources) {
    if (!isRecord(source)) continue;
    pushCitation(citations, seen, {
      url: source.uri,
      title: source.title,
      metadata: { source: 'citationMetadata' },
    });
  }
  const stored = { ...root };
  if (isRecord(stored.candidates) || Array.isArray(stored.candidates)) {
    stored.candidates = (stored.candidates as unknown[]).map((item) => {
      if (!isRecord(item) || !isRecord(item.groundingMetadata)) return item;
      const metadata = { ...item.groundingMetadata };
      delete metadata.searchEntryPoint;
      return { ...item, groundingMetadata: metadata };
    });
  }
  const usage = isRecord(root.usageMetadata) ? root.usageMetadata : null;
  return {
    rawAnswer: texts.join('\n').trim(),
    modelLabel: asString(root.modelVersion) ?? requestedModel,
    citations,
    providerMetadata: {
      endpointHost: GEMINI_HOST,
      webSearchQueries: Array.isArray(grounding.webSearchQueries) ? grounding.webSearchQueries : [],
      usage,
      searchEntryPointOmitted: true,
      note: 'Gemini API output with Google Search grounding. This is API behavior, not the consumer Gemini web product.',
    },
    rawResponse: stored,
  };
}

function textFromAgentOutput(output: unknown[]): string {
  const chunks: string[] = [];
  for (const item of output) {
    if (!isRecord(item) || item.type !== 'message') continue;
    const content = Array.isArray(item.content) ? item.content : [];
    for (const part of content) {
      if (!isRecord(part)) continue;
      const text = asString(part.text);
      if (text) chunks.push(text);
    }
  }
  return chunks.join('\n').trim();
}

function parsePerplexity(payload: unknown, requestedModel: string | null): ParsedProviderAnswer {
  const root = isRecord(payload) ? payload : {};
  const citations: ProviderCitation[] = [];
  const seen = new Set<string>();
  const output = Array.isArray(root.output) ? root.output : [];
  for (const item of output) {
    if (!isRecord(item) || item.type !== 'search_results' || !Array.isArray(item.results)) continue;
    for (const result of item.results) {
      if (!isRecord(result)) continue;
      pushCitation(citations, seen, {
        url: result.url,
        title: result.title,
        snippet: result.snippet,
        metadata: {
          id: result.id ?? null,
          date: result.date ?? null,
          source: result.source ?? null,
        },
      });
    }
  }
  let rawAnswer = textFromAgentOutput(output);
  if (!rawAnswer && Array.isArray(root.choices)) {
    const choice = isRecord(root.choices[0]) ? root.choices[0] : {};
    const message = isRecord(choice.message) ? choice.message : {};
    rawAnswer = asString(message.content) ?? '';
  }
  if (Array.isArray(root.search_results)) {
    for (const result of root.search_results) {
      if (!isRecord(result)) continue;
      pushCitation(citations, seen, {
        url: result.url,
        title: result.title,
        snippet: result.snippet,
        metadata: { source: 'legacy_search_results' },
      });
    }
  }
  if (Array.isArray(root.citations)) {
    for (const citation of root.citations) {
      if (typeof citation === 'string') {
        pushCitation(citations, seen, { url: citation, metadata: { source: 'legacy_citations' } });
      } else if (isRecord(citation)) {
        pushCitation(citations, seen, {
          url: citation.url,
          title: citation.title,
          snippet: citation.snippet,
          metadata: { source: 'legacy_citations' },
        });
      }
    }
  }
  const usage = isRecord(root.usage) ? root.usage : null;
  return {
    rawAnswer,
    modelLabel: asString(root.model) ?? requestedModel,
    citations,
    providerMetadata: {
      endpointHost: PERPLEXITY_HOST,
      responseId: asString(root.id),
      usage,
      note: 'Perplexity Agent API output. This is API behavior, not the consumer Perplexity web product.',
    },
    rawResponse: root,
  };
}

function parseDoubaoAnnotations(
  message: Record<string, unknown>,
  citations: ProviderCitation[],
  seen: Set<string>,
) {
  const annotations = Array.isArray(message.annotations) ? message.annotations : [];
  for (const annotation of annotations) {
    if (!isRecord(annotation)) continue;
    const nested = isRecord(annotation.url_citation) ? annotation.url_citation : annotation;
    pushCitation(citations, seen, {
      url: nested.url,
      title: nested.title,
      snippet: nested.snippet ?? nested.summary,
      metadata: { source: 'annotations' },
    });
  }
  const references = Array.isArray(message.references)
    ? message.references
    : Array.isArray(message.reference)
      ? message.reference
      : [];
  for (const reference of references) {
    if (!isRecord(reference)) continue;
    pushCitation(citations, seen, {
      url: reference.url,
      title: reference.title ?? reference.site_name,
      snippet: reference.summary ?? reference.snippet,
      metadata: { source: 'references' },
    });
  }
}

function parseDoubao(payload: unknown, requestedModel: string | null): ParsedProviderAnswer {
  const root = isRecord(payload) ? payload : {};
  const choice = Array.isArray(root.choices) && isRecord(root.choices[0]) ? root.choices[0] : {};
  const message = isRecord(choice.message) ? choice.message : {};
  const content = message.content;
  let rawAnswer = '';
  if (typeof content === 'string') rawAnswer = content.trim();
  else if (Array.isArray(content)) {
    rawAnswer = content
      .map((part) => (isRecord(part) ? asString(part.text) : null))
      .filter((item): item is string => !!item)
      .join('\n')
      .trim();
  }
  const citations: ProviderCitation[] = [];
  const seen = new Set<string>();
  parseDoubaoAnnotations(message, citations, seen);
  if (Array.isArray(root.references)) {
    for (const reference of root.references) {
      if (!isRecord(reference)) continue;
      pushCitation(citations, seen, {
        url: reference.url,
        title: reference.title,
        snippet: reference.summary ?? reference.snippet,
        metadata: { source: 'root_references' },
      });
    }
  }
  const usage = isRecord(root.usage) ? root.usage : null;
  return {
    rawAnswer,
    modelLabel: asString(root.model) ?? requestedModel,
    citations,
    providerMetadata: {
      endpointHost: hostOf(DOUBAO_DEFAULT_BASE),
      responseId: asString(root.id),
      usage,
      note: 'Doubao Volcengine Ark Chat API output with web_search_options. This is API behavior, not the consumer Doubao web product.',
    },
    rawResponse: root,
  };
}

export function parseProviderResponse(
  provider: ProviderId,
  payload: unknown,
  requestedModel: string | null,
): ParsedProviderAnswer {
  if (provider === 'gemini') return parseGemini(payload, requestedModel);
  if (provider === 'perplexity') return parsePerplexity(payload, requestedModel);
  return parseDoubao(payload, requestedModel);
}

export async function executeProviderCall(args: {
  provider: ProviderId;
  env: NodeJS.ProcessEnv;
  queryText: string;
  fetchImpl: FetchLike;
  timeoutMs?: number;
}): Promise<ParsedProviderAnswer> {
  const readiness = providerReadiness(args.provider, args.env);
  if (!readiness.ready) {
    throw new ProviderNotReadyError(readiness.setupMessage ?? 'Provider is not configured.');
  }
  const request = buildProviderRequest(args.provider, args.env, args.queryText);
  const signal = AbortSignal.timeout(args.timeoutMs ?? 90_000);
  let response: { ok: boolean; status: number; text: () => Promise<string> };
  try {
    response = await args.fetchImpl(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(request.body),
      signal,
    });
  } catch (error) {
    let message = 'Provider request failed.';
    if (error instanceof Error) {
      message = error.name === 'TimeoutError' ? 'Provider request timed out.' : error.message;
    }
    throw new ProviderHttpError(message, 0, null);
  }
  const text = await response.text();
  let parsed: unknown = { unparsed: truncateText(text, 2_000) };
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { unparsed: truncateText(text, 2_000) };
  }
  const redacted = redactJson(parsed, secretValues(args.env));
  if (!response.ok) {
    throw new ProviderHttpError(
      `Provider returned HTTP ${response.status}.`,
      response.status,
      redacted,
    );
  }
  return parseProviderResponse(args.provider, redacted, readiness.model);
}
