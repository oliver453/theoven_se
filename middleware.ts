import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware för API routes, static files etc.
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Om det redan är en /en route, fortsätt som vanligt
  if (pathname.startsWith('/en')) {
    return NextResponse.next();
  }

  // För root path, låt klient-sidan hantera språkdetektering
  // Detta förhindrar server-side redirects som kan orsaka problem
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};