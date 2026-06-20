import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { QuestionnaireSchema, ResultTemplate, ScoringRule } from '../engine/types';

export interface AssessmentDefinitionData {
  type: string;
  questionnaireSchema: QuestionnaireSchema;
  scoringRule: ScoringRule;
  resultTemplate: ResultTemplate;
  version: string;
}

@Injectable()
export class AssessmentDefinitionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.assessment.findMany({ orderBy: [{ type: 'asc' }, { version: 'desc' }] });
  }

  /**
   * 取某评估类型当前生效的最新版本定义——"最新"按version字段的创建顺序，
   * 不是按字符串排序（呼应TASK-105B"评估定义数据驱动"，版本管理本身也要严谨，
   * 不能假设version永远是简单递增的数字字符串就用字符串比较）。
   * 本Sprint先用createdAt倒序取第一条作为"当前生效版本"的简化实现，
   * 更完整的版本生效/下线管理（如显式的is_active字段）留待后续Sprint按实际运营需求引入。
   */
  findLatestByType(type: string) {
    return this.prisma.assessment.findFirst({
      where: { type },
      orderBy: { reviewedAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.assessment.findUnique({ where: { id } });
  }

  create(data: AssessmentDefinitionData) {
    return this.prisma.assessment.create({ data });
  }

  markReviewed(id: string, reviewerId: string) {
    return this.prisma.assessment.update({
      where: { id },
      data: { reviewedBy: reviewerId, reviewedAt: new Date() },
    });
  }
}
