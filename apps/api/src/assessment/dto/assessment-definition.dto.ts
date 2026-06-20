import { IsIn, IsObject, IsString } from 'class-validator';

const ASSESSMENT_TYPES = ['osa', 'sleep', 'stress', 'weight_loss', 'diabetes', 'altitude'] as const;

/**
 * questionnaireSchema/scoringRule/resultTemplate三个字段结构复杂（详见
 * engine/types.ts），这里只做"必须是对象"的形态校验，真正的结构性校验
 * （题目ID一致性、riskBands覆盖完整性、风险等级取值合法性）在
 * AssessmentDefinitionService.create()内部完成——DTO负责形态，Service负责语义，
 * 这是本项目从Knowledge/SEO/Partner模块延续下来的一贯分工。
 */
export class CreateAssessmentDefinitionDto {
  @IsIn(ASSESSMENT_TYPES)
  type!: (typeof ASSESSMENT_TYPES)[number];

  @IsObject()
  questionnaireSchema!: Record<string, unknown>;

  @IsObject()
  scoringRule!: Record<string, unknown>;

  @IsObject()
  resultTemplate!: Record<string, unknown>;

  @IsString()
  version!: string;
}

export class MarkReviewedDto {
  @IsString()
  reviewerId!: string;
}
