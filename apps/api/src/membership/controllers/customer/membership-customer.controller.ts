import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../identity/guards/jwt-auth.guard';
import { CurrentUser } from '../../../identity/decorators/current-user.decorator';
import { AppJwtPayload } from '../../../identity/jwt-payload.types';
import { MembershipService } from '../../services/membership.service';

@Controller('membership')
@UseGuards(JwtAuthGuard)
export class MembershipCustomerController {
  constructor(private readonly service: MembershipService) {}

  /** 会员Dashboard——TASK-106G */
  @Get('dashboard')
  getDashboard(@CurrentUser() user: AppJwtPayload) {
    const customerId = this.assertCustomer(user);
    return this.service.getMembershipDashboard(customerId);
  }

  /** 当前权益列表——供Paywall/升级入口判断 */
  @Get('capabilities')
  getCapabilities(@CurrentUser() user: AppJwtPayload) {
    const customerId = this.assertCustomer(user);
    return this.service.getCapabilityList(customerId);
  }

  /** 取消当前订阅 */
  @Delete('subscriptions/:id')
  cancelSubscription(@CurrentUser() user: AppJwtPayload, @Param('id') id: string) {
    const customerId = this.assertCustomer(user);
    return this.service.cancelSubscription(customerId, id);
  }

  /** 订阅历史 */
  @Get('subscriptions')
  getSubscriptionHistory(@CurrentUser() user: AppJwtPayload) {
    const customerId = this.assertCustomer(user);
    // SubscriptionRepository.findHistoryForCustomer 使用 withRlsContext，已做隔离
    return this.service['subscriptionRepo'].findHistoryForCustomer(customerId);
  }

  /**
   * 会员升级入口（本Sprint不接真实支付，此端点供后台测试/未来支付回调调用）。
   * 呼应禁止事项说明：本端点只执行"业务层的开通逻辑"，
   * 不处理任何支付令牌/签名/金额校验——这些由支付Sprint的PaymentCallbackController负责，
   * 支付成功后再调用MembershipService.startSubscription()。
   */
  @Post('subscriptions')
  startSubscription(@CurrentUser() user: AppJwtPayload, @Body() body: {
    planTier: string;
    billingCycle: 'monthly' | 'yearly';
    amount: number;
    currentPeriodStart: string;
    currentPeriodEnd: string;
  }) {
    const customerId = this.assertCustomer(user);
    return this.service.startSubscription(customerId, {
      planTier: body.planTier,
      billingCycle: body.billingCycle,
      amount: body.amount,
      currentPeriodStart: new Date(body.currentPeriodStart),
      currentPeriodEnd: new Date(body.currentPeriodEnd),
    });
  }

  private assertCustomer(user: AppJwtPayload): string {
    if (user.kind !== 'customer') throw new ForbiddenException('该接口仅供C端用户访问');
    return user.sub;
  }
}
