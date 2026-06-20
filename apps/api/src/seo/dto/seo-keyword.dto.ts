import { IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

const TRENDS = ['rising', 'stable', 'declining'];
const RECOMMENDATION_LEVELS = ['high', 'medium', 'low'];

export class CreateSeoKeywordDto {
  @IsString() @MaxLength(150) keyword!: string;
  @IsOptional() @IsInt() @Min(0) searchVolume?: number;
  @IsOptional() @IsInt() @Min(0) @Max(100) competitionScore?: number;
  @IsOptional() @IsIn(TRENDS) trend?: string;
  @IsOptional() @IsIn(RECOMMENDATION_LEVELS) recommendationLevel?: string;
  @IsOptional() @IsUUID() clusterId?: string;
}

export class LinkKeywordToArticleDto {
  @IsUUID() articleId!: string;
}
