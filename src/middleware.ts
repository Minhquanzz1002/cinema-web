import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken');
    console.log('token:', token);
    if (!token && !request.nextUrl.pathname.startsWith('/auth/login')) {
        return NextResponse.redirect(new URL('/admin/auth/login', request.url));
    }
    if (token && request.nextUrl.pathname.startsWith('/auth/login')) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/products/:path*', '/auth/login']
};