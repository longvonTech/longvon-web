import type { GeoLocale } from './geo';
export const OEM_JOURNEY_ANCHOR = 'sample-to-production';
export const OEM_INTERESTS = ['odm-sample-evaluation', 'odm-pilot-evaluation', 'odm-production-feasibility'] as const;
export function oemJourneyPath(locale: GeoLocale) { return `${locale === 'en' ? '/en' : ''}/smart-ring-oem-odm#${OEM_JOURNEY_ANCHOR}`; }
export function oemJourneyRfqHref(locale: GeoLocale, stage: 0 | 1 | 2 = 0) { return `${locale === 'en' ? '/en' : ''}/partner/oem?keyword=${OEM_INTERESTS[stage]}`; }

// Public quantities intentionally withheld: current procurement source requires RFQ confirmation.
export const OEM_JOURNEY_COPY = {
 en: {
  metaTitle: 'Smart Ring OEM/ODM: Samples, Pilot & Production | LONGVON',
  description: 'Evaluate smart ring samples, scope a pilot and plan OEM/ODM production with LONGVON. Model-specific MOQ, customization and terms are confirmed after project review.',
  title: 'From sample evaluation to pilot and production',
  intro: 'Planning a branded smart ring or a custom ODM project? Start by defining what you need to evaluate, then agree the next technical and commercial gate. A sample inquiry or annual forecast is not a production order.',
  stages: [
   { title: 'Sample evaluation', input: 'Share your intended use, target market, preferred model or reference product, required functions and App/data integration needs.', output: 'Aim of the review: a proposed sample configuration and evaluation scope, with availability and commercial terms to be confirmed.', gate: 'Before proceeding: agree what the sample should demonstrate. A request is not an accepted order or payment confirmation.', cta: 'Discuss sample suitability' },
   { title: 'Pilot production', input: 'Share evaluation feedback, desired pilot quantity and any changes to branding, packaging, hardware or integration.', output: 'Aim of the review: a scoped pilot proposal, validation/acceptance criteria and the changes that need engineering review.', gate: 'Before proceeding: confirm the supported model/configuration, feasibility, pilot quantity and commercial agreement. Pilot availability is project-specific.', cta: 'Evaluate a pilot project' },
   { title: 'Mass-production planning', input: 'Share the target configuration, market, estimated annual demand, timing and feedback from the agreed validation stages.', output: 'Aim of the review: manufacturing feasibility, an agreed production scope and a quotation for the qualified project.', gate: 'Before proceeding: confirm the model-specific MOQ, configuration, acceptance scope and order. Forecast demand does not reserve capacity or establish an order.', cta: 'Request production feasibility review' },
  ],
  moqTitle: 'How are pilot quantity and production MOQ decided?',
  moq: 'Pilot quantities and the production MOQ are confirmed after model, configuration and project evaluation. Sample evaluation, pilot production and a production order are different commitments. Quantity ranges in the inquiry form describe your estimate, not an advertised or recommended manufacturing MOQ.',
  customizationTitle: 'Scope the customization your project actually needs',
  customization: [
   'Existing-platform OEM: discuss the selected hardware, branding and packaging scope.',
   'Custom ODM: evaluate industrial design, hardware and firmware changes with engineering before making a commitment.',
   'Customer-owned App and partner SDK/API: confirm platforms, documentation, permissions and the agreed integration scope; no public self-serve SDK or unrestricted BLE promise.',
   'Algorithms and cloud services: confirm authorized outputs and device/App/cloud responsibilities; many metrics depend on cloud services, not an all-offline assumption.',
  ],
  briefTitle: 'Prepare a useful quotation brief',
  brief: 'Include target market, intended product/model/use case, sample and pilot estimates, annual forecast, required functions and integrations, target timing, and contact details. Unknown items can be discussed; an estimate is not a purchasing commitment. NDA or detailed technical review may be appropriate before sharing design files.',
  cta: 'Discuss your sample-to-production project',
  compactTitle: 'Plan an evaluation before scaling',
  compact: 'Sample suitability → a scoped pilot → production feasibility. Confirm the selected model, customization and commercial terms at each gate.',
  linkLabel: 'Plan a sample-to-pilot-to-production ODM project',
  faqs: [
   { question: 'Can we evaluate samples before committing to production?', answer: 'You can request sample evaluation and discuss suitability for your project. Confirm model/configuration, availability, evaluation scope and commercial terms first; submitting an inquiry does not create an accepted order or confirm payment.' },
   { question: 'Can we run a smaller pilot, and what is the production MOQ?', answer: 'Discuss pilot quantities and the production MOQ after the model, configuration and project have been evaluated. There is no universal pilot or MOQ commitment on this page. The form’s quantity ranges are estimates from the buyer, not recommended production minimums.' },
   { question: 'What can we customize for an OEM or ODM smart ring?', answer: 'Discuss branding/packaging on an existing platform or project-scoped industrial design, hardware, firmware, App, partner SDK/API and cloud algorithm integration. Feasibility and deliverables must be agreed; SDK/data access does not imply unrestricted BLE access or that all algorithms run offline.' },
   { question: 'What do you need for a useful quotation and technical review?', answer: 'Provide the target market, intended product/model/use case, sample/pilot estimates, annual forecast, required functions/integration, timing and contact details. Mark unknowns rather than inventing a budget or order. Prices, timing and other commercial terms are confirmed for the qualified project.' },
  ],
 },
 zh: {
  metaTitle: '智能戒指 OEM/ODM：样品、试产与量产 | LONGVON',
  description: '与 LONGVON 评估智能戒指样品、试产及 OEM/ODM 量产路径。按型号、配置与项目确认 MOQ、定制范围及商务条件。',
  title: '从样品评估到试产与量产',
  intro: '计划推出自有品牌智能戒指或定制 ODM 项目？请先明确需要评估的内容，再约定下一阶段的技术与商务条件。样品咨询或年度采购预测不等于量产订单。',
  stages: [
   { title: '样品评估', input: '说明应用场景、目标市场、意向型号或参考产品、所需功能及 App/数据集成需求。', output: '本轮评估目标：提出样品配置与评估范围建议，供应情况和商务条件另行确认。', gate: '进入下一步前：约定样品需验证的目标。提出需求不等于订单已接受，也不代表已付款。', cta: '咨询样品适配性' },
   { title: '试产评估', input: '提供样品反馈、预计试产数量，以及品牌、包装、硬件或集成方面的变更要求。', output: '本轮评估目标：明确试产方案范围、验证/验收标准及需工程评估的变更。', gate: '进入下一步前：确认支持的型号/配置、可行性、试产数量与商务约定。是否支持试产按项目评估。', cta: '评估试产项目' },
   { title: '量产规划', input: '说明目标配置、市场、预计年度需求、目标时间及约定验证阶段的反馈。', output: '本轮评估目标：评估制造可行性、约定生产范围，并为符合条件的项目提供报价。', gate: '进入下一步前：确认对应型号的 MOQ、配置、验收范围与订单。需求预测不代表预留产能或正式下单。', cta: '申请量产可行性评估' },
  ],
  moqTitle: '试产数量与量产 MOQ 如何确定？',
  moq: '试产数量与量产 MOQ 在型号、配置及项目评估后确认。样品评估、试产与量产订单属于不同承诺阶段。询盘表中的数量区间用于表达您的需求估计，不是对外公布或推荐的生产起订量。',
  customizationTitle: '明确项目实际需要的定制范围',
  customization: [
   '现有平台 OEM：沟通所选硬件、品牌与包装范围。',
   '定制 ODM：工业设计、硬件与固件变更先经工程评估，再作出承诺。',
   '客户自有 App 与合作伙伴 SDK/API：确认平台、文档、权限与约定集成范围；不承诺公开自助 SDK 或无限制 BLE 协议。',
   '算法与云端服务：确认获授权输出及设备/App/云端职责；许多指标依赖云服务，不假设全部算法可离线运行。',
  ],
  briefTitle: '准备有助于报价的项目资料',
  brief: '请提供目标市场、意向产品/型号/场景、样品与试产数量估计、年度需求预测、所需功能和集成、目标时间及联系方式。未知内容可在沟通中补充；需求估计不是采购承诺。分享设计文件前，可按情况先约定保密或详细技术评估。',
  cta: '咨询样品至量产项目',
  compactTitle: '先评估，再规划规模化',
  compact: '样品适配性 → 明确范围的试产 → 量产可行性。每个阶段均确认所选型号、定制范围与商务条件。',
  linkLabel: '规划样品—试产—量产 ODM 合作路径',
  faqs: [
   { question: '能否先评估样品，再决定是否量产？', answer: '可以提出样品评估需求，沟通项目适配性。应先确认型号/配置、供应情况、评估范围与商务条件；提交询盘不代表订单已接受，也不代表已付款。' },
   { question: '能否先做小批量试产，量产 MOQ 是多少？', answer: '试产数量与量产 MOQ 在型号、配置及项目评估后沟通。本页不作通用试产数量或 MOQ 承诺。表单数量区间是买方需求估计，不是推荐的量产起订量。' },
   { question: '智能戒指 OEM/ODM 可以定制哪些范围？', answer: '可讨论现有平台的品牌/包装，或项目范围内的工业设计、硬件、固件、App、合作伙伴 SDK/API 与云端算法集成。可行性和交付内容需约定；SDK/数据接入不等于无限制 BLE 访问，也不代表全部算法离线运行。' },
   { question: '报价与技术评估需要哪些信息？', answer: '请提供目标市场、意向产品/型号/场景、样品/试产数量估计、年度预测、所需功能/集成、时间与联系方式。未知内容请留待确认，不必虚构预算或订单。价格、时间及其他商务条件按符合要求的具体项目确认。' },
  ],
 },
} as const;
