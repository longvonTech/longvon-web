import { IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { COOPERATION_TYPES, CooperationType } from './create-lead.dto';

export class ConvertLeadToPartnerDto {
  @IsString()
  @MaxLength(200)
  companyName!: string;

  @IsIn(COOPERATION_TYPES)
  type!: CooperationType;

  @IsObject()
  contactInfo!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  region?: string;
}

export class UpdateContractStatusDto {
  @IsIn(['pending', 'active', 'terminated'])
  contractStatus!: 'pending' | 'active' | 'terminated';
}
