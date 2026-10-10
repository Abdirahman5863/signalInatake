'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthShell, GoogleMark } from '@/components/auth/AuthShell'
import styles from '@/components/auth/auth.module.css'
import { supabase } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(() => searchParams.get('error'))

  useEffect(() => {
    let active = true
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (active && user) router.replace('/dashboard')
    }
    void checkUser()
    if (searchParams.has('error')) router.replace('/login')
    return () => { active = false }
  }, [searchParams, router])

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
      })
      if (error) throw error
      if (!data?.url) throw new Error('Google sign in could not start. Please retry.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign in could not start. Please retry.')
      setGoogleLoading(false)
    }
  }

  return (
    <AuthShell mode="login" title="Welcome back" description="Sign in to review new project enquiries and pick up where you left off.">
      {error && <div role="alert" className={styles.error}><strong>We could not sign you in.</strong><span>{error}</span></div>}
      <button type="button" onClick={handleGoogleLogin} disabled={googleLoading} className={styles.googleButton}>
        {googleLoading ? <span className={styles.spinner} aria-hidden="true" /> : <GoogleMark />}
        <span>{googleLoading ? 'Connecting to Google…' : 'Continue with Google'}</span>
      </button>
      <p className={styles.noPassword}>Use your Google account to sign in securely.</p>
      <div className={styles.switchAuth}>New to LeadVett? <Link href="/signup">Create your free account <span aria-hidden="true">→</span></Link></div>
    </AuthShell>
  )
}

export default function LoginPage() {
  return <Suspense fallback={<div className={styles.loading} role="status">Loading sign in…</div>}><LoginForm /></Suspense>
}
