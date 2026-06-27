import { NextRequest } from 'next/server';
import { proxyToApi } from '../../_lib/proxy';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyToApi(request, `/admin/news/${path.join('/')}`, 'GET');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyToApi(request, `/admin/news/${path.join('/')}`, 'PATCH');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyToApi(request, `/admin/news/${path.join('/')}`, 'POST');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyToApi(request, `/admin/news/${path.join('/')}`, 'DELETE');
}
