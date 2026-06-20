import { IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateTopicDto {
  @IsString() @MaxLength(100) name!: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() coverImage?: string;
}

export class UpdateTopicDto {
  @IsOptional() @IsString() @MaxLength(100) name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() coverImage?: string;
}

export class AddTopicArticleDto {
  @IsUUID() articleId!: string;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}
