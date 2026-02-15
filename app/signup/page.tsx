'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { Check, Zap, Shield, Users } from 'lucide-react'
import leadicon from '../public/images/leadicon.png'

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
        return
      }
    }
    checkUser()

    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
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
      {/* Left side - Branding and Value Props */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-[#b5944b]/10 via-[#b5944b]/5 to-white flex-col justify-center p-12">
        <div className="max-w-md mx-auto space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src={leadicon}
              alt="LeadVett Logo"
              width={60}
              height={50}
              className="object-contain"
            />
            <span className="text-3xl font-extrabold tracking-tight text-gray-900">
              Lead<span className="text-[#b5944b]">Vett</span>
            </span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-gray-900">
              Deploy your agency's
              <span className="block text-[#b5944b]">
                qualification policy
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Join 127+ agencies using programmable discipline to stop wasting 
              15 hours/week on bad DMs.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[#b5944b] p-1 flex-shrink-0">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Clinical Breakdowns in 10 Seconds
                </h3>
                <p className="text-sm text-gray-600">
                  Strengths vs. Risks, not vague summaries
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[#b5944b] p-1 flex-shrink-0">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  One-Click DM Scripts
                </h3>
                <p className="text-sm text-gray-600">
                  AI-generated replies that actually close deals
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[#b5944b] p-1 flex-shrink-0">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Rule Engine Transparency
                </h3>
                <p className="text-sm text-gray-600">
                  See exactly why each badge was assigned
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[#b5944b] p-1 flex-shrink-0">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  2-Minute ManyChat Setup
                </h3>
                <p className="text-sm text-gray-600">
                  Works with your existing IG automation
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full bg-[#b5944b]/20 border-2 border-white flex items-center justify-center text-xs font-bold text-[#b5944b]"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  127 agencies already saving time
                </p>
                <p className="text-xs text-gray-600">
                  1,905 hours saved this month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Image
              src={leadicon}
              alt="LeadVett Logo"
              width={50}
              height={40}
              className="object-contain"
            />
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              Lead<span className="text-[#b5944b]">Vett</span>
            </span>
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Start saving time today
            </h2>
            <p className="text-gray-600">
              14-day free trial • No credit card required
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border-2 border-red-200 p-4 text-sm text-red-800">
              <p className="font-semibold">Authentication Error</p>
              <p className="mt-1 text-xs">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full group relative flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-base font-semibold text-gray-900 hover:border-[#b5944b] hover:bg-[#b5944b]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
          >
            {googleLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#b5944b] border-t-transparent" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#4285F4"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
              <Check className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs font-medium text-green-700">
                Free 14-day trial
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200">
              <Zap className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                2-min setup
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200">
              <Users className="h-3.5 w-3.5 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">
                127+ agencies
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-gray-500">
                One avoided call = Year paid for
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#b5944b] hover:text-[#9a7a3d] transition-colors"
            >
              Sign in
            </Link>
          </p>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to LeadVett's{' '}
              <a href="#" className="underline hover:text-gray-700">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="underline hover:text-gray-700">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#b5944b] border-t-transparent" />
      </div>
    }>
      <SignUpForm />
    </Suspense>
  )
}