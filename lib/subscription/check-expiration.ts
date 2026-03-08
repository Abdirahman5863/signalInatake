import { createClient } from '@/lib/supabase/server'

export async function checkSubscriptionExpiration(userId: string) {
  const supabase = await createClient()
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!subscription) {
    return {
      hasAccess: false,
      reason: 'no_subscription',
      subscription: null
    }
  }

  const now = new Date()
  const periodEnd = new Date(subscription.current_period_end)

  // Check if subscription period has ended
  if (now > periodEnd) {
    console.log('⏰ Subscription period ended for user:', userId)
    
    // Mark subscription as expired
    await supabase
      .from('subscriptions')
      .update({ 
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    return {
      hasAccess: false,
      reason: 'subscription_expired',
      subscription: { ...subscription, status: 'expired' },
      expiredDate: periodEnd
    }
  }

  // Subscription is still active
  if (subscription.status === 'active') {
    return {
      hasAccess: true,
      reason: 'active_subscription',
      subscription,
      daysUntilExpiry: Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    }
  }

  return {
    hasAccess: false,
    reason: 'subscription_inactive',
    subscription
  }
}