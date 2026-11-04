import { NextRequest } from 'next/server';
import { proxyToApi } from '../../_lib/proxy';

async function forward(request: NextRequest, method?: string) {
  const params = request.nextUrl.pathname.replace(/^\/api\/admin\/geo\/?/, '');
  const path = params ? `/${params}` : '';
  return proxyToApi(request, `/admin/geo-benchmark${path}${request.nextUrl.search}`, method);
}

export async function GET(request: NextRequest) {
  return forward(request, 'GET');
}

export async function POST(request: NextRequest) {
  return forward(request, 'POST');
}

export async function PATCH(request: NextRequest) {
  return forward(request, 'PATCH');
}
