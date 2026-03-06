import { createClient } from '@/lib/supabase/server'

export async function checkSubscriptionAccess() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      hasAccess: false,
      reason: 'not_authenticated',
      subscription: null,
      trialDaysLeft: 0
    }
  }

  // Get subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // No subscription - check if in trial period
  if (!subscription) {
    // Check when user signed up
    const { data: userData } = await supabase
      .from('auth.users')
      .select('created_at')
      .eq('id', user.id)
      .single()

    const signupDate = new Date(userData?.created_at || user.created_at)
    const now = new Date()
    const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))
    
    const TRIAL_DAYS = 3 // Your 3-day trial
    const trialDaysLeft = Math.max(0, TRIAL_DAYS - daysSinceSignup)

    if (trialDaysLeft > 0) {
      return {
        hasAccess: true,
        reason: 'trial',
        subscription: null,
        trialDaysLeft,
        trialEndsAt: new Date(signupDate.getTime() + (TRIAL_DAYS * 24 * 60 * 60 * 1000))
      }
    }

    return {
      hasAccess: false,
      reason: 'trial_expired',
      subscription: null,
      trialDaysLeft: 0
    }
  }

  // Has subscription - check if active
  if (subscription.status === 'active') {
    return {
      hasAccess: true,
      reason: 'active_subscription',
      subscription,
      trialDaysLeft: 0
    }
  }

  // Subscription exists but not active
  return {
    hasAccess: false,
    reason: 'subscription_inactive',
    subscription,
    trialDaysLeft: 0
  }
}

export async function requireSubscription() {
  const access = await checkSubscriptionAccess()
  
  if (!access.hasAccess) {
    return {
      allowed: false,
      redirectTo: '/pricing',
      message: access.reason === 'trial_expired' 
        ? 'Your 3-day trial has expired. Subscribe to continue using LeadVett.'
        : 'You need an active subscription to access this feature.'
    }
  }

  return {
    allowed: true,
    access
  }
}