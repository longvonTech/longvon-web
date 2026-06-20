import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

/**
 * Identity Domain模块，呼应database-domain-model-v1.md的User Domain
 * + authentication-architecture-v1.md / authorization-architecture-v1.md。
 *
 * JwtModule.register({})留空：本模块内部对Access Token与Refresh Token
 * 使用两套不同的secret/有效期（见auth.service.ts），不能让JwtModule统一注入
 * 一套全局secret/签发参数，sign()/verify()调用时各自显式传入secret，
 * 因此这里只需要注入JwtService实例本身，不依赖JwtModule的全局配置。
 */
@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  // RolesGuard/AuthService导出给其他模块（如未来Customer模块的@Roles装饰器场景）使用
  exports: [AuthService, RolesGuard],
})
export class IdentityModule {}
