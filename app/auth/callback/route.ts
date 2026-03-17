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
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if this is a new user and send welcome email
      try {
        const user = data.user
        const createdAt = new Date(user.created_at).getTime()
        const now = new Date().getTime()
        const isNewUser = (now - createdAt) < 60000 // created within last 60 seconds

        if (isNewUser) {
          await fetch(`${baseUrl}/api/welcome`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.user_metadata?.full_name || 
                    user.user_metadata?.name || 
                    'there'
            })
          })
        }
      } catch (emailError) {
        // Don't block the redirect if email fails
        console.error('Welcome email failed:', emailError)
      }

      return NextResponse.redirect(`${baseUrl}${next}`)
    }

    console.error('❌ Auth callback error:', error.message)
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(error.message)}`)
  }

  // No code — redirect to login
  return NextResponse.redirect(`${baseUrl}/login?error=no_code`)
}