import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../database/prisma.service';
import { ROLES_KEY, AppRole } from '../decorators/roles.decorator';
import { AppJwtPayload } from '../jwt-payload.types';

// 呼应 /docs/engineering/api/authorization-architecture-v1.md 第4部分：
// "Role检查在Guard层基于JWT的role声明静态判断"——本Guard只做Role层判断，
// 不做Tier(会员档位)的额度判断，Tier判断属于业务层动态逻辑，
// 留给各业务模块Service层处理（Sprint 1未实现Membership，故Tier判断逻辑暂不落地）
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // 未声明@Roles()的接口不做角色限制（鉴权与否由JwtAuthGuard单独控制）
    }

    const request = context.switchToHttp().getRequest();
    const user: AppJwtPayload | undefined = request.user;
    if (!user) {
      throw new ForbiddenException('缺少身份信息');
    }

    if (user.kind === 'customer') {
      if (requiredRoles.includes('customer')) return true;
      throw new ForbiddenException('当前身份无权访问该资源');
    }

    // 后台User：role名称不下发到Token，需查库获取当前真实角色名
    // （呼应authentication-architecture-v1.md"权限不下发到Token"原则）
    const role = await this.prisma.role.findUnique({
      where: { id: user.roleId },
    });
    if (!role) {
      throw new ForbiddenException('角色不存在或已被移除');
    }

    if (requiredRoles.includes(role.name as AppRole)) {
      return true;
    }
    throw new ForbiddenException('当前角色无权访问该资源');
  }
}
