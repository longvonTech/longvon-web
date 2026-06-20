import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppJwtPayload } from '../jwt-payload.types';

// 仅校验Access Token（短期15分钟），Refresh Token的校验逻辑独立写在
// AuthService.refresh()中（使用不同的secret与不同的有效期，不复用本Strategy）
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET未配置，请检查.env文件');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: AppJwtPayload): AppJwtPayload {
    if (!payload?.sub) {
      throw new UnauthorizedException('无效的访问令牌');
    }
    return payload;
  }
}
