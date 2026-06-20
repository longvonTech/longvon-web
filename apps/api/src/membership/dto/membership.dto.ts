import { IsIn, IsISO8601, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TIERS } from '../tier-capability-matrix';
import { SUBSCRIPTION_STATUSES } from '../subscription-status.util';

export class StartSubscriptionDto {
  @IsIn(TIERS)
  planTier!: string;

  @IsIn(['monthly', 'yearly'])
  billingCycle!: 'monthly' | 'yearly';

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsISO8601()
  currentPeriodStart!: string;

  @IsISO8601()
  currentPeriodEnd!: string;
}

export class UpdateSubscriptionStatusDto {
  @IsIn(SUBSCRIPTION_STATUSES)
  status!: string;
}
