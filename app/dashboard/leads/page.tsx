import { createClient } from '@/lib/supabase/server'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LeadsStats } from '@/components/leads/LeadsStats'
import { LeadsPipeline } from '@/components/leads/LeadsPipeline'

export default async function LeadsPipelinePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get all leads with form info
  const { data: leads, error } = await supabase
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

  if (error) {
    console.error('Error fetching leads:', error)
    return <div className="text-red-600 p-4">Error loading leads</div>
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Lead Pipeline</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            All your qualified leads in one place
          </p>
        </div>
      </div>

      {/* Stats */}
      <LeadsStats leads={leads || []} />

      {/* Pipeline */}
      <LeadsPipeline leads={leads || []} />
    </div>
  )
}