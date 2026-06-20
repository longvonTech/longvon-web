// 最小化API客户端封装。Sprint 1只有/health与/customer/me两个真实端点，
// 暂不引入SWR/React Query等数据请求库——引入数据请求库的收益要等到
// 有多个页面、多个需要缓存/重试的请求场景时才能体现，现在加只是增加依赖面。
//
// 注意：Next.js只会把以NEXT_PUBLIC_为前缀的环境变量打包进浏览器端代码，
// 不带这个前缀的变量在客户端组件里读到的永远是undefined（服务端组件不受此限制）。
// 本文件的apiFetch可能被客户端组件调用，因此必须使用NEXT_PUBLIC_API_BASE_URL。

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

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
    const body = await response.text();
    throw new Error(`API请求失败：${response.status} ${body}`);
  }

  return response.json() as Promise<T>;
}
