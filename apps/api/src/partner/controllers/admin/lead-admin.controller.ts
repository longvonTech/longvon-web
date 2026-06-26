import {
  Body,
  Controller,
  ForbiddenException,
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
import { CurrentUser } from '../../../identity/decorators/current-user.decorator';
import { AppJwtPayload } from '../../../identity/jwt-payload.types';
import { LeadService } from '../../services/lead.service';
import { LeadAnalyticsService } from '../../services/lead-analytics.service';
import { AddLeadNoteDto, AssignLeadDto, UpdateLeadStatusDto } from '../../dto/lead-management.dto';

/**
 * Lead后台管理——呼应TASK-104E"CRM Basic Module"。
 * 角色限定为crm_operator/administrator/super_administrator，
 * content_editor/medical_reviewer均无权访问，呼应
 * unified-authorization-matrix-v1.md对CRM资源的角色归属。
 */
@Controller('admin/leads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('crm_operator', 'administrator', 'super_administrator')
export class LeadAdminController {
  constructor(
    private readonly leadService: LeadService,
    private readonly analyticsService: LeadAnalyticsService,
  ) {}

  // Lead Source Dashboard基础版——路由放在:id参数路由之前，
  // 避免Nest把"dashboard"误当作:id参数匹配到详情接口（路由声明顺序很重要）
  @Get('dashboard/sources')
  getSourceDashboard() {
    return this.analyticsService.getSourceDashboard();
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('cooperationType') cooperationType?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.leadService.findManyForAdmin({
      status,
      cooperationType,
      assignedTo,
      page: parseInt(page, 10) || 1,
      pageSize: Math.min(parseInt(pageSize, 10) || 20, 100),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadService.findByIdForAdmin(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateLeadStatusDto) {
    return this.leadService.updateStatus(id, dto.status);
  }

  @Post(':id/assign')
  assign(@Param('id') id: string, @Body() dto: AssignLeadDto) {
    return this.leadService.assign(id, dto.userId);
  }

  @Post(':id/notes')
  addNote(
    @Param('id') id: string,
    @Body() dto: AddLeadNoteDto,
    @CurrentUser() user: AppJwtPayload,
  ) {
    // Lead Notes的作者必须是真实的后台User身份（不是C端Customer），
    // 这条Controller整体已限定admin角色访问，user.kind在此处理论上必为'admin'，
    // 但仍显式校验，防止未来有人不小心把本Controller的Guard配置改松后出现类型不匹配
    if (user.kind !== 'admin') {
      throw new ForbiddenException('仅后台用户可添加Lead备注');
    }
    return this.leadService.addNote(id, user.sub, dto.content);
  }
}
