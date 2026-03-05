import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Phone, Mail, Clock } from 'lucide-react'

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
    return <div className="text-destructive text-sm">Error: {error.message}</div>
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 sm:p-12 text-center">
        <p className="text-sm sm:text-base text-muted-foreground">
          No leads yet. Share your form to start collecting responses.
        </p>
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

  const getProposalReadiness = (badge: string | null, hardRule: string | null) => {
    if (hardRule || badge === 'Rejected') {
      return { icon: '❌', text: 'Not Recommended', color: 'text-red-700' }
    }
    if (badge === 'Gold') {
      return { icon: '✅', text: 'Ready', color: 'text-green-700' }
    }
    if (badge === 'Silver') {
      return { icon: '⚠️', text: 'Conditional', color: 'text-yellow-700' }
    }
    return { icon: '⏸️', text: 'Hold', color: 'text-orange-700' }
  }

  const goldLeads = leads.filter(l => l.badge === 'Gold')
  const silverLeads = leads.filter(l => l.badge === 'Silver')
  const bronzeLeads = leads.filter(l => l.badge === 'Bronze')
  const rejectedLeads = leads.filter(l => l.hard_rule_triggered || l.badge === 'Rejected')

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Lead Pipeline</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {goldLeads.length} Gold • {silverLeads.length} Silver • {bronzeLeads.length} Bronze • {rejectedLeads.length} Rejected
          </p>
        </div>
      </div>

      {/* GOLD LEADS */}
      {goldLeads.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🔥</span>
            <h3 className="text-base sm:text-lg font-bold text-green-700">
              CALL NOW ({goldLeads.length})
            </h3>
          </div>
          <div className="space-y-2">
            {goldLeads.map((lead: any) => {
              const proposalStatus = getProposalReadiness(lead.badge, lead.hard_rule_triggered)
              return (
                <div
                  key={lead.id}
                  className="bg-green-50 border-2 border-green-300 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-green-400 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h4 className="font-bold text-base sm:text-lg text-gray-900 truncate">{lead.lead_name}</h4>
                        <Badge className="bg-green-500 text-white text-xs flex-shrink-0">
                          🔥 GOLD
                        </Badge>
                        <span className={`text-xs font-semibold ${proposalStatus.color} flex-shrink-0`}>
                          {proposalStatus.icon} {proposalStatus.text}
                        </span>
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
                      {lead.summary && (
                        <p className="text-xs text-gray-600 italic mt-2 line-clamp-2">
                          {lead.summary}
                        </p>
                      )}
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
              )
            })}
          </div>
        </div>
      )}

      {/* SILVER LEADS */}
      {silverLeads.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">⚡</span>
            <h3 className="text-base sm:text-lg font-bold text-yellow-700">
              FOLLOW UP SOON ({silverLeads.length})
            </h3>
          </div>
          <div className="space-y-2">
            {silverLeads.map((lead: any) => {
              const proposalStatus = getProposalReadiness(lead.badge, lead.hard_rule_triggered)
              return (
                <div
                  key={lead.id}
                  className="bg-yellow-50 border-2 border-yellow-300 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-yellow-400 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h4 className="font-bold text-sm sm:text-base text-gray-900 truncate">{lead.lead_name}</h4>
                        <Badge className="bg-yellow-500 text-white text-xs flex-shrink-0">
                          ⚡ SILVER
                        </Badge>
                        <span className={`text-xs font-semibold ${proposalStatus.color} flex-shrink-0`}>
                          {proposalStatus.icon} {proposalStatus.text}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">
                        {lead.lead_email}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-1 sm:gap-2 font-semibold text-yellow-700">
                          <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
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
                      className="flex items-center justify-center gap-2 rounded-full bg-yellow-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-yellow-700 transition-colors whitespace-nowrap w-full sm:w-auto"
                    >
                      <span>View</span>
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* BRONZE LEADS */}
      {bronzeLeads.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🟡</span>
            <h3 className="text-sm sm:text-base font-bold text-orange-700">
              NURTURE / DELAY ({bronzeLeads.length})
            </h3>
          </div>
          <div className="space-y-2">
            {bronzeLeads.slice(0, 5).map((lead: any) => {
              const proposalStatus = getProposalReadiness(lead.badge, lead.hard_rule_triggered)
              return (
                <div
                  key={lead.id}
                  className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3 hover:border-orange-300 transition-all"
                >
                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <h4 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">{lead.lead_name}</h4>
                        <Badge className="bg-orange-500 text-white text-xs flex-shrink-0">
                          BRONZE
                        </Badge>
                        <span className={`text-xs ${proposalStatus.color} flex-shrink-0`}>
                          {proposalStatus.icon}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{lead.lead_email}</p>
                    </div>
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 font-medium whitespace-nowrap"
                    >
                      View
                    </Link>
                  </div>
                </div>
              )
            })}
            {bronzeLeads.length > 5 && (
              <p className="text-xs text-center text-gray-500 pt-2">
                + {bronzeLeads.length - 5} more bronze leads
              </p>
            )}
          </div>
        </div>
      )}

      {/* REJECTED LEADS */}
      {rejectedLeads.length > 0 && (
        <details className="space-y-2 sm:space-y-3">
          <summary className="flex items-center gap-2 cursor-pointer">
            <span className="text-lg sm:text-xl">🛑</span>
            <h3 className="text-sm sm:text-base font-bold text-red-700">
              DISQUALIFIED / ARCHIVED ({rejectedLeads.length})
            </h3>
          </summary>
          <div className="space-y-2 mt-3 opacity-60">
            {rejectedLeads.slice(0, 3).map((lead: any) => (
              <div
                key={lead.id}
                className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                      <h4 className="font-semibold text-xs sm:text-sm text-gray-700 line-through truncate">
                        {lead.lead_name}
                      </h4>
                      <Badge className="bg-red-600 text-white text-xs flex-shrink-0">
                        REJECTED
                      </Badge>
                    </div>
                    <p className="text-xs text-red-600 truncate">
                      {lead.hard_rule_triggered || 'Hard rule triggered'}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/leads/${lead.id}`}
                    className="text-xs text-red-600 hover:text-red-700 whitespace-nowrap"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}