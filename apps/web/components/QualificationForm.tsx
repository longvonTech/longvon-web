'use client';

import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { submitPartnerLead, type CooperationType } from '../lib/partner-api';
import { COOPERATION_FIELD_CONFIG } from './qualification-form-config';

interface Props {
  cooperationType: CooperationType;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

/**
 * 统一的合作意向表单组件，供全部6个Partner Landing Page复用。
 * 呼应TASK-104C"统一验证规则、统一提交逻辑"——本组件不为每个cooperationType
 * 编写独立的表单组件，只是渲染时按COOPERATION_FIELD_CONFIG切换文案，
 * 提交逻辑(handleSubmit)对全部类型完全一致。
 *
 * 来源追踪字段（呼应TASK-104B"支持SEO来源追踪"）：utm_source/utm_medium/
 * utm_campaign从当前URL查询参数读取，source_page记录当前落地页路径，
 * 全部在提交时随表单一并发送给后端，不依赖后端去解析referrer等不可靠信息。
 */
export function QualificationForm({ cooperationType }: Props) {
  const config = COOPERATION_FIELD_CONFIG[cooperationType];
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [remark, setRemark] = useState('');
  const [honeypot, setHoneypot] = useState(''); // 正常用户看不到这个字段，不应该有值
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('submitting');
    setErrorMessage('');

    try {
      await submitPartnerLead({
        companyName: companyName || undefined,
        contactName,
        phone,
        email: email || undefined,
        position: position || undefined,
        cooperationType,
        remark: remark || undefined,
        sourcePage: pathname,
        utmSource: searchParams.get('utm_source') || undefined,
        utmMedium: searchParams.get('utm_medium') || undefined,
        utmCampaign: searchParams.get('utm_campaign') || undefined,
        sourceKeyword: searchParams.get('keyword') || undefined,
        website: honeypot || undefined,
      });
      setState('success');
    } catch {
      setState('error');
      setErrorMessage('提交失败，请稍后重试或直接联系我们。');
    }
  }

  if (state === 'success') {
    return (
      <div style={{ padding: 24, background: '#f0f9f0', borderRadius: 8, color: '#2d6a2d' }}>
        提交成功，我们会在1-2个工作日内与您联系。
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600 }}>{config.label}意向登记</h3>

      <label>
        {config.companyLabel}
        <input value={companyName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)} style={inputStyle} />
      </label>

      <label>
        联系人姓名 *
        <input required value={contactName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactName(e.target.value)} style={inputStyle} />
      </label>

      <label>
        手机号 *
        <input
          required
          type="tel"
          value={phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
          style={inputStyle}
        />
      </label>

      <label>
        邮箱
        <input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} style={inputStyle} />
      </label>

      <label>
        {config.positionLabel}
        <input
          value={position}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPosition(e.target.value)}
          placeholder={config.positionPlaceholder}
          style={inputStyle}
        />
      </label>

      <label>
        {config.remarkLabel}
        <textarea
          value={remark}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRemark(e.target.value)}
          placeholder={config.remarkPlaceholder}
          rows={3}
          style={inputStyle}
        />
      </label>

      {/* Honeypot字段：CSS隐藏，真实用户看不到也不会填写，机器人脚本常会无差别填充 */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
        <label>
          网站
          <input
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      {state === 'error' && <p style={{ color: '#c0392b' }}>{errorMessage}</p>}

      <button type="submit" disabled={state === 'submitting'} style={buttonStyle}>
        {state === 'submitting' ? '提交中...' : '提交合作意向'}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 4,
  padding: '8px 10px',
  border: '1px solid #ddd',
  borderRadius: 6,
  fontSize: 14,
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  background: '#0066cc',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  fontSize: 15,
  cursor: 'pointer',
};
