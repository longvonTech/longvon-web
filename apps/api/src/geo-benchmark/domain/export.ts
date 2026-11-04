import { redactJson } from './redact';

export type ExportCitation = {
  position: number;
  title: string | null;
  url: string;
  snippet: string | null;
};

export type ExportReview = {
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
} | null;

export type ExportAudit = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  actorLabel: string | null;
  payload: unknown;
  createdAt: string;
};

export type ExportResult = {
  id: string;
  provider: string;
  mode: string;
  origin: string;
  version: number;
  predecessorId: string | null;
  queryCode: string;
  queryText: string;
  category: string;
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
  providerMetadata: unknown;
  citations: ExportCitation[];
  review: ExportReview;
  auditHistory: ExportAudit[];
};

export type ExportDocument = {
  benchmark: 'GEO-BENCHMARK-01';
  exportedAt: string;
  note: string;
  results: ExportResult[];
  auditHistory: ExportAudit[];
};

function cell(value: unknown): string {
  if (value == null) return '';
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  const neutralized = /^[=+\-@]/.test(text) ? `'${text}` : text;
  if (/[",\n\r]/.test(neutralized)) return `"${neutralized.replace(/"/g, '""')}"`;
  return neutralized;
}

export function sanitizeExportDocument(
  document: ExportDocument,
  secrets: string[],
): ExportDocument {
  return redactJson(document, secrets) as ExportDocument;
}

export function toCsv(document: ExportDocument): string {
  const headers = [
    'id',
    'provider',
    'mode',
    'origin',
    'version',
    'query_code',
    'query_text',
    'category',
    'model_label',
    'captured_at',
    'locale',
    'language',
    'region',
    'search_mode',
    'capture_status',
    'review_status',
    'score',
    'mention',
    'identity_correct',
    'supplier_candidate',
    'active_recommendation',
    'official_citation',
    'independent_citation',
    'factual_errors',
    'rationale',
    'evaluator',
    'reviewed_at',
    'raw_answer',
    'citations',
    'notes',
    'screenshot_ref',
    'audit_history',
  ];
  const lines = [headers.join(',')];
  for (const result of document.results) {
    const row = [
      result.id,
      result.provider,
      result.mode,
      result.origin,
      result.version,
      result.queryCode,
      result.queryText,
      result.category,
      result.modelLabel,
      result.capturedAt,
      result.locale,
      result.language,
      result.region,
      result.searchMode,
      result.captureStatus,
      result.reviewStatus,
      result.review?.score ?? '',
      result.review?.mention ?? '',
      result.review?.identityCorrect ?? '',
      result.review?.supplierCandidate ?? '',
      result.review?.activeRecommendation ?? '',
      result.review?.officialCitation ?? '',
      result.review?.independentCitation ?? '',
      result.review?.factualErrors ?? '',
      result.review?.rationale ?? '',
      result.review?.evaluator ?? '',
      result.review?.reviewedAt ?? '',
      result.rawAnswer,
      result.citations,
      result.notes,
      result.screenshotRef,
      result.auditHistory,
    ];
    lines.push(row.map(cell).join(','));
  }
  return lines.join('\n');
}
