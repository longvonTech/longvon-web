import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global：数据库访问是几乎全部模块的基础依赖，注册为全局模块避免
// 每个业务模块都要重复import DatabaseModule
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
