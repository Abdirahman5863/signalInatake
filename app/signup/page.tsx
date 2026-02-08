'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Sparkles, Zap, BarChart3, Shield, Users, Clock } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
        return
      }
    }
    checkUser()

    // Check for error from OAuth callback
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
      // Clean up URL
      router.replace('/signup')
    }
  }, [searchParams, router])

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })

      if (error) throw error
      
      // The OAuth flow will redirect automatically, so we don't need to do anything here
      // If there's no redirect, it means there was an error
      if (!data?.url) {
        throw new Error('Failed to initiate Google sign in')
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during Google sign up')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding and Description */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-background flex-col justify-center p-12 text-foreground">
        <div className="max-w-md mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-3">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">SignalIntake</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              Start Qualifying
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Leads Today
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Join agencies using AI to automatically qualify leads. Create forms,
              collect responses, and get instant Gold/Silver/Bronze badges.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-2.5 flex-shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Create Intake Forms</h3>
                <p className="text-sm text-muted-foreground">
                  Set up beautiful forms with proven questions in seconds
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-2.5 flex-shrink-0">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Claude AI instantly analyzes responses and assigns qualification badges
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-2.5 flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Focus on Gold Leads</h3>
                <p className="text-sm text-muted-foreground">
                  Prioritize your time on leads most likely to convert
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="rounded-lg bg-primary p-2">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">SignalIntake</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">
              Create your account
            </h2>
            <p className="text-muted-foreground">
              Get started in seconds with Google sign-in
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
              <p className="font-medium">Authentication Error</p>
              <p className="mt-1 text-xs">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full group relative flex items-center justify-center gap-3 rounded-lg border-2 border-input bg-background px-6 py-4 text-base font-semibold hover:bg-accent hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
          >
            {googleLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>

          <div className="pt-8 border-t">
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to SignalIntake&apos;s Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
