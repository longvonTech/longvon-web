import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../identity/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/guards/roles.guard';
import { Roles } from '../../../identity/decorators/roles.decorator';
import { ArticleService } from '../../services/article.service';
import { CreateArticleDto, SubmitForReviewDto, UpdateArticleDto } from '../../dto/article.dto';

@Controller('admin/knowledge/articles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticleAdminController {
  constructor(private readonly service: ArticleService) {}

  @Get()
  @Roles('content_editor', 'medical_reviewer', 'administrator', 'super_administrator')
  findAll(
    @Query('status') status?: string,
    @Query('categoryId') categoryId?: string,
    @Query('tagId') tagId?: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.service.findManyForAdmin({
      status,
      categoryId,
      tagId,
      page: parseInt(page, 10) || 1,
      pageSize: Math.min(parseInt(pageSize, 10) || 20, 100),
    });
  }

  @Get(':id')
  @Roles('content_editor', 'medical_reviewer', 'administrator', 'super_administrator')
  findOne(@Param('id') id: string) {
    return this.service.findByIdForAdmin(id);
  }

  @Post()
  @Roles('content_editor', 'administrator', 'super_administrator')
  create(@Body() dto: CreateArticleDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('content_editor', 'administrator', 'super_administrator')
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/submit-for-review')
  @Roles('content_editor', 'administrator', 'super_administrator')
  submitForReview(@Param('id') id: string, @Body() dto: SubmitForReviewDto) {
    return this.service.submitForReview(id, dto.reviewerId);
  }

  // 发布动作即"医学审核通过"的确认动作，因此不开放给Content Editor自己点——
  // 这是医学审核闸门在权限层面的第二道防线（第一道是Service内部的硬性状态校验），
  // 即使有人绕过前端直接调API，没有medical_reviewer/administrator及以上角色也无法触发
  @Post(':id/publish')
  @Roles('medical_reviewer', 'administrator', 'super_administrator')
  publish(@Param('id') id: string) {
    return this.service.publish(id);
  }

  @Delete(':id')
  @Roles('administrator', 'super_administrator')
  delete(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
