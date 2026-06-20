import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

// Sprint 1仅接入Redis连接本身，具体用途（会话缓存/限流/队列）留待
// 对应业务模块(Membership/AI Assistant等)在后续Sprint实现时按
// caching-architecture-v1.md / message-event-architecture-v1.md的设计接入，
// 本类只提供最基础的连接与健康检查能力
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public client!: Redis;

  onModuleInit() {
    this.client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async ping(): Promise<'PONG'> {
    return this.client.ping() as Promise<'PONG'>;
  }
}
