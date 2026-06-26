import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../identity/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/guards/roles.guard';
import { Roles } from '../../../identity/decorators/roles.decorator';
import {
  CategoryService,
  TagService,
  AuthorService,
  MedicalReviewerService,
} from '../../services/reference-data.service';
import {
  CreateAuthorDto,
  CreateCategoryDto,
  CreateMedicalReviewerDto,
  CreateTagDto,
  UpdateAuthorDto,
  UpdateCategoryDto,
  UpdateMedicalReviewerDto,
} from '../../dto/reference-data.dto';

@Controller('admin/knowledge/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryAdminController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  @Roles('content_editor', 'medical_reviewer', 'administrator', 'super_administrator')
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @Roles('content_editor', 'administrator', 'super_administrator')
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('content_editor', 'administrator', 'super_administrator')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('administrator', 'super_administrator')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}

@Controller('admin/knowledge/tags')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TagAdminController {
  constructor(private readonly service: TagService) {}

  @Get()
  @Roles('content_editor', 'medical_reviewer', 'administrator', 'super_administrator')
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @Roles('content_editor', 'administrator', 'super_administrator')
  create(@Body() dto: CreateTagDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  @Roles('administrator', 'super_administrator')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}

@Controller('admin/knowledge/authors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthorAdminController {
  constructor(private readonly service: AuthorService) {}

  @Get()
  @Roles('content_editor', 'medical_reviewer', 'administrator', 'super_administrator')
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @Roles('content_editor', 'administrator', 'super_administrator')
  create(@Body() dto: CreateAuthorDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('content_editor', 'administrator', 'super_administrator')
  update(@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
    return this.service.update(id, dto);
  }
}

@Controller('admin/knowledge/medical-reviewers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalReviewerAdminController {
  constructor(private readonly service: MedicalReviewerService) {}

  @Get()
  @Roles('content_editor', 'medical_reviewer', 'administrator', 'super_administrator')
  findAll() {
    return this.service.findAll();
  }

  // 创建/编辑"谁是医学审核专家"本身，比创建Category/Tag更敏感——
  // 这相当于决定谁有权在平台上为健康内容做医学背书，因此不开放给Content Editor，
  // 仅限后台管理职级，呼应unified-authorization-matrix-v1.md对医学审核权限的从严处理原则
  @Post()
  @Roles('administrator', 'super_administrator')
  create(@Body() dto: CreateMedicalReviewerDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('administrator', 'super_administrator')
  update(@Param('id') id: string, @Body() dto: UpdateMedicalReviewerDto) {
    return this.service.update(id, dto);
  }
}
