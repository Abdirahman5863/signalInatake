'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface PricingCardsProps {
  userSubscription?: {
    plan: string
    status: string
  }
}

export function PricingCards({ userSubscription }: PricingCardsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: 'solo' | 'team') => {
    setLoading(plan)

    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment initialization failed')
      }

      // Redirect to Dodo payment page
      window.location.href = data.authorization_url

    } catch (error: any) {
      console.error('Subscription error:', error)
      alert(error.message || 'Failed to start subscription')
      setLoading(null)
    }
  }

  const currentPlan = userSubscription?.plan
  const isActive = userSubscription?.status === 'active'

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {/* Solo Plan */}
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Solo Agency</h3>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-5xl font-bold text-gray-900">$49</span>
          <span className="text-lg text-gray-600">/month</span>
        </div>

        <ul className="space-y-3 mb-8">
          {[
            'Unlimited lead analysis',
            'Gold/Silver/Bronze badges',
            'AI-generated DM scripts',
            'Rule engine',
            '1 user account',
            'Email support'
          ].map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {currentPlan === 'solo' && isActive ? (
          <button
            disabled
            className="w-full rounded-full bg-gray-300 px-8 py-4 font-semibold text-gray-600 cursor-not-allowed"
          >
            Current Plan
          </button>
        ) : (
          <button
            onClick={() => handleSubscribe('solo')}
            disabled={loading === 'solo'}
            className="w-full rounded-full bg-gray-900 px-8 py-4 font-semibold text-white hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading === 'solo' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Subscribe Now'
            )}
          </button>
        )}
      </div>

      {/* Team Plan */}
      <div className="bg-white rounded-2xl p-8 border-2 border-[#b5944b] shadow-xl relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#b5944b] to-[#d4af37] text-white px-6 py-2 rounded-full text-sm font-bold">
          MOST POPULAR
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-2">Agency Team</h3>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-5xl font-bold text-gray-900">$129</span>
          <span className="text-lg text-gray-600">/month</span>
        </div>

        <ul className="space-y-3 mb-8">
          {[
            'Everything in Solo',
            'Up to 5 team seats',
            'Custom budget rules',
            'Advanced analytics',
            'Webhook integration',
            'Priority support',
            'Weekly strategy call'
          ].map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-[#b5944b] flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {currentPlan === 'team' && isActive ? (
          <button
            disabled
            className="w-full rounded-full bg-gray-300 px-8 py-4 font-semibold text-gray-600 cursor-not-allowed"
          >
            Current Plan
          </button>
        ) : (
          <button
            onClick={() => handleSubscribe('team')}
            disabled={loading === 'team'}
            className="w-full rounded-full bg-gradient-to-r from-[#b5944b] to-[#d4af37] px-8 py-4 font-semibold text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading === 'team' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Subscribe Now'
            )}
          </button>
        )}
      </div>
    </div>
  )
}