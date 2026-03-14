import { SettingsContent } from '@/components/dashboard/settings/SettingsContent'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user data
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Fetch payment history
  const { data: payments } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Calculate trial info
  const TRIAL_DAYS = 3
  const signupDate = new Date(user.created_at)
  const now = new Date()
  const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))
  const trialDaysLeft = Math.max(0, TRIAL_DAYS - daysSinceSignup)
  const trialEndsAt = new Date(signupDate.getTime() + (TRIAL_DAYS * 24 * 60 * 60 * 1000))

  return (
    <SettingsContent 
      user={user}
      subscription={subscription}
      payments={payments || []}
      trialInfo={{
        daysLeft: trialDaysLeft,
        endsAt: trialEndsAt,
        inTrial: trialDaysLeft > 0 && (!subscription || subscription.status !== 'active')
      }}
    />
  )
}