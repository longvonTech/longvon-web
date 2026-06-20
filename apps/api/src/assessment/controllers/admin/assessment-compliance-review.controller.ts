import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../identity/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/guards/roles.guard';
import { Roles } from '../../../identity/decorators/roles.decorator';
import { AssessmentResultRepository } from '../../repositories/assessment-result.repository';

/**
 * 呼应TASK-105L"Assessment Compliance Review"——供医学审核专家抽查
 * 已完成评估的结果文案（recommendations/riskFactors/disclaimer），
 * 确认实际产生的结果内容没有偏离评估定义里预先写好的合规文案
 * （理论上不应该偏离，因为文案是从result_template直接取的，不是现场生成，
 * 但"现场抽查实际产生的数据"仍然是比"只看定义文档"更可靠的合规确认方式）。
 */
@Controller('admin/assessments/compliance-review')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('medical_reviewer', 'administrator', 'super_administrator')
export class AssessmentComplianceReviewController {
  constructor(private readonly resultRepo: AssessmentResultRepository) {}

  @Get()
  review(
    @Query('riskLevel') riskLevel?: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.resultRepo.findManyForComplianceReview({
      riskLevel,
      page: parseInt(page, 10) || 1,
      pageSize: Math.min(parseInt(pageSize, 10) || 20, 100),
    });
  }
}
