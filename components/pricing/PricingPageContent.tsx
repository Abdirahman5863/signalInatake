'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Check, Loader2, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

const TRIAL_DAYS = 3

export function PricingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trialStatus, setTrialStatus] = useState<{
    inTrial: boolean
    daysLeft: number
    expired: boolean
  }>({ inTrial: false, daysLeft: 0, expired: false })

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login?redirect=/pricing')
          return
        }

        // Get subscription
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('plan, status, current_period_end')
          .eq('user_id', user.id)
          .single()

        setSubscription(subData)

        // Check trial status if no active subscription
        if (!subData || subData.status !== 'active') {
          const signupDate = new Date(user.created_at)
          const now = new Date()
          const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))
          const daysLeft = Math.max(0, TRIAL_DAYS - daysSinceSignup)
          
          setTrialStatus({
            inTrial: daysLeft > 0,
            daysLeft,
            expired: daysLeft === 0
          })
        } else {
          // Has active subscription - check if it's expired
          const periodEnd = new Date(subData.current_period_end)
          const now = new Date()
          
          if (now > periodEnd) {
            // Subscription expired
            setTrialStatus({ inTrial: false, daysLeft: 0, expired: true })
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
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

  // Check if subscription is expired
  const subscriptionExpired = subscription?.status === 'active' && 
    new Date(subscription.current_period_end) < new Date()

  // Dynamic button text
  const getButtonText = () => {
    if (subscribing) return 'Processing...'
    if (subscriptionExpired) return 'Renew Subscription - $49/month'
    if (trialStatus.inTrial) return `Upgrade Now - Skip ${trialStatus.daysLeft} ${trialStatus.daysLeft === 1 ? 'Day' : 'Days'} Trial`
    if (trialStatus.expired) return 'Subscribe Now - $49/month'
    return 'Subscribe Now - $49/month'
  }

  const getButtonColor = () => {
    if (trialStatus.expired || subscriptionExpired) return 'bg-orange-600 hover:bg-orange-700'
    if (trialStatus.inTrial) return 'bg-blue-600 hover:bg-blue-700'
    return 'bg-gray-900 hover:bg-gray-800'
  }

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

        {/* Trial Active - Can Upgrade Early */}
        {trialStatus.inTrial && !hasActiveSubscription && (
          <div className="mb-8 rounded-lg bg-blue-50 border-2 border-blue-200 p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-bold text-blue-900 mb-1">
                  {trialStatus.daysLeft} {trialStatus.daysLeft === 1 ? 'Day' : 'Days'} Left in Trial
                </h3>
                <p className="text-sm text-blue-700">
                  You can upgrade now to skip the trial and get instant access, or continue enjoying your free trial. No credit card required for trial.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Trial Expired Warning */}
        {trialStatus.expired && !hasActiveSubscription && (
          <div className="mb-8 rounded-lg bg-orange-50 border-2 border-orange-200 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-orange-600" />
              <div>
                <h3 className="font-bold text-orange-900 mb-1">
                  Your 3-Day Trial Has Ended
                </h3>
                <p className="text-sm text-orange-700">
                  Subscribe to LeadVett Pro to continue qualifying leads and accessing all features.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Expired */}
        {subscriptionExpired && (
          <div className="mb-8 rounded-lg bg-orange-50 border-2 border-orange-200 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-orange-600" />
              <div>
                <h3 className="font-bold text-orange-900 mb-1">
                  Subscription Expired
                </h3>
                <p className="text-sm text-orange-700">
                  Your monthly subscription has ended. Renew now to continue using LeadVett Pro.
                </p>
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
            One plan. Everything included. 
            {trialStatus.inTrial && ` ${trialStatus.daysLeft}-day trial available.`}
            {!trialStatus.inTrial && !hasActiveSubscription && ' Cancel anytime.'}
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
                  {trialStatus.inTrial && (
                    <div className="text-sm text-blue-600 font-semibold">
                      {trialStatus.daysLeft} days trial left
                    </div>
                  )}
                  {trialStatus.expired && (
                    <div className="text-sm text-orange-600 font-semibold">
                      Trial ended
                    </div>
                  )}
                  {subscriptionExpired && (
                    <div className="text-sm text-orange-600 font-semibold">
                      Subscription expired
                    </div>
                  )}
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

            {hasActiveSubscription && !subscriptionExpired ? (
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
                className={`w-full rounded-full px-8 py-4 text-lg font-semibold text-white transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 ${getButtonColor()}`}
              >
                {subscribing ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  getButtonText()
                )}
              </button>
            )}

            <div className="mt-6 space-y-3 text-center text-sm text-gray-600">
              {trialStatus.inTrial && (
                <p className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Upgrade early or continue free trial
                </p>
              )}
              {!hasActiveSubscription && (
                <p className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  {trialStatus.inTrial ? 'No credit card required for trial' : 'Cancel anytime'}
                </p>
              )}
              <p className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                One avoided call = Year paid
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}