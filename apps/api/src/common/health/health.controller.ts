import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';

// 呼应 /docs/engineering/system/monitoring-observability-v1.md 第3部分：
// Liveness（进程是否存活）与Readiness（是否已准备好接受流量）需要分开两个端点，
// 不能合并，否则"进程活着但数据库连不上"时负载均衡器会误判为健康。
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get('live')
  liveness() {
    return { status: 'ok' };
  }

  @Get('ready')
  async readiness() {
    const checks: Record<string, 'ok' | 'error'> = {
      database: 'ok',
      redis: 'ok',
    };

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      checks.database = 'error';
    }

    try {
      await this.redis.ping();
    } catch {
      checks.redis = 'error';
    }

    const allOk = Object.values(checks).every((v) => v === 'ok');
    return { status: allOk ? 'ok' : 'degraded', checks };
  }
}
