import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../../redis/redis.service';

export const RATE_LIMIT_KEY = 'rate_limit';

export interface RateLimitOptions {
  windowSeconds: number;
  maxRequests: number;
}

// 装饰器：标注某个端点的限流参数。不引入@nestjs/throttler这类新增npm依赖——
// 沙箱无网络，已声明的依赖版本号本身就未经验证（见runtime-validation-report-v1.md），
// 再叠加一个从未被验证过装得上的新依赖没有必要，Sprint 1已有的RedisService
// 完全够用来实现一个简单可靠的IP级限流。
export const RateLimit = (options: RateLimitOptions) => SetMetadata(RATE_LIMIT_KEY, options);

/**
 * 呼应TASK-104G"Rate Limit"安全审查项。
 * 仅对挂了@RateLimit()装饰器的端点生效，未标注的端点不受影响——
 * 这是公开的Lead Capture端点（无需登录、任何人都能调用）最直接的防滥用手段，
 * 与DTO层的输入校验、Honeypot字段共同构成TASK-104G要求的"表单防刷"组合措施
 * （三者互为补充：限流防止单一来源高频提交，Honeypot防止简单机器人，
 * DTO校验防止格式错误/恶意payload，任何单一手段都不足以覆盖全部场景）。
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly redis: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<RateLimitOptions>(RATE_LIMIT_KEY, context.getHandler());
    if (!options) return true;

    const request = context.switchToHttp().getRequest();
    // x-forwarded-for由反向代理设置，沙箱/本地直连环境下退回到socket地址；
    // 生产环境必须确认反向代理（如阿里云SLB/Nginx）会正确设置该头，
    // 否则全部请求会被错误地归并为同一个IP，导致限流形同虚设或误伤全部用户，
    // 这是alicloud-deployment-v1.md里需要核实的一项部署前提，本Sprint先按约定实现逻辑本身
    const ip =
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      request.socket?.remoteAddress ||
      'unknown';

    const routeKey = `${context.getClass().name}.${context.getHandler().name}`;
    const redisKey = `ratelimit:${routeKey}:${ip}`;

    const count = await this.redis.client.incr(redisKey);
    if (count === 1) {
      await this.redis.client.expire(redisKey, options.windowSeconds);
    }

    if (count > options.maxRequests) {
      throw new HttpException(
        '请求过于频繁，请稍后再试',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
