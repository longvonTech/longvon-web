import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const res = await fetch('http://localhost:4000/admin/images', {
    headers: { 'x-admin-token': request.headers.get('x-admin-token') ?? '' },
  });
  return NextResponse.json(await res.json(), { status: res.status });
}
