import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// 呼应 /docs/security/unified-authorization-matrix-v1.md：
// 'customer'对应C端Customer角色（Tier额度判断不在此处，由各业务模块Service层完成，
// 见authorization-architecture-v1.md第4部分"Role检查在Guard层，Tier检查在Service层"原则）
export type AppRole =
  | 'customer'
  | 'partner'
  | 'medical_reviewer'
  | 'content_editor'
  | 'crm_operator'
  | 'administrator'
  | 'super_administrator';

export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
