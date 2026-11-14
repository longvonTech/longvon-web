import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

/**
 * LONGVON channel query DTO.
 * All timestamps are 13-digit Unix milliseconds as documented in Apifox.
 * lastVersion semantics are intentionally opaque until the backend owner confirms them.
 */
export class ChannelRangeQueryDto {
  @IsOptional()
  @IsString()
  @Matches(/^\\d{13}$/)
  lastVersion?: string | null;

  @IsString()
  @Matches(/^\\d{13}$/)
  devTimeStart!: string;

  @IsString()
  @Matches(/^\\d{13}$/)
  devTimeEnd!: string;

  @IsString()
  @IsNotEmpty()
  phonenumber!: string;
}

export class SleepQueryDto {
  @IsOptional()
  @IsString()
  lastVersion?: string | null;

  @IsString()
  @Matches(/^\\d{13}$/)
  devTime!: string;

  @IsString()
  phonenumber!: string;
}

export class OsaQueryDto {
  @IsString()
  @Matches(/^\\d{13}$/)
  devTime!: string;

  @IsString()
  phonenumber!: string;
}
