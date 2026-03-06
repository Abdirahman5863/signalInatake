import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔷 Subscription cancellation started')
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.log('❌ No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ User authenticated:', user.email)

    // Get user's subscription
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (fetchError || !subscription) {
      console.log('❌ No subscription found:', fetchError)
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    console.log('✅ Subscription found:', subscription.id)

    // Cancel with Dodo if subscription ID exists
    if (subscription.dodo_subscription_id) {
      try {
        // For now, we'll just mark it as cancelled
        // When you integrate real Dodo Payments, uncomment this:
        // await dodoPayments.cancelSubscription(subscription.dodo_subscription_id)
        console.log('✅ Dodo cancellation skipped (mock mode)')
      } catch (dodoError: any) {
        console.error('⚠️ Dodo cancellation error:', dodoError)
        // Continue anyway - we'll cancel locally
      }
    }

    // Update subscription to cancel at period end
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('❌ Update error:', updateError)
      throw updateError
    }

    console.log('✅ Subscription cancelled successfully')

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully'
    })

  } catch (error: any) {
    console.error('❌ Subscription cancellation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}