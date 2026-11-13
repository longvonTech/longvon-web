import { sanitizeExportDocument, toCsv, type ExportDocument } from './domain/export';
import { redactJson } from './domain/redact';

function document(): ExportDocument {
  return {
    benchmark: 'GEO-BENCHMARK-01',
    exportedAt: '2026-11-04T00:00:00.000Z',
    note: 'fixture',
    results: [
      {
        id: 'result-1',
        provider: 'gemini',
        mode: 'web_manual',
        origin: 'web_manual',
        version: 1,
        predecessorId: null,
        queryCode: 'Q001',
        queryText: 'Which companies manufacture smart rings in China?',
        category: 'manufacturer_discovery',
        modelLabel: 'Gemini app',
        capturedAt: '2026-11-04T00:00:00.000Z',
        locale: 'en-US',
        language: 'en',
        region: null,
        searchMode: null,
        notes: 'Captured from the official UI',
        screenshotRef: '/uploads/geo/q001.png',
        captureStatus: 'complete',
        reviewStatus: 'reviewed',
        rawAnswer: '=HYPERLINK("https://evil.example") LONGVON is a manufacturer.',
        providerMetadata: { source: 'web_manual', api_key: 'should-not-export' },
        citations: [
          {
            position: 1,
            title: 'LONGVON',
            url: 'https://www.longvon.com/',
            snippet: 'Official site',
          },
        ],
        review: {
          score: 5,
          mention: true,
          identityCorrect: true,
          supplierCandidate: true,
          activeRecommendation: true,
          officialCitation: true,
          independentCitation: true,
          factualErrors: false,
          rationale: 'Official website and an independent citation were both visible.',
          evaluator: 'geo-reviewer',
          reviewedAt: '2026-11-04T01:00:00.000Z',
        },
        auditHistory: [
          {
            id: 'audit-1',
            action: 'review',
            entityType: 'geo_result',
            entityId: 'result-1',
            actorLabel: 'geo-reviewer',
            payload: { score: 5 },
            createdAt: '2026-11-04T01:00:00.000Z',
          },
        ],
      },
    ],
    auditHistory: [
      {
        id: 'audit-1',
        action: 'review',
        entityType: 'geo_result',
        entityId: 'result-1',
        actorLabel: 'geo-reviewer',
        payload: { score: 5, authorization: 'Bearer secret-token-value' },
        createdAt: '2026-11-04T01:00:00.000Z',
      },
    ],
  };
}

describe('export', () => {
  it('includes raw answers, citations, scores, and audit history without secrets', () => {
    const safe = sanitizeExportDocument(document(), ['secret-token-value']);
    const json = JSON.stringify(safe);
    expect(json).toContain('LONGVON is a manufacturer.');
    expect(json).toContain('https://www.longvon.com/');
    expect(json).toContain('"score":5');
    expect(json).toContain('geo-reviewer');
    expect(json).toContain('"action":"review"');
    expect(json).not.toContain('should-not-export');
    expect(json).not.toContain('secret-token-value');
    expect(json).toContain('[REDACTED]');

    const csv = toCsv(safe);
    expect(csv).toContain('raw_answer');
    expect(csv).toContain('audit_history');
    expect(csv).toContain('https://www.longvon.com/');
    expect(csv).toContain("'=HYPERLINK");
    expect(csv).not.toContain('secret-token-value');
  });

  it('redacts nested secret fields', () => {
    expect(redactJson({ nested: { password: 'hunter2hunter2', ok: true } }, [])).toEqual({
      nested: { password: '[REDACTED]', ok: true },
    });
  });
});
