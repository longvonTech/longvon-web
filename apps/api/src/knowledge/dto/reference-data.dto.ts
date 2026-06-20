import { IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString() @MaxLength(100) name!: string;
  @IsOptional() @IsString() slug?: string; // 不传时由Service从name派生
  @IsOptional() @IsUUID() parentId?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}

export class UpdateCategoryDto {
  @IsOptional() @IsString() @MaxLength(100) name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}

export class CreateTagDto {
  @IsString() @MaxLength(50) name!: string;
  @IsOptional() @IsString() slug?: string;
}

export class CreateAuthorDto {
  @IsString() @MaxLength(100) name!: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() avatar?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsUUID() userId?: string;
}

export class UpdateAuthorDto {
  @IsOptional() @IsString() @MaxLength(100) name?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() avatar?: string;
  @IsOptional() @IsString() title?: string;
}

export class CreateMedicalReviewerDto {
  @IsString() @MaxLength(100) name!: string;
  @IsString() credentials!: string;
  @IsOptional() @IsString() licenseNo?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() avatar?: string;
}

export class UpdateMedicalReviewerDto {
  @IsOptional() @IsString() @MaxLength(100) name?: string;
  @IsOptional() @IsString() credentials?: string;
  @IsOptional() @IsString() licenseNo?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() avatar?: string;
}
