import { updateSession } from '@/utils/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { response, session } = await updateSession(request)

  // Get the pathname of the request
  const pathname = request.nextUrl.pathname

  // If user is authenticated and trying to access login or sign-up, redirect to home
  if (session && (pathname === '/login')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!session && pathname !== '/login' && pathname !== '/sign-up') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // For all other cases, proceed with the request
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}