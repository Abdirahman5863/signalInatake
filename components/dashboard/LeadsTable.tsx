import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

export async function LeadsTable() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: leads, error } = await supabase
    .from('lead_responses')
    .select(
      `
      *,
      intake_forms!inner (
        id,
        form_name,
        user_id
      )
    `
    )
    .eq('intake_forms.user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return <div className="text-destructive">Error: {error.message}</div>
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No leads yet. Share your form to start collecting responses.</p>
      </div>
    )
  }

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'Gold':
        return 'bg-green-500 text-white'
      case 'Silver':
        return 'bg-yellow-500 text-white'
      case 'Bronze':
        return 'bg-orange-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">All Leads</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {leads.length} total leads • Click any lead to see full AI analysis
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Lead Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Form</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Badge</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Summary</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <tr key={lead.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{lead.lead_name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{lead.lead_email}</td>
                  <td className="px-4 py-3 text-sm">{lead.intake_forms?.form_name || 'Unknown'}</td>
                  <td className="px-4 py-3">
                    {lead.badge ? (
                      <Badge className={`${getBadgeColor(lead.badge)}`}>
                        {lead.badge}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm max-w-xs truncate" title={lead.summary}>
                    {lead.summary || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      View
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}