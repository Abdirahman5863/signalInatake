import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export async function LeadsTable() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get all leads from user's forms
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
    .limit(10)

  if (error) {
    return (
      <div className="text-destructive">Error loading leads: {error.message}</div>
    )
  }

  if (!leads || leads.length === 0) {
    return null
  }

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'Gold':
        return 'bg-green-500'
      case 'Silver':
        return 'bg-yellow-500'
      case 'Bronze':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recent Leads</h2>
      <div className="rounded-md border">
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Lead Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Form
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Badge
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <tr key={lead.id} className="border-b">
                  <td className="px-4 py-3 text-sm">{lead.lead_name}</td>
                  <td className="px-4 py-3 text-sm">{lead.lead_email}</td>
                  <td className="px-4 py-3 text-sm">
                    {lead.intake_forms?.form_name || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {lead.badge ? (
                      <Badge
                        className={`${getBadgeColor(lead.badge)} text-white`}
                      >
                        {lead.badge}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="text-primary hover:underline"
                    >
                      View
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

