import { FormsList } from '@/components/dashboard/FormsList'
import { LeadsTable } from '@/components/dashboard/LeadsTable'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { createClient } from '@/lib/supabase/server'
import { SubscriptionStatus } from '@/components/dashboard/SubscriptionStatus'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

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

      {/* Header - Mobile Responsive */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Manage your intake forms and view qualified leads
          </p>
        </div>
        
        {/* Subscription Status */}
        <SubscriptionStatus subscription={subscription} />
      </div>

      {/* Forms Section */}
      {!hasForms ? <EmptyState /> : <FormsList forms={forms} />}

      {/* Leads Table - Mobile Responsive */}
      {hasForms && (
        <div className="mt-6 sm:mt-8">
          <LeadsTable />
        </div>
      )}
    </div>
  )
}