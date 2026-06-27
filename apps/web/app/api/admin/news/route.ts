import { NextRequest } from 'next/server';
import { proxyToApi } from '../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyToApi(request, '/admin/news');
}

export async function POST(request: NextRequest) {
  return proxyToApi(request, '/admin/news', 'POST');
}
