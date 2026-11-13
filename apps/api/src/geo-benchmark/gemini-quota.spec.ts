import { BadRequestException } from '@nestjs/common';
import { CreateApiRunDto, CreateCaptureDto } from './dto/geo-benchmark.dto';
import {
  assertNoQuotaSecrets,
  geminiQuotaResetAt,
  MemoryGeminiQuotaStore,
  PrismaGeminiQuotaStore,
  readGeminiMonthlyCap,
  utcMonthBucket,
} from './domain/gemini-quota';
import { GeoBenchmarkService } from './geo-benchmark.service';

const NOVEMBER = new Date('2026-11-30T23:59:59.999Z');
const DECEMBER = new Date('2026-12-01T00:00:00.000Z');
const KEY = 'gemini-test-key-value';

function codes(from: number, to: number): string[] {
  const list: string[] = [];
  for (let number = from; number <= to; number += 1) {
    list.push(`Q${String(number).padStart(3, '0')}`);
  }
  return list;
}

function runDto(queryCodes: string[], confirmCost = true): CreateApiRunDto {
  const dto = new CreateApiRunDto();
  dto.provider = 'gemini';
  dto.queryCodes = queryCodes;
  dto.confirmCost = confirmCost;
  dto.operatorLabel = 'geo-operator';
  return dto;
}

function harness(quota = new MemoryGeminiQuotaStore()) {
  const fetchImpl = jest.fn(async () => ({
    ok: true,
    status: 200,
    text: async () =>
      JSON.stringify({
        modelVersion: 'gemini-3.8-flash',
        candidates: [{ content: { parts: [{ text: 'API answer, not a consumer web capture.' }] } }],
      }),
  }));
  const prisma = {
    geoQuery: {
      upsert: jest.fn().mockResolvedValue({}),
      findMany: jest.fn(async (args?: { where?: { code?: { in?: string[] } } }) => {
        const selected = args?.where?.code?.in ?? [];
        return selected.map((code) => ({
          id: '00000000-0000-4000-8000-000000000001',
          code,
          text: `text ${code}`,
          category: 'manufacturer_discovery',
        }));
      }),
      findUnique: jest.fn().mockResolvedValue({
        id: '00000000-0000-4000-8000-000000000001',
        code: 'Q001',
      }),
    },
    geoRun: {
      create: jest.fn().mockResolvedValue({ id: '11111111-1111-4111-8111-111111111111' }),
      update: jest.fn(async () => ({ costAcknowledged: true })),
    },
    geoResult: { create: jest.fn() },
    geoAuditEvent: { create: jest.fn().mockResolvedValue({}) },
    $transaction: jest.fn(async (fn: (tx: Record<string, unknown>) => Promise<unknown>) =>
      fn({
        geoResult: {
          create: jest.fn().mockResolvedValue({
            id: '22222222-2222-4222-8222-222222222222',
            provider: 'gemini',
            mode: 'web_manual',
            origin: 'web_manual',
            version: 1,
            predecessorId: null,
            queryCode: 'Q001',
            queryText: 'Which companies manufacture smart rings in China?',
            category: 'manufacturer_discovery',
            modelLabel: null,
            capturedAt: new Date('2026-11-04T00:00:00.000Z'),
            locale: null,
            language: null,
            region: null,
            searchMode: null,
            notes: null,
            screenshotRef: null,
            captureStatus: 'complete',
            reviewStatus: 'pending',
            rawAnswer: 'Manual consumer web paste.',
            rawResponse: null,
            providerMetadata: { source: 'web_manual' },
            citations: [],
            review: null,
          }),
        },
        geoAuditEvent: { create: jest.fn().mockResolvedValue({}) },
        geoCitation: { deleteMany: jest.fn() },
      }),
    ),
  };
  return {
    fetchImpl,
    prisma,
    quota,
    service: new GeoBenchmarkService(prisma as never, quota),
  };
}

