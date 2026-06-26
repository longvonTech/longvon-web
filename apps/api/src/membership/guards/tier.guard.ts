import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MembershipService } from '../services/membership.service';
import { CapabilityKey } from '../tier-capability-matrix';
import { AppJwtPayload } from '../../identity/jwt-payload.types';

export const REQUIRES_CAPABILITY_KEY = 'requires_capability';

/**
 * @RequiresCapability 装饰器：声明端点/控制器所需的能力键。
 * 必须与JwtAuthGuard一起使用（JwtAuthGuard先鉴权，本Guard再检查Tier权限）。
 *
 * 呼应TASK-106C"权限唯一来源，不得散落在Controller中判断"——
 * Controller本身只用声明需要哪个能力键，具体判断逻辑在本Guard里统一完成，
 * Controller不需要也不应该自己import tier-capability-matrix.ts。
 *
 * 例：
 *   @UseGuards(JwtAuthGuard, TierGuard)
 *   @RequiresCapability('assessment.fullResult')
 *   @Get('full')
 *   getFullResult() { ... }
 */
export const RequiresCapability = (capability: CapabilityKey) =>
  SetMetadata(REQUIRES_CAPABILITY_KEY, capability);

@Injectable()
export class TierGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly membershipService: MembershipService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const capability = this.reflector.getAllAndOverride<CapabilityKey>(REQUIRES_CAPABILITY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 未标注@RequiresCapability的端点不做Tier检查
    if (!capability) return true;

    const request = context.switchToHttp().getRequest();
    const user: AppJwtPayload | undefined = request.user;

    if (!user) throw new ForbiddenException('未鉴权');
    if (user.kind !== 'customer') {
      // 后台User（admin身份）默认拥有全部能力，不受Tier限制
      return true;
    }

    const hasCapability = await this.membershipService.hasCapability(user.sub, capability);
    if (!hasCapability) {
      throw new ForbiddenException(
        JSON.stringify({
          code: 'UPGRADE_REQUIRED',
          requiredCapability: capability,
          message: '该功能需要升级会员后才能使用',
        }),
      );
    }

    return true;
  }
}
