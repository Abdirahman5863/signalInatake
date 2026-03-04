// app/auth/callback/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  const baseUrl = 'https://leadvett.com'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`)
    }

    console.error('❌ Auth callback error:', error.message)
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(error.message)}`)
  }

  // No code — redirect to login
  return NextResponse.redirect(`${baseUrl}/login?error=no_code`)
}