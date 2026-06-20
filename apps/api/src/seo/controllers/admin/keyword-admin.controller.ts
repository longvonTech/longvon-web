import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../identity/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/guards/roles.guard';
import { Roles } from '../../../identity/decorators/roles.decorator';
import { KeywordClusterService, SeoKeywordService } from '../../services/keyword.service';
import { CreateKeywordClusterDto, UpdateKeywordClusterDto } from '../../dto/keyword-cluster.dto';
import { CreateSeoKeywordDto, LinkKeywordToArticleDto } from '../../dto/seo-keyword.dto';

@Controller('admin/seo/keyword-clusters')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('content_editor', 'administrator', 'super_administrator')
export class KeywordClusterAdminController {
  constructor(private readonly service: KeywordClusterService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() dto: CreateKeywordClusterDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateKeywordClusterDto) {
    return this.service.update(id, dto);
  }
}

@Controller('admin/seo/keywords')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('content_editor', 'administrator', 'super_administrator')
export class SeoKeywordAdminController {
  constructor(private readonly service: SeoKeywordService) {}

  @Get()
  findAll(@Query('clusterId') clusterId?: string, @Query('status') status?: string) {
    return this.service.findAll({ clusterId, status });
  }

  @Post()
  create(@Body() dto: CreateSeoKeywordDto) {
    return this.service.create(dto);
  }

  @Post(':id/link-article')
  linkToArticle(@Param('id') id: string, @Body() dto: LinkKeywordToArticleDto) {
    return this.service.linkToArticle(id, dto.articleId);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string) {
    return this.service.reject(id);
  }
}
