import { createClient } from '@/lib/supabase/server'

/**
 * LeadVett is currently free. Keep this compatibility helper so existing
 * callers do not need to know about the product-model change.
 */
export async function checkSubscriptionAccess() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return {
    hasAccess: Boolean(user),
    reason: user ? 'free_access' : 'not_authenticated',
    subscription: null,
    trialDaysLeft: 0,
  }
}

export async function requireSubscription() {
  const access = await checkSubscriptionAccess()

  if (!access.hasAccess) {
    return {
      allowed: false,
      redirectTo: '/login',
      message: 'Sign in to use LeadVett.',
    }
  }

  return { allowed: true, access }
}
