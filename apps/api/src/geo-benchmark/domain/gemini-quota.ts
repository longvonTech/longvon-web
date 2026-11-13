import type { PrismaService } from '../../database/prisma.service';
import { collectSecretValues, redactString } from './redact';
import { BenchmarkValidationError } from './validation';

/** Default shared cap for Gemini official API requests. The admin UI cannot raise it. */
export const DEFAULT_GEMINI_MONTHLY_CAP = 60;
export const MAX_GEMINI_MONTHLY_CAP = 100_000;

/**
 * Standard generateContent models whose token price is "Free of charge" on the
 * Gemini API pricing page checked 2026-11-04:
 * https://ai.google.dev/gemini-api/docs/pricing
 * This is a server allowlist, not a live billing check.
 */
export const GEMINI_FREE_TIER_MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash-lite'] as const;

export const GEMINI_BILLING_NOTE =
  'This application cap cannot guarantee a $0 Google bill. Free-tier eligibility is controlled by Google. This app does not read the Google project billing state.';

export const GEMINI_GROUNDING_NOTE =
  'Google Search grounding is disabled. The Gemini API pricing page lists Grounding with Google Search as not available on the free tier for gemini-3.8-flash, and this app cannot verify free-tier eligibility for the configured Google project. No grounding tool is sent.';

export type GeminiQuotaEvent = {
  provider: 'gemini';
  model: string;
  monthBucket: string;
  requestCount: number;
  remaining: number;
  cap: number;
  groundingEnabled: false;
  blocked: boolean;
  blockReason: string | null;
  resetAt: string;
  recordedAt: string;
  queryCode: string | null;
};

export type GeminiQuotaSnapshot = {
  provider: 'gemini';
  model: string | null;
  monthBucket: string;
  used: number;
  remaining: number;
  cap: number;
  resetAt: string;
  groundingEnabled: false;
  groundingNote: string;
  billingNote: string;
  clientCanRaiseCap: false;
  measures: 'api_behavior_not_consumer_geo';
};

export type GeminiQuotaReserveInput = {
  now: Date;
  cap: number;
  model: string;
  queryCode: string | null;
  runId: string | null;
};

export interface GeminiQuotaStore {
  reserve(input: GeminiQuotaReserveInput): Promise<GeminiQuotaEvent>;
  snapshot(now: Date, cap: number, model: string | null): Promise<GeminiQuotaSnapshot>;
}

export function isGeminiFreeTierModel(model: string): boolean {
  return (GEMINI_FREE_TIER_MODELS as readonly string[]).includes(model);
}

