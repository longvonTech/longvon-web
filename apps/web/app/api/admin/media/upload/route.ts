import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

export async function POST(request: NextRequest) {
  const body = await request.arrayBuffer();
  const contentType = request.headers.get('content-type') ?? '';
  const res = await fetch(`${API_BASE}/admin/media/upload`, {
    method: 'POST',
    headers: {
      'x-admin-token': request.headers.get('x-admin-token') ?? '',
      'content-type': contentType,
    },
    body: body.byteLength > 0 ? body : undefined,
  });
  return NextResponse.json(await res.json(), { status: res.status });
}
