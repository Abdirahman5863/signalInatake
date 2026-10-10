import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const candidate = url.searchParams.get('next') ?? '/dashboard'
  const next = candidate.startsWith('/dashboard') && !candidate.includes('\\') ? candidate : '/dashboard'
  const origin = process.env.NEXT_PUBLIC_SITE_URL || url.origin
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, origin))
  }
  return NextResponse.redirect(new URL('/login?error=Sign-in%20could%20not%20be%20completed.%20Please%20retry.', origin))
}
