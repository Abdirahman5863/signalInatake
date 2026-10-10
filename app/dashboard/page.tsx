import { FormsList } from '@/components/dashboard/FormsList'
import { RecentLeads } from '@/components/dashboard/RecentLeads'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { DashboardRefresh } from '@/components/dashboard/DashboardRefresh'
import { createClient } from '@/lib/supabase/server'
import { HeartHandshake } from 'lucide-react'

export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: forms } = await supabase
    .from('intake_forms')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const hasForms = Boolean(forms?.length)

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
      <DashboardRefresh userId={user.id} />

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Project enquiries</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
          Manage your intake forms and focus on the leads worth pursuing.
        </p>
      </div>

      {hasForms && recentLeads && recentLeads.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <RecentLeads leads={recentLeads} />
        </div>
      )}
      {!hasForms ? <EmptyState /> : <FormsList forms={forms!} />}
    </div>
  )
}
