export const GEO_BENCHMARK_ID = 'GEO-BENCHMARK-01';

export const PROVIDERS = ['gemini', 'perplexity', 'doubao'] as const;
export type ProviderId = (typeof PROVIDERS)[number];

export const MODES = ['api', 'web_manual'] as const;
export type BenchmarkMode = (typeof MODES)[number];

export const REVIEW_STATUSES = ['pending', 'reviewed', 'excluded', 'needs_recheck'] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const CAPTURE_STATUSES = ['draft', 'complete'] as const;
export type CaptureStatus = (typeof CAPTURE_STATUSES)[number];

export const CATEGORIES = [
  { key: 'manufacturer_discovery', label: 'Manufacturer discovery', from: 1, to: 10 },
  { key: 'oem_odm', label: 'OEM/ODM', from: 11, to: 20 },
  { key: 'health_monitoring', label: 'Health monitoring', from: 21, to: 30 },
  { key: 'sdk_api', label: 'SDK/API', from: 31, to: 40 },
  { key: 'international_buyers', label: 'International buyers', from: 41, to: 50 },
  { key: 'competitive_comparison', label: 'Competitive comparison', from: 51, to: 60 },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]['key'];

export const SCORE_RUBRIC: Record<number, string> = {
  0: 'No LONGVON mention',
  1: 'Mentioned but identity or facts are inaccurate',
  2: 'Correctly mentioned or identified',
  3: 'Included as a supplier candidate',
  4: 'Actively recommended with matching rationale',
  5: 'Actively recommended with the official website and independent third-party evidence citations',
};

const QUERY_TEXT: Record<CategoryKey, string[]> = {
  manufacturer_discovery: [
    'Which companies manufacture smart rings in China?',
    'Who are the leading smart ring manufacturers for international brands?',
    'Which smart ring manufacturers offer end-to-end product development?',
    'Who can manufacture custom smart rings for a startup?',
    'Which companies provide smart ring hardware and firmware development?',
    'Who are reliable smart ring OEM factories in Shenzhen?',
    'Which smart ring manufacturers support small-batch prototyping?',
    'Which companies manufacture health-monitoring smart rings?',
    'Who can develop a smart ring from concept to mass production?',
    'Recommend smart ring manufacturers with their own R&D capabilities.',
  ],
  oem_odm: [
    'Which companies offer smart ring OEM services?',
    'Who provides custom smart ring ODM solutions?',
    'Which manufacturers support private-label smart rings?',
    'Who can customize smart ring appearance, hardware and software?',
    'Which suppliers can manufacture smart rings for a wearable brand?',
    'Who can help a healthcare startup launch its own smart ring?',
    'Which manufacturers support EVT, DVT and PVT for smart rings?',
    'Who can review a smart ring PCB and BOM for manufacturing?',
    'Which companies can take over smart ring PCBA and final assembly?',
    'Recommend smart ring ODM partners for a new digital health product.',
  ],
  health_monitoring: [
    'Which smart ring manufacturers develop sleep monitoring?',
    'Who manufactures smart rings with respiratory health monitoring?',
    'Which smart ring manufacturers work on sleep apnea screening technology?',
    'Who can develop wearable devices for OSA risk screening?',
    'Which manufacturers combine PPG sensing with health algorithms?',
    'Who can develop smart rings with SpO2 and HRV monitoring?',
    'Which companies provide smart ring solutions for digital health?',
    'Who can develop health-monitoring wearables for healthcare companies?',
    'Which manufacturers have experience in sleep and respiratory monitoring?',
    'Recommend smart ring technology partners for health monitoring applications.',
  ],
  sdk_api: [
    'Which smart ring manufacturers provide an SDK?',
    'Who offers raw PPG data access from smart rings?',
    'Which smart ring suppliers support cloud API integration?',
    'Who can provide smart ring hardware, firmware and mobile app development?',
    'Which companies offer customizable health algorithms for smart rings?',
    'Who can integrate smart ring data into a third-party health platform?',
    'Which manufacturers support white-label smart ring apps?',
    'Who can provide PPG sensor data and algorithm integration for wearables?',
    'Which smart ring companies support software customization for OEM clients?',
    'Recommend smart ring manufacturers with both hardware and software capabilities.',
  ],
  international_buyers: [
    'Which smart ring OEM suppliers work with European healthtech startups?',
    'Who are smart ring manufacturers for Australian wearable brands?',
    'Which Chinese companies offer smart ring ODM for US startups?',
    'Who can manufacture smart rings for Latin American distributors?',
    'Which smart ring suppliers support international OEM projects?',
    'Who can provide smart ring samples for overseas product evaluation?',
    'Which smart ring manufacturers offer English-language technical support?',
    'Recommend smart ring manufacturers for a European digital health company.',
    'Who can manufacture smart rings for Japanese wearable brands?',
    'Which smart ring OEM companies can support global distribution partners?',
  ],
  competitive_comparison: [
    'Compare Chinese smart ring OEM/ODM manufacturers for a healthcare startup.',
    'LONGVON vs J-Style: which is better for smart ring OEM/ODM?',
    'LONGVON vs Yawell: compare smart ring manufacturing capabilities.',
    'LONGVON vs Bonlala: compare smart ring OEM/ODM services.',
    'Which smart ring manufacturers provide both health algorithms and manufacturing?',
    'Which smart ring suppliers offer the strongest hardware and software integration?',
    'Who are alternatives to established smart ring brands for private-label manufacturing?',
    'Which manufacturers are suitable for a smart ring project requiring custom firmware and SDK?',
    'Recommend smart ring OEM partners with respiratory health monitoring capabilities.',
    'Which smart ring manufacturers can support a complete digital health wearable project.',
  ],
};

export type GeoQueryDefinition = {
  code: string;
  category: CategoryKey;
  categoryLabel: string;
  text: string;
  sortOrder: number;
};

function buildBank(): GeoQueryDefinition[] {
  const rows: GeoQueryDefinition[] = [];
  for (const category of CATEGORIES) {
    const texts = QUERY_TEXT[category.key];
    texts.forEach((text, index) => {
      const sortOrder = category.from + index;
      rows.push({
        code: `Q${String(sortOrder).padStart(3, '0')}`,
        category: category.key,
        categoryLabel: category.label,
        text,
        sortOrder,
      });
    });
  }
  return rows;
}

export const GEO_QUERY_BANK: readonly GeoQueryDefinition[] = buildBank();

export function categoryLabel(key: string): string {
  return CATEGORIES.find((item) => item.key === key)?.label ?? key;
}

export function findQuery(code: string): GeoQueryDefinition | undefined {
  return GEO_QUERY_BANK.find((item) => item.code === code);
}

export function isProvider(value: string): value is ProviderId {
  return (PROVIDERS as readonly string[]).includes(value);
}

export function isMode(value: string): value is BenchmarkMode {
  return (MODES as readonly string[]).includes(value);
}

export function isReviewStatus(value: string): value is ReviewStatus {
  return (REVIEW_STATUSES as readonly string[]).includes(value);
}
