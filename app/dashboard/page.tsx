import { FormsList } from '@/components/dashboard/FormsList'
import { LeadsTable } from '@/components/dashboard/LeadsTable'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: forms } = await supabase
    .from('intake_forms')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  const hasForms = forms && forms.length > 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your intake forms and view qualified leads
        </p>
      </div>

      {!hasForms ? <EmptyState /> : <FormsList />}

      {hasForms && (
        <div className="mt-8">
          <LeadsTable />
        </div>
      )}
    </div>
  )
}

