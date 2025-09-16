import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const publicPaths = ['/sign-in', '/sign-up', '/api/auth/google', '/api/auth/google/callback', '/landing'];
    if(accessToken && publicPaths.includes(request.nextUrl.pathname)){
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  return NextResponse.next();
}