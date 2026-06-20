import { apiFetch } from './api-client';

export const TIER_DISPLAY_NAMES = {
  free: '免费版',
  premium: 'Premium',
  pro: 'Pro',
  enterprise: '企业版',
} as const;

export type MembershipTier = keyof typeof TIER_DISPLAY_NAMES;

export interface MembershipDashboard {
  tier: MembershipTier;
  tierDisplayName: string;
  expiresAt: string | null;
  paymentStatus: string;
  subscription: {
    id: string;
    planTier: string;
    billingCycle: string;
    status: string;
    currentPeriodEnd: string;
  } | null;
  capabilities: string[];
  upgradeOptions: {
    tier: MembershipTier;
    displayName: string;
    monthlyPrice: number;
    yearlyPrice: number;
  }[];
}

export function getMembershipDashboard(accessToken: string) {
  return apiFetch<MembershipDashboard>('/membership/dashboard', { accessToken });
}

export function getCapabilities(accessToken: string) {
  return apiFetch<{ tier: string; capabilities: string[] }>('/membership/capabilities', { accessToken });
}
