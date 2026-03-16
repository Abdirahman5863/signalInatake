import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Phone, Mail, Clock, ExternalLink } from 'lucide-react'

interface RecentLeadsProps {
  leads: any[]
}

export function RecentLeads({ leads }: RecentLeadsProps) {
  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'Gold':
        return 'bg-green-500 text-white'
      case 'Silver':
        return 'bg-yellow-500 text-white'
      case 'Bronze':
        return 'bg-orange-500 text-white'
      case 'Rejected':
        return 'bg-red-600 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getActionText = (action: string | null, badge: string | null) => {
    if (badge === 'Rejected') return 'Disqualified - Archive'
    if (action) return action
    
    switch (badge) {
      case 'Gold':
        return 'Call within 2 hours'
      case 'Silver':
        return 'Send screening Loom'
      case 'Bronze':
        return 'Add to nurture'
      default:
        return 'Review needed'
    }
  }

  const getLeadBorderColor = (badge: string | null) => {
    switch (badge) {
      case 'Gold':
        return 'border-green-300 bg-green-50'
      case 'Silver':
        return 'border-yellow-300 bg-yellow-50'
      case 'Bronze':
        return 'border-orange-200 bg-orange-50'
      case 'Rejected':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  // Group by priority
  const goldLeads = leads.filter(l => l.badge === 'Gold')
  const otherLeads = leads.filter(l => l.badge !== 'Gold')

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with View All Link */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Recent Leads</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Latest {leads.length} leads • 
            {goldLeads.length} Gold, {leads.filter(l => l.badge === 'Silver').length} Silver, 
            {leads.filter(l => l.badge === 'Bronze').length} Bronze
          </p>
        </div>
        <Link
          href="/dashboard/leads"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
        >
          <ExternalLink className="h-4 w-4" />
          View All Leads
        </Link>
      </div>

      {/* GOLD LEADS FIRST - Priority Display */}
      {goldLeads.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🔥</span>
            <h3 className="text-base sm:text-lg font-bold text-green-700">
              CALL NOW ({goldLeads.length})
            </h3>
          </div>
          <div className="space-y-2">
            {goldLeads.slice(0, 3).map((lead: any) => (
              <div
                key={lead.id}
                className="bg-green-50 border-2 border-green-300 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-green-400 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h4 className="font-bold text-base sm:text-lg text-gray-900 truncate">
                        {lead.lead_name}
                      </h4>
                      <Badge className="bg-green-500 text-white text-xs flex-shrink-0">
                        🔥 GOLD
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">
                      {lead.lead_email}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2 font-semibold text-green-700">
                        <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{getActionText(lead.action, lead.badge)}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/leads/${lead.id}`}
                    className="flex items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-green-700 transition-colors whitespace-nowrap w-full sm:w-auto"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Link>
                </div>
              </div>
            ))}
            {goldLeads.length > 3 && (
              <div className="text-center py-2">
                <Link
                  href="/dashboard/leads?filter=Gold"
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  + {goldLeads.length - 3} more Gold leads →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OTHER RECENT LEADS - Compact View */}
      {otherLeads.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm sm:text-base font-bold text-gray-700">
            Other Recent Leads ({otherLeads.length})
          </h3>
          <div className="space-y-2">
            {otherLeads.slice(0, 5).map((lead: any) => (
              <div
                key={lead.id}
                className={`rounded-lg border p-3 hover:shadow-sm transition-all ${getLeadBorderColor(lead.badge)}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {lead.lead_name}
                      </h4>
                      <Badge className={`${getBadgeColor(lead.badge)} text-xs flex-shrink-0`}>
                        {lead.badge}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="truncate">{lead.lead_email}</span>
                      <span className="text-gray-400">•</span>
                      <span className="whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/leads/${lead.id}`}
                    className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium whitespace-nowrap"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {otherLeads.length > 5 && (
            <div className="text-center py-2">
              <Link
                href="/dashboard/leads"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                View all {otherLeads.length} leads →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {leads.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 sm:p-12 text-center">
          <p className="text-sm sm:text-base text-muted-foreground">
            No leads yet. Share your form to start collecting responses.
          </p>
        </div>
      )}
    </div>
  )
}