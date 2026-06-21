import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'http://localhost:4000/growth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const url = new URL(request.url);
  const res = await fetch(`${API_BASE}/${path.join('/')}${url.search}`, {
    headers: { 'x-admin-token': request.headers.get('x-admin-token') ?? '' },
  }).catch(() => null);
  if (!res) return NextResponse.json({ error: 'API unavailable' }, { status: 503 });
  return NextResponse.json(await res.json(), { status: res.status });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const body = await request.text();
  const res = await fetch(`${API_BASE}/${path.join('/')}`, {
    method: 'POST',
    headers: {
      'x-admin-token': request.headers.get('x-admin-token') ?? '',
      'Content-Type': request.headers.get('content-type') ?? 'application/json',
    },
    body: body || undefined,
  }).catch(() => null);
  if (!res) return NextResponse.json({ error: 'API unavailable' }, { status: 503 });
  return NextResponse.json(await res.json(), { status: res.status });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const body = await request.text();
  const res = await fetch(`${API_BASE}/${path.join('/')}`, {
    method: 'PUT',
    headers: {
      'x-admin-token': request.headers.get('x-admin-token') ?? '',
      'Content-Type': 'application/json',
    },
    body: body || undefined,
  }).catch(() => null);
  if (!res) return NextResponse.json({ error: 'API unavailable' }, { status: 503 });
  return NextResponse.json(await res.json(), { status: res.status });
}
