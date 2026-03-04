'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { PricingCards } from '@/components/pricing/PricingCards'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function PricingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSubscription() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login?redirect=/pricing')
          return
        }

        // Get user's current subscription
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

  // Show success message if redirected from payment
  const paymentStatus = searchParams.get('payment')
  const plan = searchParams.get('plan')

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
      <div className="max-w-6xl mx-auto">
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
                  Payment Successful!
                </h3>
                <p className="text-sm text-green-700">
                  Your {plan === 'team' ? 'Agency Team' : 'Solo Agency'} subscription is now active.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Failed Message */}
        {paymentStatus === 'failed' && (
          <div className="mb-8 rounded-lg bg-red-50 border-2 border-red-200 p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">❌</div>
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

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Start your 14-day free trial. No credit card required.
          </p>
        </div>

        <PricingCards userSubscription={subscription || undefined} />
      </div>
    </div>
  )
}