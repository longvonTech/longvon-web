import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../identity/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/guards/roles.guard';
import { Roles } from '../../../identity/decorators/roles.decorator';
import { AssessmentDefinitionService } from '../../services/assessment-definition.service';
import { CreateAssessmentDefinitionDto, MarkReviewedDto } from '../../dto/assessment-definition.dto';

/**
 * 评估定义的创建/审核——呼应TASK-105B"评估定义数据驱动"。
 * 创建/审核权限限定在medical_reviewer/administrator/super_administrator，
 * 不开放给content_editor/crm_operator——评估的计分逻辑直接影响给用户的
 * 健康风险判断，敏感度高于一般内容编辑，比照MedicalReviewer实体管理的权限收紧原则。
 */
@Controller('admin/assessments/definitions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('medical_reviewer', 'administrator', 'super_administrator')
export class AssessmentDefinitionAdminController {
  constructor(private readonly service: AssessmentDefinitionService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() dto: CreateAssessmentDefinitionDto) {
    // dto的questionnaireSchema/scoringRule/resultTemplate三个字段在DTO层只做了
    // "是对象"的形态校验（具体原因见assessment-definition.dto.ts顶部说明），
    // 这里收窄为Service期望的具体类型，经unknown中转而不是直接断言，
    // 也不使用as never这种会让TS彻底跳过类型检查的危险写法
    return this.service.create(
      dto as unknown as Parameters<AssessmentDefinitionService['create']>[0],
    );
  }

  @Post(':id/mark-reviewed')
  markReviewed(@Param('id') id: string, @Body() dto: MarkReviewedDto) {
    return this.service.markReviewed(id, dto.reviewerId);
  }
}
