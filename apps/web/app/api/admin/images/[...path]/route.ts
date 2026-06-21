import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const res = await fetch(`http://localhost:4000/admin/images/${path.join('/')}`, {
    headers: { 'x-admin-token': request.headers.get('x-admin-token') ?? '' },
  });
  return NextResponse.json(await res.json(), { status: res.status });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const body = await request.arrayBuffer();
  const contentType = request.headers.get('content-type') ?? '';
  const res = await fetch(`http://localhost:4000/admin/images/${path.join('/')}`, {
    method: 'POST',
    headers: { 'x-admin-token': request.headers.get('x-admin-token') ?? '', 'content-type': contentType },
    body: body.byteLength > 0 ? body : undefined,
  });
  return NextResponse.json(await res.json(), { status: res.status });
}
