import { createClient } from '@/lib/supabase/server'
import { PricingCards } from '@/components/pricing/PricingCards'
import { redirect } from 'next/navigation'

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/pricing')
  }

  // Get user's current subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
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