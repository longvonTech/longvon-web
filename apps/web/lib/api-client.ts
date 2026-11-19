// 最小化API客户端封装。Sprint 1只有/health与/customer/me两个真实端点，
// 暂不引入SWR/React Query等数据请求库——引入数据请求库的收益要等到
// 有多个页面、多个需要缓存/重试的请求场景时才能体现，现在加只是增加依赖面。
//
// 注意：Next.js只会把以NEXT_PUBLIC_为前缀的环境变量打包进浏览器端代码，
// 不带这个前缀的变量在客户端组件里读到的永远是undefined（服务端组件不受此限制）。
// 浏览器未配置 API 地址时走同源 /api；服务端保留本地 API 默认地址。

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/$/, '') ||
  (typeof window !== 'undefined' ? '/api' : 'http://localhost:4000');

// Expose status and known field names, never raw backend internals to the UI.
export class ApiError extends Error {
  constructor(public status: number, public fields: string[] = []) {
    super(`API request failed (${status})`);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { accessToken?: string },
): Promise<T> {
  const { accessToken, ...rest } = options ?? {};
  const headers = new Headers(rest.headers);
  headers.set('Content-Type', 'application/json');
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
  });

  if (!response.ok) {
    let fields: string[] = [];
    try {
      const body = await response.json();
      const messages: unknown[] = Array.isArray(body.message) ? body.message : [body.message];
      fields = ['phone'].filter(field => messages.some(message =>
        typeof message === 'string' && message.startsWith(`${field} `)));
    } catch { /* proxy errors may be HTML */ }
    throw new ApiError(response.status, fields);
  }

  return response.json() as Promise<T>;
}
