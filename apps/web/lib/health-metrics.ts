export interface HealthMetricCategory {
  slug: string;
  title: string;
  titleEn: string;
  emoji: string;
  color: string;
  count: number;
  summary: string;
  parameters: string[];
}

export const HEALTH_METRIC_CATEGORIES: HealthMetricCategory[] = [
  {
    slug: 'rapid-test',
    title: '60秒快速检测',
    titleEn: 'Quick Check',
    emoji: '⚡',
    color: '#FFD60A',
    count: 6,
    summary: '一分钟内快速了解当前核心健康状态，涵盖心率、血氧、呼吸与恢复能力等关键即时指标。',
    parameters: [
      '当前健康状态',
      '当前心率',
      '当前血氧',
      '当前生理负荷',
      '当前呼吸状态',
      '当前恢复能力评估',
    ],
  },
  {
    slug: 'activity',
    title: '运动监测',
    titleEn: 'Activity',
    emoji: '🏃',
    color: '#64D2FF',
    count: 7,
    summary: '记录日常与运动场景下的活动数据，帮助建立可持续的运动习惯与目标管理。',
    parameters: [
      '步数',
      '运动频率',
      '运动目标',
      '里程',
      '卡路里',
      '运动时长',
      '运动心率',
    ],
  },
  {
    slug: 'heart-rate',
    title: '心率监测',
    titleEn: 'Heart Rate',
    emoji: '💓',
    color: '#FF375F',
    count: 6,
    summary: '全天候追踪心率变化，支持手动测量与阈值报警，掌握心脏负荷与异常波动。',
    parameters: [
      '24小时心率变化',
      '平均心率',
      '最高心率',
      '最低心率',
      '手动测量及及时心率',
      '心率高低阈值报警设置',
    ],
  },
  {
    slug: 'blood-oxygen',
    title: '血氧监测',
    titleEn: 'SpO₂',
    emoji: '🩸',
    color: '#30D158',
    count: 6,
    summary: '持续监测血氧饱和度变化，支持手动测量与低血氧报警，关注呼吸与循环健康。',
    parameters: [
      '24小时血氧变化',
      '平均血氧',
      '最高血氧',
      '最低血氧',
      '手动测量及及时血氧',
      '血氧报警阈值设定',
    ],
  },
  {
    slug: 'stress',
    title: '抗压能力监测',
    titleEn: 'Stress',
    emoji: '🧠',
    color: '#FF9F0A',
    count: 4,
    summary: '基于 HRV 等指标量化全天压力与恢复状态，识别高压时段与最佳恢复窗口。',
    parameters: [
      '24小时压力趋势化监测',
      '全天压力时长及占比',
      '全天恢复度时长及占比',
      '压力得分及变化',
    ],
  },
  {
    slug: 'sleep-quality',
    title: '睡眠质量监测',
    titleEn: 'Sleep Quality',
    emoji: '😴',
    color: '#0A84FF',
    count: 22,
    summary: '对整夜睡眠进行多维度深度分析，从入睡效率到分期结构，再到 AI 评估建议。',
    parameters: [
      '睡眠得分',
      '上床时间',
      '入睡时间',
      '出睡时间',
      '起床时间',
      '总睡眠时长',
      '在床时长',
      '睡眠效率',
      '静息心率',
      '清醒时长及比例',
      'REM时长及比例',
      '浅睡时长及比例',
      '深睡时长及比例',
      '入睡潜伏期时长',
      '清醒次数',
      '睡眠期间恢复度变化趋势',
      '恢复度时长及比例',
      '睡眠期间心率变化趋势',
      '最高心率',
      '平均心率',
      '睡眠期间体温变化',
      'AI睡眠评估及建议',
    ],
  },
  {
    slug: 'sleep-apnea',
    title: '睡眠呼吸暂停监测',
    titleEn: 'OSA Screening',
    emoji: '🫁',
    color: '#BF5AF2',
    count: 20,
    summary: '专项监测睡眠呼吸健康，覆盖血氧跌落、AHI、ODI 等指标，结合 AI 提供 OSA 初筛参考。',
    parameters: [
      '血氧跌落≥4%次数和时长',
      '血氧跌落≥3%次数和时长',
      '血氧范围',
      '最低血氧',
      '平均血氧',
      '血氧区间占比及时长',
      '心率范围',
      '平均心率',
      '心率过速时长',
      '心率过缓时长',
      '心率范围占比及时长',
      '呼吸率范围',
      '平均呼吸率',
      '呼吸率区间及占比',
      '体动量趋势',
      'AHI',
      'OSA初筛结果',
      'ODI',
      'ODI评分',
      'AI睡眠呼吸健康评估及建议',
    ],
  },
];

export const TOTAL_HEALTH_METRICS = HEALTH_METRIC_CATEGORIES.reduce(
  (sum, c) => sum + c.count,
  0,
);

export function getHealthMetricBySlug(slug: string): HealthMetricCategory | undefined {
  return HEALTH_METRIC_CATEGORIES.find(c => c.slug === slug);
}

export function getAllHealthMetricSlugs(): string[] {
  return HEALTH_METRIC_CATEGORIES.map(c => c.slug);
}
