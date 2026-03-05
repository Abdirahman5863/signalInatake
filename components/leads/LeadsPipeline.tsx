'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Phone, Mail, Clock, Filter, 
  Search, ChevronDown, Calendar, Award 
} from 'lucide-react'

interface LeadsPipelineProps {
  leads: any[]
}

export function LeadsPipeline({ leads }: LeadsPipelineProps) {
  const [filter, setFilter] = useState<'all' | 'Gold' | 'Silver' | 'Bronze' | 'Rejected'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'confidence' | 'badge'>('date')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let filtered = leads

    // Apply badge filter
    if (filter !== 'all') {
      filtered = filtered.filter(l => {
        if (filter === 'Rejected') {
          return l.badge === 'Rejected' || l.hard_rule_triggered
        }
        return l.badge === filter
      })
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(l =>
        l.lead_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.lead_email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return (b.confidence_score || 0) - (a.confidence_score || 0)
        case 'badge':
          const badgeOrder = { Gold: 0, Silver: 1, Bronze: 2, Rejected: 3 }
          return (badgeOrder[a.badge as keyof typeof badgeOrder] || 99) - 
                 (badgeOrder[b.badge as keyof typeof badgeOrder] || 99)
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }, [leads, filter, sortBy, searchQuery])

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'Gold': return 'bg-green-500 text-white'
      case 'Silver': return 'bg-yellow-500 text-white'
      case 'Bronze': return 'bg-orange-500 text-white'
      case 'Rejected': return 'bg-red-600 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getActionText = (action: string | null, badge: string | null) => {
    if (badge === 'Rejected') return 'Disqualified - Archive'
    if (action) return action
    
    switch (badge) {
      case 'Gold': return 'Book 30-min Strategy Call within 2 hours'
      case 'Silver': return 'Send 15-min Screening Loom Video'
      case 'Bronze': return 'Add to 90-day Nurture Sequence'
      default: return 'Review needed'
    }
  }

  const getLeadBorderColor = (badge: string | null) => {
    switch (badge) {
      case 'Gold': return 'border-green-300 bg-green-50'
      case 'Silver': return 'border-yellow-300 bg-yellow-50'
      case 'Bronze': return 'border-orange-200 bg-orange-50'
      case 'Rejected': return 'border-red-200 bg-red-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          No leads yet. Share your form to start collecting responses.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters & Search */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filter & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Badge Filter */}
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Filter by Badge
            </label>
            <div className="flex flex-wrap gap-2">
              {['all', 'Gold', 'Silver', 'Bronze', 'Rejected'].map((badge) => (
                <button
                  key={badge}
                  onClick={() => setFilter(badge as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filter === badge
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {badge === 'all' ? 'All' : badge}
                  {badge !== 'all' && (
                    <span className="ml-1.5 opacity-75">
                      ({leads.filter(l => {
                        if (badge === 'Rejected') return l.badge === 'Rejected' || l.hard_rule_triggered
                        return l.badge === badge
                      }).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="sm:w-48">
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="date">Latest First</option>
              <option value="confidence">Confidence Score</option>
              <option value="badge">Badge Priority</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredLeads.length} of {leads.length} leads
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <p className="text-gray-500">No leads match your filters</p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className={`rounded-lg border-2 p-4 sm:p-5 transition-all hover:shadow-md ${getLeadBorderColor(lead.badge)}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Lead Info */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">
                      {lead.lead_name}
                    </h3>
                    <Badge className={`${getBadgeColor(lead.badge)} text-xs flex-shrink-0`}>
                      {lead.badge === 'Gold' && '🔥 '}
                      {lead.badge === 'Silver' && '⚡ '}
                      {lead.badge?.toUpperCase()}
                    </Badge>
                    {lead.confidence_score && (
                      <span className="text-xs font-semibold text-gray-600 flex items-center gap-1 flex-shrink-0">
                        <Award className="h-3.5 w-3.5" />
                        {lead.confidence_score}% confidence
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <p className="text-sm text-gray-600 mb-3 truncate">
                    {lead.lead_email}
                  </p>

                  {/* Summary */}
                  {lead.summary && (
                    <p className="text-sm text-gray-700 italic mb-3 line-clamp-2">
                      "{lead.summary}"
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 font-medium text-gray-900">
                      {lead.badge === 'Gold' && <Phone className="h-4 w-4 text-green-600" />}
                      {lead.badge === 'Silver' && <Mail className="h-4 w-4 text-yellow-600" />}
                      <span className="truncate">{getActionText(lead.action, lead.badge)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span className="truncate">{lead.intake_forms?.form_name}</span>
                    </div>
                  </div>

                  {/* Hard Rule Warning */}
                  {lead.hard_rule_triggered && (
                    <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                      <strong>⚠️ Auto-Disqualified:</strong> {lead.hard_rule_triggered}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Link
                  href={`/dashboard/leads/${lead.id}`}
                  className={`flex items-center justify-center gap-2 rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white transition-colors whitespace-nowrap w-full lg:w-auto ${
                    lead.badge === 'Gold' ? 'bg-green-600 hover:bg-green-700' :
                    lead.badge === 'Silver' ? 'bg-yellow-600 hover:bg-yellow-700' :
                    lead.badge === 'Bronze' ? 'bg-orange-600 hover:bg-orange-700' :
                    'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  <span>View Full Analysis</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}