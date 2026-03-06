'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Crown, Clock } from 'lucide-react'
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
  const [trialInfo, setTrialInfo] = useState<{
    inTrial: boolean
    daysLeft: number
    endsAt: Date | null
  } | null>(null)

  useEffect(() => {
    // Check trial status
    async function checkTrial() {
      try {
        const response = await fetch('/api/subscription/trial-status')
        if (response.ok) {
          const data = await response.json()
          setTrialInfo(data)
        }
      } catch (error) {
        console.error('Error checking trial:', error)
      }
    }
    
    if (!subscription || subscription.status !== 'active') {
      checkTrial()
    }
  }, [subscription])

  // Show trial status
  if (!subscription || subscription.status !== 'active') {
    if (trialInfo?.inTrial) {
      return (
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 w-full sm:w-auto">
              <h3 className="font-semibold text-blue-900 text-sm sm:text-base mb-1">
                {trialInfo.daysLeft} {trialInfo.daysLeft === 1 ? 'Day' : 'Days'} Left in Trial
              </h3>
              <p className="text-xs sm:text-sm text-blue-700 mb-3 sm:mb-4">
                Your 3-day free trial ends on {trialInfo.endsAt ? new Date(trialInfo.endsAt).toLocaleDateString() : 'soon'}. 
                Subscribe to keep your forms and leads.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                Subscribe Now - $49/month
              </Link>
            </div>
          </div>
        </div>
      )
    }

    // Trial expired
    return (
      <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 w-full sm:w-auto">
            <h3 className="font-semibold text-orange-900 text-sm sm:text-base mb-1">
              Trial Expired - Subscribe to Continue
            </h3>
            <p className="text-xs sm:text-sm text-orange-700 mb-3 sm:mb-4">
              Your 3-day trial has ended. Subscribe now to unlock unlimited lead analysis and AI-powered qualification.
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

  // Active subscription - NO cancel button
  const renewalDate = new Date(subscription.current_period_end).toLocaleDateString()

  return (
    <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 w-full sm:w-auto">
          <h3 className="font-semibold text-green-900 text-sm sm:text-base mb-1">
            LeadVett Pro - Active ✓
          </h3>
          <p className="text-xs sm:text-sm text-green-700">
            Your next billing date is {renewalDate}
          </p>
        </div>
      </div>
    </div>
  )
}