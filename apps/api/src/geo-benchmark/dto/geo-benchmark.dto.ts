import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CAPTURE_STATUSES, MODES, PROVIDERS, REVIEW_STATUSES } from '../query-bank';
import { LIMITS } from '../domain/validation';

export class CitationDto {
  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.title)
  title?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(LIMITS.url)
  url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.snippet)
  snippet?: string;
}

export class CreateCaptureDto {
  @IsIn(PROVIDERS)
  provider!: 'gemini' | 'perplexity' | 'doubao';

  @IsString()
  @MinLength(4)
  @MaxLength(8)
  queryCode!: string;

  @IsString()
  @MaxLength(LIMITS.answer)
  rawAnswer!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(LIMITS.citations)
  @ValidateNested({ each: true })
  @Type(() => CitationDto)
  citations?: CitationDto[];

  @IsOptional()
  @IsIn(CAPTURE_STATUSES)
  captureStatus?: 'draft' | 'complete';

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  modelLabel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  locale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  searchMode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.notes)
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.screenshot)
  screenshotRef?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.operator)
  operatorLabel?: string;
}

export class UpdateCaptureDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(LIMITS.answer)
  rawAnswer?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(LIMITS.citations)
  @ValidateNested({ each: true })
  @Type(() => CitationDto)
  citations?: CitationDto[];

  @IsOptional()
  @IsIn(CAPTURE_STATUSES)
  captureStatus?: 'draft' | 'complete';

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  modelLabel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  locale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  searchMode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.notes)
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.screenshot)
  screenshotRef?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.operator)
  operatorLabel?: string;
}

export class ReviewResultDto {
  @IsIn(['reviewed', 'excluded', 'needs_recheck'])
  reviewStatus!: 'reviewed' | 'excluded' | 'needs_recheck';

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  score?: number;

  @IsOptional()
  @IsBoolean()
  mention?: boolean;

  @IsOptional()
  @IsBoolean()
  identityCorrect?: boolean;

  @IsOptional()
  @IsBoolean()
  supplierCandidate?: boolean;

  @IsOptional()
  @IsBoolean()
  activeRecommendation?: boolean;

  @IsOptional()
  @IsBoolean()
  officialCitation?: boolean;

  @IsOptional()
  @IsBoolean()
  independentCitation?: boolean;

  @IsOptional()
  @IsBoolean()
  factualErrors?: boolean;

  @IsString()
  @MinLength(1)
  @MaxLength(LIMITS.rationale)
  rationale!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(LIMITS.evaluator)
  evaluator!: string;
}

export class CreateApiRunDto {
  @IsIn(PROVIDERS)
  provider!: 'gemini' | 'perplexity' | 'doubao';

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(60)
  @IsString({ each: true })
  queryCodes!: string[];

  @IsOptional()
  @IsBoolean()
  confirmCost?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  locale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.operator)
  operatorLabel?: string;
}

export class CorrectionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(LIMITS.answer)
  rawAnswer!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(LIMITS.citations)
  @ValidateNested({ each: true })
  @Type(() => CitationDto)
  citations?: CitationDto[];

  @IsOptional()
  @IsIn(CAPTURE_STATUSES)
  captureStatus?: 'draft' | 'complete';

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  modelLabel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  locale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.label)
  searchMode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.notes)
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.screenshot)
  screenshotRef?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.operator)
  operatorLabel?: string;
}

export const MODE_VALUES = MODES;
export const REVIEW_STATUS_VALUES = REVIEW_STATUSES;
