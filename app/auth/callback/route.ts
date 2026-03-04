// /app/auth/callback/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Always use the production URL in production
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Always redirect to the canonical domain, not origin
      // This prevents session loss when Vercel uses different edge nodes
      return NextResponse.redirect(`${baseUrl}${next}`)
    }

    console.error('Auth callback error:', error)
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`)
}