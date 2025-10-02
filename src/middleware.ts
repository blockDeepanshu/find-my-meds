import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production')

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip authentication for public paths
  const publicPaths = ['/api/auth', '/login', '/favicon.ico']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path)) || pathname === '/'
  
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  // Verify token
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return NextResponse.next()
  } catch (error) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
