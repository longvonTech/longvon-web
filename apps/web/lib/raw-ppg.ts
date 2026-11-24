import type { GeoLocale } from './geo';

export const RAW_PPG_ANCHOR = '100hz-raw-ppg';
export function rawPpgSectionPath(locale: GeoLocale): string {
  return `${locale === 'en' ? '/en' : ''}/smart-ring-sdk-api#${RAW_PPG_ANCHOR}`;
}
export function rawPpgRfqHref(locale: GeoLocale): string {
  // An internal interest keyword, not a fabricated acquisition campaign. Existing first/latest UTM capture is unchanged.
  return `${locale === 'en' ? '/en' : ''}/partner/oem?keyword=100hz-raw-ppg`;
}

export const RAW_PPG_COPY = {
  en: {
    title: '100Hz Raw PPG Data',
    intro: 'Evaluating raw signals for your wearable product, digital-health platform, algorithm team or research project? Qualified OEM/ODM partners can discuss 100Hz PPG raw-data access through LONGVON’s agreed SDK and project pathway. This is a technical evaluation, not a public SDK download or a guarantee for every ring model.',
    meaningTitle: 'What 100Hz means — and what to evaluate',
    meaning: '100Hz describes a sampling frequency of 100 samples per second. It does not by itself specify continuous recording, wireless streaming latency, buffering duration or cloud API update frequency. Start with the signal and integration requirements your R&D team needs to evaluate; confirm the actual sampling and delivery configuration in the technical SOW.',
    responsibilitiesTitle: 'Device data and cloud algorithms are different scopes',
    responsibilities: [
      { title: 'Partner SDK / customer-owned App', body: 'The SDK provides agreed device-connectivity and data pathways. Customer-owned App integration is supported subject to project evaluation; confirm the supported ring model, SDK platforms and available data before planning implementation.' },
      { title: 'Cloud algorithms / Cloud API', body: 'Many health metrics use LONGVON cloud algorithm services. Raw-data access does not mean that all algorithms run offline, that every metric is available through an API, or that unrestricted BLE protocol access is included. Define the device, App and cloud responsibilities separately.' },
    ],
    scopeTitle: 'Agree the technical scope before implementation',
    scopeIntro: 'Use discovery, NDA and the technical statement of work to confirm the following. These are evaluation questions, not published specifications or default entitlements.',
    scope: [
      { title: 'Hardware and sampling', body: 'Supported ring model and hardware revision; required signals; sampling configuration and any operating constraints.' },
      { title: 'Data delivery', body: 'Raw-data format, units, timing information, transfer method and buffering behavior. No packet format, retention period or latency is specified here.' },
      { title: 'App and SDK integration', body: 'Customer App ownership, target platforms, SDK availability, documentation and the agreed integration/support scope.' },
      { title: 'Permissions and cloud scope', body: 'Who may access/use the data; handling requirements; authorized algorithm outputs; any cloud/API dependencies and environments.' },
    ],
    processTitle: 'Start with a scoped technical consultation',
    process: ['Share your use case, target platforms, raw-signal requirements and customer-owned App plan.', 'Discuss discovery/NDA and confirm the supported hardware and SDK pathway.', 'Agree data permissions, device/cloud responsibilities, technical SOW and commercial scope before implementation.'],
    caution: 'Raw PPG availability is not evidence of clinical validation. Ring1C is a consumer health-monitoring reference product, not a medical device; Chinese regulatory progress does not establish overseas medical-device clearance.',
    cta: 'Discuss a 100Hz raw PPG project',
    ctaNote: 'Tell us what you need to evaluate. Data access, licensing and integration scope are agreed per project; no public price or licensing entitlement is implied.',
    linkLabel: 'Evaluate 100Hz raw PPG via the partner SDK',
    faqs: [
      { question: 'Does 100Hz raw PPG mean continuous real-time BLE streaming?', answer: 'No continuous-streaming or latency guarantee is made here. 100Hz describes sampling frequency. Qualified partners discuss the agreed SDK pathway; sampling configuration, transfer and buffering behavior must be confirmed in the technical SOW. Unrestricted BLE access is not a default offer.' },
      { question: 'Which ring model, raw-data format and SDK platform should we use?', answer: 'Confirm the supported ring model, hardware revision, SDK platforms, raw-data format and delivery scope during technical consultation. This page does not publish a universal model/platform compatibility list or packet specification.' },
      { question: 'Can raw PPG replace LONGVON cloud algorithms or establish a diagnosis?', answer: 'No such claim is made. Many health metrics depend on LONGVON cloud services; raw-data access and algorithm authorization are separate scopes. Ring1C is not a medical device, and raw-signal access is not evidence of diagnostic capability or clinical validation.' },
      { question: 'What should we provide for a raw PPG technical consultation?', answer: 'Share your intended use, target App platforms, raw-signal requirements and data-handling needs. Discovery/NDA and a technical SOW establish the supported hardware, SDK/data pathway, permissions and cloud responsibilities. SDK access is project-scoped, not a public self-serve download.' },
    ],
  },
  zh: {
    title: '100Hz PPG 原始数据',
    intro: '正在为可穿戴产品、数字健康平台、算法团队或研究项目评估原始信号？符合条件的 OEM/ODM 合作伙伴可通过 LONGVON 约定的 SDK 与项目路径讨论 100Hz PPG 原始数据接入。这属于技术评估，不是公开 SDK 下载，也不是对所有戒指型号的保证。',
    meaningTitle: '100Hz 的含义与评估重点',
    meaning: '100Hz 表示每秒 100 次采样的采样频率，本身不代表连续记录、无线传输延迟、缓存时长或云端 API 更新频率。请先明确研发团队需要评估的信号与集成要求，再在技术工作说明书（SOW）中确认实际采样与交付配置。',
    responsibilitiesTitle: '设备数据与云端算法属于不同范围',
    responsibilities: [
      { title: '合作伙伴 SDK / 客户自有 App', body: 'SDK 提供约定的设备连接与数据通路。支持按项目评估客户自有 App 集成；开始实施规划前，应确认支持的戒指型号、SDK 平台及可用数据。' },
      { title: '云端算法 / Cloud API', body: '许多健康指标通过 LONGVON 云端算法服务提供。原始数据接入不代表所有算法均可离线运行、每个指标均已开放 API，或包含无限制 BLE 协议访问。设备、App 与云端的职责应分别定义。' },
    ],
    scopeTitle: '实施前确认技术范围',
    scopeIntro: '在需求沟通、保密约定与技术 SOW 中确认以下内容。这些是评估问题，不是已发布的规格或默认权益。',
    scope: [
      { title: '硬件与采样', body: '支持的戒指型号与硬件版本、所需信号、采样配置及运行约束。' },
      { title: '数据交付', body: '原始数据格式、单位、时间信息、传输方式与缓存行为。本页不定义数据包格式、保留期限或传输延迟。' },
      { title: 'App 与 SDK 集成', body: '客户 App 归属、目标平台、SDK 可用性、文档与约定的集成及支持范围。' },
      { title: '权限与云端范围', body: '数据访问和使用主体、处理要求、获授权的算法输出，以及云端/API 依赖和运行环境。' },
    ],
    processTitle: '从明确范围的技术咨询开始',
    process: ['说明应用场景、目标平台、原始信号需求及客户自有 App 计划。', '沟通需求与保密约定，确认支持的硬件和 SDK 路径。', '实施前约定数据权限、端云职责、技术 SOW 与商务合作范围。'],
    caution: '原始 PPG 的可用性不等于临床验证证据。Ring1C 是消费级健康监测参考产品，不是医疗器械；中国监管进展不构成海外医疗器械批准。',
    cta: '咨询 100Hz PPG 原始数据项目',
    ctaNote: '请说明需要评估的内容。数据访问、授权及集成范围按项目约定，本页不构成公开价格或默认授权权益。',
    linkLabel: '通过合作伙伴 SDK 评估 100Hz PPG 原始数据',
    faqs: [
      { question: '100Hz PPG 原始数据是否代表连续实时 BLE 传输？', answer: '本页不承诺连续传输或固定延迟。100Hz 表示采样频率；符合条件的合作伙伴通过约定的 SDK 路径讨论接入，采样配置、传输与缓存行为须在技术 SOW 中确认。无限制 BLE 访问不是默认权益。' },
      { question: '应该使用哪种戒指型号、原始数据格式及 SDK 平台？', answer: '请在技术咨询中确认支持的戒指型号、硬件版本、SDK 平台、原始数据格式及交付范围。本页不发布通用型号/平台兼容清单或数据包规格。' },
      { question: '原始 PPG 能否替代 LONGVON 云端算法或用于确诊？', answer: '本页不作此类承诺。许多健康指标依赖 LONGVON 云端服务；原始数据接入与算法授权属于不同范围。Ring1C 不是医疗器械，原始信号接入也不构成诊断能力或临床验证证据。' },
      { question: '申请 PPG 原始数据技术咨询需准备什么？', answer: '请说明应用场景、目标 App 平台、原始信号要求及数据处理需求。通过需求沟通、保密约定与技术 SOW 确定支持的硬件、SDK/数据路径、权限和端云职责。SDK 按项目开通，不提供公开自助下载。' },
    ],
  },
} as const;
