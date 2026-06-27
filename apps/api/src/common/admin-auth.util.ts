import { UnauthorizedException } from '@nestjs/common';

export function verifyAdminToken(token: string | undefined): void {
  const password = process.env.ADMIN_IMAGE_PASSWORD ?? 'mateyou-admin-2024';
  if (!token || token !== password) {
    throw new UnauthorizedException('密码错误');
  }
}
