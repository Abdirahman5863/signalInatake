'use client'

import Link from 'next/link'
import { Eye, TrendingUp, Clock, Mail } from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  badge: string
  confidence_score: number
  created_at: string
  form_id?: string
  status?: string
  ai_analysis?: any
}

export function RecentLeads({ leads }: { leads: Lead[] }) {
  const getBadgeColor = (badge: string) => {
    const badgeLower = badge.toLowerCase()
    switch (badgeLower) {
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getBadgeIcon = (badge: string) => {
    const badgeLower = badge.toLowerCase()
    switch (badgeLower) {
      case 'gold':
        return '🥇'
      case 'silver':
        return '🥈'
      case 'bronze':
        return '🥉'
      default:
        return '📋'
    }
  }

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-blue-100 text-blue-800'
    
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-green-100 text-green-800'
      case 'qualified':
        return 'bg-purple-100 text-purple-800'
      case 'converted':
        return 'bg-emerald-100 text-emerald-800'
      case 'lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Leads</h2>
        </div>
        <Link
          href="/dashboard/leads"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xl">{getBadgeIcon(lead.badge)}</span>
                <h3 className="font-semibold text-gray-900 truncate">{lead.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getBadgeColor(
                    lead.badge
                  )}`}
                >
                  {lead.badge} {lead.confidence_score}%
                </span>
                {lead.status && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{lead.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {lead.ai_analysis?.summary && (
                <p className="text-xs text-gray-500 mt-2 italic line-clamp-1">
                  "{lead.ai_analysis.summary}"
                </p>
              )}
            </div>

            <Link
              href={`/dashboard/leads/${lead.id}`}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium whitespace-nowrap"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </div>
        ))}
      </div>

      {leads.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No recent leads yet</p>
          <p className="text-sm mt-1">Share your form to start collecting leads</p>
        </div>
      )}
    </div>
  )
}