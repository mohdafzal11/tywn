import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// Define which routes require authentication
const protectedRoutes = ['/dashboard', '/calendar', '/settings']
const publicRoutes = ['/login', '/api/login', '/api/callback', '/api/logout', '/api/user']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes that don't need auth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Skip files like favicon.ico, etc.
  ) {
    return NextResponse.next()
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If it's a protected route, check for session
  if (isProtectedRoute) {
    try {
      const cookieStore = await cookies()
      const sessionCookie = cookieStore.get('session')?.value

      if (!sessionCookie) {
        // No session found, redirect to login
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
      }

      // Validate session format
      let sessionData
      try {
        sessionData = JSON.parse(decodeURIComponent(sessionCookie))
      } catch {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
      }

      if (!sessionData.userId) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
      }

      // Session is valid, continue
      return NextResponse.next()
    } catch (error) {
      console.error('Middleware error:', error)
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (pathname === '/login') {
    try {
      const cookieStore = await cookies()
      const sessionCookie = cookieStore.get('session')?.value

      if (sessionCookie) {
        const sessionData = JSON.parse(decodeURIComponent(sessionCookie))
        if (sessionData.userId) {
          const dashboardUrl = new URL('/dashboard', request.url)
          return NextResponse.redirect(dashboardUrl)
        }
      }
    } catch (error) {
      // If session is invalid, allow access to login
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
