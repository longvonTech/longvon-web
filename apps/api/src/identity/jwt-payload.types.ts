// 对应 /docs/engineering/api/authentication-architecture-v1.md 第2部分 JWT Claims设计
// C端Customer Token与后台User Token是两套不同的Claims结构，不可混用同一个Guard判断逻辑

export interface CustomerJwtPayload {
  sub: string; // customer_id
  kind: 'customer';
  clientType: 'web' | 'app' | 'harmonyos' | 'miniprogram';
  // tier目前固定为'free'（Membership业务模块未在Sprint 1实现，见auth.service.ts注释），
  // Sprint 2接入Membership Service后改为查询Subscriptions实时计算
  tier: 'free' | 'premium' | 'pro' | 'enterprise';
}

export interface AdminJwtPayload {
  sub: string; // user_id
  kind: 'admin';
  roleId: string;
  // 权限明细不下发到Token，每次请求查Roles.permissions（呼应authentication-architecture-v1.md
  // 第2部分"权限不下发到Token，只下发身份"原则）
}

export type AppJwtPayload = CustomerJwtPayload | AdminJwtPayload;
