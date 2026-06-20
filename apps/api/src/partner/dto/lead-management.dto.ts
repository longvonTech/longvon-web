import { IsIn, IsString, IsUUID, MaxLength } from 'class-validator';
import { LEAD_STATUSES, LeadStatus } from '../utils/lead-status.util';

export class UpdateLeadStatusDto {
  @IsIn(LEAD_STATUSES)
  status!: LeadStatus;
}

export class AssignLeadDto {
  @IsUUID()
  userId!: string;
}

export class AddLeadNoteDto {
  @IsString()
  @MaxLength(2000)
  content!: string;
}
