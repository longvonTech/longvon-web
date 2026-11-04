import { findQuery, isProvider, type ProviderId } from '../query-bank';

export class BenchmarkValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BenchmarkValidationError';
  }
}

export const LIMITS = {
  answer: 100_000,
  notes: 4_000,
  rationale: 8_000,
  citations: 40,
  url: 2_000,
  title: 500,
  snippet: 4_000,
  label: 120,
  screenshot: 500,
  evaluator: 80,
  operator: 80,
};

const EMAIL_LIKE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_LIKE = /(?:\+?\d[\d\s().-]{8,}\d)/;

export function assertRoleLabel(value: string | undefined | null, field: string): string | null {
  if (value == null || value.trim() === '') return null;
  const trimmed = value.trim();
  if (trimmed.length > LIMITS.operator) {
    throw new BenchmarkValidationError(`${field} must be ${LIMITS.operator} characters or fewer.`);
  }
  if (EMAIL_LIKE.test(trimmed) || PHONE_LIKE.test(trimmed)) {
    throw new BenchmarkValidationError(
      `${field} must be a role label. Do not store an email address or phone number.`,
    );
  }
  return trimmed;
}

export function assertRequiredRoleLabel(value: string | undefined | null, field: string): string {
  const label = assertRoleLabel(value, field);
  if (!label) throw new BenchmarkValidationError(`${field} is required.`);
  return label;
}

export type CitationInput = {
  title?: string | null;
  url: string;
  snippet?: string | null;
};

export type NormalizedCitation = {
  title: string | null;
  url: string;
  snippet: string | null;
};

export function assertPublicHttpUrl(value: string, field = 'URL'): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > LIMITS.url) {
    throw new BenchmarkValidationError(
      `${field} must be a non-empty http(s) URL of at most ${LIMITS.url} characters.`,
    );
  }
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('file:')) {
    throw new BenchmarkValidationError(`${field} must use http or https.`);
  }
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new BenchmarkValidationError(`${field} is not a valid URL.`);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new BenchmarkValidationError(`${field} must use http or https.`);
  }
  if (parsed.username || parsed.password) {
    throw new BenchmarkValidationError(`${field} must not include credentials.`);
  }
  if (!parsed.hostname) {
    throw new BenchmarkValidationError(`${field} is missing a host.`);
  }
  return trimmed;
}

export function assertScreenshotRef(value: string | undefined | null): string | null {
  if (value == null || value.trim() === '') return null;
  const trimmed = value.trim();
  if (trimmed.length > LIMITS.screenshot) {
    throw new BenchmarkValidationError(
      `Screenshot reference must be ${LIMITS.screenshot} characters or fewer.`,
    );
  }
  if (trimmed.startsWith('/')) {
    if (
      trimmed.startsWith('//') ||
      trimmed.includes('..') ||
      !/^\/[A-Za-z0-9._~/-]+$/.test(trimmed)
    ) {
      throw new BenchmarkValidationError('Screenshot reference path is not allowed.');
    }
    return trimmed;
  }
  return assertPublicHttpUrl(trimmed, 'Screenshot reference');
}

export function normalizeCitations(inputs: CitationInput[] | undefined): NormalizedCitation[] {
  const list = inputs ?? [];
  if (list.length > LIMITS.citations) {
    throw new BenchmarkValidationError(`At most ${LIMITS.citations} citations can be stored.`);
  }
  return list.map((item, index) => {
    const url = assertPublicHttpUrl(item.url, `Citation ${index + 1} URL`);
    const title = item.title?.trim() ? item.title.trim() : null;
    const snippet = item.snippet?.trim() ? item.snippet.trim() : null;
    if (title && title.length > LIMITS.title) {
      throw new BenchmarkValidationError(`Citation ${index + 1} title is too long.`);
    }
    if (snippet && snippet.length > LIMITS.snippet) {
      throw new BenchmarkValidationError(`Citation ${index + 1} snippet is too long.`);
    }
    return { title, url, snippet };
  });
}

export function assertRawAnswer(value: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new BenchmarkValidationError('The raw answer is required.');
  }
  if (value.length > LIMITS.answer) {
    throw new BenchmarkValidationError(
      `The raw answer must be ${LIMITS.answer} characters or fewer.`,
    );
  }
  return value;
}

export function assertBoundedText(
  value: string | undefined | null,
  field: string,
  max: number,
): string | null {
  if (value == null || value.trim() === '') return null;
  if (value.length > max) {
    throw new BenchmarkValidationError(`${field} must be ${max} characters or fewer.`);
  }
  return value;
}

export function assertQueryCodes(codes: string[]): string[] {
  if (!Array.isArray(codes) || codes.length === 0) {
    throw new BenchmarkValidationError('Select at least one query.');
  }
  if (codes.length > 60) {
    throw new BenchmarkValidationError('A run can include at most the 60 fixed queries.');
  }
  const seen = new Set<string>();
  for (const code of codes) {
    if (!findQuery(code)) {
      throw new BenchmarkValidationError(`Unknown query id ${code}. Use the fixed bank Q001-Q060.`);
    }
    if (seen.has(code)) {
      throw new BenchmarkValidationError(`Query ${code} was included more than once.`);
    }
    seen.add(code);
  }
  return codes;
}

