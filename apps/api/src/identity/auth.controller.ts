import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestCodeDto } from './dto/request-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

/**
 * 鉴权端点，呼应authentication-architecture-v1.md第3部分。
 * Sprint 1范围仅含Identity/Customer，端点本身不做角色/权限校验
 * （JwtAuthGuard/RolesGuard用于保护其他模块的端点，登录类端点本身必须公开访问）。
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('customer/request-code')
  requestCustomerCode(@Body() dto: RequestCodeDto) {
    return this.authService.requestCustomerCode(dto.phone);
  }

  @Post('customer/verify-code')
  verifyCustomerCode(@Body() dto: VerifyCodeDto) {
    return this.authService.verifyCustomerCode(dto.phone, dto.code);
  }

  @Post('admin/login')
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto.username, dto.password);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }
}
