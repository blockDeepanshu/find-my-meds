import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard)
  const { pathname } = request.nextUrl

  // Paths that require authentication
  const protectedPaths = ["/dashboard", "/p"]
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  // If not a protected path, continue
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // Check if user has a valid session token
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    // If no token, redirect to login
    if (!token) {
      console.log(`[Middleware] No token found for ${pathname}, redirecting to login`)
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Token exists, allow access
    console.log(`[Middleware] Token found for ${pathname}, allowing access for user: ${token.email}`)
    return NextResponse.next()

  } catch (error) {
    console.error(`[Middleware] Error checking token:`, error)
    // On error, redirect to login to be safe
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/p/:path*",
  ],
}

