import { NextResponse } from 'next/server';

const API_BASE = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

export async function proxyToApi(
  request: Request,
  path: string,
  method?: string,
) {
  const headers: Record<string, string> = {
    'x-admin-token': request.headers.get('x-admin-token') ?? '',
  };
  const contentType = request.headers.get('content-type');
  if (contentType) headers['content-type'] = contentType;

  const verb = method ?? request.method;
  const body =
    verb === 'GET' || verb === 'DELETE'
      ? undefined
      : await request.arrayBuffer();

  const res = await fetch(`${API_BASE}${path}`, {
    method: verb,
    headers,
    body: body && body.byteLength > 0 ? body : undefined,
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
