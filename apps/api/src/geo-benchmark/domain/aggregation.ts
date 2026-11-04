import { CATEGORIES, GEO_QUERY_BANK, type BenchmarkMode, type ProviderId } from '../query-bank';

export type ScoredResultRow = {
  provider: ProviderId | string;
  mode: BenchmarkMode | string;
  queryCode: string;
  category: string;
  version: number;
  reviewStatus: string;
  captureStatus: string;
  score: number | null;
  mention: boolean;
  identityCorrect: boolean;
  supplierCandidate: boolean;
  activeRecommendation: boolean;
  officialCitation: boolean;
  independentCitation: boolean;
  factualErrors: boolean;
};

export type RateMetric = {
  numerator: number;
  denominator: number;
  rate: number | null;
};

export type ScoreDistribution = {
  '0': number;
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
  sampleSize: number;
};

export type CategoryBreakdown = {
  category: string;
  label: string;
  coverage: RateMetric;
  sampleSize: number;
  mentionRate: RateMetric;
  accurateEntityRate: RateMetric;
  supplierCandidateRate: RateMetric;
  activeRecommendationRate: RateMetric;
  score4or5Rate: RateMetric;
  officialCitationRate: RateMetric;
  independentCitationRate: RateMetric;
  factualErrorRate: RateMetric;
  scoreDistribution: ScoreDistribution;
};

export type ProviderModeMetrics = {
  provider: string;
  mode: BenchmarkMode;
  coverage: RateMetric;
  sampleSize: number;
  mentionRate: RateMetric;
  accurateEntityRate: RateMetric;
  supplierCandidateRate: RateMetric;
  activeRecommendationRate: RateMetric;
  score4or5Rate: RateMetric;
  officialCitationRate: RateMetric;
  independentCitationRate: RateMetric;
  factualErrorRate: RateMetric;
  scoreDistribution: ScoreDistribution;
  categories: CategoryBreakdown[];
};

export type MetricsReport = {
  benchmark: 'GEO-BENCHMARK-01';
  note: string;
  panels: Array<{
    mode: BenchmarkMode;
    providers: ProviderModeMetrics[];
  }>;
};

const EMPTY_DISTRIBUTION = (): ScoreDistribution => ({
  '0': 0,
  '1': 0,
  '2': 0,
  '3': 0,
  '4': 0,
  '5': 0,
  sampleSize: 0,
});

function rate(numerator: number, denominator: number): RateMetric {
  if (denominator === 0) return { numerator: 0, denominator: 0, rate: null };
  return { numerator, denominator, rate: numerator / denominator };
}

export function selectScoredResults<T extends ScoredResultRow>(rows: T[]): T[] {
  const best = new Map<string, T>();
  for (const row of rows) {
    if (row.reviewStatus !== 'reviewed') continue;
    if (row.captureStatus !== 'complete') continue;
    if (row.score == null || row.score < 0 || row.score > 5) continue;
    const key = `${row.provider}|${row.mode}|${row.queryCode}`;
    const previous = best.get(key);
    if (!previous || row.version > previous.version) best.set(key, row);
  }
  return [...best.values()];
}

function distribution(rows: ScoredResultRow[]): ScoreDistribution {
  const dist = EMPTY_DISTRIBUTION();
  for (const row of rows) {
    if (row.score == null) continue;
    const key = String(row.score) as keyof Omit<ScoreDistribution, 'sampleSize'>;
    if (dist[key] != null) dist[key] += 1;
  }
  dist.sampleSize = rows.length;
  return dist;
}

function flagRate(rows: ScoredResultRow[], pick: (row: ScoredResultRow) => boolean): RateMetric {
  return rate(rows.filter(pick).length, rows.length);
}

function metricsFor(
  rows: ScoredResultRow[],
  universeSize: number,
): Omit<ProviderModeMetrics, 'provider' | 'mode' | 'categories'> {
  const covered = new Set(rows.map((row) => row.queryCode)).size;
  return {
    coverage: rate(covered, universeSize),
    sampleSize: rows.length,
    mentionRate: flagRate(rows, (row) => row.mention),
    accurateEntityRate: flagRate(rows, (row) => row.identityCorrect),
    supplierCandidateRate: flagRate(rows, (row) => row.supplierCandidate),
    activeRecommendationRate: flagRate(rows, (row) => row.activeRecommendation),
    score4or5Rate: flagRate(rows, (row) => row.score != null && row.score >= 4),
    officialCitationRate: flagRate(rows, (row) => row.officialCitation),
    independentCitationRate: flagRate(rows, (row) => row.independentCitation),
    factualErrorRate: flagRate(rows, (row) => row.factualErrors),
    scoreDistribution: distribution(rows),
  };
}

export function buildMetrics(args: {
  rows: ScoredResultRow[];
  mode?: BenchmarkMode | null;
  provider?: string | null;
  category?: string | null;
}): MetricsReport {
  const universe = GEO_QUERY_BANK.filter(
    (item) => !args.category || item.category === args.category,
  );
  const scored = selectScoredResults(args.rows).filter((row) => {
    if (args.mode && row.mode !== args.mode) return false;
    if (args.provider && row.provider !== args.provider) return false;
    if (args.category && row.category !== args.category) return false;
    return universe.some((item) => item.code === row.queryCode);
  });
  const modes: BenchmarkMode[] = args.mode ? [args.mode] : ['api', 'web_manual'];
  const providers = args.provider ? [args.provider] : ['gemini', 'perplexity', 'doubao'];
  const categories = CATEGORIES.filter((item) => !args.category || item.key === args.category);

  return {
    benchmark: 'GEO-BENCHMARK-01',
    note: 'Rates use human-reviewed complete results only. Missing queries are omitted from the denominator. API and web_manual are never combined. An API result is not consumer-product GEO evidence.',
    panels: modes.map((mode) => ({
      mode,
      providers: providers.map((provider) => {
        const providerRows = scored.filter((row) => row.provider === provider && row.mode === mode);
        const base = metricsFor(providerRows, universe.length);
        return {
          provider,
          mode,
          ...base,
          categories: categories.map((category) => {
            const categoryUniverse = universe.filter((item) => item.category === category.key);
            const categoryRows = providerRows.filter((row) => row.category === category.key);
            return {
              category: category.key,
              label: category.label,
              ...metricsFor(categoryRows, categoryUniverse.length),
            };
          }),
        };
      }),
    })),
  };
}
