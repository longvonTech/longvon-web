import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@mateyou/database';
import { PrismaService } from '../database/prisma.service';
import {
  executeProviderCall,
  listProviderReadiness,
  ProviderHttpError,
  ProviderNotReadyError,
  providerReadiness,
  type FetchLike,
} from './adapters/provider-adapters';
import { buildMetrics, type ScoredResultRow } from './domain/aggregation';
import {
  PrismaGeminiQuotaStore,
  readGeminiMonthlyCap,
  type GeminiQuotaSnapshot,
  type GeminiQuotaStore,
} from './domain/gemini-quota';
import {
  sanitizeExportDocument,
  toCsv,
  type ExportAudit,
  type ExportDocument,
  type ExportResult,
} from './domain/export';
import { collectSecretValues, redactJson, redactString, truncateText } from './domain/redact';
import {
  assertCostConfirmed,
  assertBoundedText,
  assertProvider,
  assertQueryCodes,
  assertRawAnswer,
  assertRawMutable,
  assertRoleLabel,
  assertScreenshotRef,
  BenchmarkValidationError,
  capturedAtRange,
  normalizeCitations,
  normalizeReview,
  rawAnswerLocked,
  type CitationInput,
} from './domain/validation';
import { pickLatestVersion } from './domain/versions';
import {
  CATEGORIES,
  findQuery,
  GEO_BENCHMARK_ID,
  GEO_QUERY_BANK,
  isMode,
  isReviewStatus,
  SCORE_RUBRIC,
  type BenchmarkMode,
} from './query-bank';
import {
  CorrectionDto,
  CreateApiRunDto,
  CreateCaptureDto,
  ReviewResultDto,
  UpdateCaptureDto,
} from './dto/geo-benchmark.dto';

const resultInclude = {
  citations: { orderBy: { position: 'asc' as const } },
  review: true,
} satisfies Prisma.GeoResultInclude;

type StoredResult = Prisma.GeoResultGetPayload<{ include: typeof resultInclude }>;

