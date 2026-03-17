// middleware.ts — ROOT directory (same level as app/, lib/)

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session on every request — this is what keeps users logged in
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Always let auth routes, API routes, and PUBLIC intake forms through
  if (
    pathname.startsWith('/auth') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/intake')  // ✅ INTAKE FORMS ARE PUBLIC
  ) {
    return supabaseResponse
  }

  // Protected routes — redirect to login if not logged in
  const protectedPaths = ['/dashboard', '/forms', '/settings', '/leads']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))

  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Auth pages — redirect to dashboard if already logged in
  if ((pathname.startsWith('/login') || pathname.startsWith('/signup')) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}