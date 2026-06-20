/**
 * 六大评估定义种子数据。
 *
 * 本文件是TASK-105整个Sprint"平台级引擎"架构原则的最终证明：
 * OSA/Sleep/Stress/WeightLoss/Diabetes/Altitude六条记录全部符合同一个
 * questionnaire_schema/scoring_rule/result_template契约（详见
 * apps/api/src/assessment/engine/types.ts），由同一个ScoringEngineService解释执行，
 * 本文件本身不包含任何计分逻辑代码，只有数据。
 *
 * 运行方式（需要真实数据库连接，本沙箱无法执行）：
 *   npx prisma db seed
 * （已在packages/database/package.json的"prisma.seed"字段配置）
 *
 * 全部六个评估的disclaimer与recommendations文案均遵循
 * assessment-engine-compliance-v1.md的核心原则：不出现诊断结论、疾病确认、
 * 治疗建议、医疗承诺，措辞统一使用"自评/风险提示/建议关注/建议咨询医生"。
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DISCLAIMER =
  '本评估为健康风险自评工具，结果仅供参考，不构成医学诊断，不能替代专业医疗意见。如有疑虑，请咨询专业医生。';

const osaDefinition = {
  type: 'osa',
  version: 'v1',
  questionnaireSchema: {
    questions: [
      { id: 'snoring', type: 'single_choice', label: '您打鼾的频率和声音大小', required: true,
        options: [
          { value: 'never', label: '从不打鼾' },
          { value: 'occasionally', label: '偶尔打鼾' },
          { value: 'frequently', label: '经常打鼾' },
          { value: 'loud_every_night', label: '几乎每晚打鼾且声音很大' },
        ] },
      { id: 'daytime_tiredness', type: 'boolean', label: '白天是否常感到疲倦或嗜睡', required: true },
      { id: 'witnessed_apnea', type: 'boolean', label: '是否有人观察到您睡眠中出现呼吸暂停或喘息', required: true },
      { id: 'hypertension', type: 'boolean', label: '是否有高血压或正在服用降压药', required: true },
      { id: 'bmi', type: 'numeric', label: '您的BMI（体重指数）', required: true, min: 10, max: 60 },
      { id: 'neck_circumference', type: 'numeric', label: '颈围（cm）', required: true, min: 20, max: 60 },
      { id: 'age', type: 'numeric', label: '年龄', required: true, min: 18, max: 100 },
      { id: 'gender', type: 'single_choice', label: '性别', required: true,
        options: [{ value: 'male', label: '男' }, { value: 'female', label: '女' }] },
    ],
  },
  scoringRule: {
    questionWeights: [
      { questionId: 'snoring', optionWeights: { never: 0, occasionally: 0, frequently: 1, loud_every_night: 2 } },
      { questionId: 'daytime_tiredness', booleanWeights: { true: 1, false: 0 } },
      { questionId: 'witnessed_apnea', booleanWeights: { true: 2, false: 0 } },
      { questionId: 'hypertension', booleanWeights: { true: 1, false: 0 } },
      { questionId: 'bmi', numericBands: [
        { min: 10, max: 29.9, points: 0 }, { min: 30, max: 34.9, points: 1 }, { min: 35, max: 60, points: 2 },
      ] },
      { questionId: 'neck_circumference', numericBands: [
        { min: 20, max: 39.9, points: 0 }, { min: 40, max: 42.9, points: 1 }, { min: 43, max: 60, points: 2 },
      ] },
      { questionId: 'age', numericBands: [{ min: 18, max: 49.9, points: 0 }, { min: 50, max: 100, points: 1 }] },
      { questionId: 'gender', optionWeights: { male: 1, female: 0 } },
    ],
    riskBands: [
      { minScore: 0, maxScore: 2, riskLevel: 'low' },
      { minScore: 3, maxScore: 4, riskLevel: 'moderate' },
      { minScore: 5, maxScore: 6, riskLevel: 'high' },
      { minScore: 7, maxScore: 11, riskLevel: 'very_high' },
    ],
    riskFactors: [
      { questionId: 'snoring', triggerValues: ['loud_every_night'], factorLabel: '夜间打鼾声音较大且频繁' },
      { questionId: 'witnessed_apnea', triggerValues: ['true'], factorLabel: '存在他人观察到的呼吸暂停现象' },
      { questionId: 'bmi', numericThreshold: { min: 30 }, factorLabel: 'BMI偏高' },
      { questionId: 'hypertension', triggerValues: ['true'], factorLabel: '存在血压相关风险因素' },
    ],
  },
  resultTemplate: {
    scoreLabel: 'OSA风险评分',
    recommendationsByRiskLevel: {
      low: ['暂无明显风险信号，建议保持规律作息与健康体重'],
      moderate: ['建议关注睡眠质量变化，可记录一段时间的睡眠日志'],
      high: ['建议咨询医生进行进一步睡眠评估，如多导睡眠监测'],
      very_high: ['建议尽快咨询专业医生，必要时进行专业睡眠监测检查'],
    },
    nextActionsByRiskLevel: {
      low: ['了解睡眠健康相关知识'],
      moderate: ['持续观察3-4周后重新评估'],
      high: ['预约睡眠专科或呼吸科门诊咨询'],
      very_high: ['尽快预约睡眠专科门诊'],
    },
    disclaimer: DISCLAIMER,
  },
};

const sleepDefinition = {
  type: 'sleep',
  version: 'v1',
  questionnaireSchema: {
    questions: [
      { id: 'sleep_duration', type: 'single_choice', label: '平均每晚睡眠时长', required: true,
        options: [
          { value: 'lt5', label: '少于5小时' }, { value: '5to6', label: '5-6小时' },
          { value: '6to7', label: '6-7小时' }, { value: 'gte7', label: '7小时以上' },
        ] },
      { id: 'sleep_onset', type: 'single_choice', label: '入睡所需时间', required: true,
        options: [
          { value: 'lt15', label: '15分钟内' }, { value: '15to30', label: '15-30分钟' },
          { value: '30to60', label: '30-60分钟' }, { value: 'gt60', label: '60分钟以上' },
        ] },
      { id: 'night_wakings', type: 'single_choice', label: '夜间醒来的频率', required: true,
        options: [
          { value: 'never', label: '几乎不醒' }, { value: 'once', label: '偶尔1次' },
          { value: 'multiple', label: '经常2次以上' },
        ] },
      { id: 'daytime_function', type: 'boolean', label: '白天是否因睡眠不足影响工作或生活', required: true },
      { id: 'sleep_satisfaction', type: 'single_choice', label: '对自己睡眠质量的整体满意度', required: true,
        options: [
          { value: 'satisfied', label: '满意' }, { value: 'neutral', label: '一般' }, { value: 'dissatisfied', label: '不满意' },
        ] },
    ],
  },
  scoringRule: {
    questionWeights: [
      { questionId: 'sleep_duration', optionWeights: { gte7: 0, '6to7': 1, '5to6': 2, lt5: 3 } },
      { questionId: 'sleep_onset', optionWeights: { lt15: 0, '15to30': 1, '30to60': 2, gt60: 3 } },
      { questionId: 'night_wakings', optionWeights: { never: 0, once: 1, multiple: 2 } },
      { questionId: 'daytime_function', booleanWeights: { true: 2, false: 0 } },
      { questionId: 'sleep_satisfaction', optionWeights: { satisfied: 0, neutral: 1, dissatisfied: 2 } },
    ],
    riskBands: [
      { minScore: 0, maxScore: 2, riskLevel: 'low' },
      { minScore: 3, maxScore: 5, riskLevel: 'moderate' },
      { minScore: 6, maxScore: 8, riskLevel: 'high' },
      { minScore: 9, maxScore: 12, riskLevel: 'very_high' },
    ],
    riskFactors: [
      { questionId: 'sleep_duration', triggerValues: ['lt5'], factorLabel: '睡眠时长明显不足' },
      { questionId: 'daytime_function', triggerValues: ['true'], factorLabel: '睡眠不足已影响日间功能' },
      { questionId: 'night_wakings', triggerValues: ['multiple'], factorLabel: '夜间频繁醒来' },
    ],
  },
  resultTemplate: {
    scoreLabel: '睡眠风险评分（Sleep Score）',
    recommendationsByRiskLevel: {
      low: ['您的睡眠状况整体良好，建议继续保持'],
      moderate: ['建议关注睡眠环境与作息规律性，减少睡前电子设备使用'],
      high: ['建议调整作息习惯并持续观察，如无改善可咨询医生'],
      very_high: ['建议咨询医生或睡眠专科，了解可能的睡眠问题成因'],
    },
    nextActionsByRiskLevel: {
      low: ['了解睡眠卫生相关知识'],
      moderate: ['尝试规律作息2-4周后重新评估'],
      high: ['记录睡眠日志并咨询医生'],
      very_high: ['预约睡眠专科门诊'],
    },
    disclaimer: DISCLAIMER,
  },
};

const stressDefinition = {
  type: 'stress',
  version: 'v1',
  questionnaireSchema: {
    questions: [
      { id: 'overwhelmed', type: 'single_choice', label: '近两周感到难以应对压力的频率', required: true,
        options: [
          { value: 'never', label: '从不' }, { value: 'sometimes', label: '有时' },
          { value: 'often', label: '经常' }, { value: 'always', label: '几乎一直' },
        ] },
      { id: 'irritability', type: 'single_choice', label: '近两周感到烦躁或易怒的频率', required: true,
        options: [
          { value: 'never', label: '从不' }, { value: 'sometimes', label: '有时' }, { value: 'often', label: '经常' },
        ] },
      { id: 'physical_symptoms', type: 'boolean', label: '是否出现头痛/肌肉紧张/胃部不适等身体症状', required: true },
      { id: 'concentration', type: 'boolean', label: '是否感到注意力难以集中', required: true },
      { id: 'coping', type: 'single_choice', label: '您觉得自己目前应对压力的能力', required: true,
        options: [
          { value: 'good', label: '较好' }, { value: 'moderate', label: '一般' }, { value: 'poor', label: '较弱' },
        ] },
    ],
  },
  scoringRule: {
    questionWeights: [
      { questionId: 'overwhelmed', optionWeights: { never: 0, sometimes: 1, often: 2, always: 3 } },
      { questionId: 'irritability', optionWeights: { never: 0, sometimes: 1, often: 2 } },
      { questionId: 'physical_symptoms', booleanWeights: { true: 2, false: 0 } },
      { questionId: 'concentration', booleanWeights: { true: 1, false: 0 } },
      { questionId: 'coping', optionWeights: { good: 0, moderate: 1, poor: 2 } },
    ],
    riskBands: [
      { minScore: 0, maxScore: 2, riskLevel: 'low' },
      { minScore: 3, maxScore: 4, riskLevel: 'moderate' },
      { minScore: 5, maxScore: 7, riskLevel: 'high' },
      { minScore: 8, maxScore: 10, riskLevel: 'very_high' },
    ],
    riskFactors: [
      { questionId: 'overwhelmed', triggerValues: ['always'], factorLabel: '近期持续感到难以应对压力' },
      { questionId: 'physical_symptoms', triggerValues: ['true'], factorLabel: '压力已伴随身体症状' },
    ],
  },
  resultTemplate: {
    scoreLabel: '压力水平自评分',
    recommendationsByRiskLevel: {
      low: ['当前压力水平较为平稳，建议保持现有的放松方式'],
      moderate: ['建议尝试规律运动、冥想等方式缓解压力'],
      high: ['建议关注压力来源并寻求支持，如与亲友沟通或寻求专业咨询'],
      very_high: ['建议尽快寻求专业心理咨询或医生帮助'],
    },
    nextActionsByRiskLevel: {
      low: ['了解压力管理相关知识'],
      moderate: ['尝试正念/呼吸训练等放松技巧'],
      high: ['考虑预约心理咨询师'],
      very_high: ['尽快联系心理咨询或医疗专业人士'],
    },
    disclaimer: DISCLAIMER,
  },
};

const weightLossDefinition = {
  type: 'weight_loss',
  version: 'v1',
  questionnaireSchema: {
    questions: [
      { id: 'bmi', type: 'numeric', label: '您的BMI（体重指数）', required: true, min: 10, max: 60 },
      { id: 'activity_level', type: 'single_choice', label: '每周中等强度运动的天数', required: true,
        options: [
          { value: 'none', label: '几乎不运动' }, { value: '1to2', label: '1-2天' },
          { value: '3to4', label: '3-4天' }, { value: 'gte5', label: '5天以上' },
        ] },
      { id: 'diet_pattern', type: 'single_choice', label: '日常饮食习惯', required: true,
        options: [
          { value: 'balanced', label: '较均衡' }, { value: 'irregular', label: '不规律' }, { value: 'high_sugar_fat', label: '高糖高脂为主' },
        ] },
      { id: 'weight_trend', type: 'single_choice', label: '近6个月体重变化趋势', required: true,
        options: [
          { value: 'stable', label: '基本稳定' }, { value: 'gaining', label: '持续增加' }, { value: 'fluctuating', label: '反复波动' },
        ] },
      { id: 'sleep_adequate', type: 'boolean', label: '睡眠是否充足（每晚7小时以上）', required: true },
    ],
  },
  scoringRule: {
    questionWeights: [
      { questionId: 'bmi', numericBands: [
        { min: 10, max: 23.9, points: 0 }, { min: 24, max: 27.9, points: 1 }, { min: 28, max: 60, points: 2 },
      ] },
      { questionId: 'activity_level', optionWeights: { gte5: 0, '3to4': 0, '1to2': 1, none: 2 } },
      { questionId: 'diet_pattern', optionWeights: { balanced: 0, irregular: 1, high_sugar_fat: 2 } },
      { questionId: 'weight_trend', optionWeights: { stable: 0, fluctuating: 1, gaining: 2 } },
      { questionId: 'sleep_adequate', booleanWeights: { true: 0, false: 1 } },
    ],
    riskBands: [
      { minScore: 0, maxScore: 1, riskLevel: 'low' },
      { minScore: 2, maxScore: 3, riskLevel: 'moderate' },
      { minScore: 4, maxScore: 6, riskLevel: 'high' },
      { minScore: 7, maxScore: 9, riskLevel: 'very_high' },
    ],
    riskFactors: [
      { questionId: 'diet_pattern', triggerValues: ['high_sugar_fat'], factorLabel: '饮食以高糖高脂为主' },
      { questionId: 'weight_trend', triggerValues: ['gaining'], factorLabel: '近期体重持续增加' },
      { questionId: 'activity_level', triggerValues: ['none'], factorLabel: '日常运动量不足' },
    ],
  },
  resultTemplate: {
    scoreLabel: '体重管理风险评分',
    recommendationsByRiskLevel: {
      low: ['当前体重管理状况良好，建议保持现有生活方式'],
      moderate: ['建议适度增加运动频率并关注饮食结构'],
      high: ['建议制定具体的饮食与运动计划，必要时咨询营养师'],
      very_high: ['建议咨询医生或营养师，制定个性化的体重管理方案'],
    },
    nextActionsByRiskLevel: {
      low: ['了解均衡饮食相关知识'],
      moderate: ['尝试记录饮食与运动日志'],
      high: ['考虑咨询营养师'],
      very_high: ['尽快咨询医生或营养专科'],
    },
    disclaimer: DISCLAIMER,
  },
};

const diabetesDefinition = {
  type: 'diabetes',
  version: 'v1',
  questionnaireSchema: {
    questions: [
      { id: 'age', type: 'numeric', label: '年龄', required: true, min: 18, max: 100 },
      { id: 'bmi', type: 'numeric', label: '您的BMI（体重指数）', required: true, min: 10, max: 60 },
      { id: 'family_history', type: 'boolean', label: '直系亲属中是否有糖尿病病史', required: true },
      { id: 'activity_level', type: 'single_choice', label: '每周中等强度运动的天数', required: true,
        options: [
          { value: 'gte3', label: '3天以上' }, { value: '1to2', label: '1-2天' }, { value: 'none', label: '几乎不运动' },
        ] },
      { id: 'high_sugar_diet', type: 'boolean', label: '是否经常摄入含糖饮料或精制碳水', required: true },
      { id: 'gestational_history', type: 'boolean', label: '（如适用）是否有妊娠糖尿病病史', required: false },
    ],
  },
  scoringRule: {
    questionWeights: [
      { questionId: 'age', numericBands: [{ min: 18, max: 44.9, points: 0 }, { min: 45, max: 100, points: 1 }] },
      { questionId: 'bmi', numericBands: [
        { min: 10, max: 23.9, points: 0 }, { min: 24, max: 27.9, points: 1 }, { min: 28, max: 60, points: 2 },
      ] },
      { questionId: 'family_history', booleanWeights: { true: 2, false: 0 } },
      { questionId: 'activity_level', optionWeights: { gte3: 0, '1to2': 1, none: 2 } },
      { questionId: 'high_sugar_diet', booleanWeights: { true: 1, false: 0 } },
      { questionId: 'gestational_history', booleanWeights: { true: 1, false: 0 } },
    ],
    riskBands: [
      { minScore: 0, maxScore: 1, riskLevel: 'low' },
      { minScore: 2, maxScore: 3, riskLevel: 'moderate' },
      { minScore: 4, maxScore: 6, riskLevel: 'high' },
      { minScore: 7, maxScore: 9, riskLevel: 'very_high' },
    ],
    riskFactors: [
      { questionId: 'family_history', triggerValues: ['true'], factorLabel: '存在糖尿病家族史' },
      { questionId: 'bmi', numericThreshold: { min: 28 }, factorLabel: 'BMI偏高' },
      { questionId: 'high_sugar_diet', triggerValues: ['true'], factorLabel: '日常含糖饮食摄入较多' },
    ],
  },
  resultTemplate: {
    scoreLabel: '糖尿病风险自评分',
    recommendationsByRiskLevel: {
      low: ['当前风险因素较少，建议保持健康饮食与运动习惯'],
      moderate: ['建议关注饮食结构，适度增加运动'],
      high: ['建议进行血糖相关检查，咨询医生评估具体情况'],
      very_high: ['建议尽快咨询医生并进行血糖检测，不建议自行判断或用药'],
    },
    nextActionsByRiskLevel: {
      low: ['了解糖尿病风险因素相关知识'],
      moderate: ['尝试记录饮食并增加运动频率'],
      high: ['预约内分泌科或全科门诊检查血糖'],
      very_high: ['尽快预约医生进行专业检测'],
    },
    disclaimer: DISCLAIMER + ' 本评估不构成糖尿病诊断，糖尿病的确诊需通过专业医疗机构的血糖检测完成。',
  },
};

const altitudeDefinition = {
  type: 'altitude',
  version: 'v1',
  questionnaireSchema: {
    questions: [
      { id: 'destination_altitude', type: 'single_choice', label: '计划前往的海拔高度', required: true,
        options: [
          { value: 'lt2500', label: '2500米以下' }, { value: '2500to3500', label: '2500-3500米' },
          { value: '3500to5000', label: '3500-5000米' }, { value: 'gte5000', label: '5000米以上' },
        ] },
      { id: 'ascent_speed', type: 'single_choice', label: '计划的上升速度', required: true,
        options: [
          { value: 'gradual', label: '逐步适应（多日爬升）' }, { value: 'rapid', label: '快速到达（如直接飞抵）' },
        ] },
      { id: 'altitude_history', type: 'boolean', label: '此前是否有高原反应史', required: true },
      { id: 'cardio_condition', type: 'boolean', label: '是否有心肺相关基础疾病', required: true },
      { id: 'physical_fitness', type: 'single_choice', label: '日常体能水平', required: true,
        options: [
          { value: 'good', label: '较好' }, { value: 'moderate', label: '一般' }, { value: 'poor', label: '较弱' },
        ] },
    ],
  },
  scoringRule: {
    questionWeights: [
      { questionId: 'destination_altitude', optionWeights: { lt2500: 0, '2500to3500': 1, '3500to5000': 2, gte5000: 3 } },
      { questionId: 'ascent_speed', optionWeights: { gradual: 0, rapid: 2 } },
      { questionId: 'altitude_history', booleanWeights: { true: 2, false: 0 } },
      { questionId: 'cardio_condition', booleanWeights: { true: 2, false: 0 } },
      { questionId: 'physical_fitness', optionWeights: { good: 0, moderate: 1, poor: 2 } },
    ],
    riskBands: [
      { minScore: 0, maxScore: 1, riskLevel: 'low' },
      { minScore: 2, maxScore: 4, riskLevel: 'moderate' },
      { minScore: 5, maxScore: 7, riskLevel: 'high' },
      { minScore: 8, maxScore: 11, riskLevel: 'very_high' },
    ],
    riskFactors: [
      { questionId: 'altitude_history', triggerValues: ['true'], factorLabel: '此前有高原反应史' },
      { questionId: 'cardio_condition', triggerValues: ['true'], factorLabel: '存在心肺相关基础疾病' },
      { questionId: 'ascent_speed', triggerValues: ['rapid'], factorLabel: '计划快速到达高海拔，缺乏适应过程' },
    ],
  },
  resultTemplate: {
    scoreLabel: '高原健康风险评分',
    recommendationsByRiskLevel: {
      low: ['风险因素较少，建议仍按一般高原旅行注意事项做好准备'],
      moderate: ['建议安排逐步适应海拔的行程，避免快速上升'],
      high: ['建议出行前咨询医生，了解高原反应的预防措施'],
      very_high: ['建议出行前务必咨询医生，评估是否适合前往该海拔地区'],
    },
    nextActionsByRiskLevel: {
      low: ['了解高原健康基础知识'],
      moderate: ['制定逐步适应海拔的行程计划'],
      high: ['出行前咨询医生'],
      very_high: ['出行前预约医生进行专业评估'],
    },
    disclaimer: DISCLAIMER,
  },
};

const definitions = [osaDefinition, sleepDefinition, stressDefinition, weightLossDefinition, diabetesDefinition, altitudeDefinition];

async function main() {
  for (const def of definitions) {
    await prisma.assessment.create({ data: def });
    // eslint-disable-next-line no-console
    console.log(`已创建评估定义: ${def.type} ${def.version}`);
  }
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