describe('Gemini monthly quota policy', () => {
  const previous = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
    GEMINI_MONTHLY_REQUEST_CAP: process.env.GEMINI_MONTHLY_REQUEST_CAP,
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,
  };

  beforeEach(() => {
    process.env.GEMINI_API_KEY = KEY;
    process.env.GEMINI_MODEL = 'gemini-3.8-flash';
    delete process.env.GEMINI_MONTHLY_REQUEST_CAP;
    delete process.env.PERPLEXITY_API_KEY;
  });

  afterEach(() => {
    for (const [name, value] of Object.entries(previous)) {
      if (value == null) delete process.env[name];
      else process.env[name] = value;
    }
  });

  it('uses UTC calendar months and resets at 00:00 UTC on the first day', () => {
    expect(utcMonthBucket(NOVEMBER)).toBe('2026-11');
    expect(utcMonthBucket(DECEMBER)).toBe('2026-12');
    expect(geminiQuotaResetAt(NOVEMBER).toISOString()).toBe('2026-12-01T00:00:00.000Z');
    expect(geminiQuotaResetAt(DECEMBER).toISOString()).toBe('2027-01-01T00:00:00.000Z');
    expect(readGeminiMonthlyCap({})).toBe(60);
  });

  it('accepts exactly 60 reservations and blocks the 61st without incrementing', async () => {
    const store = new MemoryGeminiQuotaStore();
    const accepted = [];
    for (let count = 0; count < 60; count += 1) {
      accepted.push(
        await store.reserve({
          now: NOVEMBER,
          cap: 60,
          model: 'gemini-3.8-flash',
          queryCode: `Q${String((count % 60) + 1).padStart(3, '0')}`,
          runId: null,
        }),
      );
    }
    const blocked = await store.reserve({
      now: NOVEMBER,
      cap: 60,
      model: 'gemini-3.8-flash',
      queryCode: 'Q001',
      runId: null,
    });
    expect(accepted.every((event) => !event.blocked)).toBe(true);
    expect(accepted[59].requestCount).toBe(60);
    expect(accepted[59].remaining).toBe(0);
    expect(blocked.blocked).toBe(true);
    expect(blocked.requestCount).toBe(60);
    expect(blocked.groundingEnabled).toBe(false);
    expect(blocked.blockReason).toMatch(/No provider request was sent/);
    const nextMonth = await store.reserve({
      now: DECEMBER,
      cap: 60,
      model: 'gemini-3.8-flash',
      queryCode: 'Q001',
      runId: null,
    });
    expect(nextMonth.blocked).toBe(false);
    expect(nextMonth.monthBucket).toBe('2026-12');
    expect(nextMonth.requestCount).toBe(1);
  });

  it('shares one atomic cap across concurrent reservations', async () => {
    const store = new MemoryGeminiQuotaStore();
    const results = await Promise.all(
      Array.from({ length: 80 }, (_, index) =>
        store.reserve({
          now: new Date('2026-11-15T00:00:00.000Z'),
          cap: 60,
          model: 'gemini-3.8-flash',
          queryCode: `Q${String((index % 60) + 1).padStart(3, '0')}`,
          runId: null,
        }),
      ),
    );
    const accepted = results
      .filter((event) => !event.blocked)
      .map((event) => event.requestCount)
      .sort((left, right) => left - right);
    expect(accepted).toEqual(Array.from({ length: 60 }, (_, index) => index + 1));
    expect(results.filter((event) => event.blocked)).toHaveLength(20);
    const snapshot = await store.snapshot(
      new Date('2026-11-15T00:00:00.000Z'),
      60,
      'gemini-3.8-flash',
    );
    expect(snapshot.used).toBe(60);
    expect(snapshot.remaining).toBe(0);
    expect(snapshot.clientCanRaiseCap).toBe(false);
    expect(snapshot.groundingEnabled).toBe(false);
  });

  it('lets the first 60 Gemini queries fetch and blocks the 61st before fetch', async () => {
    const { service, fetchImpl, quota } = harness();
    const first = await service.runApi(runDto(codes(1, 60)), fetchImpl, NOVEMBER);
    expect(first.status).toBe('completed');
    expect(fetchImpl).toHaveBeenCalledTimes(60);
    const second = await service.runApi(runDto(['Q001']), fetchImpl, NOVEMBER);
    expect(fetchImpl).toHaveBeenCalledTimes(60);
    expect(second.status).toBe('failed');
    expect(second.failures[0].message).toMatch(/No provider request was sent/);
    expect(second.geminiQuota).toMatchObject({
      used: 60,
      remaining: 0,
      cap: 60,
      monthBucket: '2026-11',
      resetAt: '2026-12-01T00:00:00.000Z',
      groundingEnabled: false,
    });
    expect(quota.events.some((event) => event.blocked && event.queryCode === 'Q001')).toBe(true);
    assertNoQuotaSecrets(quota.events, [KEY]);
  });

  it('rolls the shared counter over at 00:00 UTC on the first day', async () => {
    process.env.GEMINI_MONTHLY_REQUEST_CAP = '1';
    const { service, fetchImpl } = harness();
    await service.runApi(runDto(['Q001']), fetchImpl, NOVEMBER);
    const blocked = await service.runApi(runDto(['Q002']), fetchImpl, NOVEMBER);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(blocked.failures[0].message).toMatch(/cap of 1/);
    const rolled = await service.runApi(runDto(['Q003']), fetchImpl, DECEMBER);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(rolled.status).toBe('completed');
    expect(rolled.geminiQuota?.monthBucket).toBe('2026-12');
    expect(rolled.geminiQuota?.used).toBe(1);
  });

  it('stops a batch at the shared cap and does not let the rest bypass it', async () => {
    process.env.GEMINI_MONTHLY_REQUEST_CAP = '4';
    const { service, fetchImpl, quota } = harness();
    const batch = await service.runApi(runDto(codes(1, 8)), fetchImpl, NOVEMBER);
    expect(fetchImpl).toHaveBeenCalledTimes(4);
    expect(batch.resultIds).toHaveLength(4);
    expect(batch.failures.map((failure) => failure.queryCode)).toEqual([
      'Q005',
      'Q006',
      'Q007',
      'Q008',
    ]);
    expect(batch.status).toBe('partial');
    expect(quota.events.filter((event) => !event.blocked)).toHaveLength(4);
    expect(quota.events.filter((event) => event.blocked)).toHaveLength(4);
    const followUp = await service.runApi(runDto(['Q009']), fetchImpl, NOVEMBER);
    expect(fetchImpl).toHaveBeenCalledTimes(4);
    expect(followUp.failures[0].message).toMatch(/No provider request was sent/);
  });

  it('keeps a failed request on the cap so a retry cannot fetch again', async () => {
    process.env.GEMINI_MONTHLY_REQUEST_CAP = '1';
    const { service, fetchImpl, quota } = harness();
    fetchImpl.mockRejectedValueOnce(new Error('socket hang up'));
    const failed = await service.runApi(runDto(['Q001']), fetchImpl, NOVEMBER);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(failed.status).toBe('failed');
    expect(quota.events).toHaveLength(1);
    expect(quota.events[0].blocked).toBe(false);
    const retry = await service.runApi(runDto(['Q001']), fetchImpl, NOVEMBER);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(retry.failures[0].message).toMatch(/No provider request was sent/);
    expect(quota.events).toHaveLength(2);
    expect(quota.events[1].blocked).toBe(true);
  });

  it('does not fetch or reserve quota when confirmCost is missing', async () => {
    const { service, fetchImpl, quota, prisma } = harness();
    await expect(
      service.runApi(runDto(['Q001'], false), fetchImpl, NOVEMBER),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(quota.events).toHaveLength(0);
    expect(prisma.geoRun.create).not.toHaveBeenCalled();
  });

  it('ignores a client cap and keeps grounding disabled on every event', async () => {
    process.env.GEMINI_MONTHLY_REQUEST_CAP = '1';
    const { service, fetchImpl, quota } = harness();
    const dto = runDto(codes(1, 2));
    (dto as CreateApiRunDto & { monthlyCap?: number }).monthlyCap = 1000;
    const result = await service.runApi(dto, fetchImpl, NOVEMBER);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(result.failures).toHaveLength(1);
    expect(quota.events.every((event) => event.groundingEnabled === false)).toBe(true);
    expect(JSON.stringify(quota.events)).not.toContain(KEY);
    expect(JSON.stringify(fetchImpl.mock.calls)).not.toMatch(/google_search|"tools"/);
  });

  it('does not consume Gemini quota for another provider or a consumer-web capture', async () => {
    process.env.PERPLEXITY_API_KEY = 'pplx-test-key-value';
    const { service, fetchImpl, quota } = harness();
    const perplexity = runDto(['Q001']);
    perplexity.provider = 'perplexity';
    fetchImpl.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => '{"error":"no"}',
    });
    await service.runApi(perplexity, fetchImpl, NOVEMBER);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(quota.events).toHaveLength(0);

    const capture = new CreateCaptureDto();
    capture.provider = 'gemini';
    capture.queryCode = 'Q001';
    capture.rawAnswer = 'Manual consumer web paste.';
    capture.operatorLabel = 'geo-operator';
    const saved = await service.createCapture(capture);
    expect(saved.mode).toBe('web_manual');
    expect(saved.origin).toBe('web_manual');
    expect(quota.events).toHaveLength(0);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('rejects an invalid server cap before fetch', async () => {
    process.env.GEMINI_MONTHLY_REQUEST_CAP = 'nope';
    const { service, fetchImpl, quota } = harness();
    await expect(service.runApi(runDto(['Q001']), fetchImpl, NOVEMBER)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(quota.events).toHaveLength(0);
  });

  it('treats an empty conditional update as a block and keeps concurrent reservations on one counter', async () => {
    let used = 0;
    const events: Array<Record<string, unknown>> = [];
    const tx = {
      $executeRaw: jest.fn(async () => 1),
      $queryRaw: jest.fn(async (strings: TemplateStringsArray, ...values: unknown[]) => {
        const sql = strings.join(' ');
        if (sql.includes('UPDATE')) {
          const cap = values.find((value) => typeof value === 'number');
          if (typeof cap === 'number' && used < cap) {
            used += 1;
            return [{ used_count: used }];
          }
          return [];
        }
        return [{ used_count: used }];
      }),
      geoGeminiQuotaEvent: {
        create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
          events.push(data);
          return data;
        }),
      },
    };
    const prisma = {
      $transaction: async (fn: (client: typeof tx) => Promise<unknown>) => fn(tx),
      $queryRaw: tx.$queryRaw,
    };
    const store = new PrismaGeminiQuotaStore(prisma as never);
    const results = await Promise.all(
      Array.from({ length: 80 }, (_, index) =>
        store.reserve({
          now: new Date('2026-11-15T00:00:00.000Z'),
          cap: 60,
          model: 'gemini-3.8-flash',
          queryCode: `Q${String((index % 60) + 1).padStart(3, '0')}`,
          runId: null,
        }),
      ),
    );
    expect(results.filter((event) => !event.blocked)).toHaveLength(60);
    expect(results.filter((event) => event.blocked)).toHaveLength(20);
    expect(events).toHaveLength(80);
    expect(events.every((event) => event.groundingEnabled === false)).toBe(true);
    expect(events.some((event) => event.blockReason)).toBe(true);
    expect(JSON.stringify(events)).not.toContain(KEY);
    const updateSql = tx.$queryRaw.mock.calls
      .map((call) => (call[0] as TemplateStringsArray).join(' '))
      .find((sql) => sql.includes('UPDATE'));
    expect(updateSql).toContain('"used_count" <');
    const snapshot = await store.snapshot(
      new Date('2026-11-15T00:00:00.000Z'),
      60,
      'gemini-3.8-flash',
    );
    expect(snapshot).toMatchObject({ used: 60, remaining: 0, clientCanRaiseCap: false });
  });

  it('lets two batches share one counter when they run together', async () => {
    const quota = new MemoryGeminiQuotaStore();
    const first = harness(quota);
    const second = harness(quota);
    const [left, right] = await Promise.all([
      first.service.runApi(runDto(codes(1, 40)), first.fetchImpl, NOVEMBER),
      second.service.runApi(runDto(codes(21, 60)), second.fetchImpl, NOVEMBER),
    ]);
    const fetches = first.fetchImpl.mock.calls.length + second.fetchImpl.mock.calls.length;
    expect(fetches).toBe(60);
    expect(left.resultIds.length + right.resultIds.length).toBe(60);
    expect(left.failures.length + right.failures.length).toBe(20);
    expect(quota.events.filter((event) => !event.blocked)).toHaveLength(60);
    const snapshot = await quota.snapshot(NOVEMBER, 60, 'gemini-3.8-flash');
    expect(snapshot.used).toBe(60);
    expect(snapshot.remaining).toBe(0);
  });
});
