import {
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateArticleDto {
  @IsString() @MaxLength(200) title!: string;
  @IsOptional() @IsString() slug?: string; // 不传时由Service从title派生
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsString() summary?: string;
  @IsString() content!: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() @MaxLength(70) seoTitle?: string; // 长度上限呼应常见SEO标题展示限制
  @IsOptional() @IsString() seoKeywords?: string;
  @IsOptional() @IsString() @MaxLength(160) seoDescription?: string;
  @IsOptional() @IsUUID() authorId?: string;
  @IsOptional() @IsArray() @ArrayUnique() @IsUUID('all', { each: true }) tagIds?: string[];
}

export class UpdateArticleDto {
  @IsOptional() @IsString() @MaxLength(200) title?: string;
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() @MaxLength(70) seoTitle?: string;
  @IsOptional() @IsString() seoKeywords?: string;
  @IsOptional() @IsString() @MaxLength(160) seoDescription?: string;
  @IsOptional() @IsUUID() authorId?: string;
  @IsOptional() @IsArray() @ArrayUnique() @IsUUID('all', { each: true }) tagIds?: string[];
}

export class SubmitForReviewDto {
  @IsUUID() reviewerId!: string;
}
