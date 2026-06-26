import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AdminJwtPayload, CustomerJwtPayload } from './jwt-payload.types';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const OTP_TTL_SECONDS = 5 * 60; // 验证码5分钟有效
const REFRESH_TOKEN_REDIS_PREFIX = 'auth:refresh:';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwt: JwtService,
  ) {}

  // ---------------------------------------------------------
  // C端：手机验证码登录
  // ---------------------------------------------------------

  /**
   * 请求验证码。
   * Sprint 1未接入真实短信服务商（短信网关选型留待后续Sprint确认），
   * 当前实现仅生成验证码写入Redis并以日志形式输出，便于本地开发联调。
   * 生产环境启用前必须替换为真实短信发送逻辑，并移除日志输出验证码的行为
   * （日志中打印验证码在生产环境是一个明确的安全隐患，仅限本地开发阶段使用）。
   */
  async requestCustomerCode(phone: string): Promise<{ devOnlyCode?: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redis.client.set(`otp:${phone}`, code, 'EX', OTP_TTL_SECONDS);

    if (process.env.NODE_ENV !== 'production') {
      this.logger.warn(
        `[DEV ONLY] 手机号 ${phone} 的验证码为 ${code}（生产环境绝不应以任何形式输出验证码）`,
      );
      return { devOnlyCode: code };
    }

    // TODO(Sprint 2): 接入真实短信网关
    return {};
  }

  async verifyCustomerCode(phone: string, code: string): Promise<TokenPair> {
    const cached = await this.redis.client.get(`otp:${phone}`);
    if (!cached || cached !== code) {
      throw new UnauthorizedException('验证码错误或已过期');
    }
    await this.redis.client.del(`otp:${phone}`);

    let customer = await this.prisma.customer.findUnique({ where: { phone } });
    if (!customer) {
      customer = await this.prisma.customer.create({
        data: { phone, sourceChannel: 'direct' },
      });
    }

    const payload: CustomerJwtPayload = {
      sub: customer.id,
      kind: 'customer',
      clientType: 'web',
      // Membership业务模块未在Sprint 1实现，固定为free，
      // Sprint 2接入后改为查询该customer的有效Subscription计算实际tier
      tier: 'free',
    };

    return this.issueTokenPair(payload);
  }

  // ---------------------------------------------------------
  // 后台：用户名密码登录
  // ---------------------------------------------------------

  async adminLogin(username: string, password: string): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user || user.deletedAt || user.status !== 'active') {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const matched = await bcrypt.compare(password, user.passwordHash);
    if (!matched) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload: AdminJwtPayload = {
      sub: user.id,
      kind: 'admin',
      roleId: user.roleId,
    };

    return this.issueTokenPair(payload);
  }

  // ---------------------------------------------------------
  // Refresh Token 轮换
  // 呼应 authentication-architecture-v1.md 第3部分：
  // 每次用Refresh Token换取新Access Token时，同时换发新Refresh Token，
  // 旧Token失效；检测到旧Token被重复使用则视为可能泄露，撤销该用户名下全部Token。
  // ---------------------------------------------------------

  async refresh(refreshToken: string): Promise<TokenPair> {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error('JWT_REFRESH_SECRET未配置');

    // jsonwebtoken.verify()在标准JWT payload基础上会自动附加iat/exp，
    // 这里把它们显式纳入类型声明，避免后续解构时出现类型不匹配
    type DecodedRefreshToken = (CustomerJwtPayload | AdminJwtPayload) & {
      jti: string;
      iat: number;
      exp: number;
    };

    let decoded: DecodedRefreshToken;
    try {
      decoded = this.jwt.verify(refreshToken, { secret }) as DecodedRefreshToken;
    } catch {
      throw new UnauthorizedException('刷新令牌无效或已过期');
    }

    const redisKey = `${REFRESH_TOKEN_REDIS_PREFIX}${decoded.sub}`;
    const storedJti = await this.redis.client.get(redisKey);

    if (!storedJti || storedJti !== decoded.jti) {
      // 旧token被重复使用，或token已被撤销：撤销该用户当前会话，要求重新登录
      // TODO(Sprint 2): 写入SecurityEvents(event_type='token_reuse_detected')，
      // 该写入需经过service账号鉴权与对应Repository封装，本Sprint暂不实现
      await this.redis.client.del(redisKey);
      throw new UnauthorizedException('检测到令牌异常使用，请重新登录');
    }

    await this.redis.client.del(redisKey);

    // 直接从已知类型解构，去掉此前版本不安全的"先转Record<string,unknown>再转回"双重断言写法
    // （那种写法在runtime-validation-report-v1.md记录的tsc检查中被实际报出类型错误，此处为修复）
    const { jti: _jti, iat: _iat, exp: _exp, ...rest } = decoded;
    void _jti;
    void _iat;
    void _exp;

    return this.issueTokenPair(rest);
  }

  // ---------------------------------------------------------
  // 私有：签发Access+Refresh Token对，并将Refresh Token的jti写入Redis用于轮换检测
  // ---------------------------------------------------------

  private async issueTokenPair(payload: CustomerJwtPayload | AdminJwtPayload): Promise<TokenPair> {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT密钥未配置，请检查.env文件');
    }

    const accessToken = this.jwt.sign(payload, {
      secret: accessSecret,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    });

    const jti = randomUUID();
    const refreshExpiresIn =
      payload.kind === 'customer' ? (process.env.JWT_REFRESH_EXPIRES_IN ?? '30d') : '12h'; // 后台账号Refresh Token有效期更短，降低被盗用风险窗口

    const refreshToken = this.jwt.sign(
      { ...payload, jti },
      { secret: refreshSecret, expiresIn: refreshExpiresIn },
    );

    const redisKey = `${REFRESH_TOKEN_REDIS_PREFIX}${payload.sub}`;
    const ttlSeconds = payload.kind === 'customer' ? 30 * 24 * 3600 : 12 * 3600;
    await this.redis.client.set(redisKey, jti, 'EX', ttlSeconds);

    return { accessToken, refreshToken };
  }
}
