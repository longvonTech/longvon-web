import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { HTML_LANG_HEADER, htmlLangFromPathname } from './lib/i18n-routes';

/**
 * Stamps the request with the document language derived from the path.
 * Root layout reads this header so `<html lang>` is present in SSR HTML.
 * Does not change routing, crawler rules, or response bodies.
 */
export function middleware(request: NextRequest) {
  const lang = htmlLangFromPathname(request.nextUrl.pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(HTML_LANG_HEADER, lang);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)'],
};
