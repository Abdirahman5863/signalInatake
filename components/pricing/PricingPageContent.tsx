'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Check, Loader2, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function PricingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSubscription() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login?redirect=/pricing')
          return
        }

        const { data } = await supabase
          .from('subscriptions')
          .select('plan, status')
          .eq('user_id', user.id)
          .single()

        setSubscription(data)
      } catch (error) {
        console.error('Error loading subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSubscription()
  }, [router])

  const handleSubscribe = async () => {
    setSubscribing(true)
    setError(null)

    try {
      console.log('Initializing payment...')

      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro' })
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Payment error:', errorData)
        throw new Error(errorData.error || 'Payment initialization failed')
      }

      const data = await response.json()
      console.log('Payment data:', data)

      if (!data.authorization_url) {
        throw new Error('No payment URL received')
      }

      // Redirect to payment page
      window.location.href = data.authorization_url

    } catch (error: any) {
      console.error('Subscription error:', error)
      setError(error.message || 'Failed to start subscription. Please try again.')
      setSubscribing(false)
    }
  }

  const paymentStatus = searchParams.get('payment')
  const hasActiveSubscription = subscription?.status === 'active'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Success Message */}
        {paymentStatus === 'success' && (
          <div className="mb-8 rounded-lg bg-green-50 border-2 border-green-200 p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎉</div>
              <div>
                <h3 className="font-bold text-green-900 mb-1">
                  Welcome to LeadVett Pro!
                </h3>
                <p className="text-sm text-green-700">
                  Your subscription is now active. Start qualifying leads like a pro.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Failed Message */}
        {paymentStatus === 'failed' && (
          <div className="mb-8 rounded-lg bg-red-50 border-2 border-red-200 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">
                  Payment Failed
                </h3>
                <p className="text-sm text-red-700">
                  Your payment could not be processed. Please try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 rounded-lg bg-red-50 border-2 border-red-200 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Professional Plan
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple, Honest Pricing
          </h1>
          <p className="text-xl text-gray-600">
            One plan. Everything included. Cancel anytime.
          </p>
        </div>

        {/* Single Pricing Card */}
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-gray-900 shadow-2xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#b5944b] to-[#d4af37] text-white px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap">
              🔥 LIMITED TIME OFFER
            </div>

            <div className="text-center mb-8 mt-2">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                LeadVett Pro
              </h3>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-6xl font-bold text-gray-900">$49</span>
                <div className="text-left">
                  <div className="text-lg text-gray-600">/month</div>
                  <div className="text-sm text-green-600 font-semibold">14-day free trial</div>
                </div>
              </div>
              <p className="text-gray-600">
                Everything you need to qualify leads like a pro
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Unlimited lead analysis',
                'Gold/Silver/Bronze AI badges',
                'One-click DM scripts',
                'Rule engine transparency',
                'Confidence scoring (0-100%)',
                'Hard reject automation',
                'ManyChat integration',
                'Mobile-friendly forms',
                'Export to CSV',
                'Lead status management',
                'Email support'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-base">{feature}</span>
                </li>
              ))}
            </ul>

            {hasActiveSubscription ? (
              <div className="space-y-4">
                <button
                  disabled
                  className="w-full rounded-full bg-green-500 px-8 py-4 text-lg font-semibold text-white cursor-not-allowed opacity-75"
                >
                  ✓ Active Subscription
                </button>
                <p className="text-center text-sm text-gray-600">
                  You're all set! Visit your{' '}
                  <Link href="/dashboard" className="text-[#b5944b] hover:underline font-medium">
                    dashboard
                  </Link>
                  {' '}to start qualifying leads.
                </p>
              </div>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className="w-full rounded-full bg-gray-900 px-8 py-4 text-lg font-semibold text-white hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {subscribing ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Start 14-Day Free Trial
                  </>
                )}
              </button>
            )}

            <div className="mt-6 space-y-3 text-center text-sm text-gray-600">
              <p className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                No credit card required for trial
              </p>
              <p className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Cancel anytime with one click
              </p>
              <p className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                One avoided call = Year paid
              </p>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-50 border-2 border-blue-200">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                30-Day Money-Back Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}