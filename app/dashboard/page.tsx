import { FormsList } from '@/components/dashboard/FormsList'
import { RecentLeads } from '@/components/dashboard/RecentLeads'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { createClient } from '@/lib/supabase/server'
import { SubscriptionStatus } from '@/components/dashboard/SubscriptionStatus'
import { checkSubscriptionAccess } from '@/lib/subscription/access'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Check subscription access
  const access = await checkSubscriptionAccess()

  // Show trial/subscription status banner
  const showTrialBanner = access.reason === 'trial' && access.trialDaysLeft <= 3
  const showExpiredBanner = !access.hasAccess

  const { data: forms } = await supabase
    .from('intake_forms')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const hasForms = forms && forms.length > 0
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: recentLeads } = await supabase
    .from('lead_responses')
    .select(`
      *,
      intake_forms!inner (
        id,
        form_name,
        user_id
      )
    `)
    .eq('intake_forms.user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Google Analytics */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-C6QJQ6KGNJ"></script>
      <script dangerouslySetInnerHTML={{__html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-C6QJQ6KGNJ');
      `}}></script>

      {/* Trial Warning Banner */}
      {showTrialBanner && (
        <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⏰</span>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 text-sm sm:text-base mb-1">
                {access.trialDaysLeft} {access.trialDaysLeft === 1 ? 'day' : 'days'} left in your trial
              </h3>
              <p className="text-xs sm:text-sm text-orange-700 mb-3">
                Your trial ends on {new Date(access.trialEndsAt!).toLocaleDateString()}. 
                Subscribe now to keep your forms and leads.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-orange-700 transition-colors"
              >
                Subscribe Now - $49/month
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Expired Banner */}
      {showExpiredBanner && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 text-sm sm:text-base mb-1">
                Your trial has expired
              </h3>
              <p className="text-xs sm:text-sm text-red-700 mb-3">
                Subscribe to continue using LeadVett and access your forms.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Manage your intake forms and view qualified leads
          </p>
        </div>
        
        <SubscriptionStatus subscription={subscription} />
      </div>

      {/* Forms Section */}
      {!hasForms ? <EmptyState /> : <FormsList forms={forms} />}

      {/* Recent Leads */}
      {hasForms && recentLeads && recentLeads.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <RecentLeads leads={recentLeads} />
        </div>
      )}
    </div>
  )
}