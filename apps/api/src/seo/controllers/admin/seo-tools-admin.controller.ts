import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../identity/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/guards/roles.guard';
import { Roles } from '../../../identity/decorators/roles.decorator';
import { SlugValidationService } from '../../services/slug-validation.service';
import { InternalLinkingService } from '../../services/internal-linking.service';
import { ValidateSlugDto } from '../../dto/validate-slug.dto';

@Controller('admin/seo')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('content_editor', 'medical_reviewer', 'administrator', 'super_administrator')
export class SeoToolsAdminController {
  constructor(
    private readonly slugValidation: SlugValidationService,
    private readonly internalLinking: InternalLinkingService,
  ) {}

  @Post('validate-slug')
  validateSlug(@Body() dto: ValidateSlugDto) {
    return this.slugValidation.validate(dto.entityType, dto.slug);
  }

  /**
   * 供内容编辑/医学审核在文章提交审核或发布前预览内链合规情况——
   * 呼应health-knowledge-graph-v1.md的内链规则，这是一个"提交前自检"工具，
   * 不是强制阻断发布的硬性校验（TASK-102的publish()硬性校验只针对医学审核闸门，
   * 内链规则本身是SEO最佳实践而非合规红线，因此这里设计为"可见但不强制阻断"）。
   */
  @Get('internal-links/:articleId')
  getInternalLinkSuggestions(@Param('articleId') articleId: string) {
    return this.internalLinking.getSuggestionsForArticle(articleId);
  }
}
