import { Body, Controller, ForbiddenException, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../identity/guards/jwt-auth.guard';
import { CurrentUser } from '../identity/decorators/current-user.decorator';
import { AppJwtPayload } from '../identity/jwt-payload.types';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('me')
  getMe(@CurrentUser() user: AppJwtPayload) {
    this.assertCustomer(user);
    return this.customerService.getProfile(user.sub);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: AppJwtPayload, @Body() dto: UpdateCustomerDto) {
    this.assertCustomer(user);
    return this.customerService.updateProfile(user.sub, dto);
  }

  // 本控制器仅服务C端Customer自助查看/编辑自己的资料，后台User身份不适用本端点
  // （不使用@Roles装饰器+RolesGuard，因为这里需要拒绝的是"kind=admin"，
  // 而RolesGuard的设计目标是后台角色判断，C端/后台两种身份类型的区分在此处更简单直接）
  private assertCustomer(user: AppJwtPayload): void {
    if (user.kind !== 'customer') {
      throw new ForbiddenException('该接口仅供C端用户访问');
    }
  }
}
