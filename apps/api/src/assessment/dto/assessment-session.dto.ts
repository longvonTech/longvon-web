import { IsIn, IsObject, IsOptional, IsString } from 'class-validator';

const ASSESSMENT_TYPES = ['osa', 'sleep', 'stress', 'weight_loss', 'diabetes', 'altitude'] as const;

export class StartAssessmentDto {
  @IsIn(ASSESSMENT_TYPES)
  assessmentType!: (typeof ASSESSMENT_TYPES)[number];

  @IsOptional()
  @IsIn(['web', 'app', 'ai_chat'])
  channel?: 'web' | 'app' | 'ai_chat';
}

export class SaveProgressDto {
  // 答案的题目级语义校验在answer-validator.ts里对照questionnaire_schema完成，
  // 这里只做"必须是一个对象"的形态校验
  @IsObject()
  answers!: Record<string, unknown>;
}

export class SubmitAssessmentDto {
  @IsObject()
  answers!: Record<string, unknown>;
}

export class AssessmentHistoryQueryDto {
  @IsOptional()
  @IsString()
  assessmentType?: string;
}
