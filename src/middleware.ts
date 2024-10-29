import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessTokenAdmin');
    console.log('token:', token);
    if (!token && !request.nextUrl.pathname.startsWith('/admin/auth/login')) {
        return NextResponse.redirect(new URL('/admin/auth/login', request.url));
    }
    if (token && request.nextUrl.pathname.startsWith('/admin/auth/login')) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
};