export function assertCostConfirmed(queryCount: number, confirmCost: boolean | undefined): void {
  if (queryCount < 1 || confirmCost !== true) {
    throw new BenchmarkValidationError(
      'Provider API runs call paid APIs, including a single query. Review the provider, model, and cost warning, then resubmit with confirmCost set to true. No request was sent.',
    );
  }
}

export function assertProvider(value: string): ProviderId {
  if (!isProvider(value)) {
    throw new BenchmarkValidationError('Provider must be gemini, perplexity, or doubao.');
  }
  return value;
}

export type ReviewFlags = {
  mention: boolean;
  identityCorrect: boolean;
  supplierCandidate: boolean;
  activeRecommendation: boolean;
  officialCitation: boolean;
  independentCitation: boolean;
  factualErrors: boolean;
};

export type ReviewInput = {
  reviewStatus: 'reviewed' | 'excluded' | 'needs_recheck';
  score?: number | null;
  rationale?: string | null;
  evaluator?: string | null;
} & Partial<ReviewFlags>;

export type NormalizedReview = {
  reviewStatus: 'reviewed' | 'excluded' | 'needs_recheck';
  score: number | null;
  rationale: string;
  evaluator: string;
  flags: ReviewFlags;
};

function requireBoolean(value: boolean | undefined, field: string): boolean {
  if (typeof value !== 'boolean') {
    throw new BenchmarkValidationError(`${field} is required.`);
  }
  return value;
}

export function normalizeReview(input: ReviewInput): NormalizedReview {
  const evaluator = assertRequiredRoleLabel(input.evaluator, 'Evaluator');
  const rationale = (input.rationale ?? '').trim();
  if (!rationale) {
    throw new BenchmarkValidationError('A scoring rationale is required.');
  }
  if (rationale.length > LIMITS.rationale) {
    throw new BenchmarkValidationError(
      `Rationale must be ${LIMITS.rationale} characters or fewer.`,
    );
  }

  if (input.reviewStatus === 'reviewed') {
    if (
      input.score == null ||
      !Number.isInteger(input.score) ||
      input.score < 0 ||
      input.score > 5
    ) {
      throw new BenchmarkValidationError(
        'A reviewed result needs an integer score from 0 through 5.',
      );
    }
    return {
      reviewStatus: 'reviewed',
      score: input.score,
      rationale,
      evaluator,
      flags: {
        mention: requireBoolean(input.mention, 'Mention'),
        identityCorrect: requireBoolean(input.identityCorrect, 'Identity correctness'),
        supplierCandidate: requireBoolean(input.supplierCandidate, 'Supplier candidate'),
        activeRecommendation: requireBoolean(input.activeRecommendation, 'Active recommendation'),
        officialCitation: requireBoolean(input.officialCitation, 'Official citation'),
        independentCitation: requireBoolean(input.independentCitation, 'Independent citation'),
        factualErrors: requireBoolean(input.factualErrors, 'Factual errors'),
      },
    };
  }

  if (input.reviewStatus !== 'excluded' && input.reviewStatus !== 'needs_recheck') {
    throw new BenchmarkValidationError(
      'Review status must be reviewed, excluded, or needs_recheck.',
    );
  }
  if (
    input.score != null &&
    (!Number.isInteger(input.score) || input.score < 0 || input.score > 5)
  ) {
    throw new BenchmarkValidationError('Score must be an integer from 0 through 5.');
  }
  return {
    reviewStatus: input.reviewStatus,
    score: input.score ?? null,
    rationale,
    evaluator,
    flags: {
      mention: input.mention === true,
      identityCorrect: input.identityCorrect === true,
      supplierCandidate: input.supplierCandidate === true,
      activeRecommendation: input.activeRecommendation === true,
      officialCitation: input.officialCitation === true,
      independentCitation: input.independentCitation === true,
      factualErrors: input.factualErrors === true,
    },
  };
}

export function rawAnswerLocked(reviewStatus: string): boolean {
  return reviewStatus === 'reviewed' || reviewStatus === 'excluded';
}

export function assertRawMutable(reviewStatus: string): void {
  if (rawAnswerLocked(reviewStatus)) {
    throw new BenchmarkValidationError(
      'The raw answer and citations are immutable after review. Create a correction to store a new version.',
    );
  }
}

export function parseFilterInstant(value: string, field: string): Date {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const normalized = dateOnly
    ? `${value}T${field === 'to' ? '23:59:59.999Z' : '00:00:00.000Z'}`
    : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    throw new BenchmarkValidationError(`${field} must be an ISO date.`);
  }
  return date;
}

export function capturedAtRange(
  from?: string,
  to?: string,
): { gte?: Date; lte?: Date } | undefined {
  if (!from && !to) return undefined;
  const range: { gte?: Date; lte?: Date } = {};
  if (from) range.gte = parseFilterInstant(from, 'from');
  if (to) range.lte = parseFilterInstant(to, 'to');
  return range;
}
