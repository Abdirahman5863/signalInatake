import { FormsList } from '@/components/dashboard/FormsList'
import { RecentLeads } from '@/components/dashboard/RecentLeads'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { createClient } from '@/lib/supabase/server'
import { checkSubscriptionExpiration } from '@/lib/subscription/check-expiration'
import { Clock, AlertCircle, Crown, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { DashboardRefresh } from '@/components/dashboard/DashboardRefresh'

const TRIAL_DAYS = 3

export const revalidate = 0 // Disable caching for this page

export default async function DashboardPage({ searchParams }: { 
  searchParams: { payment?: string; reason?: string } 
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get payment status from URL
  const paymentStatus = searchParams?.payment
  const failureReason = searchParams?.reason

  // Check subscription expiration
  const subscriptionCheck = await checkSubscriptionExpiration(user.id)

  const { data: forms } = await supabase
    .from('intake_forms')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const hasForms = forms && forms.length > 0

  const { data: recentLeads } = await supabase
    .from('leads')
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

  // Calculate trial status
  const hasActiveSubscription = subscriptionCheck.hasAccess && subscriptionCheck.reason === 'active_subscription'
  const subscriptionExpired = subscriptionCheck.reason === 'subscription_expired'
  
  const signupDate = new Date(user.created_at)
  const now = new Date()
  const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))
  const trialDaysLeft = Math.max(0, TRIAL_DAYS - daysSinceSignup)
  const inTrial = trialDaysLeft > 0 && !hasActiveSubscription
  const trialExpired = trialDaysLeft === 0 && !hasActiveSubscription && !subscriptionExpired
  const trialEndsAt = new Date(signupDate.getTime() + (TRIAL_DAYS * 24 * 60 * 60 * 1000))

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

      {/* Client-side Auto Refresh Component */}
      <DashboardRefresh userId={user.id} />

      {/* Header with Manual Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Manage your intake forms and view qualified leads
          </p>
        </div>
        
        {/* Manual Refresh Button */}
        <button
          onClick={() => window.location.reload()}
          className="hidden sm:inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          title="Refresh dashboard"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden lg:inline">Refresh</span>
        </button>
      </div>

      {/* Payment Success Banner */}
      {paymentStatus === 'success' && (
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-green-900 text-sm sm:text-base mb-1">
                🎉 Payment Successful!
              </h3>
              <p className="text-xs sm:text-sm text-green-700">
                Welcome to LeadVett Pro! Your subscription is now active for 30 days.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Failed Banner */}
      {paymentStatus === 'failed' && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 text-sm sm:text-base mb-1">
                Payment Failed
              </h3>
              <p className="text-xs sm:text-sm text-red-700 mb-3">
                Your payment could not be processed. This could be due to insufficient funds, card declined, or network issues.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Try Again
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Payment Processing Banner */}
      {paymentStatus === 'processing' && (
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <div>
              <h3 className="font-bold text-blue-900 text-sm sm:text-base mb-1">
                Payment Processing
              </h3>
              <p className="text-xs sm:text-sm text-blue-700">
                Your payment is being processed. This page will update automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Expired Banner - PRIORITY */}
      {subscriptionExpired && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 text-sm sm:text-base mb-1">
                Subscription Expired - Renew to Continue
              </h3>
              <p className="text-xs sm:text-sm text-red-700 mb-3">
                Your monthly subscription ended on {subscriptionCheck.expiredDate ? new Date(subscriptionCheck.expiredDate).toLocaleDateString() : 'recently'}. 
                Renew now to continue using LeadVett Pro.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Renew Subscription - $49/month
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Active Subscription with Expiry Warning */}
      {hasActiveSubscription && (
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 text-sm sm:text-base mb-1">
                LeadVett Pro - Active ✓
              </h3>
              <p className="text-xs sm:text-sm text-green-700">
                Your subscription renews on {subscriptionCheck.subscription ? new Date(subscriptionCheck.subscription.current_period_end).toLocaleDateString() : 'N/A'}
                {subscriptionCheck.daysUntilExpiry && subscriptionCheck.daysUntilExpiry <= 7 && (
                  <span className="block mt-1 text-orange-700 font-semibold">
                    ⚠️ {subscriptionCheck.daysUntilExpiry} {subscriptionCheck.daysUntilExpiry === 1 ? 'day' : 'days'} until renewal required
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trial Active */}
      {inTrial && (
        <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 text-sm sm:text-base mb-1">
                {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} left in your trial
              </h3>
              <p className="text-xs sm:text-sm text-orange-700 mb-3">
                Your trial ends on {trialEndsAt.toLocaleDateString()}. Subscribe now to keep your forms and leads.
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

      {/* Trial Expired */}
      {trialExpired && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 text-sm sm:text-base mb-1">
                Trial Expired - Subscribe to Continue
              </h3>
              <p className="text-xs sm:text-sm text-red-700 mb-3">
                Your 3-day trial has ended. Subscribe now to unlock unlimited lead analysis and AI-powered qualification.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Subscribe Now - $49/month
              </Link>
            </div>
          </div>
        </div>
      )}

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