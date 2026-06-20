import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateKeywordClusterDto {
  @IsString() @MaxLength(100) rootKeyword!: string;
  @IsOptional() @IsUUID() hubTopicId?: string;
  @IsOptional() @IsString() description?: string;
}

export class UpdateKeywordClusterDto {
  @IsOptional() @IsString() @MaxLength(100) rootKeyword?: string;
  @IsOptional() @IsUUID() hubTopicId?: string;
  @IsOptional() @IsString() description?: string;
}
