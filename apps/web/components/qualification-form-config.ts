import type { CooperationType } from '../lib/partner-api';
import type { SiteLocale } from '../lib/i18n-routes';

/**
 * 各合作类型的表单字段展示差异配置。
 *
 * 设计说明（重要，呼应TASK-104C"统一验证规则、统一提交逻辑"）：
 * Leads表的字段集是固定的（呼应TASK-104B冻结的字段清单），不存在
 * "Hospital类型在数据库里有专属字段、OEM类型又有另一套专属字段"这种情况。
 * "动态字段"体现在这一层——同一个remark文本字段，根据cooperation_type
 * 显示不同的引导文案与占位提示，引导用户填入该类型最相关的补充信息，
 * 后端收到的始终是同一个CreateLeadDto，校验规则与提交逻辑完全统一。
 */
export interface CooperationFieldConfig {
  label: string;
  positionLabel: string;
  positionPlaceholder: string;
  remarkLabel: string;
  remarkPlaceholder: string;
  companyLabel: string;
}

export interface FormChromeCopy {
  formTitleSuffix: string;
  contactName: string;
  phone: string;
  email: string;
  emailRequired: boolean;
  websiteHoneypot: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
}

const CONFIG_ZH: Record<CooperationType, CooperationFieldConfig> = {
  hospital: {
    label: '医院合作',
    positionLabel: '科室 / 职务',
    positionPlaceholder: '如：睡眠医学中心 主任',
    remarkLabel: '合作意向说明',
    remarkPlaceholder: '如：希望了解临床研究合作或科室设备引入流程',
    companyLabel: '医院名称',
  },
  pharmacy: {
    label: '药房渠道合作',
    positionLabel: '职务',
    positionPlaceholder: '如：连锁采购负责人',
    remarkLabel: '门店规模说明',
    remarkPlaceholder: '如：门店数量、所在区域',
    companyLabel: '药房 / 连锁名称',
  },
  oem: {
    label: 'OEM代工合作',
    positionLabel: '职务',
    positionPlaceholder: '如：采购总监',
    remarkLabel: '产能与需求说明',
    remarkPlaceholder: '如：预计年采购量、质量体系认证情况',
    companyLabel: '企业名称',
  },
  odm: {
    label: 'ODM合作',
    positionLabel: '职务',
    positionPlaceholder: '如：产品负责人',
    remarkLabel: '产品需求说明',
    remarkPlaceholder: '如：目标产品形态、上市时间要求',
    companyLabel: '企业名称',
  },
  distributor: {
    label: '区域代理合作',
    positionLabel: '职务',
    positionPlaceholder: '如：渠道负责人',
    remarkLabel: '区域与渠道说明',
    remarkPlaceholder: '如：意向代理区域、现有渠道资源',
    companyLabel: '公司名称',
  },
  enterprise: {
    label: '企业批量采购',
    positionLabel: '职务',
    positionPlaceholder: '如：人力资源 / 员工福利负责人',
    remarkLabel: '采购规模说明',
    remarkPlaceholder: '如：预计采购数量、用途（员工健康福利/团建活动等）',
    companyLabel: '企业名称',
  },
};

const CONFIG_EN: Record<CooperationType, CooperationFieldConfig> = {
  hospital: {
    label: 'Hospital collaboration',
    positionLabel: 'Department / Role',
    positionPlaceholder: 'e.g. Sleep Medicine Center Director',
    remarkLabel: 'Project notes',
    remarkPlaceholder: 'e.g. clinical research interest or department evaluation flow',
    companyLabel: 'Hospital name',
  },
  pharmacy: {
    label: 'Pharmacy channel',
    positionLabel: 'Role',
    positionPlaceholder: 'e.g. Chain procurement lead',
    remarkLabel: 'Store footprint',
    remarkPlaceholder: 'e.g. number of stores and regions',
    companyLabel: 'Pharmacy / chain name',
  },
  oem: {
    label: 'OEM / ODM',
    positionLabel: 'Role',
    positionPlaceholder: 'e.g. Procurement Director',
    remarkLabel: 'Volume & requirements',
    remarkPlaceholder: 'e.g. estimated annual volume, certifications, customization needs',
    companyLabel: 'Company name',
  },
  odm: {
    label: 'ODM',
    positionLabel: 'Role',
    positionPlaceholder: 'e.g. Product Manager',
    remarkLabel: 'Product requirements',
    remarkPlaceholder: 'e.g. target form factor and launch timeline',
    companyLabel: 'Company name',
  },
  distributor: {
    label: 'Regional distribution',
    positionLabel: 'Role',
    positionPlaceholder: 'e.g. Channel lead',
    remarkLabel: 'Territory & channels',
    remarkPlaceholder: 'e.g. target regions and existing channel assets',
    companyLabel: 'Company name',
  },
  enterprise: {
    label: 'Enterprise programs',
    positionLabel: 'Role',
    positionPlaceholder: 'e.g. HR / employee wellness lead',
    remarkLabel: 'Program scale',
    remarkPlaceholder: 'e.g. estimated quantity and use case',
    companyLabel: 'Company name',
  },
};

const CHROME_ZH: FormChromeCopy = {
  formTitleSuffix: '意向登记',
  contactName: '联系人姓名 *',
  phone: '手机号 *',
  email: '邮箱',
  emailRequired: false,
  websiteHoneypot: '网站',
  submit: '提交合作意向',
  submitting: '提交中...',
  success: '提交成功，我们会在1-2个工作日内与您联系。',
  error: '提交失败，请稍后重试或直接联系我们。',
};

const CHROME_EN: FormChromeCopy = {
  formTitleSuffix: ' inquiry',
  contactName: 'Contact name *',
  phone: 'Phone / WhatsApp *',
  email: 'Work email *',
  emailRequired: true,
  websiteHoneypot: 'Website',
  submit: 'Submit inquiry',
  submitting: 'Submitting...',
  success: 'Thanks — our team will reply within 1–2 business days.',
  error: 'Submission failed. Please try again or email us directly.',
};

/** @deprecated Prefer getCooperationFieldConfig(type, locale) */
export const COOPERATION_FIELD_CONFIG = CONFIG_ZH;

export function getCooperationFieldConfig(
  cooperationType: CooperationType,
  locale: SiteLocale = 'zh',
): CooperationFieldConfig {
  return (locale === 'en' ? CONFIG_EN : CONFIG_ZH)[cooperationType];
}

export function getFormChromeCopy(locale: SiteLocale = 'zh'): FormChromeCopy {
  return locale === 'en' ? CHROME_EN : CHROME_ZH;
}
