'use client'

import { useState } from 'react'
import { AlertCircle, Check, Loader2 } from 'lucide-react'
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
      <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900 mb-1">
              No Active Subscription
            </h3>
            <p className="text-sm text-orange-700 mb-4">
              Subscribe to unlock unlimited lead analysis and AI-powered qualification.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 transition-colors"
            >
              View Plans
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const planName = subscription.plan === 'team' ? 'Agency Team' : 'Solo Agency'
  const renewalDate = new Date(subscription.current_period_end).toLocaleDateString()

  return (
    <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
      <div className="flex items-start gap-3">
        <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-green-900 mb-1">
            {planName} - Active
          </h3>
          <p className="text-sm text-green-700 mb-4">
            {subscription.cancel_at_period_end 
              ? `Your subscription will end on ${renewalDate}`
              : `Your next billing date is ${renewalDate}`
            }
          </p>
          <div className="flex gap-3">
            <Link
              href="/pricing"
              className="text-sm font-medium text-green-700 hover:text-green-800"
            >
              Change Plan
            </Link>
            {!subscription.cancel_at_period_end && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cancelling...
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