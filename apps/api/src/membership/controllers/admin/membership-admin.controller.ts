import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../identity/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/guards/roles.guard';
import { Roles } from '../../../identity/decorators/roles.decorator';
import { MembershipService } from '../../services/membership.service';
import { UpdateSubscriptionStatusDto } from '../../dto/membership.dto';
import { SubscriptionStatus } from '../../subscription-status.util';

@Controller('admin/memberships')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('crm_operator', 'administrator', 'super_administrator')
export class MembershipAdminController {
  constructor(private readonly service: MembershipService) {}

  @Get()
  findAll(
    @Query('tier') tier?: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.service.findManyForAdmin({
      tier,
      page: parseInt(page, 10) || 1,
      pageSize: Math.min(parseInt(pageSize, 10) || 20, 100),
    });
  }

  @Get('analytics')
  getAnalytics() {
    return this.service.getAnalyticsSummary();
  }

  // 手动推进订阅状态机（用于测试/客服处理/本Sprint无支付网关时的模拟操作）
  @Patch('subscriptions/:id/status')
  updateSubscriptionStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionStatusDto,
  ) {
    return this.service.adminUpdateSubscriptionStatus(id, dto.status as SubscriptionStatus);
  }
}
