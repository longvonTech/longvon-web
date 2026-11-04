import { UnauthorizedException } from '@nestjs/common';

export function verifyAdminToken(token: string | undefined): void {
  const password = process.env.ADMIN_IMAGE_PASSWORD?.trim();
  if (!password) {
    throw new UnauthorizedException('Admin authentication is not configured.');
  }
  if (!token || token !== password) {
    throw new UnauthorizedException('密码错误');
  }
}
