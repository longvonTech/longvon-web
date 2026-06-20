import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../identity/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/guards/roles.guard';
import { Roles } from '../../../identity/decorators/roles.decorator';
import { TopicService } from '../../services/topic.service';
import { AddTopicArticleDto, CreateTopicDto, UpdateTopicDto } from '../../dto/topic.dto';

@Controller('admin/knowledge/topics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('content_editor', 'administrator', 'super_administrator')
export class TopicAdminController {
  constructor(private readonly service: TopicService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.getByIdForAdmin(id);
  }

  @Post()
  create(@Body() dto: CreateTopicDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/articles')
  addArticle(@Param('id') id: string, @Body() dto: AddTopicArticleDto) {
    return this.service.addArticle(id, dto.articleId, dto.sortOrder);
  }

  @Delete(':id/articles/:articleId')
  removeArticle(@Param('id') id: string, @Param('articleId') articleId: string) {
    return this.service.removeArticle(id, articleId);
  }
}
