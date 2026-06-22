/**
 * 输入安全守卫：三层防护
 * 1. XSS/SQL注入特征检测
 * 2. 垃圾数据识别
 * 3. 频率限制已由RateLimitGuard处理
 */

// XSS / SQL注入特征
const INJECTION_PATTERNS = [
  /<script[\s\S]*?>/i,
  /javascript:/i,
  /on\w+\s*=/i,           // onerror= onclick=
  /SELECT\s+.*FROM/i,
  /INSERT\s+INTO/i,
  /DROP\s+TABLE/i,
  /UNION\s+SELECT/i,
  /--\s/,                  // SQL注释
  /;\s*(DROP|DELETE|UPDATE|INSERT)/i,
  /\{\{.*\}\}/,            // 模板注入
  /\$\{.*\}/,              // JS模板字符串注入
];

// 明显垃圾手机号
const FAKE_PHONE_PATTERNS = [
  /^1{7,}/,                // 1111111111
  /^(\d)\1{7,}/,           // 重复数字 00000000
  /^1234567/,
  /^0000000/,
  /^\d{4,6}$/,             // 太短
  /^\d{12,}$/,             // 太长
];

// 垃圾姓名关键词
const FAKE_NAME_KEYWORDS = [
  '测试', 'test', 'TEST', 'demo', 'DEMO',
  'aaa', 'bbb', 'xxx', 'yyy', 'zzz',
  '123', '111', 'null', 'undefined',
  'admin', 'root', 'user', '用户',
];

export interface GuardResult {
  blocked: boolean;
  reason?: string;
  silent?: boolean; // true=静默丢弃，false=返回错误
}

export function checkInput(data: {
  contactName?: string;
  phone?: string;
  remark?: string;
  companyName?: string;
}): GuardResult {

  const fields = [
    data.contactName ?? '',
    data.phone ?? '',
    data.remark ?? '',
    data.companyName ?? '',
  ];

  // 1. 注入检测（所有字段）
  for (const field of fields) {
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(field)) {
        return { blocked: true, reason: '输入包含非法字符', silent: false };
      }
    }
  }

  // 2. 手机号格式验证
  const phone = data.phone ?? '';
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    // 检查是否是明显垃圾号码
    const isFake = FAKE_PHONE_PATTERNS.some(p => p.test(phone));
    if (isFake) {
      return { blocked: true, reason: '无效手机号', silent: true };
    }
    // 非大陆手机号格式也放行（海外用户）
  }

  // 3. 姓名垃圾检测
  const name = (data.contactName ?? '').toLowerCase().trim();
  if (name.length < 2) {
    return { blocked: true, reason: '姓名过短', silent: true };
  }
  for (const keyword of FAKE_NAME_KEYWORDS) {
    if (name.includes(keyword.toLowerCase())) {
      return { blocked: true, reason: '测试数据', silent: true };
    }
  }

  // 4. 备注内容安全检测
  const remark = data.remark ?? '';
  if (remark.length > 500) {
    return { blocked: true, reason: '备注内容过长', silent: false };
  }

  return { blocked: false };
}
