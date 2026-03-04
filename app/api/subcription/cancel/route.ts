import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'


export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 404 })
    }

    // Cancel with Dodo if subscription ID exists
    if (subscription.dodo_subscription_id) {
    //   await dodoPayments.cancelSubscription(subscription.dodo_subscription_id)
    }

    // Update subscription to cancel at period end
    await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    return NextResponse.json({
      success: true,
      message: 'Subscription will be cancelled at the end of billing period'
    })

  } catch (error: any) {
    console.error('Subscription cancellation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}