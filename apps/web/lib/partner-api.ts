import { apiFetch } from './api-client';

export const COOPERATION_TYPES = ['hospital', 'pharmacy', 'oem', 'odm', 'distributor', 'enterprise'] as const;
export type CooperationType = (typeof COOPERATION_TYPES)[number];

export interface LeadSubmission {
  companyName?: string;
  contactName: string;
  phone: string;
  email?: string;
  position?: string;
  cooperationType: CooperationType;
  remark?: string;
  sourcePage?: string;
  sourceKeyword?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  /** First-touch document.referrer (host+path). */
  referrer?: string;
  /** First landing path in the session. */
  landingPage?: string;
  firstLandingPage?: string;
  firstReferrer?: string;
  firstUtmSource?: string;
  firstUtmMedium?: string;
  firstUtmCampaign?: string;
  firstUtmContent?: string;
  firstUtmTerm?: string;
  firstVisitAt?: string;
  latestLandingPage?: string;
  latestReferrer?: string;
  latestUtmSource?: string;
  latestUtmMedium?: string;
  latestUtmCampaign?: string;
  latestVisitAt?: string;
  attributionChannel?: string;
  attributionConfidence?: string;
  website?: string; // honeypot，正常用户不应该填写这个字段
}

export function submitPartnerLead(data: LeadSubmission) {
  return apiFetch<{ submitted: boolean }>('/partner-leads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
