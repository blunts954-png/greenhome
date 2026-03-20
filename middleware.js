import { NextResponse } from 'next/server';

const REDIRECTS = new Map([
  ['/about-us', '/about'],
  ['/our-story', '/about'],
  ['/connect', '/contact']
]);

export function middleware(request) {
  const pathname = request.nextUrl.pathname.toLowerCase();
  const destination = REDIRECTS.get(pathname);

  if (!destination) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(destination, request.url), 308);
}

export const config = {
  matcher: ['/about-us', '/our-story', '/connect']
};
