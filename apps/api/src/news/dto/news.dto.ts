import { IsArray, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class NewsMediaItemDto {
  @IsIn(['image', 'video'])
  type!: 'image' | 'video';

  @IsString()
  url!: string;

  @IsOptional()
  @IsString()
  caption?: string;
}

export class CreateNewsDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsString()
  @MinLength(1)
  content!: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsArray()
  media?: NewsMediaItemDto[];
}

export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsArray()
  media?: NewsMediaItemDto[];
}
