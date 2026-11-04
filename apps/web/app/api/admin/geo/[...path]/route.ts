import { NextRequest, NextResponse } from 'next/server';
import { proxyToApi } from '../../_lib/proxy';
import { geoBenchmarkApiPath } from '../../_lib/geo-proxy-path';

async function forward(request: NextRequest, method?: string) {
  try {
    const path = geoBenchmarkApiPath(request.nextUrl.pathname, request.nextUrl.search);
    return proxyToApi(request, path, method);
  } catch {
    return NextResponse.json({ message: 'Rejected geo admin path.' }, { status: 400 });
  }
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
