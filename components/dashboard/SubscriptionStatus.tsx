'use client'

import { useState } from 'react'
import { AlertCircle, Check, Loader2, Crown } from 'lucide-react'
import Link from 'next/link'

interface SubscriptionStatusProps {
  subscription: {
    plan: string
    status: string
    current_period_end: string
    cancel_at_period_end: boolean
  } | null
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.')) {
      return
    }

    setCancelling(true)

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      alert('Subscription cancelled. You will retain access until the end of your billing period.')
      window.location.reload()

    } catch (error: any) {
      alert(error.message || 'Failed to cancel subscription')
    } finally {
      setCancelling(false)
    }
  }

  if (!subscription || subscription.status !== 'active') {
    return (
      <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 w-full sm:w-auto">
            <h3 className="font-semibold text-orange-900 text-sm sm:text-base mb-1">
              No Active Subscription
            </h3>
            <p className="text-xs sm:text-sm text-orange-700 mb-3 sm:mb-4">
              Subscribe to unlock unlimited lead analysis and AI-powered qualification.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-orange-700 transition-colors w-full sm:w-auto"
            >
              View Plans
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const planName = subscription.plan === 'pro' ? 'LeadVett Pro' : subscription.plan === 'team' ? 'Agency Team' : 'Solo Agency'
  const renewalDate = new Date(subscription.current_period_end).toLocaleDateString()

  return (
    <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 w-full sm:w-auto">
          <h3 className="font-semibold text-green-900 text-sm sm:text-base mb-1">
            {planName} - Active ✓
          </h3>
          <p className="text-xs sm:text-sm text-green-700 mb-3 sm:mb-4">
            {subscription.cancel_at_period_end 
              ? `Your subscription will end on ${renewalDate}`
              : `Your next billing date is ${renewalDate}`
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link
              href="/pricing"
              className="text-xs sm:text-sm font-medium text-green-700 hover:text-green-800 underline text-center sm:text-left"
            >
              Manage Plan
            </Link>
            {!subscription.cancel_at_period_end && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 flex items-center justify-center sm:justify-start gap-1 sm:gap-2"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  'Cancel Subscription'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}