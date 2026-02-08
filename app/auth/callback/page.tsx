'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Completing authentication...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        // Handle OAuth errors
        if (error) {
          console.error('OAuth error:', error, errorDescription)
          router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`)
          return
        }

        if (!code) {
          console.error('No authorization code found')
          router.push('/login?error=No authorization code')
          return
        }

        setStatus('Exchanging authorization code...')

        // Exchange code for session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
          console.error('Exchange error:', exchangeError)
          router.push(`/login?error=${encodeURIComponent(exchangeError.message)}`)
          return
        }

        if (!data.session) {
          console.error('No session after exchange')
          router.push('/login?error=Failed to create session')
          return
        }

        // Session created successfully
        console.log('Session created:', data.session.user.email)
        setStatus('Success! Redirecting...')

        // CRITICAL: Use router.push, not window.location
        // This ensures Next.js properly handles the navigation
        router.push('/dashboard')
        
      } catch (err: any) {
        console.error('Callback error:', err)
        router.push(`/login?error=${encodeURIComponent(err.message || 'Unknown error')}`)
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-muted-foreground font-medium">{status}</p>
      </div>
    </div>
  )
}