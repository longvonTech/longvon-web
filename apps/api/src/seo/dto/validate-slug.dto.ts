import { IsIn, IsString } from 'class-validator';

const ENTITY_TYPES = ['article', 'topic', 'category', 'tag'];

export class ValidateSlugDto {
  @IsIn(ENTITY_TYPES)
  entityType!: 'article' | 'topic' | 'category' | 'tag';

  @IsString()
  slug!: string;
}
