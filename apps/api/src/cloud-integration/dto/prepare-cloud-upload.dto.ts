import { IsIn, IsInt, IsISO8601, IsOptional, IsString, Max, Min } from 'class-validator';

export const CLOUD_UPLOAD_OPERATIONS = [
  'heart-rate',
  'spo2',
  'temperature',
  'steps-calories',
  'sleep-basic',
  'osa-history',
  'raw-ppg',
] as const;

export type CloudUploadOperation = (typeof CLOUD_UPLOAD_OPERATIONS)[number];

/**
 * Metadata-only preparation contract.
 * Deliberately excludes physiological values and raw signal payloads:
 * this phase must not transmit or persist health data.
 */
export class PrepareCloudUploadDto {
  @IsIn([...CLOUD_UPLOAD_OPERATIONS])
  operation!: CloudUploadOperation;

  @IsString()
  @IsOptional()
  deviceMac?: string;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsInt()
  @Min(0)
  @Max(1000000)
  sampleCount!: number;

  @IsISO8601()
  startTime!: string;

  @IsISO8601()
  endTime!: string;
}
