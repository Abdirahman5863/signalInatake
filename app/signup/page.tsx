'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthShell, GoogleMark } from '@/components/auth/AuthShell'
import styles from '@/components/auth/auth.module.css'
import { supabase } from '@/lib/supabase/client'

function SignUpForm() {
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
    if (searchParams.has('error')) router.replace('/signup')
    return () => { active = false }
  }, [searchParams, router])

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
      })
      if (error) throw error
      if (!data?.url) throw new Error('Google sign up could not start. Please retry.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign up could not start. Please retry.')
      setGoogleLoading(false)
    }
  }

  return (
    <AuthShell mode="signup" title="Create your account" description="Get free early access to the project enquiry workflow. No card or payment setup required.">
      {error && <div role="alert" className={styles.error}><strong>We could not create your account.</strong><span>{error}</span></div>}
      <button type="button" onClick={handleGoogleSignUp} disabled={googleLoading} className={styles.googleButton}>
        {googleLoading ? <span className={styles.spinner} aria-hidden="true" /> : <GoogleMark />}
        <span>{googleLoading ? 'Connecting to Google…' : 'Continue with Google'}</span>
      </button>
      <div className={styles.freeNote}><span aria-hidden="true">✓</span><p><strong>Free while we learn from the pilot.</strong><br />Create a form and review project enquiries at no charge.</p></div>
      <div className={styles.switchAuth}>Already have an account? <Link href="/login">Sign in <span aria-hidden="true">→</span></Link></div>
    </AuthShell>
  )
}

export default function SignUpPage() {
  return <Suspense fallback={<div className={styles.loading} role="status">Loading account setup…</div>}><SignUpForm /></Suspense>
}