export type ResultFilters = {
  provider?: string;
  mode?: string;
  category?: string;
  status?: string;
  queryCode?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

@Injectable()
export class GeoBenchmarkService {
  private bankReady: Promise<void> | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiQuotaStore: GeminiQuotaStore = new PrismaGeminiQuotaStore(prisma),
  ) {}

  providerStatus() {
    return {
      benchmark: GEO_BENCHMARK_ID,
      rubric: SCORE_RUBRIC,
      providers: listProviderReadiness(),
      access: 'admin-token',
    };
  }

  async geminiQuota(now = new Date()): Promise<GeminiQuotaSnapshot> {
    try {
      const readiness = providerReadiness('gemini');
      return await this.geminiQuotaStore.snapshot(
        now,
        readGeminiMonthlyCap(process.env),
        readiness.model,
      );
    } catch (error) {
      this.rethrow(error);
    }
  }

  async listQueries() {
    await this.ensureQueries();
    const queries = await this.prisma.geoQuery.findMany({ orderBy: { sortOrder: 'asc' } });
    return { benchmark: GEO_BENCHMARK_ID, total: queries.length, queries };
  }

  async coverage(filters: ResultFilters) {
    try {
      await this.ensureQueries();
      const provider = filters.provider ? assertProvider(filters.provider) : undefined;
      const mode = this.readMode(filters.mode);
      if (!provider || !mode) {
        throw new BenchmarkValidationError(
          'Coverage requires both provider and mode so API and web_manual stay separate.',
        );
      }
      const capturedAt = capturedAtRange(filters.from, filters.to);
      const results = await this.prisma.geoResult.findMany({
        where: {
          provider,
          mode,
          ...(filters.category ? { category: this.readCategory(filters.category) } : {}),
          ...(capturedAt ? { capturedAt } : {}),
        },
        include: { review: true, citations: { select: { id: true } } },
        orderBy: [{ queryCode: 'asc' }, { version: 'desc' }, { capturedAt: 'desc' }],
      });
      const universe = GEO_QUERY_BANK.filter(
        (item) => !filters.category || item.category === filters.category,
      );
      return {
        provider,
        mode,
        queries: universe.map((query) => {
          const versions = results.filter((item) => item.queryCode === query.code);
          const latest = pickLatestVersion(versions);
          const scored = pickLatestVersion(
            versions.filter(
              (item) =>
                item.reviewStatus === 'reviewed' &&
                item.captureStatus === 'complete' &&
                item.review?.score != null,
            ),
          );
          return {
            code: query.code,
            category: query.category,
            categoryLabel: query.categoryLabel,
            text: query.text,
            latest: latest ? this.summary(latest) : null,
            scored: scored ? this.summary(scored) : null,
          };
        }),
      };
    } catch (error) {
      this.rethrow(error);
    }
  }

  async metrics(filters: ResultFilters) {
    try {
      await this.ensureQueries();
      const where = this.buildWhere({ ...filters, status: undefined });
      const rows = await this.prisma.geoResult.findMany({
        where,
        select: {
          provider: true,
          mode: true,
          queryCode: true,
          category: true,
          version: true,
          reviewStatus: true,
          captureStatus: true,
          review: {
            select: {
              score: true,
              mention: true,
              identityCorrect: true,
              supplierCandidate: true,
              activeRecommendation: true,
              officialCitation: true,
              independentCitation: true,
              factualErrors: true,
            },
          },
        },
      });
      const scored: ScoredResultRow[] = rows.map((row) => ({
        provider: row.provider,
        mode: row.mode,
        queryCode: row.queryCode,
        category: row.category,
        version: row.version,
        reviewStatus: row.reviewStatus,
        captureStatus: row.captureStatus,
        score: row.review?.score ?? null,
        mention: row.review?.mention ?? false,
        identityCorrect: row.review?.identityCorrect ?? false,
        supplierCandidate: row.review?.supplierCandidate ?? false,
        activeRecommendation: row.review?.activeRecommendation ?? false,
        officialCitation: row.review?.officialCitation ?? false,
        independentCitation: row.review?.independentCitation ?? false,
        factualErrors: row.review?.factualErrors ?? false,
      }));
      return buildMetrics({
        rows: scored,
        mode: filters.mode ? this.readMode(filters.mode) : null,
        provider: filters.provider ? assertProvider(filters.provider) : null,
        category: filters.category ? this.readCategory(filters.category) : null,
      });
    } catch (error) {
      this.rethrow(error);
    }
  }

  async listResults(filters: ResultFilters) {
    await this.ensureQueries();
    const where = this.buildWhere(filters);
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20));
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.geoResult.count({ where }),
      this.prisma.geoResult.findMany({
        where,
        include: resultInclude,
        orderBy: [{ capturedAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return {
      page,
      pageSize,
      total,
      results: rows.map((row) => this.present(row)),
    };
  }

  async getResult(id: string) {
    const result = await this.requireResult(id);
    const history = await this.prisma.geoResult.findMany({
      where: { provider: result.provider, mode: result.mode, queryCode: result.queryCode },
      select: {
        id: true,
        version: true,
        reviewStatus: true,
        captureStatus: true,
        capturedAt: true,
      },
      orderBy: { version: 'asc' },
    });
    const audit = await this.prisma.geoAuditEvent.findMany({
      where: { entityType: 'geo_result', entityId: id },
      orderBy: { createdAt: 'asc' },
    });
    return { ...this.present(result), history, audit };
  }

  async createCapture(dto: CreateCaptureDto) {
    try {
      const provider = assertProvider(dto.provider);
      const query = this.requireQuery(dto.queryCode);
      const captureStatus = dto.captureStatus ?? 'complete';
      const rawAnswer =
        captureStatus === 'draft' && dto.rawAnswer.trim() === ''
          ? ''
          : assertRawAnswer(dto.rawAnswer);
      const citations = normalizeCitations(dto.citations);
      const operator = assertRoleLabel(dto.operatorLabel, 'Operator');
      await this.ensureQueries();
      const storedQuery = await this.prisma.geoQuery.findUnique({ where: { code: query.code } });
      if (!storedQuery) throw new NotFoundException('Query bank is unavailable.');
      const created = await this.prisma.$transaction(async (tx) => {
        const result = await tx.geoResult.create({
          data: {
            queryId: storedQuery.id,
            provider,
            mode: 'web_manual',
            origin: 'web_manual',
            version: 1,
            modelLabel: assertBoundedText(dto.modelLabel, 'Model label', 120),
            queryCode: query.code,
            queryText: query.text,
            category: query.category,
            capturedAt: new Date(),
            locale: assertBoundedText(dto.locale, 'Locale', 120),
            language: assertBoundedText(dto.language, 'Language', 120),
            region: assertBoundedText(dto.region, 'Region', 120),
            searchMode: assertBoundedText(dto.searchMode, 'Search mode', 120),
            notes: assertBoundedText(dto.notes, 'Notes', 4000),
            screenshotRef: assertScreenshotRef(dto.screenshotRef),
            rawAnswer,
            providerMetadata: {
              source: 'web_manual',
              note: 'Human capture from the official consumer web UI. Not an API response.',
            },
            captureStatus,
            reviewStatus: 'pending',
            citations: {
              create: citations.map((citation, index) => ({
                position: index + 1,
                title: citation.title,
                url: citation.url,
                snippet: citation.snippet,
              })),
            },
          },
          include: resultInclude,
        });
        await this.writeAudit(tx, 'create', result.id, operator, {
          provider,
          mode: 'web_manual',
          queryCode: query.code,
          captureStatus,
          citationCount: citations.length,
        });
        return result;
      });
      return this.present(created);
    } catch (error) {
      this.rethrow(error);
    }
  }

  async updateCapture(id: string, dto: UpdateCaptureDto) {
    try {
      const existing = await this.requireResult(id);
      assertRawMutable(existing.reviewStatus);
      const operator = assertRoleLabel(dto.operatorLabel, 'Operator');
      const rawAnswer =
        dto.rawAnswer == null
          ? undefined
          : dto.captureStatus === 'draft' && dto.rawAnswer.trim() === ''
            ? ''
            : assertRawAnswer(dto.rawAnswer);
      const citations = dto.citations == null ? undefined : normalizeCitations(dto.citations);
      const updated = await this.prisma.$transaction(async (tx) => {
        if (citations) {
          await tx.geoCitation.deleteMany({ where: { resultId: id } });
        }
        const result = await tx.geoResult.update({
          where: { id },
          data: {
            rawAnswer,
            modelLabel:
              dto.modelLabel === undefined
                ? undefined
                : assertBoundedText(dto.modelLabel, 'Model label', 120),
            locale:
              dto.locale === undefined ? undefined : assertBoundedText(dto.locale, 'Locale', 120),
            language:
              dto.language === undefined
                ? undefined
                : assertBoundedText(dto.language, 'Language', 120),
            region:
              dto.region === undefined ? undefined : assertBoundedText(dto.region, 'Region', 120),
            searchMode:
              dto.searchMode === undefined
                ? undefined
                : assertBoundedText(dto.searchMode, 'Search mode', 120),
            notes:
              dto.notes === undefined ? undefined : assertBoundedText(dto.notes, 'Notes', 4000),
            screenshotRef:
              dto.screenshotRef === undefined ? undefined : assertScreenshotRef(dto.screenshotRef),
            captureStatus: dto.captureStatus,
            reviewStatus: 'pending',
            ...(citations
              ? {
                  citations: {
                    create: citations.map((citation, index) => ({
                      position: index + 1,
                      title: citation.title,
                      url: citation.url,
                      snippet: citation.snippet,
                    })),
                  },
                }
              : {}),
          },
          include: resultInclude,
        });
        await this.writeAudit(tx, 'edit', id, operator, {
          fields: Object.keys(dto).filter((key) => key !== 'operatorLabel'),
          queryCode: existing.queryCode,
          provider: existing.provider,
          mode: existing.mode,
        });
        return result;
      });
      return this.present(updated);
    } catch (error) {
      this.rethrow(error);
    }
  }

  async correct(id: string, dto: CorrectionDto) {
    try {
      const existing = await this.requireResult(id);
      if (!rawAnswerLocked(existing.reviewStatus)) {
        throw new BenchmarkValidationError(
          'This result can still be edited. Create a correction only after review or exclusion.',
        );
      }
      const rawAnswer = assertRawAnswer(dto.rawAnswer);
      const citations = normalizeCitations(dto.citations ?? this.citationsOf(existing));
      const operator = assertRoleLabel(dto.operatorLabel, 'Operator');
      const captureStatus = dto.captureStatus ?? 'complete';
      const created = await this.prisma.$transaction(async (tx) => {
        const result = await tx.geoResult.create({
          data: {
            queryId: existing.queryId,
            provider: existing.provider,
            mode: existing.mode,
            origin: existing.origin,
            version: existing.version + 1,
            predecessorId: existing.id,
            modelLabel:
              dto.modelLabel === undefined
                ? existing.modelLabel
                : assertBoundedText(dto.modelLabel, 'Model label', 120),
            queryCode: existing.queryCode,
            queryText: existing.queryText,
            category: existing.category,
            capturedAt: new Date(),
            locale:
              dto.locale === undefined
                ? existing.locale
                : assertBoundedText(dto.locale, 'Locale', 120),
            language:
              dto.language === undefined
                ? existing.language
                : assertBoundedText(dto.language, 'Language', 120),
            region:
              dto.region === undefined
                ? existing.region
                : assertBoundedText(dto.region, 'Region', 120),
            searchMode:
              dto.searchMode === undefined
                ? existing.searchMode
                : assertBoundedText(dto.searchMode, 'Search mode', 120),
            notes:
              dto.notes === undefined
                ? existing.notes
                : assertBoundedText(dto.notes, 'Notes', 4000),
            screenshotRef:
              dto.screenshotRef === undefined
                ? existing.screenshotRef
                : assertScreenshotRef(dto.screenshotRef),
            rawAnswer,
            rawResponse: existing.rawResponse ?? undefined,
            providerMetadata: this.json(existing.providerMetadata) ?? undefined,
            captureStatus,
            reviewStatus: 'pending',
            citations: {
              create: citations.map((citation, index) => ({
                position: index + 1,
                title: citation.title,
                url: citation.url,
                snippet: citation.snippet,
              })),
            },
          },
          include: resultInclude,
        });
        await this.writeAudit(tx, 'edit', result.id, operator, {
          correctionOf: existing.id,
          previousVersion: existing.version,
          queryCode: existing.queryCode,
          provider: existing.provider,
          mode: existing.mode,
        });
        return result;
      });
      return this.present(created);
    } catch (error) {
      this.rethrow(error);
    }
  }

  async review(id: string, dto: ReviewResultDto) {
    try {
      const existing = await this.requireResult(id);
      const normalized = normalizeReview(dto);
      if (normalized.reviewStatus === 'reviewed' && existing.captureStatus !== 'complete') {
        throw new BenchmarkValidationError(
          'Draft captures are excluded from scored metrics. Mark the capture complete before review.',
        );
      }
      const reviewedAt = new Date();
      const updated = await this.prisma.$transaction(async (tx) => {
        await tx.geoReview.upsert({
          where: { resultId: id },
          create: {
            resultId: id,
            score: normalized.score,
            ...normalized.flags,
            rationale: normalized.rationale,
            evaluator: normalized.evaluator,
            reviewedAt,
          },
          update: {
            score: normalized.score,
            ...normalized.flags,
            rationale: normalized.rationale,
            evaluator: normalized.evaluator,
            reviewedAt,
          },
        });
        const result = await tx.geoResult.update({
          where: { id },
          data: { reviewStatus: normalized.reviewStatus },
          include: resultInclude,
        });
        await this.writeAudit(
          tx,
          normalized.reviewStatus === 'excluded' ? 'exclude' : 'review',
          id,
          normalized.evaluator,
          {
            reviewStatus: normalized.reviewStatus,
            score: normalized.score,
            queryCode: existing.queryCode,
            provider: existing.provider,
            mode: existing.mode,
          },
        );
        return result;
      });
      return this.present(updated);
    } catch (error) {
      this.rethrow(error);
    }
  }

  async runApi(
    dto: CreateApiRunDto,
    fetchImpl: FetchLike = globalThis.fetch as unknown as FetchLike,
    now: Date = new Date(),
  ) {
    try {
      const provider = assertProvider(dto.provider);
      const queryCodes = assertQueryCodes(dto.queryCodes);
      // Reject before readiness checks, quota reservation, database writes, and any provider fetch.
      assertCostConfirmed(queryCodes.length, dto.confirmCost);
      const readiness = providerReadiness(provider);
      if (!readiness.ready)
        throw new ProviderNotReadyError(readiness.setupMessage ?? 'Provider is not configured.');
      const geminiCap = provider === 'gemini' ? readGeminiMonthlyCap(process.env) : null;
      const operator = assertRoleLabel(dto.operatorLabel, 'Operator');
      await this.ensureQueries();
      const queries = await this.prisma.geoQuery.findMany({ where: { code: { in: queryCodes } } });
      const byCode = new Map(queries.map((query) => [query.code, query]));
      const run = await this.prisma.geoRun.create({
        data: {
          provider,
          mode: 'api',
          trigger: queryCodes.length > 1 ? 'batch' : 'single',
          status: 'running',
          modelLabel: readiness.model,
          locale: assertBoundedText(dto.locale, 'Locale', 120),
          language: assertBoundedText(dto.language, 'Language', 120),
          operatorLabel: operator,
          costAcknowledged: dto.confirmCost === true,
          queryCount: queryCodes.length,
          metadata: {
            benchmark: GEO_BENCHMARK_ID,
            note: 'API behavior only. Not consumer-product GEO evidence.',
            ...(geminiCap == null
              ? {}
              : {
                  geminiMonthlyCap: geminiCap,
                  groundingEnabled: false,
                }),
          },
        },
      });
      const resultIds: string[] = [];
      const failures: Array<{ queryCode: string; message: string }> = [];
      for (const code of queryCodes) {
        const query = byCode.get(code);
        if (!query) {
          failures.push({ queryCode: code, message: 'Query is not in the database.' });
          continue;
        }
        if (provider === 'gemini' && geminiCap != null) {
          const reservation = await this.geminiQuotaStore.reserve({
            now,
            cap: geminiCap,
            model: readiness.model ?? 'gemini',
            queryCode: query.code,
            runId: run.id,
          });
          if (reservation.blocked) {
            failures.push({
              queryCode: code,
              message:
                reservation.blockReason ?? 'Gemini monthly cap reached. No request was sent.',
            });
            continue;
          }
        }
        try {
          const parsed = await executeProviderCall({
            provider,
            env: process.env,
            queryText: query.text,
            fetchImpl,
          });
          const saved = await this.prisma.$transaction(async (tx) => {
            const result = await tx.geoResult.create({
              data: {
                queryId: query.id,
                runId: run.id,
                provider,
                mode: 'api',
                origin: 'api',
                modelLabel: parsed.modelLabel,
                queryCode: query.code,
                queryText: query.text,
                category: query.category,
                capturedAt: new Date(),
                locale: assertBoundedText(dto.locale, 'Locale', 120),
                language: assertBoundedText(dto.language, 'Language', 120),
                rawAnswer: parsed.rawAnswer,
                rawResponse: this.json(parsed.rawResponse) ?? undefined,
                providerMetadata: this.json(parsed.providerMetadata) ?? undefined,
                captureStatus: 'complete',
                reviewStatus: 'pending',
                citations: {
                  create: parsed.citations.map((citation, index) => ({
                    position: index + 1,
                    title: citation.title,
                    url: citation.url,
                    snippet: citation.snippet,
                    providerMetadata: (citation.providerMetadata ?? undefined) as
                      | Prisma.InputJsonValue
                      | undefined,
                  })),
                },
              },
            });
            await this.writeAudit(tx, 'create', result.id, operator, {
              provider,
              mode: 'api',
              queryCode: query.code,
              runId: run.id,
              citationCount: parsed.citations.length,
              modelLabel: parsed.modelLabel,
            });
            return result;
          });
          resultIds.push(saved.id);
        } catch (error) {
          if (error instanceof ProviderNotReadyError) throw error;
          // The Gemini reservation stays consumed. Do not call the provider again.
          failures.push({ queryCode: code, message: this.publicError(error) });
        }
      }
      const geminiQuota =
        provider === 'gemini' && geminiCap != null
          ? await this.geminiQuotaStore.snapshot(now, geminiCap, readiness.model)
          : null;
      const status =
        failures.length === 0 ? 'completed' : resultIds.length === 0 ? 'failed' : 'partial';
      const updated = await this.prisma.geoRun.update({
        where: { id: run.id },
        data: {
          status,
          successCount: resultIds.length,
          failureCount: failures.length,
          errorSummary: failures.length
            ? truncateText(
                failures.map((item) => `${item.queryCode}: ${item.message}`).join('\n'),
                2_000,
              )
            : null,
          completedAt: new Date(),
          metadata: {
            benchmark: GEO_BENCHMARK_ID,
            failures,
            note: 'API behavior only. Not consumer-product GEO evidence.',
            ...(geminiQuota
              ? {
                  geminiMonthBucket: geminiQuota.monthBucket,
                  geminiUsed: geminiQuota.used,
                  geminiRemaining: geminiQuota.remaining,
                  geminiMonthlyCap: geminiQuota.cap,
                  geminiResetAt: geminiQuota.resetAt,
                  groundingEnabled: false,
                }
              : {}),
          },
        },
      });
      await this.prisma.geoAuditEvent.create({
        data: {
          action: queryCodes.length > 1 ? 'batch_run' : 'create',
          entityType: 'geo_run',
          entityId: run.id,
          actorLabel: operator,
          payload: {
            provider,
            mode: 'api',
            queryCodes,
            successCount: resultIds.length,
            failureCount: failures.length,
            costAcknowledged: updated.costAcknowledged,
            ...(geminiQuota
              ? {
                  groundingEnabled: false,
                  geminiMonthBucket: geminiQuota.monthBucket,
                  geminiUsed: geminiQuota.used,
                  geminiRemaining: geminiQuota.remaining,
                }
              : {}),
          },
        },
      });
      return {
        runId: run.id,
        status,
        provider,
        mode: 'api' as const,
        resultIds,
        failures,
        geminiQuota,
        note: 'Stored API output is not consumer-platform GEO evidence. It stays in the api panel until a human reviews it.',
      };
    } catch (error) {
      this.rethrow(error);
    }
  }

  async exportData(filters: ResultFilters, format: string, actor: string | null) {
    try {
      if (format !== 'json' && format !== 'csv') {
        throw new BenchmarkValidationError('Export format must be json or csv.');
      }
      const operator = assertRoleLabel(actor, 'Operator');
      await this.ensureQueries();
      const where = this.buildWhere(filters);
      const rows = await this.prisma.geoResult.findMany({
        where,
        include: resultInclude,
        orderBy: [{ provider: 'asc' }, { mode: 'asc' }, { queryCode: 'asc' }, { version: 'asc' }],
        take: 5_000,
      });
      const resultIds = rows.map((row) => row.id);
      const runIds = rows.map((row) => row.runId).filter((id): id is string => !!id);
      const auditRows = await this.prisma.geoAuditEvent.findMany({
        where: {
          OR: [
            {
              entityType: 'geo_result',
              entityId: {
                in: resultIds.length ? resultIds : ['00000000-0000-0000-0000-000000000000'],
              },
            },
            {
              entityType: 'geo_run',
              entityId: { in: runIds.length ? runIds : ['00000000-0000-0000-0000-000000000000'] },
            },
          ],
        },
        orderBy: { createdAt: 'asc' },
      });
      const exportEvent = await this.prisma.geoAuditEvent.create({
        data: {
          action: 'export',
          entityType: 'geo_export',
          actorLabel: operator,
          payload: {
            format,
            resultCount: rows.length,
            provider: filters.provider ?? null,
            mode: filters.mode ?? null,
            category: filters.category ?? null,
            status: filters.status ?? null,
          },
        },
      });
      const audits = [...auditRows, exportEvent].map((event) => this.presentAudit(event));
      const auditsByResult = new Map<string, ExportAudit[]>();
      for (const event of audits) {
        if (!event.entityId) continue;
        const list = auditsByResult.get(event.entityId) ?? [];
        list.push(event);
        auditsByResult.set(event.entityId, list);
      }
      const document: ExportDocument = {
        benchmark: 'GEO-BENCHMARK-01',
        exportedAt: new Date().toISOString(),
        note: 'Raw answers, citations, human scores, and audit history. API rows are not consumer GEO evidence. Secrets are removed.',
        results: rows.map((row) => this.toExportResult(row, auditsByResult.get(row.id) ?? [])),
        auditHistory: audits,
      };
      const safe = sanitizeExportDocument(document, collectSecretValues());
      if (format === 'csv') {
        return {
          format,
          filename: 'geo-benchmark-01.csv',
          mimeType: 'text/csv; charset=utf-8',
          body: toCsv(safe),
        };
      }
      return {
        format,
        filename: 'geo-benchmark-01.json',
        mimeType: 'application/json',
        body: JSON.stringify(safe),
      };
    } catch (error) {
      this.rethrow(error);
    }
  }

  private async ensureQueries(): Promise<void> {
    if (!this.bankReady) {
      this.bankReady = this.writeBank().catch((error) => {
        this.bankReady = null;
        throw error;
      });
    }
    return this.bankReady;
  }

  private async writeBank(): Promise<void> {
    for (const query of GEO_QUERY_BANK) {
      await this.prisma.geoQuery.upsert({
        where: { code: query.code },
        create: {
          code: query.code,
          category: query.category,
          text: query.text,
          sortOrder: query.sortOrder,
        },
        update: {
          category: query.category,
          text: query.text,
          sortOrder: query.sortOrder,
        },
      });
    }
  }

  private async requireResult(id: string): Promise<StoredResult> {
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new BadRequestException('Result id must be a UUID.');
    const result = await this.prisma.geoResult.findUnique({
      where: { id },
      include: resultInclude,
    });
    if (!result) throw new NotFoundException('Result not found.');
    return result;
  }

  private requireQuery(code: string) {
    const query = findQuery(code);
    if (!query)
      throw new BenchmarkValidationError(`Unknown query id ${code}. Use the fixed bank Q001-Q060.`);
    return query;
  }

  private readMode(value: string | undefined): BenchmarkMode | undefined {
    if (!value) return undefined;
    if (!isMode(value)) throw new BenchmarkValidationError('Mode must be api or web_manual.');
    return value;
  }

  private readCategory(value: string): string {
    if (!CATEGORIES.some((item) => item.key === value)) {
      throw new BenchmarkValidationError('Unknown category.');
    }
    return value;
  }

  private buildWhere(filters: ResultFilters): Prisma.GeoResultWhereInput {
    try {
      const where: Prisma.GeoResultWhereInput = {};
      if (filters.provider) where.provider = assertProvider(filters.provider);
      const mode = this.readMode(filters.mode);
      if (mode) where.mode = mode;
      if (filters.category) where.category = this.readCategory(filters.category);
      if (filters.queryCode) where.queryCode = filters.queryCode;
      if (filters.status === 'draft') where.captureStatus = 'draft';
      else if (filters.status) {
        if (!isReviewStatus(filters.status)) throw new BenchmarkValidationError('Unknown status.');
        where.reviewStatus = filters.status;
      }
      const capturedAt = capturedAtRange(filters.from, filters.to);
      if (capturedAt) where.capturedAt = capturedAt;
      return where;
    } catch (error) {
      this.rethrow(error);
    }
  }

  private async writeAudit(
    tx: Prisma.TransactionClient,
    action: string,
    entityId: string,
    actor: string | null,
    payload: Record<string, unknown>,
  ) {
    await tx.geoAuditEvent.create({
      data: {
        action,
        entityType: 'geo_result',
        entityId,
        actorLabel: actor,
        payload: payload as Prisma.InputJsonValue,
      },
    });
  }

  private json(value: unknown): Prisma.InputJsonValue | undefined {
    if (value == null) return undefined;
    return redactJson(value, collectSecretValues()) as Prisma.InputJsonValue;
  }

  private citationsOf(result: StoredResult): CitationInput[] {
    return result.citations.map((citation) => ({
      title: citation.title,
      url: citation.url,
      snippet: citation.snippet,
    }));
  }

  private summary(result: {
    id: string;
    version: number;
    reviewStatus: string;
    captureStatus: string;
    capturedAt: Date;
    modelLabel: string | null;
    citations: { id: string }[];
    review: { score: number | null } | null;
  }) {
    return {
      id: result.id,
      version: result.version,
      reviewStatus: result.reviewStatus,
      captureStatus: result.captureStatus,
      score: result.review?.score ?? null,
      capturedAt: result.capturedAt,
      modelLabel: result.modelLabel,
      citationCount: result.citations.length,
      countsTowardMetrics:
        result.reviewStatus === 'reviewed' &&
        result.captureStatus === 'complete' &&
        result.review?.score != null,
    };
  }

  private present(result: StoredResult) {
    const secrets = collectSecretValues();
    return {
      ...result,
      rawAnswer: redactString(result.rawAnswer, secrets),
      notes: result.notes ? redactString(result.notes, secrets) : result.notes,
      rawResponse: result.rawResponse ? redactJson(result.rawResponse, secrets) : null,
      providerMetadata: result.providerMetadata
        ? redactJson(result.providerMetadata, secrets)
        : null,
      citations: result.citations.map((citation) => ({
        ...citation,
        title: citation.title ? redactString(citation.title, secrets) : citation.title,
        snippet: citation.snippet ? redactString(citation.snippet, secrets) : citation.snippet,
        providerMetadata: citation.providerMetadata
          ? redactJson(citation.providerMetadata, secrets)
          : null,
      })),
      immutable: rawAnswerLocked(result.reviewStatus),
    };
  }

  private presentAudit(event: {
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    actorLabel: string | null;
    payload: Prisma.JsonValue;
    createdAt: Date;
  }): ExportAudit {
    return {
      id: event.id,
      action: event.action,
      entityType: event.entityType,
      entityId: event.entityId,
      actorLabel: event.actorLabel,
      payload: redactJson(event.payload, collectSecretValues()),
      createdAt: event.createdAt.toISOString(),
    };
  }

  private toExportResult(result: StoredResult, auditHistory: ExportAudit[]): ExportResult {
    const presented = this.present(result);
    return {
      id: presented.id,
      provider: presented.provider,
      mode: presented.mode,
      origin: presented.origin,
      version: presented.version,
      predecessorId: presented.predecessorId,
      queryCode: presented.queryCode,
      queryText: presented.queryText,
      category: presented.category,
      modelLabel: presented.modelLabel,
      capturedAt: presented.capturedAt.toISOString(),
      locale: presented.locale,
      language: presented.language,
      region: presented.region,
      searchMode: presented.searchMode,
      notes: presented.notes,
      screenshotRef: presented.screenshotRef,
      captureStatus: presented.captureStatus,
      reviewStatus: presented.reviewStatus,
      rawAnswer: presented.rawAnswer,
      providerMetadata: presented.providerMetadata,
      citations: presented.citations.map((citation) => ({
        position: citation.position,
        title: citation.title,
        url: citation.url,
        snippet: citation.snippet,
      })),
      review: presented.review
        ? {
            score: presented.review.score,
            mention: presented.review.mention,
            identityCorrect: presented.review.identityCorrect,
            supplierCandidate: presented.review.supplierCandidate,
            activeRecommendation: presented.review.activeRecommendation,
            officialCitation: presented.review.officialCitation,
            independentCitation: presented.review.independentCitation,
            factualErrors: presented.review.factualErrors,
            rationale: presented.review.rationale,
            evaluator: presented.review.evaluator,
            reviewedAt: presented.review.reviewedAt.toISOString(),
          }
        : null,
      auditHistory,
    };
  }

  private publicError(error: unknown): string {
    const secrets = collectSecretValues();
    if (error instanceof ProviderHttpError) {
      const body = truncateText(JSON.stringify(error.redactedBody ?? ''), 400);
      return redactString(`${error.message} ${body}`.trim(), secrets);
    }
    if (error instanceof Error) return redactString(truncateText(error.message, 500), secrets);
    return 'Provider request failed.';
  }

  private rethrow(error: unknown): never {
    if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
    if (error instanceof BenchmarkValidationError || error instanceof ProviderNotReadyError) {
      throw new BadRequestException(error.message);
    }
    throw error;
  }
}
