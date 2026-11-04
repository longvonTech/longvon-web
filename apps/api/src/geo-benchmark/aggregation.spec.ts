import { buildMetrics, selectScoredResults, type ScoredResultRow } from './domain/aggregation';

function row(
  overrides: Partial<ScoredResultRow> & Pick<ScoredResultRow, 'queryCode' | 'provider' | 'mode'>,
): ScoredResultRow {
  return {
    category: 'manufacturer_discovery',
    version: 1,
    reviewStatus: 'reviewed',
    captureStatus: 'complete',
    score: 0,
    mention: false,
    identityCorrect: false,
    supplierCandidate: false,
    activeRecommendation: false,
    officialCitation: false,
    independentCitation: false,
    factualErrors: false,
    ...overrides,
  };
}

describe('aggregation', () => {
  it('does not treat missing or unreviewed queries as score zero', () => {
    const rows = [
      row({
        queryCode: 'Q001',
        provider: 'gemini',
        mode: 'api',
        score: 4,
        mention: true,
        identityCorrect: true,
        activeRecommendation: true,
      }),
      row({ queryCode: 'Q002', provider: 'gemini', mode: 'api', score: 0 }),
      row({
        queryCode: 'Q003',
        provider: 'gemini',
        mode: 'api',
        reviewStatus: 'pending',
        score: null,
      }),
      row({
        queryCode: 'Q004',
        provider: 'gemini',
        mode: 'api',
        captureStatus: 'draft',
        score: 5,
        mention: true,
      }),
      row({
        queryCode: 'Q005',
        provider: 'gemini',
        mode: 'api',
        reviewStatus: 'excluded',
        score: 1,
      }),
      row({
        queryCode: 'Q006',
        provider: 'gemini',
        mode: 'api',
        reviewStatus: 'needs_recheck',
        score: 2,
      }),
    ];
    const report = buildMetrics({ rows, mode: 'api', provider: 'gemini' });
    const metrics = report.panels[0].providers[0];
    expect(metrics.coverage).toEqual({ numerator: 2, denominator: 60, rate: 2 / 60 });
    expect(metrics.sampleSize).toBe(2);
    expect(metrics.mentionRate).toEqual({ numerator: 1, denominator: 2, rate: 0.5 });
    expect(metrics.scoreDistribution['0']).toBe(1);
    expect(metrics.scoreDistribution['4']).toBe(1);
    expect(metrics.scoreDistribution.sampleSize).toBe(2);
    expect(
      selectScoredResults(rows)
        .map((item) => item.queryCode)
        .sort(),
    ).toEqual(['Q001', 'Q002']);
  });

  it('keeps API and web_manual in separate panels', () => {
    const rows = [
      row({ queryCode: 'Q001', provider: 'gemini', mode: 'api', score: 4, mention: true }),
      row({ queryCode: 'Q001', provider: 'gemini', mode: 'web_manual', score: 0, mention: false }),
    ];
    const report = buildMetrics({ rows, provider: 'gemini' });
    const api = report.panels.find((panel) => panel.mode === 'api')!.providers[0];
    const web = report.panels.find((panel) => panel.mode === 'web_manual')!.providers[0];
    expect(api.mentionRate).toEqual({ numerator: 1, denominator: 1, rate: 1 });
    expect(web.mentionRate).toEqual({ numerator: 0, denominator: 1, rate: 0 });
    expect(api.sampleSize + web.sampleSize).toBe(2);
  });

  it('uses the latest reviewed version and keeps the prior reviewed version while a correction is pending', () => {
    const rows = [
      row({
        queryCode: 'Q010',
        provider: 'doubao',
        mode: 'web_manual',
        version: 1,
        score: 2,
        mention: true,
        identityCorrect: true,
      }),
      row({
        queryCode: 'Q010',
        provider: 'doubao',
        mode: 'web_manual',
        version: 2,
        score: 5,
        mention: true,
        activeRecommendation: true,
        officialCitation: true,
        independentCitation: true,
      }),
      row({
        queryCode: 'Q011',
        provider: 'doubao',
        mode: 'web_manual',
        category: 'oem_odm',
        version: 1,
        score: 4,
        mention: true,
      }),
      row({
        queryCode: 'Q011',
        provider: 'doubao',
        mode: 'web_manual',
        category: 'oem_odm',
        version: 2,
        reviewStatus: 'pending',
        score: null,
      }),
    ];
    const selected = selectScoredResults(rows);
    expect(selected.find((item) => item.queryCode === 'Q010')?.version).toBe(2);
    expect(selected.find((item) => item.queryCode === 'Q011')?.version).toBe(1);
    const report = buildMetrics({ rows, mode: 'web_manual', provider: 'doubao' });
    const metrics = report.panels[0].providers[0];
    expect(metrics.sampleSize).toBe(2);
    expect(metrics.score4or5Rate).toEqual({ numerator: 2, denominator: 2, rate: 1 });
    expect(metrics.officialCitationRate.numerator).toBe(1);
    expect(metrics.independentCitationRate.numerator).toBe(1);
  });

  it('returns null rates when a category has no reviewed sample', () => {
    const rows = [
      row({
        queryCode: 'Q021',
        provider: 'perplexity',
        mode: 'api',
        category: 'health_monitoring',
        score: 3,
        mention: true,
        supplierCandidate: true,
        factualErrors: true,
      }),
    ];
    const report = buildMetrics({ rows, mode: 'api', provider: 'perplexity' });
    const metrics = report.panels[0].providers[0];
    const health = metrics.categories.find((item) => item.category === 'health_monitoring')!;
    const oem = metrics.categories.find((item) => item.category === 'oem_odm')!;
    expect(health.coverage).toEqual({ numerator: 1, denominator: 10, rate: 0.1 });
    expect(health.supplierCandidateRate).toEqual({ numerator: 1, denominator: 1, rate: 1 });
    expect(health.factualErrorRate).toEqual({ numerator: 1, denominator: 1, rate: 1 });
    expect(oem.sampleSize).toBe(0);
    expect(oem.mentionRate).toEqual({ numerator: 0, denominator: 0, rate: null });
    expect(oem.scoreDistribution.sampleSize).toBe(0);
  });

  it('uses the category size as the coverage denominator when a category filter is set', () => {
    const rows = [
      row({
        queryCode: 'Q031',
        provider: 'gemini',
        mode: 'api',
        category: 'sdk_api',
        score: 2,
        mention: true,
        identityCorrect: true,
      }),
    ];
    const report = buildMetrics({ rows, mode: 'api', provider: 'gemini', category: 'sdk_api' });
    const metrics = report.panels[0].providers[0];
    expect(metrics.coverage).toEqual({ numerator: 1, denominator: 10, rate: 0.1 });
    expect(metrics.accurateEntityRate).toEqual({ numerator: 1, denominator: 1, rate: 1 });
    expect(metrics.categories).toHaveLength(1);
  });
});
