'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { submitPartnerLead, type CooperationType } from '../lib/partner-api';
import { captureLeadAttribution, readLeadAttribution } from '../lib/lead-attribution';
import type { SiteLocale } from '../lib/i18n-routes';

interface Props {
  locale?: SiteLocale;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const PROJECT_TYPES = [
  { value: 'OEM', coop: 'oem' as CooperationType },
  { value: 'ODM', coop: 'odm' as CooperationType },
  { value: 'Private Label', coop: 'oem' as CooperationType },
  { value: 'Technology Integration', coop: 'oem' as CooperationType },
  { value: 'Healthcare / Digital Health', coop: 'oem' as CooperationType },
  { value: 'Research / Pilot Project', coop: 'oem' as CooperationType },
  { value: 'Other', coop: 'oem' as CooperationType },
];

const PRODUCT_INTERESTS = [
  'General health monitoring',
  'Sleep monitoring',
  'Sleep respiratory monitoring',
  'OSA-related monitoring',
  'HR / HRV',
  'SpO₂',
  'Custom health monitoring',
  'Other',
];

const PROJECT_STAGES = [
  'Idea / Concept',
  'Product Development',
  'Prototype / Sample Evaluation',
  'Ready for Production',
  'Existing Product Upgrade',
  'Other',
];

const QUANTITIES = [
  'Sample / Evaluation',
  '100–300',
  '300–1,000',
  '1,000–5,000',
  '5,000–10,000',
  '10,000+',
  'Not decided yet',
];

const CAPABILITIES = [
  'Hardware',
  'Firmware',
  'Health Algorithms',
  'Mobile App',
  'SDK',
  'Cloud API',
  'Manufacturing',
  'Full Product Development',
  'Healthcare / Digital Health Integration',
];

const MARKETS = ['Australia', 'North America', 'Europe', 'UK', 'Asia', 'Middle East', 'Other'];

const TIMELINES = [
  'Exploring',
  'Within 3 months',
  '3–6 months',
  '6–12 months',
  'More than 12 months',
  'Not decided',
];

function isValidEmail(value: string): boolean {
  const v = value.trim();
  if (!v || v.length > 200) return false;
  // Reject incomplete / placeholder values while allowing Gmail/Outlook/Yahoo.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return false;
  if (v.endsWith('@') || v.startsWith('@')) return false;
  return true;
}

function buildRemark(parts: Record<string, string>): string {
  const lines = Object.entries(parts)
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${k}: ${v.trim()}`);
  return lines.join('\n').slice(0, 2000);
}

const copy = {
  zh: {
    title: 'OEM/ODM 项目需求',
    name: '联系人姓名 *',
    company: '公司名称 *',
    email: '商务邮箱 *',
    phone: '电话 / WhatsApp *',
    projectType: '项目类型 *',
    productInterest: '产品方向 *',
    projectStage: '项目阶段 *',
    quantity: '预计初始数量（非 MOQ）',
    capabilities: '所需能力（可多选）',
    market: '目标市场 / 区域',
    timeline: '目标时间线',
    message: '项目需求说明',
    messagePlaceholder:
      '请描述产品需求、目标市场、所需功能，或已有规格要点（可选）。',
    privacy: '您提交的信息仅用于评估与回复本次项目咨询，不会用于无关用途。',
    submit: '提交 OEM/ODM 项目需求',
    submitting: '提交中…',
    successTitle: '您的询盘已成功提交。',
    successBody: '我们的团队将审核您的项目需求，并通过邮件与您联系。',
    error: '无法提交您的请求。请重试，或通过本站合作渠道再次联系我们。',
    emailInvalid: '请输入有效的商务邮箱地址。',
    requiredMissing: '请填写所有必填项。',
    selectPlaceholder: '请选择',
  },
  en: {
    title: 'OEM/ODM Project Inquiry',
    name: 'Name *',
    company: 'Company *',
    email: 'Business Email *',
    phone: 'Phone / WhatsApp *',
    projectType: 'Project Type *',
    productInterest: 'Product Interest *',
    projectStage: 'Project Stage *',
    quantity: 'Estimated Initial Quantity (not MOQ)',
    capabilities: 'Required Capabilities (multi-select)',
    market: 'Target Market / Region',
    timeline: 'Target Timeline',
    message: 'Project Requirements / Message',
    messagePlaceholder:
      'Please describe your product requirements, target market, required functions, or any existing specifications.',
    privacy: 'Your information will only be used to evaluate and respond to your project inquiry.',
    submit: 'Request OEM/ODM Consultation',
    submitting: 'Submitting…',
    successTitle: 'Your inquiry has been submitted successfully.',
    successBody:
      'Our team will review your project requirements and contact you by email. Meanwhile you can review LONGVON credentials and delivery evidence:',
    error: "We couldn't submit your request. Please try again or contact us through this site's partner channels.",
    emailInvalid: 'Please enter a valid business email address.',
    requiredMissing: 'Please complete all required fields.',
    selectPlaceholder: 'Please select',
  },
} as const;

const PROJECT_TYPE_LABELS_ZH: Record<string, string> = {
  OEM: 'OEM',
  ODM: 'ODM',
  'Private Label': '贴牌 / Private Label（意向分类）',
  'Technology Integration': '技术集成',
  'Healthcare / Digital Health': '医疗健康 / 数字健康',
  'Research / Pilot Project': '研究 / 试点项目',
  Other: '其他',
};

const PRODUCT_LABELS_ZH: Record<string, string> = {
  'General health monitoring': '综合健康监测',
  'Sleep monitoring': '睡眠监测',
  'Sleep respiratory monitoring': '睡眠呼吸健康监测',
  'OSA-related monitoring': 'OSA 相关监测',
  'HR / HRV': '心率 / HRV',
  'SpO₂': 'SpO₂',
  'Custom health monitoring': '定制健康监测',
  Other: '其他',
};

const STAGE_LABELS_ZH: Record<string, string> = {
  'Idea / Concept': '概念 / 立项',
  'Product Development': '产品开发中',
  'Prototype / Sample Evaluation': '样品 / 原型评估',
  'Ready for Production': '准备量产',
  'Existing Product Upgrade': '既有产品升级',
  Other: '其他',
};

const QUANTITY_LABELS_ZH: Record<string, string> = {
  'Sample / Evaluation': '样品 / 评估',
  '100–300': '100–300',
  '300–1,000': '300–1,000',
  '1,000–5,000': '1,000–5,000',
  '5,000–10,000': '5,000–10,000',
  '10,000+': '10,000+',
  'Not decided yet': '尚未确定',
};

const CAP_LABELS_ZH: Record<string, string> = {
  Hardware: '硬件',
  Firmware: '固件',
  'Health Algorithms': '健康算法',
  'Mobile App': '移动 App',
  SDK: 'SDK',
  'Cloud API': '云端 API',
  Manufacturing: '生产制造',
  'Full Product Development': '端到端产品开发',
  'Healthcare / Digital Health Integration': '医疗健康 / 数字健康集成',
};

const MARKET_LABELS_ZH: Record<string, string> = {
  Australia: '澳大利亚',
  'North America': '北美',
  Europe: '欧洲',
  UK: '英国',
  Asia: '亚洲',
  'Middle East': '中东',
  Other: '其他',
};

const TIMELINE_LABELS_ZH: Record<string, string> = {
  Exploring: '探索中',
  'Within 3 months': '3 个月内',
  '3–6 months': '3–6 个月',
  '6–12 months': '6–12 个月',
  'More than 12 months': '12 个月以上',
  'Not decided': '尚未确定',
};

export function OemRfqForm({ locale = 'zh' }: Props) {
  const t = copy[locale];
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('');
  const [productInterest, setProductInterest] = useState('');
  const [projectStage, setProjectStage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [market, setMarket] = useState('');
  const [timeline, setTimeline] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldError, setFieldError] = useState('');

  useEffect(() => {
    captureLeadAttribution(pathname);
  }, [pathname]);

  const label = useMemo(
    () => ({
      projectType: (v: string) => (locale === 'zh' ? PROJECT_TYPE_LABELS_ZH[v] ?? v : v),
      product: (v: string) => (locale === 'zh' ? PRODUCT_LABELS_ZH[v] ?? v : v),
      stage: (v: string) => (locale === 'zh' ? STAGE_LABELS_ZH[v] ?? v : v),
      quantity: (v: string) => (locale === 'zh' ? QUANTITY_LABELS_ZH[v] ?? v : v),
      cap: (v: string) => (locale === 'zh' ? CAP_LABELS_ZH[v] ?? v : v),
      market: (v: string) => (locale === 'zh' ? MARKET_LABELS_ZH[v] ?? v : v),
      timeline: (v: string) => (locale === 'zh' ? TIMELINE_LABELS_ZH[v] ?? v : v),
    }),
    [locale],
  );

  function toggleCapability(value: string) {
    setCapabilities((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage('');
    setFieldError('');

    if (!contactName.trim() || !companyName.trim() || !phone.trim() || !projectType || !productInterest || !projectStage) {
      setFieldError(t.requiredMissing);
      return;
    }
    if (!isValidEmail(email)) {
      setFieldError(t.emailInvalid);
      return;
    }

    const selected = PROJECT_TYPES.find((p) => p.value === projectType);
    const cooperationType = selected?.coop ?? 'oem';

    const remark = buildRemark({
      'Project Type': projectType,
      'Product Interest': productInterest,
      'Project Stage': projectStage,
      'Estimated Initial Quantity': quantity,
      Capabilities: capabilities.join('; '),
      'Target Market': market,
      Timeline: timeline,
      Message: message,
    });

    setState('submitting');
    try {
      const attr = readLeadAttribution(pathname);
      const keywordBits = [
        searchParams.get('keyword') || undefined,
        attr.aiSource ? `ai:${attr.aiSource}` : undefined,
      ].filter(Boolean);
      await submitPartnerLead({
        companyName: companyName.trim(),
        contactName: contactName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        cooperationType,
        remark: remark || undefined,
        sourcePage: pathname,
        landingPage: attr.firstLandingPage || attr.landingPage,
        referrer: attr.firstReferrer || attr.referrer,
        utmSource: attr.firstUtmSource || attr.utmSource || attr.aiSource || undefined,
        utmMedium: attr.firstUtmMedium || attr.utmMedium || (attr.aiSource ? 'ai_assistant' : undefined),
        utmCampaign: attr.firstUtmCampaign || attr.utmCampaign || undefined,
        sourceKeyword: keywordBits.length ? keywordBits.join('|') : undefined,
        firstLandingPage: attr.firstLandingPage,
        firstReferrer: attr.firstReferrer,
        firstUtmSource: attr.firstUtmSource,
        firstUtmMedium: attr.firstUtmMedium,
        firstUtmCampaign: attr.firstUtmCampaign,
        firstUtmContent: attr.firstUtmContent,
        firstUtmTerm: attr.firstUtmTerm,
        firstVisitAt: attr.firstVisitAt,
        latestLandingPage: attr.latestLandingPage,
        latestReferrer: attr.latestReferrer,
        latestUtmSource: attr.latestUtmSource,
        latestUtmMedium: attr.latestUtmMedium,
        latestUtmCampaign: attr.latestUtmCampaign,
        latestVisitAt: attr.latestVisitAt,
        attributionChannel: attr.attributionChannel,
        attributionConfidence: attr.attributionConfidence,
        website: honeypot || undefined,
      });
      setState('success');
    } catch {
      setState('error');
      setErrorMessage(t.error);
    }
  }

  if (state === 'success') {
    return (
      <div
        style={{
          padding: 24,
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: 12,
          color: '#065F46',
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: 8 }}>{t.successTitle}</p>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{t.successBody}</p>
        {locale === 'en' ? (
          <p style={{ margin: '12px 0 0', fontSize: 14 }}>
            <a href="/en/company/longvon#company-trust-heading" style={{ color: '#047857', fontWeight: 600 }}>
              View LONGVON credentials &amp; delivery evidence →
            </a>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560, width: '100%' }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 650, margin: 0 }}>{t.title}</h2>

      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>{locale === 'zh' ? '联系信息' : 'Contact'}</legend>
        <label style={labelStyle}>
          {t.name}
          <input required value={contactName} onChange={(e) => setContactName(e.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          {t.company}
          <input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          {t.email}
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          {t.phone}
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
            placeholder={locale === 'en' ? '+1 / +44 / +61…' : '+86 / WhatsApp'}
          />
        </label>
      </fieldset>

      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>{locale === 'zh' ? '项目信息' : 'Project'}</legend>
        <label style={labelStyle}>
          {t.projectType}
          <select
            required
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            style={inputStyle}
          >
            <option value="">{t.selectPlaceholder}</option>
            {PROJECT_TYPES.map((p) => (
              <option key={p.value} value={p.value}>
                {label.projectType(p.value)}
              </option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          {t.productInterest}
          <select
            required
            value={productInterest}
            onChange={(e) => setProductInterest(e.target.value)}
            style={inputStyle}
          >
            <option value="">{t.selectPlaceholder}</option>
            {PRODUCT_INTERESTS.map((p) => (
              <option key={p} value={p}>
                {label.product(p)}
              </option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          {t.projectStage}
          <select
            required
            value={projectStage}
            onChange={(e) => setProjectStage(e.target.value)}
            style={inputStyle}
          >
            <option value="">{t.selectPlaceholder}</option>
            {PROJECT_STAGES.map((p) => (
              <option key={p} value={p}>
                {label.stage(p)}
              </option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          {t.quantity}
          <select value={quantity} onChange={(e) => setQuantity(e.target.value)} style={inputStyle}>
            <option value="">{t.selectPlaceholder}</option>
            {QUANTITIES.map((p) => (
              <option key={p} value={p}>
                {label.quantity(p)}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>{t.capabilities}</legend>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 8,
          }}
        >
          {CAPABILITIES.map((cap) => (
            <label
              key={cap}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: 14,
                color: '#374151',
                lineHeight: 1.4,
              }}
            >
              <input
                type="checkbox"
                checked={capabilities.includes(cap)}
                onChange={() => toggleCapability(cap)}
                style={{ marginTop: 3 }}
              />
              <span>{label.cap(cap)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>{locale === 'zh' ? '市场与时间' : 'Market & Timeline'}</legend>
        <label style={labelStyle}>
          {t.market}
          <select value={market} onChange={(e) => setMarket(e.target.value)} style={inputStyle}>
            <option value="">{t.selectPlaceholder}</option>
            {MARKETS.map((p) => (
              <option key={p} value={p}>
                {label.market(p)}
              </option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          {t.timeline}
          <select value={timeline} onChange={(e) => setTimeline(e.target.value)} style={inputStyle}>
            <option value="">{t.selectPlaceholder}</option>
            {TIMELINES.map((p) => (
              <option key={p} value={p}>
                {label.timeline(p)}
              </option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          {t.message}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.messagePlaceholder}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </label>
      </fieldset>

      <div style={{ display: 'none' }} aria-hidden="true">
        <label>
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <p style={{ margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{t.privacy}</p>

      {fieldError ? <p style={{ color: '#B91C1C', margin: 0, fontSize: 14 }}>{fieldError}</p> : null}
      {state === 'error' ? <p style={{ color: '#B91C1C', margin: 0, fontSize: 14 }}>{errorMessage}</p> : null}

      <button type="submit" disabled={state === 'submitting'} style={buttonStyle}>
        {state === 'submitting' ? t.submitting : t.submit}
      </button>
    </form>
  );
}

const fieldsetStyle: React.CSSProperties = {
  border: '1px solid #E5E7EB',
  borderRadius: 12,
  padding: '16px 14px',
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const legendStyle: React.CSSProperties = {
  padding: '0 6px',
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 14,
  fontWeight: 500,
  color: '#111827',
};

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  marginTop: 6,
  padding: '10px 12px',
  border: '1px solid #D1D5DB',
  borderRadius: 8,
  fontSize: 15,
  background: '#fff',
};

const buttonStyle: React.CSSProperties = {
  padding: '14px 20px',
  background: '#2563EB',
  color: '#fff',
  border: 'none',
  borderRadius: 980,
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
};