export function utcMonthBucket(date: Date): string {
  assertClock(date);
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${date.getUTCFullYear()}-${month}`;
}

/** 00:00 UTC on the first day of the next calendar month. */
export function geminiQuotaResetAt(date: Date): Date {
  assertClock(date);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1, 0, 0, 0, 0));
}

export function readGeminiMonthlyCap(env: NodeJS.ProcessEnv = process.env): number {
  const raw = env.GEMINI_MONTHLY_REQUEST_CAP;
  if (raw == null || raw.trim() === '') return DEFAULT_GEMINI_MONTHLY_CAP;
  if (!/^[0-9]+$/.test(raw.trim())) {
    throw new BenchmarkValidationError(
      'GEMINI_MONTHLY_REQUEST_CAP must be a non-negative integer in the server environment. The admin UI cannot set it. No request was sent.',
    );
  }
  const value = Number(raw.trim());
  if (!Number.isSafeInteger(value) || value > MAX_GEMINI_MONTHLY_CAP) {
    throw new BenchmarkValidationError(
      'GEMINI_MONTHLY_REQUEST_CAP is above the server maximum. No request was sent.',
    );
  }
  return value;
}

export function geminiCapBlockReason(cap: number, resetAt: string): string {
  return `Gemini monthly request cap of ${cap} is reached. No provider request was sent. The counter resets at ${resetAt} (00:00 UTC on the first day of the next calendar month). There is no automatic top-up or paid overage.`;
}

function assertClock(date: Date): void {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new BenchmarkValidationError('Quota clock is invalid. No request was sent.');
  }
}

function assertCap(cap: number): void {
  if (!Number.isInteger(cap) || cap < 0 || cap > MAX_GEMINI_MONTHLY_CAP) {
    throw new BenchmarkValidationError('Gemini monthly cap is invalid. No request was sent.');
  }
}

function safeLabel(value: string): string {
  return redactString(value, collectSecretValues()).slice(0, 200);
}

function decision(
  input: GeminiQuotaReserveInput,
  usedAfter: number,
  blocked: boolean,
): GeminiQuotaEvent {
  const resetAt = geminiQuotaResetAt(input.now).toISOString();
  const requestCount = usedAfter;
  return {
    provider: 'gemini',
    model: safeLabel(input.model),
    monthBucket: utcMonthBucket(input.now),
    requestCount,
    remaining: Math.max(0, input.cap - requestCount),
    cap: input.cap,
    groundingEnabled: false,
    blocked,
    blockReason: blocked ? geminiCapBlockReason(input.cap, resetAt) : null,
    resetAt,
    recordedAt: input.now.toISOString(),
    queryCode: input.queryCode,
  };
}

function snapshotOf(
  now: Date,
  cap: number,
  model: string | null,
  used: number,
): GeminiQuotaSnapshot {
  return {
    provider: 'gemini',
    model: model ? safeLabel(model) : null,
    monthBucket: utcMonthBucket(now),
    used,
    remaining: Math.max(0, cap - used),
    cap,
    resetAt: geminiQuotaResetAt(now).toISOString(),
    groundingEnabled: false,
    groundingNote: GEMINI_GROUNDING_NOTE,
    billingNote: GEMINI_BILLING_NOTE,
    clientCanRaiseCap: false,
    measures: 'api_behavior_not_consumer_geo',
  };
}

/**
 * In-process counter with a promise chain so overlapping reserve() calls share
 * one cap. Production uses PrismaGeminiQuotaStore; this store is the test double
 * for the same reserve-before-fetch rules.
 */
export class MemoryGeminiQuotaStore implements GeminiQuotaStore {
  readonly events: GeminiQuotaEvent[] = [];
  private readonly used = new Map<string, number>();
  private chain: Promise<unknown> = Promise.resolve();

  reserve(input: GeminiQuotaReserveInput): Promise<GeminiQuotaEvent> {
    const task = this.chain.then(() => this.apply(input));
    this.chain = task.then(
      () => undefined,
      () => undefined,
    );
    return task;
  }

  snapshot(now: Date, cap: number, model: string | null): Promise<GeminiQuotaSnapshot> {
    assertCap(cap);
    const used = this.used.get(utcMonthBucket(now)) ?? 0;
    return Promise.resolve(snapshotOf(now, cap, model, used));
  }

  private apply(input: GeminiQuotaReserveInput): GeminiQuotaEvent {
    assertClock(input.now);
    assertCap(input.cap);
    const bucket = utcMonthBucket(input.now);
    const current = this.used.get(bucket) ?? 0;
    const blocked = current >= input.cap;
    const usedAfter = blocked ? current : current + 1;
    if (!blocked) this.used.set(bucket, usedAfter);
    const event = decision(input, usedAfter, blocked);
    this.events.push(event);
    return event;
  }
}

type QuotaCountRow = { used_count: number | bigint };

function asCount(value: number | bigint | undefined): number {
  const count = typeof value === 'bigint' ? Number(value) : (value ?? 0);
  if (!Number.isSafeInteger(count)) {
    throw new BenchmarkValidationError('Gemini quota counter is unreadable. No request was sent.');
  }
  return count;
}

/**
 * One conditional UPDATE reserves a single Gemini request.
 * PostgreSQL locks the month row, so two transactions cannot both pass
 * `used_count < cap` for the last remaining slot. A failed provider call is
 * not refunded, and nothing in this store retries the provider.
 */
export class PrismaGeminiQuotaStore implements GeminiQuotaStore {
  constructor(private readonly prisma: PrismaService) {}

  async reserve(input: GeminiQuotaReserveInput): Promise<GeminiQuotaEvent> {
    assertClock(input.now);
    assertCap(input.cap);
    const monthBucket = utcMonthBucket(input.now);
    const event = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        INSERT INTO "growth"."geo_gemini_quota_months" ("month_bucket", "used_count", "updated_at")
        VALUES (${monthBucket}, 0, CURRENT_TIMESTAMP)
        ON CONFLICT ("month_bucket") DO NOTHING
      `;
      const updated = await tx.$queryRaw<QuotaCountRow[]>`
        UPDATE "growth"."geo_gemini_quota_months"
        SET "used_count" = "used_count" + 1,
            "updated_at" = CURRENT_TIMESTAMP
        WHERE "month_bucket" = ${monthBucket}
          AND "used_count" < ${input.cap}
        RETURNING "used_count"
      `;
      const blocked = updated.length === 0;
      let requestCount: number;
      if (blocked) {
        const rows = await tx.$queryRaw<QuotaCountRow[]>`
          SELECT "used_count" FROM "growth"."geo_gemini_quota_months"
          WHERE "month_bucket" = ${monthBucket}
        `;
        requestCount = asCount(rows[0]?.used_count);
      } else {
        requestCount = asCount(updated[0]?.used_count);
      }
      const reserved = decision(input, requestCount, blocked);
      await tx.geoGeminiQuotaEvent.create({
        data: {
          provider: 'gemini',
          model: reserved.model,
          monthBucket: reserved.monthBucket,
          requestCount: reserved.requestCount,
          groundingEnabled: false,
          blocked: reserved.blocked,
          blockReason: reserved.blockReason,
          queryCode: input.queryCode,
          runId: input.runId,
        },
      });
      return reserved;
    });
    return event;
  }

  async snapshot(now: Date, cap: number, model: string | null): Promise<GeminiQuotaSnapshot> {
    assertCap(cap);
    const monthBucket = utcMonthBucket(now);
    const rows = await this.prisma.$queryRaw<QuotaCountRow[]>`
      SELECT "used_count" FROM "growth"."geo_gemini_quota_months"
      WHERE "month_bucket" = ${monthBucket}
    `;
    return snapshotOf(now, cap, model, asCount(rows[0]?.used_count));
  }
}

export function assertNoQuotaSecrets(value: unknown, secrets: string[]): void {
  const rendered = JSON.stringify(value);
  for (const secret of secrets) {
    if (secret && rendered.includes(secret)) {
      throw new Error('Quota record included a secret value.');
    }
  }
}
